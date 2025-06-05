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

func GetDatabaseConfig() (dbType string, dbURL string) {
	if GlobalConfig.Database_url != "" && strings.HasPrefix(GlobalConfig.Database_url, "postgres://") {
		return "postgres", GlobalConfig.Database_url
	}

	if GlobalConfig.Database_url != "" {
		log.Warn("DATABASE_URL provided but not PostgreSQL. Falling back to SQLite.")
	} else {
		log.Warn("DATABASE_URL not set. Using default SQLite.")
	}

	return "sqlite", "file:bot.db?_pragma=foreign_keys(ON)&_pragma=journal_mode(WAL)"
}
