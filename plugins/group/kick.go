package plugins

import (
	"aurora/bot/libs"
	"fmt"
	"log"

	"go.mau.fi/whatsmeow/types"
)

func init() {
	libs.Newplugin(&libs.Iplugin{
		Name:        "kick",
		As:          []string{"kick"},
		Description: "Remove a participant from the group",
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
				m.Reply("Please quote the user you want to kick!.")
				return false
			}

			if !m.IsBotAdmin {
				m.Reply("Bot must be admin to kick users!.")
				return false
			}

			participantStr := m.Quoted.GetParticipant()
			senderJID, err := types.ParseJID(participantStr)
			if err != nil {
				return false
			}

			_, err = conn.RemoveParticipant(chatJID, senderJID)
			if err != nil {
				m.Reply("Failed to remove participant: " + err.Error())
				return false
			}

			m.Reply("User has been kicked from the group.")
			return true
		},
	})
}
