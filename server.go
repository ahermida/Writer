package main

import (
    "fmt"
    "net/http"
    "strings"
    "log"
    "github.com/alberthermida/Writer/resourceGo/Routes"
)

func main() {
    //handle routes
    http.Handle("/api/", routes.ApiMux)
    fmt.Printf("Server should be running on port:8080\n")
    err := http.ListenAndServe(":8080", nil) // set listen port
    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}
