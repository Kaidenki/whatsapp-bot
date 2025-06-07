package plugins

import (
	"aurora/bot/libs"
	"fmt"
	"log"

	"go.mau.fi/whatsmeow/types"
)

func init() {
	libs.Newplugin(&libs.Iplugin{
		Name:        "promote",
		As:          []string{"promote"},
		Description: "Promote a user to admin",
		Tags:        "group",
		IsPrefix:    true,
		IsGroup:     true,
		Execute: func(conn *libs.IClient, m *libs.IMessage) bool {
			jid := m.Info.Chat.String()
			chatJID, err := types.ParseJID(jid)
			if err != nil {
				log.Println(fmt.Sprintf("Failed to parse chat JID: %v", err))
				return false
			}

			if m.Quoted == nil || m.Quoted.GetStanzaID() == "" {
				m.Reply("Please quote the user you want to promote!.")
				return false
			}

			if !m.IsBotAdmin {
				m.Reply("Bot must be admin to promote users!.")
				return false
			}

			participantStr := m.Quoted.GetParticipant()
			senderJID, err := types.ParseJID(participantStr)
			if err != nil {
				return false
			}

			_, err = conn.PromoteParticipant(chatJID, senderJID)
			if err != nil {
				m.Reply("Failed to promote participant: " + err.Error())
				return false
			}

			m.Reply("User has been promoted to admin.")
			return true
		},
	})
}
