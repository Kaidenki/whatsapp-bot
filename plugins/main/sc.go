package plugins

import (
	"aurora/bot/libs"
)

func init() {
	libs.Newplugin(&libs.Iplugin{
		Name:        "(sc|source)",
		As:          []string{"sc"},
		Description: "Sends bot source repo",
		Tags:        "main",
		IsPrefix:    true,
		Execute: func(conn *libs.IClient, m *libs.IMessage) bool {
			m.Reply("https://github.com/Kaidenki/whatsapp-bot\n\n_Free (Not for Commercial Use or Sale)_\n_See license at: https://github.com/Kaidenki/whatsapp-bot?tab=readme-ov-file#-license_")
			return true
		},
	})
}
