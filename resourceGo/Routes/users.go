/*
   User Routes that will be used to Create, Read, and Update users.
   Creates a ServeMux from the default http package
*/
package routes

import (
    "fmt"
    "net/http"
    "crypto/aes"
    "crypto/cipher"
    "encoding/json"
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
  var usr userLogin // new userLogin struct to be populated by POST
  //request body should look like userLogin struct in helper.go -- Handle POST
  decoder := json.NewDecoder(req.Body)
  decoder.Decode(&usr) //populate struct
  
  fmt.Fprintf(res, "Other Test Passed!")
}
