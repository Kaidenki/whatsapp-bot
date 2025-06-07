package plugins

import (
	"aurora/bot/db"
	"aurora/bot/libs"
	"fmt"
	"strings"
)

func init() {
	libs.Newplugin(&libs.Iplugin{
		Name:        "antipromote",
		As:          []string{"antipromote"},
		Description: "Enable or Disable Antipromote",
		Tags:        "group",
		IsPrefix:    true,
		IsGroup:     true,
		Execute: func(conn *libs.IClient, m *libs.IMessage) bool {
			args := strings.ToLower(strings.TrimSpace(strings.Join(m.Args, " ")))
			jid := m.From.String()

			if args != "on" && args != "off" {
				m.Reply(fmt.Sprintf("```\nUsage:\n%santipromote on\n%santipromote off\n```", botPrefix, botPrefix))
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

			if settings.Antipromote == newState {
				m.Reply(fmt.Sprintf("_Antipromote is already turned %s._", args))
				return true
			}

			settings.Antipromote = newState
			err = db.SetGroupSettings(settings)
			if err != nil {
				m.Reply("Failed to update antipromote settings.")
				return false
			}

			m.Reply(fmt.Sprintf("*Antipromote has been turned %s.*", args))
			return true
		},
	})
}
