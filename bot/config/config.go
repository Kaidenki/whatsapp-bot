package config

import (
	"aurora/bot/helpers"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Bot_Name        string
	Sudo            []string
	Pattern         helpers.ParsedPattern
	Mode            string
	Database_url    string
	Go_Env          string
	LogMsg          bool
	TimeZone        string
	StatusView      bool
	AutoUpdate      string
	Lang            string
	Read            string // only "true", "cmd", "false"
	React           string // only "true", "cmd", "false"
	AutoStatusReact bool
}

var GlobalConfig Config
var log helpers.Logger

func validReactOrReadValue(val string) string {
	switch strings.ToLower(val) {
	case "true", "cmd", "false":
		return strings.ToLower(val)
	default:
		return ""
	}
}

func InitConfig() {
	if err := godotenv.Load(); err != nil {
		log.Warn("Warning: .env file not found")
	}

	botName := os.Getenv("BOT_NAME")
	if botName == "" {
		botName = "aurora"
	}

	sudoEnv := os.Getenv("SUDO")
	var sudoList []string
	if sudoEnv != "" {
		sudoList = strings.Split(sudoEnv, ",")
	}

	pattern := os.Getenv("PATTERN")
	parsedPattern := helpers.ParsePattern(pattern)

	mode := strings.ToLower(os.Getenv("MODE"))
	if mode != "private" && mode != "public" {
		mode = "private"
	}

	databaseURL := os.Getenv("DATABASE_URL")

	logMsg := false
	if strings.ToLower(os.Getenv("LOG_MSG")) == "true" {
		logMsg = true
	}

	autoStatusReact := false
	if strings.ToLower(os.Getenv("AUTO_STATUS_REACT")) == "true" {
		autoStatusReact = true
	}

	timezone := os.Getenv("TIMEZONE")
	if timezone == "" {
		timezone = "Africa/lagos"
	}

	statusView := false
	if strings.ToLower(os.Getenv("AUTO_STATUS_VIEW")) == "true" {
		logMsg = true
	}

	autoUpdate := os.Getenv("AUTO_UPDATE")
	if autoUpdate == "" {
		autoUpdate = "true"
	}

	lang := os.Getenv("LANG")
	if lang == "" {
		lang = "english"
	}

	read := validReactOrReadValue(os.Getenv("READ"))
	if read == "" {
		read = "cmd"
	}

	react := validReactOrReadValue(os.Getenv("REACT"))
	if react == "" {
		react = "false"
	}

	goEnv := os.Getenv("GO_ENV")
	if goEnv == "" {
		goEnv = "development"
	}

	GlobalConfig = Config{
		Bot_Name:        botName,
		Sudo:            sudoList,
		Pattern:         parsedPattern,
		Mode:            mode,
		Database_url:    databaseURL,
		Go_Env:          goEnv,
		LogMsg:          logMsg,
		TimeZone:        timezone,
		StatusView:      statusView,
		AutoUpdate:      autoUpdate,
		Lang:            lang,
		Read:            read,
		React:           react,
		AutoStatusReact: autoStatusReact,
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
