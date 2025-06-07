package plugins

import (
	"aurora/bot/db"
	"aurora/bot/libs"
	"fmt"
	"strings"
)

func init() {
	libs.Newplugin(&libs.Iplugin{
		Name:        "pdm",
		As:          []string{"pdm"},
		Description: "Enable or Disable Promote/Demote Message",
		Tags:        "group",
		IsPrefix:    true,
		IsGroup:     true,
		Execute: func(conn *libs.IClient, m *libs.IMessage) bool {
			args := strings.ToLower(strings.TrimSpace(strings.Join(m.Args, " ")))
			jid := m.From.String()

			if args != "on" && args != "off" {
				m.Reply(fmt.Sprintf("```\nUsage:\n%spdm on\n%spdm off\n```", botPrefix, botPrefix))
				return true
			}

			settings, err := db.GetGroupSettings(jid)
			if err != nil {
				m.Reply(fmt.Sprintf("Failed to fetch group settings: %v", err))
				return false
			}

			if settings == nil {
				settings = &db.GroupSettings{JID: jid}
			}

			newState := args == "on"

			if settings.PDM == newState {
				m.Reply(fmt.Sprintf("_PDM is already turned %s._", args))
				return true
			}

			settings.PDM = newState
			err = db.SetGroupSettings(settings)
			if err != nil {
				m.Reply("Failed to update PDM settings.")
				return false
			}

			m.Reply(fmt.Sprintf("*PDM has been turned %s.*", args))
			return true
		},
	})
}
