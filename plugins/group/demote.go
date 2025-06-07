package plugins

import (
	"aurora/bot/libs"
	"fmt"
	"log"

	"go.mau.fi/whatsmeow/types"
)

func init() {
	libs.Newplugin(&libs.Iplugin{
		Name:        "demote",
		As:          []string{"demote"},
		Description: "Demote a user from admin",
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
				m.Reply("Please quote the user you want to demote!.")
				return false
			}

			if !m.IsBotAdmin {
				m.Reply("Bot must be admin to demote users!.")
				return false
			}

			participantStr := m.Quoted.GetParticipant()
			senderJID, err := types.ParseJID(participantStr)
			if err != nil {
				return false
			}

			_, err = conn.DemoteParticipant(chatJID, senderJID)
			if err != nil {
				m.Reply("Failed to demote participant: " + err.Error())
				return false
			}

			m.Reply("User has been demoted from admin!.")
			return true
		},
	})
}
