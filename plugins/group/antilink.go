package plugins

import (
	"aurora/bot/config"
	"aurora/bot/db"
	"aurora/bot/helpers"
	"aurora/bot/libs"

	"fmt"
	"strings"
)

var botPrefix string

func init() {
	p := config.GlobalConfig.Pattern

	if p.Type == helpers.LiteralPattern {
		botPrefix = p.Literal
	} else if p.Regex != nil {
		botPrefix = p.Regex.String()
	} else {
		botPrefix = helpers.DefaultPattern
	}
	libs.Newplugin(&libs.Iplugin{
		Name:        "antilink",
		As:          []string{"antilink"},
		Description: "Setup Antilink for Group Chat",
		Tags:        "group",
		IsPrefix:    true,
		FromMe:      false,
		IsGroup:     true,
		Execute: func(conn *libs.IClient, m *libs.IMessage) bool {
			args := strings.ToLower(strings.TrimSpace(strings.Join(m.Args, " ")))
			prefix := botPrefix
			jid := m.From.String()

			if args == "" {
				usage := fmt.Sprintf("```\nUsage:\n%santilink get\n%santilink on\n%santilink off\n%santilink mode kick | delete\n%santilink set chat.whatsapp.com,google.com\n```",
					prefix, prefix, prefix, prefix, prefix)
				_, err := m.Reply(usage)
				return err == nil
			}
			if args == "get" {
				antilink, err := db.GetAntilink(jid)
				if err != nil {
					m.Reply(fmt.Sprintf("Failed to fetch antilink settings: %v", err))
					return false
				}
				if antilink == nil {
					m.Reply("Antilink is currently _disabled_ for this group.")
					return true
				}

				mode := "delete"
				if antilink.Mode {
					mode = "kick"
				}

				links := "None"
				if len(antilink.Links) > 0 {
					links = strings.Join(antilink.Links, ", ")
				}

				response := fmt.Sprintf(
					"Antilink is *enabled*\nMode: *%s*\nBlocked Links: %s",
					mode, links,
				)
				m.Reply(response)
				return true
			}
			choice := strings.Fields(strings.ToLower(args))

			switch choice[0] {
			case "on":
				err := db.SetAntilink(jid, true, nil)
				if err != nil {
					m.Reply("Failed to enable Antilink.")
					return false
				}
				m.Reply("_Antilink turned on_")
				return true

			case "off":
				err := db.DeleteAntilink(jid)
				if err != nil {
					m.Reply("Failed to disable Antilink.")
					return false
				}
				m.Reply("_Antilink turned off_")
				return true

			case "mode":
				if len(choice) < 2 || (choice[1] != "kick" && choice[1] != "delete") {
					m.Reply(fmt.Sprintf("```\nUsage:\n%santilink mode kick\nOR\n%santilink mode delete\n```", prefix, prefix))
					return true
				}

				mode := false
				if choice[1] == "kick" {
					mode = true
				}

				err := db.SetAntilink(jid, mode, nil)
				if err != nil {
					m.Reply("Failed to set Antilink mode.")
					return false
				}

				m.Reply(fmt.Sprintf("_Antilink mode is now set to %s_", choice[1]))
				return true

			case "set":
				if len(choice) < 2 {
					m.Reply("_You need to add some specific links to prohibit_")
					return true
				}
				rawLinks := strings.Split(choice[1], ",")
				links := make([]string, 0, len(rawLinks))
				for _, link := range rawLinks {
					trimmed := strings.TrimSpace(link)
					if trimmed != "" {
						links = append(links, trimmed)
					}
				}

				err := db.SetAntilink(jid, true, links)
				if err != nil {
					m.Reply(fmt.Sprintf("Failed to set antilink: %v", err))
					return false
				}

				m.Reply(fmt.Sprintf("_Antilink set to handle %d links_", len(links)))
				return true

			default:
				m.Reply("Unknown command. Use `" + prefix + "antilink` for usage.")
				return true
			}
		},
	})
}
