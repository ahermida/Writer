/*
   API Routes that will be used by the source of the application.
   Creates a ServeMux from the default http package
*/
package routes

import (
    "fmt"
    "net/http"
    "strings"
    "log"
)

// Routes with /api/
ApiMux := http.NewServerMux()

// Handle /api/test  -- GET
ApiMux.handleFunc("/api/test", func(res http.ResponseWriter, req *http.Request){
  if req.method != "GET" {
    http.Error(w, http.StatusText(405), 405)
    return
  }
  fmt.Fprintf("TEST PASSED")
})
