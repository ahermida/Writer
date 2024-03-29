/*
  Utility functions to be used in main (trying to keep things clean)
*/
package util

import (
    "fmt"
    "log"
    "time"
    "net/http"
    "github.com/dgrijalva/jwt-go"
    "github.com/ahermida/Writer/resourceGo/Config"
)

// HTTP logger
func Log(handler http.Handler) http.Handler {
  return http.HandlerFunc(func(res http.ResponseWriter, req *http.Request) {
    start := time.Now()
    handler.ServeHTTP(res, req)
    end := time.Since(start)
    log.Printf("%s %s %s %s", req.Host, req.URL, req.Method, end)

  })
}

// HTTP Auth Middleware
func Protect(handler http.Handler) http.Handler {
  return http.HandlerFunc(func(res http.ResponseWriter, req *http.Request) {
    userToken := req.Header.Get("WriterKey")
    if userToken == "" {
      //no token in header, so it must mean we have intruders. Returns no authorization error.
      http.Error(res, http.StatusText(401), 401)
      return
    }
    token, err := jwt.Parse(userToken, func(token *jwt.Token) (interface{}, error) {
      //parsed token lookups are done with a callback
      if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
          return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
      }
      return []byte(config.JwtSecret), nil
    })
    if err == nil && token.Valid {
      //let the http request go through
      handler.ServeHTTP(res, req)
    } else {
      //unauthorized error
      http.Error(res, http.StatusText(401), 401)
      return
    }

  })
}
