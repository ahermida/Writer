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

// struct for POST response to /users/login -- failed request
type loginFail struct {
  Success bool `json:"success"`
  Message string `json:"message"`
}

// struct for POST response to /users/login -- successful request
type loginSuccess struct {
  Success bool `json:"success"`
  Message string `json:"message"`
  Token   string `json:"token"`
}
