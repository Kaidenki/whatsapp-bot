package plugins

import (
	"aurora/bot/config"
	"aurora/bot/helpers"
	"aurora/bot/libs"

	"go.mau.fi/whatsmeow/types"
)

var log = helpers.Logger{}

func init() {
	libs.Newplugin(&libs.Iplugin{
		Description: "Auto Reacts to/Reads status",
		Before: func(conn *libs.IClient, m *libs.IMessage) {
			if m.Info.Chat.String() == "status@broadcast" {
				log.Info("status msg")
				if config.GlobalConfig.StatusView {
					log.Info("reading status msg")
					conn.WA.MarkRead([]types.MessageID{m.Info.ID}, m.Info.Timestamp, m.Info.Chat, m.Info.Sender)
				}
				if config.GlobalConfig.AutoStatusReact {
					log.Info("reacting to status msg")
					conn.WA.MarkRead([]types.MessageID{m.Info.ID}, m.Info.Timestamp, m.Info.Chat, m.Info.Sender)
					m.React("❤️")
				}
			}
		},
	})
}
