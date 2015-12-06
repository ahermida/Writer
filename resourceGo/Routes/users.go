/*
   User Routes that will be used to Create, Read, and Update users.
   Creates a ServeMux from the default http package
*/
package routes

import (
    "fmt"
    "net/http"
)

// Routes with /users/ prefix
var UsersMux = http.NewServeMux()

// Setup Routes with Mux
func init() {
  UsersMux.HandleFunc("/users/test", teststuff)
  UsersMux.HandleFunc("/users/other", otherstuff)
}

/*
   Route handlers for User Routes
*/

// Handle /users/test
func teststuff(res http.ResponseWriter, req *http.Request) {
  if req.Method != "GET" {
    http.Error(res, http.StatusText(405), 405)
    return
  }
  fmt.Fprintf(res, "Test Passed!")
}

// Handle /users/other
func otherstuff(res http.ResponseWriter, req *http.Request) {
  if req.Method != "GET" {
    http.Error(res, http.StatusText(405), 405)
    return
  }
  fmt.Fprintf(res, "Other Test Passed!")
}
