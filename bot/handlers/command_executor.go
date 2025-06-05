package handlers

import (
	"aurora/bot/config"
	"aurora/bot/libs"
	"regexp"
	"strings"
	"time"
)

func ExecuteCommand(c *libs.IClient, m *libs.IMessage) {
	var prefix string
	pattern := regexp.MustCompile(`[?!.#]`)
	for _, f := range pattern.FindAllString(m.Command, -1) {
		prefix = f
	}
	lists := libs.GetList()
	for _, cmd := range lists {
		if cmd.Before != nil {
			cmd.Before(c, m)
		}
		re := regexp.MustCompile(`^` + cmd.Name + `$`)
		if valid := len(re.FindAllString(strings.ReplaceAll(m.Command, prefix, ""), -1)) > 0; valid {
			if cmd.Execute != nil {
				if config.GlobalConfig.Mode == "private" && !m.IsOwner {
					return
				}

				var cmdWithPref bool
				var cmdWithoutPref bool
				if cmd.IsPrefix && (prefix != "" && strings.HasPrefix(m.Command, prefix)) {
					cmdWithPref = true
				} else {
					cmdWithPref = false
				}

				if !cmd.IsPrefix {
					cmdWithoutPref = true
				} else {
					cmdWithoutPref = false
				}

				if !cmdWithPref && !cmdWithoutPref {
					continue
				}

				if cmd.IsOwner && !m.IsOwner {
					continue
				}

				if cmd.IsQuery && m.Text == "" {
					m.Reply("Query Required!")
					continue
				}

				if cmd.IsGroup && !m.Info.IsGroup {
					m.Reply("This Plugin only works in Group Chat")
					continue
				}

				if cmd.IsPrivate && m.Info.IsGroup {
					m.Reply("This Plugin only works in Private Chat")
					continue
				}

				if cmd.IsMedia && m.IsMedia == "" {
					m.Reply("Reply to Media Message, or send Media with Command!")
					continue
				}

				if cmd.IsWait {
					m.React("⏳")
				}

				ok := cmd.Execute(c, m)

				if cmd.IsWait && !ok {
					m.React("❌")
				}

				if cmd.IsWait && ok {
					c.WA.MarkRead([]string{m.Info.ID}, time.Now(), m.Info.Chat, m.Info.Sender)
					m.React("")
					continue
				}
			}
		}
	}
}
