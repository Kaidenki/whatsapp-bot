package handlers

import (
	"aurora/bot/libs"
	"context"
	"fmt"

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
