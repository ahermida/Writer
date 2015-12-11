/*
   PostgreSQL Database for Application
*/
package db

import (
  _ "github.com/lib/pq"
  "github.com/ahermida/Writer/resourceGo/Config"
  "database/sql"
  "log"
)

var Connection *sql.DB

//initialize DB
func init() {
  var err error
  Connection, err = sql.Open("postgres", config.DB)
  if err != nil {
    log.Panic(err)
  }

  if err = Connection.Ping(); err != nil {
    log.Panic(err)
  }
  createModel() //creates Tables if they don't currently exist
}

//Creates Tables in the public schema for now -- 12/6/2015
func createModel() {
  //create users table if it doesn't exist
  Connection.Exec(`
    CREATE TABLE IF NOT EXISTS users
    (
      uid        serial     NOT NULL,
      username   text       NOT NULL,
      password   text       NOT NULL,
      firstname  text       NOT NULL,
      lastname   text       NOT NULL,
      activated  boolean    NOT NULL,
      CONSTRAINT users_pkey PRIMARY KEY (uid),
      UNIQUE     (username)
    )
    WITH (OIDS=FALSE);
  `)

  //create table of notes for notes app
  Connection.Exec(`
    CREATE TABLE IF NOT EXISTS notes
    (
      Created date,
      username character varying(100) NOT NULL,
      body text NOT NULL
    );
  `)

  //create
  Connection.Exec(`
    CREATE TABLE IF NOT EXISTS sps
    (
      Created date,
      username character varying(100) NOT NULL,
      body text NOT NULL
    );
  `)
}
