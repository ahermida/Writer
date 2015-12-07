package main

import (
  "net/http"
  "log"
  "github.com/ahermida/Writer/resourceGo/Routes" //package with route mux(s)
  "github.com/ahermida/Writer/resourceGo/Util"   //package with utility funcs
  "github.com/ahermida/Writer/resourceGo/Config" //package with port
)

func main() {

  //handle static files
  http.Handle("/", util.Log(http.FileServer(http.Dir("public"))))

  //handle api routes
  http.Handle("/api/", util.Log(routes.ApiMux))

  //handle user routes
  http.Handle("/users/", util.Log(routes.UsersMux))

  //Start Server
  log.Printf("Server should be running on port:8080\n")
  err := http.ListenAndServe(config.Port, nil) // set listen port
  if err != nil {
      log.Fatal("ListenAndServe: ", err)
  }
}
