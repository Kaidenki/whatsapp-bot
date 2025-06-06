package main

import (
	conn "aurora/bot"
	"aurora/bot/config"
	"aurora/bot/helpers"
	"aurora/bot/utils"
	"fmt"
	"os"
	"strings"
)

var log = helpers.Logger{}
var version string

func main() {
	data, err := os.ReadFile("version.txt")
	if err != nil {
		version = "unknown"
	} else {
		version = strings.TrimSpace(string(data))
	}

	config.InitConfig()
	utils.InitUptime()
	log.Info(fmt.Sprintf("Aurora Version: %s", version))
	conn.StartClient()
}
