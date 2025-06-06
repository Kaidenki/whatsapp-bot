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
	Pattern      helpers.ParsedPattern
	Mode         string
	Database_url string
	Go_Env       string
	LogMsg       bool
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
	}

	Pattern := os.Getenv("PATTERN")
	parsedPattern := helpers.ParsePattern(Pattern)

	mode := os.Getenv("MODE")
	mode = strings.ToLower(mode)
	if mode != "private" && mode != "public" {
		mode = "private"
	}

	databaseURL := os.Getenv("DATABASE_URL")

	logMsg := false
	if strings.ToLower(os.Getenv("LOG_MSG")) == "true" {
		logMsg = true
	}

	goEnv := os.Getenv("GO_ENV")
	if goEnv == "" {
		goEnv = "development"
	}

	GlobalConfig = Config{
		Bot_Name:     botName,
		Sudo:         sudoList,
		Pattern:      parsedPattern,
		Mode:         mode,
		Database_url: databaseURL,
		Go_Env:       goEnv,
		LogMsg:       logMsg,
	}

}

func GetDatabaseConfig() (dbType, dbURL string) {
	formattedURL, valid := helpers.FormatPostgresURL(GlobalConfig.Database_url, GlobalConfig.Go_Env)

	if !valid {
		log.Warn("Invalid or unsupported DATABASE_URL. Bot will stop.")
		return "", ""
	}

	return "postgres", formattedURL
}
