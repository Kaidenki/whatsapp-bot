package main

import (
	conn "aurora/src"
	"fmt"
)

func main() {
	InitConfig()

	log.Info(fmt.Sprintf("Sudo Users: %v", GlobalConfig.Sudo))
	log.Info(fmt.Sprintf("Mode: %s", GlobalConfig.Mode))

	conn.StartClient()
}
