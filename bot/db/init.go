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

	if _, err := DB.Exec(antilinkTable); err != nil {
		panic(err)
	}
	log.Info("Database schema initialized and ready.")
}
