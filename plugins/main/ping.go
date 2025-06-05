package commands

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
			start := time.Now()
			messageTime := time.Unix(m.Info.Timestamp.Unix(), 0)
			ping := start.Sub(messageTime).Seconds()
			m.Reply(fmt.Sprintf("*Pong :* %.2f Seconds\n", ping))
			return true
		},
	})
}
