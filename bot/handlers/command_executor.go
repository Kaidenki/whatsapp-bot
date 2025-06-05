package handlers

import (
	"aurora/bot/config"
	"aurora/bot/helpers"
	"aurora/bot/libs"
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
		// Random prefix pick for variety
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

		// Match command name strictly after prefix removal
		re := regexp.MustCompile(`^` + cmd.Name + `$`)
		if !re.MatchString(withoutPrefix) {
			continue
		}

		if cmd.Execute == nil {
			continue
		}

		// Restrict by global mode "private"
		if config.GlobalConfig.Mode == "private" && !m.FromMe {
			return
		}

		// Check prefix usage and command prefix flag
		cmdWithPref := cmd.IsPrefix && prefix != "" && strings.HasPrefix(m.Command, prefix)
		cmdWithoutPref := !cmd.IsPrefix

		if !cmdWithPref && !cmdWithoutPref {
			continue
		}

		// Permissions and requirements checks
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
