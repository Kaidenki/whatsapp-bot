package handlers

import (
	"aurora/bot/config"
	"aurora/bot/helpers"
	"aurora/bot/libs"
	"fmt"
	"math/rand"
	"regexp"
	"strings"
	"time"
)

func ExecuteCommand(c *libs.IClient, m *libs.IMessage) {
	parsed := config.GlobalConfig.Pattern
	var prefix string
	var withoutPrefix string

	switch parsed.Type {
	case helpers.RegexPattern:
		matches := parsed.Regex.FindAllString(m.Command, -1)
		if len(matches) == 0 {
			return
		}

		prefix = matches[rand.Intn(len(matches))]
		withoutPrefix = strings.TrimPrefix(m.Command, prefix)

	case helpers.LiteralPattern:
		if !strings.HasPrefix(m.Command, parsed.Literal) {
			return
		}
		prefix = parsed.Literal
		withoutPrefix = strings.TrimPrefix(m.Command, prefix)
	}

	lists := libs.GetList()

	for _, cmd := range lists {
		if cmd.Before != nil {
			cmd.Before(c, m)
		}

		fmt.Println("Sender:", m.Sender, "FromMe:", m.FromMe, "isadmin", m.IsAdmin, "isbotadmin", m.IsBotAdmin)
		re := regexp.MustCompile(`^` + cmd.Name + `$`)
		if !re.MatchString(withoutPrefix) {
			continue
		}

		if cmd.Execute == nil {
			continue
		}

		senderNum := m.Info.Sender.User
		if config.GlobalConfig.Mode == "private" && !isSudo(senderNum) {
			return
		}
		cmdWithPref := cmd.IsPrefix && prefix != "" && strings.HasPrefix(m.Command, prefix)
		cmdWithoutPref := !cmd.IsPrefix

		if !cmdWithPref && !cmdWithoutPref {
			continue
		}

		if cmd.FromMe && !m.FromMe {
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

func isSudo(sender string) bool {
	for _, sudo := range config.GlobalConfig.Sudo {
		if sender == sudo {
			return true
		}
	}
	return false
}
