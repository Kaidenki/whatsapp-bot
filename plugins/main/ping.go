package commands

import (
	"aurora/bot/libs"
	"fmt"
	"time"

	"go.mau.fi/whatsmeow/proto/waE2E"
	"google.golang.org/protobuf/proto"
)

func messInfoChat(m *libs.IMessage) string {
	return m.Info.Chat.String()
}

func init() {
	libs.Newplugin(&libs.Iplugin{
		Name:        "(ping|p)",
		As:          []string{"ping"},
		Description: "Shows bot response speed in ms",
		Tags:        "main",
		IsPrefix:    true,
		Execute: func(conn *libs.IClient, m *libs.IMessage) bool {

			resp, err := m.Reply("Pong ...")
			if err != nil {
				return false
			}

			messageTime := m.Info.Timestamp
			latency := time.Since(messageTime)
			latencyMs := latency.Milliseconds()
			editedContent := &waE2E.Message{
				ExtendedTextMessage: &waE2E.ExtendedTextMessage{
					Text: proto.String(fmt.Sprintf("*Pong :* %d ms", latencyMs)),
				},
			}

			_, err = m.Edit(resp.ID, editedContent)
			if err != nil {
				m.Reply(fmt.Sprintf("Pong : %d ms", latencyMs))
			}

			return err == nil
		},
	})
}
