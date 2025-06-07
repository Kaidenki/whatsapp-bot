package plugins

import (
	"aurora/bot/libs"

	"go.mau.fi/whatsmeow/types"
)

func dlt(conn *libs.IClient, m *libs.IMessage) bool {
	if m.Quoted == nil || m.Quoted.GetStanzaID() == "" {
		m.Reply("Please reply to the message you want to delete!")
		return false
	}

	quotedID := m.Quoted.GetStanzaID()

	if m.IsGroup {
		if !m.IsBotAdmin {
			m.Reply("Bot must be admin to delete messages in group!")
			return false
		}

		participantStr := m.Quoted.GetParticipant()
		if participantStr == "" {
			//m.Reply("Could not determine the sender of the quoted message.")
			return false
		}

		senderJID, err := types.ParseJID(participantStr)
		if err != nil {
			return false
		}

		err = conn.DeleteMsg(m.From, quotedID, senderJID)
		if err != nil {
			m.Reply("❌ Failed to delete message: " + err.Error())
			return false
		}

		return true
	}

	err := conn.DeleteMsg(m.From, quotedID, types.EmptyJID)
	if err != nil {
		m.Reply("❌ Failed to delete message: " + err.Error())
		return false
	}
	return true
}

func init() {
	libs.Newplugin(&libs.Iplugin{
		Name:     "dlt",
		As:       []string{"dlt"},
		Tags:     "whatsapp",
		IsPrefix: true,
		IsMedia:  false,
		Execute:  dlt,
		FromMe:   false,
	})
}
