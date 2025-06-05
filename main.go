package main

import (
	conn "aurora/bot"
	"aurora/bot/config"
	"aurora/bot/helpers"
	"fmt"
)

var log helpers.Logger

func main() {
	config.InitConfig()

	log.Info(fmt.Sprintf("Sudo Users: %v", config.GlobalConfig.Sudo))
	log.Info(fmt.Sprintf("Mode: %s", config.GlobalConfig.Mode))

	conn.StartClient()
}
