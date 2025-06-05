package config

import (
	"aurora/bot/helpers"
	"os"
	_ "strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Bot_Name     string
	Sudo         []string
	Pattern      string
	Mode         string
	Database_url string
}

var GlobalConfig Config
var log helpers.Logger

func InitConfig() {
	if err := godotenv.Load(); err != nil {
		log.Warn("Warning: .env file not found")
	}

	botName := os.Getenv("BOT_NAME")
	if botName == "" {
		botName = "kaidenki's bot"
	}

	sudoEnv := os.Getenv("SUDO")
	var sudoList []string
	if sudoEnv != "" {
		sudoList = strings.Split(sudoEnv, ",")
	} else {
		sudoList = []string{
			"2349xxxxxxxx7",
			"234xxxxxxxx36",
		}
	}

	Pattern := os.Getenv("PATTERN")
	if Pattern == "" {
		Pattern = "[?!.#]"
	}

	mode := os.Getenv("MODE")
	if mode == "" {
		mode = "private"
	}

	databaseURL := os.Getenv("DATABASE_URL")

	GlobalConfig = Config{
		Bot_Name:     botName,
		Sudo:         sudoList,
		Pattern:      Pattern,
		Mode:         mode,
		Database_url: databaseURL,
	}

}

func GetDatabaseConfig() (dbType, dbURL string) {
	env := os.Getenv("GO_ENV")
	formattedURL, valid := helpers.FormatPostgresURL(GlobalConfig.Database_url, env)

	if valid {
		dbType = "postgres"
		dbURL = formattedURL
	} else {
		log.Warn("Invalid or unsupported DATABASE_URL. Falling back to SQLite.")
		dbType = "sqlite"
		dbURL = "file:bot.db?_pragma=foreign_keys(ON)&_pragma=journal_mode(WAL)"
	}
	return dbType, dbURL
}
