/* Writer is a web app to help its creator manage stuff -- Commented code is for GAE */
package server

import (
  "net/http"
  "github.com/ahermida/Writer/resourceGo/Routes" //package with route mux(s)
  "github.com/ahermida/Writer/resourceGo/Util"   //package with utility funcs
)

/* Init function is where GAE Apps start */
func init() {

  //handle api routes -- Protected
  http.Handle("/api/", util.Log(util.Protect(routes.ApiMux)))

  //handle user routes -- Unprotected
  http.Handle("/users/", util.Log(routes.UsersMux))

}
