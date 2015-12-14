/*
   MySQL Database for Application
*/
package db

import (
  _ "google.golang.org/appengine/cloudsql"
  _ "github.com/go-sql-driver/mysql"
  "github.com/ahermida/Writer/resourceGo/Config"
  "database/sql"
  "log"
)

var Connection *sql.DB

//initialize DB
func init() {
  var err error
  Connection, err = sql.Open("mysql", config.DB)
  if err != nil {
    log.Panic(err)
  }

  if err = Connection.Ping(); err != nil {
    log.Fatal(err)
  }
  createModel()
}

//Creates Tables in the public DB for now -- 12/6/2015
func createModel() {

  /*              DB RESET
  _, er1 := Connection.Exec(`drop table if exists users;`)
  if er1 != nil {
    log.Println(er1)
  }*/

  _, err := Connection.Exec(`
    create table IF NOT EXISTS users
    (
          uid        serial     NOT NULL,
          username   text       NOT NULL,
          password   text       NOT NULL,
          firstname  text       NOT NULL,
          lastname   text       NOT NULL,
          activated  boolean    NOT NULL
    );`)
  if err != nil {
    log.Fatal(err)
  }
}
