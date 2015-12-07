/*
   Helper Structs for handling POST requests to /users/ && /api/
*/
package routes

// struct for POST handler to /users/make
type User struct {
  Username  string `json:"username"`
  Password  string `json:"password"`
  FirstName string `json:"firstName"`
  LastName  string `json:"lastName"`
}

//struct for POST handler to /users/login
