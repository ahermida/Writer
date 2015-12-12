/*
   API Routes that will be used by the source of the application.
   Creates a ServeMux from the default http package
*/
package routes

import (
    "fmt"
    "log"
    "net/http"
    "database/sql"
    "encoding/json"
    "github.com/dgrijalva/jwt-go"
    "github.com/ahermida/Writer/resourceGo/DB"
    "github.com/ahermida/Writer/resourceGo/Config"
)

// Routes with /api/ prefix
var ApiMux = http.NewServeMux()

// Setup Routes with Mux
func init() {
  ApiMux.HandleFunc("/api/test", test)
  ApiMux.HandleFunc("/api/user", user)
  ApiMux.HandleFunc("/api/other", other)
}

/*
   Route handlers for API Routes
*/

// Handle /api/test
func test(res http.ResponseWriter, req *http.Request) {
  if req.Method != "GET" {
    http.Error(res, http.StatusText(405), 405)
    return
  }
  fmt.Fprintf(res, "Test Passed!")
}

//handle /api/user (gets information about key via protected route)
func user(res http.ResponseWriter, req *http.Request) {
  userToken := req.Header.Get("WriterKey")
  if userToken == "" {
    //no token in header, so it must mean we have intruders. Returns no authorization error.
    http.Error(res, http.StatusText(401), 401)
    return
  }
  token, err := jwt.Parse(userToken, func(token *jwt.Token) (interface{}, error) {
    //parsed token lookups are done with a callback
    if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
        return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
    }
    return []byte(config.JwtSecret), nil
  })

  if err == nil && token.Valid {
    var firstName string;
    er := db.Connection.QueryRow(`
      SELECT firstname FROM users WHERE username=?
    `, token.Claims["username"].(string)).Scan(&firstName)

    if er != nil {
      if er == sql.ErrNoRows {
        http.Error(res, http.StatusText(401), 401)
        return
      } else {
        http.Error(res, http.StatusText(500), 500)
        return
      }
    }
    //let the http request go through
    authSuccess := &newUserSuccess{
      Success: true,
      Message:"Successful Authentication.",
      FirstName: firstName,
    }
    res.Header().Set("Content-Type", "application/json; charset=UTF-8")
    res.WriteHeader(http.StatusOK)
    if err := json.NewEncoder(res).Encode(authSuccess); err != nil {
      log.Fatal(err) //error encoding JSON, should fail
      return
    }

  } else {
    //unauthorized error
    http.Error(res, http.StatusText(401), 401)
    return
  }

}

// Handle /api/other
func other(res http.ResponseWriter, req *http.Request) {
  if req.Method != "GET" {
    http.Error(res, http.StatusText(405), 405)
    return
  }
  http.ServeFile(res, req, "private/authorize.html")
}
