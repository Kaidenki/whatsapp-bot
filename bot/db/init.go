package db

import (
	"aurora/bot/helpers"
	"database/sql"
)

var DB *sql.DB
var log helpers.Logger

func InitDB(dbConn *sql.DB) {
	DB = dbConn

	groupFiltersTable := `
    CREATE TABLE IF NOT EXISTS group_filters (
        id SERIAL PRIMARY KEY,
        chat TEXT NOT NULL,
        pattern TEXT NOT NULL,
        text TEXT NOT NULL,
        regex BOOLEAN NOT NULL DEFAULT false
    );`

	personalFiltersTable := `
    CREATE TABLE IF NOT EXISTS personal_filters (
        id SERIAL PRIMARY KEY,
        pattern TEXT NOT NULL,
        text TEXT NOT NULL,
        regex BOOLEAN NOT NULL DEFAULT false
    );`

	antilinkTable := `
    CREATE TABLE IF NOT EXISTS antilink (
        jid TEXT PRIMARY KEY,
        mode BOOLEAN,
        links JSON
    );`

	if _, err := DB.Exec(groupFiltersTable); err != nil {
		panic(err)
	}

	if _, err := DB.Exec(personalFiltersTable); err != nil {
		panic(err)
	}

	if _, err := DB.Exec(antilinkTable); err != nil {
		panic(err)
	}
	log.Info("Database schema initialized and ready.")
}
