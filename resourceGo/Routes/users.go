/*
   User Routes that will be used to Create, Read, and Update users.
   Creates a ServeMux from the default http package
*/
package routes

import (
    "fmt"
    "net/http"
    //"crypto/aes"
    //"crypto/cipher"
    "log"
    "database/sql"
    "encoding/json"
    "github.com/ahermida/Writer/resourceGo/DB"
)

// Routes with /users/ prefix
var UsersMux = http.NewServeMux()

// Setup Routes with Mux
func init() {
  //make user
  UsersMux.HandleFunc("/users/make", make)
  //get user info
  UsersMux.HandleFunc("/users/info", info)
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
  fmt.Fprintf(res, "Test Passed!")
}

// Handle /users/info
func info(res http.ResponseWriter, req *http.Request) {
  if req.Method != "POST" {
    http.Error(res, http.StatusText(405), 405)
    return
  }
  fmt.Fprintf(res, "Other Test Passed!")
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
  //check if user exists, get user, decode user password, check for match
  err := db.Connection.QueryRow(`
    SELECT password FROM users WHERE username=$1;
  `, usr.Username).Scan(&pw) //scan password into pw

  // Handle Query Result
  if err != nil {
    if err == sql.ErrNoRows {
      //handle no rows error
      res.Header().Set("Content-Type", "application/json; charset=UTF-8")
      res.WriteHeader(http.StatusOK)
      loginF := &loginFail{Success: false, Message:"Username or password is incorrect"}
      if err := json.NewEncoder(res).Encode(loginF); err != nil {
        log.Fatal(err) //error with JSON encoding
      }
    } else {
      //handle fail
      http.Error(res, http.StatusText(500), 500)
      return
    }
  }
  // Handle success --
  // Decrypt password and compare, if fail send fail json. Else send JWT.


}
