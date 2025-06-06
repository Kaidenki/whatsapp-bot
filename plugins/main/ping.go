package plugins

import (
	"aurora/bot/libs"
	"fmt"
	"time"
)

func init() {
	libs.Newplugin(&libs.Iplugin{
		Name:        "(ping|p)",
		As:          []string{"ping"},
		Description: "Shows bot response speed in ms",
		Tags:        "main",
		IsPrefix:    true,
		Execute: func(conn *libs.IClient, m *libs.IMessage) bool {
			_, err := m.Reply("Ping!")
			if err != nil {
				return false
			}

			messageTime := m.Info.Timestamp
			latency := time.Since(messageTime)
			latencyMs := latency.Milliseconds()

			m.Reply(fmt.Sprintf("Pong! Response time: %d ms", latencyMs))

			return err == nil
		},
	})
}
