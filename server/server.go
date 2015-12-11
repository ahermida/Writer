/* Writer is a web app to help its creator manage stuff -- Commented code is for GAE */
package main

import (
  "net/http"
  //"fmt"
  //"os"
  //"log"
  "github.com/ahermida/Writer/resourceGo/Routes" //package with route mux(s)
  "github.com/ahermida/Writer/resourceGo/Util"   //package with utility funcs
  //"github.com/ahermida/Writer/resourceGo/Config" //package with port
)

func init() {
  //handle static files -- GAE doesn't use this
  //http.Handle("/", util.Log(http.FileServer(http.Dir("../public"))))

  //handle api routes -- Protected
  http.Handle("/api/", util.Log(util.Protect(routes.ApiMux)))

  //handle user routes -- Unprotected
  http.Handle("/users/", util.Log(routes.UsersMux))

  //GAE Handles all the following stuff.
  /*var port = os.Getenv("PORT")
  if port == "" {
    port = config.Port;
  }
  //Start Server -- GAE doesn't use this
  log.Printf("Server should be running on port:8080\n")
  err := http.ListenAndServe(port, nil) // set listen port
  if err != nil {
    log.Fatal("ListenAndServe: ", err)
  }*/
}
