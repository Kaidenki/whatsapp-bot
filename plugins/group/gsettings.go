package plugins

import (
	"aurora/bot/db"
	"aurora/bot/libs"
	"fmt"
)

func init() {
	libs.Newplugin(&libs.Iplugin{
		Name:        "gsettings",
		As:          []string{"gsettings", "groupsettings"},
		Description: "Show current group settings (on/off)",
		Tags:        "group",
		IsPrefix:    true,
		IsGroup:     true,
		Execute: func(conn *libs.IClient, m *libs.IMessage) bool {
			jid := m.From.String()

			settings, err := db.GetGroupSettings(jid)
			if err != nil {
				m.Reply(fmt.Sprintf("Failed to fetch group settings: %v", err))
				return false
			}

			if settings == nil {
				m.Reply("No settings found for this group!.")
				return true
			}

			msg := fmt.Sprintf("*Group Settings:*\n\n"+
				"• Antidemote: %v\n"+
				"• Antipromote: %v\n"+
				"• Welcome: %v\n"+
				"• Exit: %v\n"+
				"• Promote/Demote Msg (PDM): %v",
				boolToStatus(settings.Antidemote),
				boolToStatus(settings.Antipromote),
				boolToStatus(settings.Welcome),
				boolToStatus(settings.Exit),
				boolToStatus(settings.PDM),
			)

			m.Reply(msg)
			return true
		},
	})
}

func boolToStatus(b bool) string {
	if b {
		return "enabled"
	}
	return "disabled"
}
