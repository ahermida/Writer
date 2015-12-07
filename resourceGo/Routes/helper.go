/*
   Helper Structs for handling POST requests to /users/ && /api/ Routes
*/
package routes

// struct for POST handler to /users/make
type userMake struct {
  Username  string `json:"username"`
  Password  string `json:"password"`
  FirstName string `json:"firstName"`
  LastName  string `json:"lastName"`
}

// struct for POST handler to /users/login
type userLogin struct {
  Username string `json:"username"`
  Password string `json:"username"`
}
