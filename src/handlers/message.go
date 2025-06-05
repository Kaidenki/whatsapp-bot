package handlers

import (
	"aurora/src/libs"
	"context"
	"fmt"
	"os"
	"regexp"
	"strings"
	"time"

	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/store"
	"go.mau.fi/whatsmeow/store/sqlstore"
	"go.mau.fi/whatsmeow/types"
	"go.mau.fi/whatsmeow/types/events"

	waLog "go.mau.fi/whatsmeow/util/log"
)

type IHandler struct {
	Container *store.Device
}

func NewHandler(container *sqlstore.Container) *IHandler {
	ctx := context.Background()

	deviceStore, err := container.GetFirstDevice(ctx)
	if err != nil {
		panic(err)
	}

	return &IHandler{
		Container: deviceStore,
	}
}

func (h *IHandler) Client() *whatsmeow.Client {
	clientLog := waLog.Stdout("lient", "ERROR", true)
	conn := whatsmeow.NewClient(h.Container, clientLog)
	conn.AddEventHandler(h.RegisterHandler(conn))
	return conn
}

func (h *IHandler) RegisterHandler(conn *whatsmeow.Client) func(evt interface{}) {
	return func(evt interface{}) {
		sock := libs.SerializeClient(conn)
		switch v := evt.(type) {
		case *events.Message:
			m := libs.SerializeMessage(v, sock)

			// skip deleted message
			if m.Message.GetProtocolMessage() != nil && m.Message.GetProtocolMessage().GetType() == 0 {
				return
			}

			// log
			fmt.Println("\x1b[94mFrom :", v.Info.PushName, m.Info.Sender.User, "\x1b[39m")
			if libs.HasCommand(m.Command) {
				fmt.Println("\x1b[93mCommand :", m.Command, "\x1b[39m")
			}
			if len(m.Body) < 350 {
				fmt.Print("\x1b[92mMessage : ", m.Body, "\x1b[39m", "\n")
			} else {
				fmt.Print("\x1b[92mMessage : ", m.Info.Type, "\x1b[39m", "\n")
			}

			// Get command
			go ExecuteCommand(sock, m)
			return
		case *events.Connected, *events.PushNameSetting:
			if len(conn.Store.PushName) == 0 {
				return
			}
			conn.SendPresence(types.PresenceAvailable)
		}
	}
}

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
				if os.Getenv("PUBLIC") == "false" && !m.IsOwner {
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
