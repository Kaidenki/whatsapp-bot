package plugins

import (
	"aurora/bot/libs"
)

func dlt(conn *libs.IClient, m *libs.IMessage) bool {
	if m.Quoted == nil || m.Quoted.GetStanzaID() == "" {
		m.Reply("❌ Please reply to the message you want to delete")
		return false
	}

	quotedID := m.Quoted.GetStanzaID()

	if m.IsGroup {
		if !m.IsBotAdmin {
			m.Reply("❌ Bot must be admin to delete messages in group")
			return false
		}
		conn.DeleteMsg(m.From, quotedID, false)
		return true
	}

	// Private chat: only delete if the message is from bot itself
	conn.DeleteMsg(m.From, quotedID, true)
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
		FromMe:   true,
	})
}
