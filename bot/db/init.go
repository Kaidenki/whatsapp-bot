package db

import (
	"aurora/bot/helpers"
	"database/sql"
)

var DB *sql.DB
var log helpers.Logger

func InitDB(dbConn *sql.DB) {
	DB = dbConn

	antilinkTable := `
	CREATE TABLE IF NOT EXISTS antilink (
		jid TEXT PRIMARY KEY,
		mode BOOLEAN,
		links JSON
	);`

	groupSettingsTable := `
    CREATE TABLE IF NOT EXISTS group_settings (
        jid TEXT PRIMARY KEY,
        antidemote BOOLEAN,
        antipromote BOOLEAN,
        welcome BOOLEAN,
        welcome_msg TEXT,
        exit BOOLEAN,
        exit_msg TEXT,
        pdm BOOLEAN
    );`

	if _, err := DB.Exec(antilinkTable); err != nil {
		panic(err)
	}

	if _, err := DB.Exec(groupSettingsTable); err != nil {
		panic(err)
	}

	log.Info("Database schema initialized and ready.")
}
