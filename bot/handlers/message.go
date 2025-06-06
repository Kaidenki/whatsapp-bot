package handlers

import (
	"aurora/bot/config"
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
		switch v := evt.(type) {
		case *events.Message:
			m := libs.SerializeMessage(v, sock)
			fmt.Println(m.IsAdmin)
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
