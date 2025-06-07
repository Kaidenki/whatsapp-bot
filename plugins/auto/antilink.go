package plugins

import (
	"aurora/bot/db"
	"aurora/bot/helpers"
	"aurora/bot/libs"
	"fmt"
	"regexp"
	"strings"

	"go.mau.fi/whatsmeow/types"
)

var urlRegex = regexp.MustCompile(`https?://([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(/[^\s]*)?`)

func init() {
	libs.Newplugin(&libs.Iplugin{
		Description: "Auto enforce antilink rules in group chats",
		Before: func(conn *libs.IClient, m *libs.IMessage) {
			if !m.IsGroup {
				return
			}
			if m.Text == "" {
				return
			}

			if m.FromMe {
				return
			}
			if m.IsSudo {
				return
			}

			jid := m.Info.Chat.String()
			sender := m.Sender.String()
			senderJID, err := types.ParseJID(sender)
			if err != nil {
				log.Info(fmt.Sprintf("Failed to parse sender JID: %v", err))
				return
			}
			chatJID, err := types.ParseJID(jid)
			if err != nil {
				log.Info(fmt.Sprintf("Failed to parse chat JID: %v", err))
				return
			}

			if !m.IsBotAdmin {
				return
			}
			if !m.IsAdmin {
			}

			antilink, err := db.GetAntilink(jid)
			if err != nil {
				return
			}
			if antilink == nil || (!antilink.Mode && len(antilink.Links) == 0) {
				return
			}

			text := strings.ToLower(m.Text)
			hasProhibitedLink := false

			if len(antilink.Links) > 0 {
				for _, link := range antilink.Links {
					if strings.Contains(text, strings.ToLower(link)) {
						hasProhibitedLink = true
						break
					}
				}
			} else {
				hasProhibitedLink = urlRegex.MatchString(text)
			}

			if !hasProhibitedLink {
				return
			}
			err = conn.DeleteMsg(chatJID, m.Info.ID, senderJID)
			if err != nil {
				return
			}

			if antilink.Mode {
				conn.RemoveParticipant(chatJID, senderJID)

				reply := fmt.Sprintf("_@%s kicked_", helpers.ExtractPhoneNumber(sender))
				conn.SendMentionMessage(chatJID, reply, []string{senderJID.String()})
			} else {
				reply := fmt.Sprintf("_@%s Links not allowed_", helpers.ExtractPhoneNumber(sender))
				conn.SendMentionMessage(chatJID, reply, []string{senderJID.String()})
			}

		},
	})
}
