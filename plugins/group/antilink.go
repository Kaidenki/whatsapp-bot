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
				antilink, _ := db.GetAntilink(jid)
				if antilink != nil {
					modeStr := "delete"
					if antilink.Mode {
						modeStr = "kick"
					}
					m.Reply(fmt.Sprintf("_Antilink is already enabled with mode: %s_", modeStr))
					return true
				}
				err := db.SetAntilink(jid, false, []string{})
				if err != nil {
					m.Reply("Failed to enable Antilink.")
					return false
				}
				m.Reply("_Antilink turned on with mode: delete. Use `" + prefix + "antilink set` to add links._")
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

				antilink, err := db.GetAntilink(jid)
				if err != nil || antilink == nil {
					m.Reply("Antilink is not enabled for this group. Please enable it first using `" + prefix + "antilink on`.")
					return true
				}

				newMode := false
				if choice[1] == "kick" {
					newMode = true
				}

				err = db.SetAntilink(jid, newMode, antilink.Links)
				if err != nil {
					m.Reply("Failed to set Antilink mode.")
					return false
				}

				m.Reply(fmt.Sprintf("_Antilink mode is now set to %s_", choice[1]))
				return true

			case "set":
				if len(choice) < 2 {
					m.Reply("_You need to add some specific links to prohibit, separated by commas._\nExample: `" + prefix + "antilink set google.com,facebook.com`")
					return true
				}

				antilink, err := db.GetAntilink(jid)
				if err != nil || antilink == nil {
					m.Reply("Antilink is not enabled for this group. Please enable it first using `" + prefix + "antilink on`.")
					return true
				}

				rawLinksStr := strings.Join(choice[1:], "")
				newRawLinks := strings.Split(rawLinksStr, ",")

				linkSet := make(map[string]struct{})
				for _, link := range antilink.Links {
					linkSet[link] = struct{}{}
				}

				for _, link := range newRawLinks {
					trimmed := strings.TrimSpace(link)
					if trimmed != "" {
						linkSet[trimmed] = struct{}{}
					}
				}

				allLinks := make([]string, 0, len(linkSet))
				for link := range linkSet {
					allLinks = append(allLinks, link)
				}

				if len(allLinks) == len(antilink.Links) && len(newRawLinks) > 0 {
					m.Reply("_All provided links are already in the block list._")
					return true
				}

				err = db.SetAntilink(jid, antilink.Mode, allLinks)
				if err != nil {
					m.Reply(fmt.Sprintf("Failed to update antilink links: %v", err))
					return false
				}

				m.Reply(fmt.Sprintf("_Links updated. Antilink now handles %d links._", len(allLinks)))
				return true

			default:
				m.Reply("Unknown command. Use `" + prefix + "antilink` for usage.")
				return true
			}
		},
	})
}
