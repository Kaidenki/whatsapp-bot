package handlers

import (
	"aurora/bot/config"
	"aurora/bot/db"
	"aurora/bot/helpers"
	"aurora/bot/libs"
	"context"
	"fmt"
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
	clientLog := waLog.Stdout("client", "ERROR", true)
	conn := whatsmeow.NewClient(h.Container, clientLog)
	conn.AddEventHandler(h.RegisterHandler(conn))
	return conn
}

func (h *IHandler) RegisterHandler(conn *whatsmeow.Client) func(evt interface{}) {
	return func(evt interface{}) {
		sock := libs.SerializeClient(conn)
		//fmt.Println(evt)
		switch v := evt.(type) {
		case *events.GroupInfo:
			handleGroupInfo(v, sock)

		case *events.Message:
			m := libs.SerializeMessage(v, sock)
			fmt.Println(v)
			// skip deleted message
			if m.Message.GetProtocolMessage() != nil && m.Message.GetProtocolMessage().GetType() == 0 {
				return
			}
			// log
			if config.GlobalConfig.LogMsg {
				fmt.Println("------")
				fmt.Println("\x1b[95m[ MESSAGE ]\x1b[0m")
				fmt.Println("Time    :", time.Now().Format("2006-01-02 15:04:05"))

				if m.IsGroup {
					fmt.Println("From    :", m.Info.PushName, "(Group) -", m.Info.Chat.User)
				} else {
					fmt.Println("From    : Private Chat -", m.Info.Sender.User)
				}

				msgType := helpers.GetMessageType(m.Message)
				fmt.Println("Type    :", msgType)

				text := helpers.GetTextMessage(m.Omessage)

				if msgType == "conversation" || msgType == "extendedTextMessage" {
					fmt.Println("Message :", text)
				} else {
					if text != "" {
						fmt.Println("Caption :", text)
					} else {
						fmt.Println("Caption : [empty]")
					}
				}

				fmt.Println("------")
			}

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

func handleGroupInfo(info *events.GroupInfo, conn *libs.IClient) {
	chatJID := info.JID.String()
	settings, err := db.GetGroupSettings(chatJID)
	if err != nil {
		fmt.Printf("Failed to get group settings for %s: %v\n", chatJID, err)
		return
	}

	printGroupEventLog := func(jid types.JID, text string, action string) {
		fmt.Println("------")
		fmt.Println("\x1b[95m[ MESSAGE ]\x1b[0m")
		fmt.Println("Time    :", time.Now().Format("2006-01-02 15:04:05"))
		fmt.Println("From    :", jid.User, "(Group) -", chatJID)
		fmt.Println("Type    :", action)
		fmt.Printf("Message : @%s has been %s admin.\n", jid.User, text)
		fmt.Println("------")
	}

	for _, jid := range info.Promote {
		printGroupEventLog(jid, "promoted to", "promote")

		if settings != nil && settings.PDM {
			msg := fmt.Sprintf("@%s has been promoted to admin.", jid.User)
			err := conn.SendMentionMessage(info.JID, msg, []string{jid.String()})
			if err != nil {
				fmt.Printf("Failed to send promote message: %v\n", err)
			}
		}
	}

	for _, jid := range info.Demote {
		printGroupEventLog(jid, "demoted from", "demote")

		if settings != nil && settings.PDM {
			msg := fmt.Sprintf("@%s has been demoted from admin.", jid.User)
			err := conn.SendMentionMessage(info.JID, msg, []string{jid.String()})
			if err != nil {
				fmt.Printf("Failed to send demote message: %v\n", err)
			}
		}
	}
}
