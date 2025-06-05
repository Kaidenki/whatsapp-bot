package main

import (
	conn "aurora/bot"
	"aurora/bot/config"
	"aurora/bot/helpers"
	"aurora/bot/utils"
	"fmt"
)

var log helpers.Logger

func main() {
	config.InitConfig()
	utils.InitUptime()

	log.Info(fmt.Sprintf("Sudo Users: %v", config.GlobalConfig.Sudo))
	log.Info(fmt.Sprintf("Mode: %s", config.GlobalConfig.Mode))

	conn.StartClient()
}
