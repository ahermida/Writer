/*
   User Routes that will be used to Create, Read, and Update users.
   Creates a ServeMux from the default http package
*/
package routes

import (
    "fmt"
    "log"
    "time"
    "net/url"
    "net/http"
    "crypto/hmac"
    "crypto/sha256"
    "database/sql"
    "encoding/json"
    "encoding/base64"
    "github.com/dgrijalva/jwt-go"
    "github.com/ahermida/Writer/resourceGo/DB"
    "github.com/ahermida/Writer/resourceGo/Config"
)

// Routes with /users/ prefix
var UsersMux = http.NewServeMux()

// Setup Routes with Mux
func init() {
  //make user
  UsersMux.HandleFunc("/users/make", make)
  //get user info
  UsersMux.HandleFunc("/users/activate", activate)
  //login user
  UsersMux.HandleFunc("/users/login", login)
}

/*
   Route handlers for User Routes
*/

// Handle /users/make
func make(res http.ResponseWriter, req *http.Request) {
  if req.Method != "POST" {
    http.Error(res, http.StatusText(405), 405)
    return
  }
  //POST request handling
  var newUser newUserPost // make newUser struct to be populated by POST
  decoder := json.NewDecoder(req.Body)
  decoder.Decode(&newUser) //populate struct newUser

  //check username field
  log.Printf(newUser.Username)
  if !checkEmail(newUser.Username) {
    res.Header().Set("Content-Type", "application/json; charset=UTF-8")
    res.WriteHeader(http.StatusOK)
    signupFail := &authFail{Success: false, Message:"Username must be a valid villanova.edu email address"}
    if err := json.NewEncoder(res).Encode(signupFail); err != nil {
      log.Fatal(err) //error encoding JSON, should fail
    }
    return
  }

  //check the password field
  if !checkPassword(newUser.Password) {
    res.Header().Set("Content-Type", "application/json; charset=UTF-8")
    res.WriteHeader(http.StatusOK)
    signupFail := &authFail{Success: false, Message:"Password must be 7+ characters and must include numbers and letters"}
    if err := json.NewEncoder(res).Encode(signupFail); err != nil {
      log.Fatal(err) //error encoding JSON, should fail
    }
    return
  }

  //check names
  if !checkNames(newUser.FirstName, newUser.LastName) {
    res.Header().Set("Content-Type", "application/json; charset=UTF-8")
    res.WriteHeader(http.StatusOK)
    signupFail := &authFail{Success: false, Message:"Something went wrong with name input"}
    if err := json.NewEncoder(res).Encode(signupFail); err != nil {
      log.Fatal(err) //error encoding JSON, should fail
    }
    return
  }

  /*
    Form validation passed, check DB for name
  */
  var username string
  err := db.Connection.QueryRow(`
    SELECT username FROM users WHERE username=$1;
  `, newUser.Username).Scan(&username)

  if err != nil {
    if err == sql.ErrNoRows {
      //encrypt and save password, create user
      key := []byte(config.Secret)
      hasher := hmac.New(sha256.New, key)
      hasher.Write([]byte(newUser.Password))
      newPassword := base64.StdEncoding.EncodeToString(hasher.Sum(nil))
      db.Connection.Exec(`
        INSERT INTO users (username,password,firstname,lastname,activated) VALUES ($1,$2,$3,$4,$5);
      `, newUser.Username, newPassword, newUser.FirstName, newUser.LastName, false)

      /*
        Send Email To User
      */

      //create token
      tokenizer := jwt.New(jwt.SigningMethodHS256)
      // Set some claims
      tokenizer.Claims["username"] = newUser.Username
      tokenizer.Claims["exp"] = time.Now().Add(time.Hour * 480).Unix()
      // Sign and get the complete encoded token as a string
      token, err := tokenizer.SignedString([]byte(config.JwtSecret))
      if err != nil {
        log.Fatal(err)
      }

      //create new URL
      tokenUrl := &url.URL{
        Scheme : "http",
        Host   : "localhost:8080",
        Path   : "/users/activate",
      }
      //create query
      query := tokenUrl.Query()
      query.Set("token", token)
      tokenUrl.RawQuery = query.Encode()

      //send Email
      sendEmail(newUser.Username, tokenUrl.String(), newUser.FirstName)

      res.Header().Set("Content-Type", "application/json; charset=UTF-8")
      res.WriteHeader(http.StatusOK)
      signupSuccess := &newUserSuccess{
        Success: true,
        Message:"Successful Signup! Check your email for confirmation",
        FirstName: newUser.FirstName,
      }
      if err := json.NewEncoder(res).Encode(signupSuccess); err != nil {
        log.Fatal(err) //error encoding JSON, should fail
      }
    } else {
      //handle PostgreSQL error -- internal server error
      http.Error(res, http.StatusText(500), 500)
      return
    }
  } else {
    res.Header().Set("Content-Type", "application/json; charset=UTF-8")
    res.WriteHeader(http.StatusOK)
    signupFail := &authFail{Success: false, Message:"That account name already exists"}
    if err := json.NewEncoder(res).Encode(signupFail); err != nil {
      log.Fatal(err) //error encoding JSON, should fail
    }
  }
}

// Handle /users/activate
func activate(res http.ResponseWriter, req *http.Request) {
  if req.Method != "GET" {
    http.Error(res, http.StatusText(405), 405)
    return
  }
  //parse activation route
  query, err := url.Parse(req.URL.String())
  if err != nil {
    log.Fatal(err)
  }
  myToken := query.Query().Get("token")

  //decode token
  token, err := jwt.Parse(myToken, func(token *jwt.Token) (interface{}, error) {
    //parsed token lookups are done with a callback
    if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
        return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
    }
    return []byte(config.JwtSecret), nil
  })
  if err == nil && token.Valid {
    //success -- validate account & continue
    username := token.Claims["username"].(string)
    db.Connection.Exec(`
      UPDATE users SET activated=true WHERE username=$1;
    `, username)
    //send file that will redirect them and keep the token
    http.ServeFile(res, req, "private/authorize.html")
  } else {
    res2B, _ := json.Marshal(token)
    fmt.Println(string(res2B))
    //return error & stop
    http.Error(res, http.StatusText(404), 404)
    return
  }

  //If all is well, server file
  http.ServeFile(res, req, "private/authorize.html")
}

// Handle /users/login
func login(res http.ResponseWriter, req *http.Request) {
  if req.Method != "POST" {
    http.Error(res, http.StatusText(405), 405)
    return
  }
  //POST request handling
  var usr userLogin // new userLogin struct to be populated by POST
  decoder := json.NewDecoder(req.Body)
  decoder.Decode(&usr) //populate struct usr
  var pw string  //new string to be populated by Query
  var activated bool //check if user is activated
  //check if user exists, get user, decode user password, check for match
  err := db.Connection.QueryRow(`
    SELECT password, activated FROM users WHERE username=$1;
  `, usr.Username).Scan(&pw, &activated) //scan password into pw

  // Handle Query Result
  if err != nil {
    if err == sql.ErrNoRows {
      //handle no rows error
      res.Header().Set("Content-Type", "application/json; charset=UTF-8")
      res.WriteHeader(http.StatusOK)
      loginFail := &authFail{Success: false, Message:"Username or password is incorrect"}
      if err := json.NewEncoder(res).Encode(loginFail); err != nil {
        log.Fatal(err) //error encoding JSON, should fail
      }
    } else {
      //handle PostgreSQL error
      http.Error(res, http.StatusText(500), 500)
      return
    }
  }
  // Handle success -- but check for account not being activated
  if !activated {
    res.Header().Set("Content-Type", "application/json; charset=UTF-8")
    res.WriteHeader(http.StatusOK)
    loginFail := &authFail{Success: false, Message:"Your account isn't activated yet, check for an activation email"}
    if err := json.NewEncoder(res).Encode(loginFail); err != nil {
      log.Fatal(err) //error encoding JSON, should fail
    }
    return
  }
  // Encrypt password and compare, if fail send fail json. Else send JWT.
  key := []byte(config.Secret)
  hasher := hmac.New(sha256.New, key)
  hasher.Write([]byte(usr.Password))
  if base64.StdEncoding.EncodeToString(hasher.Sum(nil)) == pw {
    //successful password
    tokenizer := jwt.New(jwt.SigningMethodHS256) //new jwt
    // Set some claims
    tokenizer.Claims["username"] = usr.Username
    tokenizer.Claims["exp"] = time.Now().Add(time.Hour * 480).Unix()
    // Sign and get the complete encoded token as a string
    token, err := tokenizer.SignedString([]byte(config.JwtSecret))
    if err != nil {
      log.Fatal(err)
    }
    //send token, Successful Authentication
    res.Header().Set("Content-Type", "application/json; charset=UTF-8")
    res.WriteHeader(http.StatusOK)
    loginS := &loginSuccess{Success: true, Message:"Success!, here's your token", Token: token}
    if err := json.NewEncoder(res).Encode(loginS); err != nil {
      log.Fatal(err) //error encoding JSON, should fail
    }

  } else {
    //incorrect password
    res.Header().Set("Content-Type", "application/json; charset=UTF-8")
    res.WriteHeader(http.StatusOK)
    loginFail := &authFail{Success: false, Message:"Username or password is incorrect"}
    if err := json.NewEncoder(res).Encode(loginFail); err != nil {
      log.Fatal(err) //error encoding JSON, should fail
    }
  }
}
