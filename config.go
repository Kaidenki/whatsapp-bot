package main

import (
	"aurora/src/helpers"
	"os"
	_ "strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Bot_Name string
	Sudo     []string
	Pattern  string
	Mode     string
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

	GlobalConfig = Config{
		Bot_Name: botName,
		Sudo:     sudoList,
		Pattern:  Pattern,
		Mode:     mode,
	}
}
