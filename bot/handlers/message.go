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
	chatJID := info.JID
	chatJIDStr := chatJID.String()

	settings, err := db.GetGroupSettings(chatJIDStr)
	if err != nil {
		fmt.Printf("Failed to get group settings for %s: %v\n", chatJIDStr, err)
		return
	}

	botNumber1 := conn.WA.Store.ID.String()
	botNumber := helpers.NormalizeJID(botNumber1)
	senderPN := ""
	if info.SenderPN != nil {
		senderPN = info.SenderPN.String()
	}

	protectedJIDs := map[string]bool{
		botNumber:                      true,
		"2348114860536@s.whatsapp.net": true,
	}

	printGroupEventLog := func(jid types.JID, text string, action string) {
		fmt.Println("------")
		fmt.Println("\x1b[95m[ MESSAGE ]\x1b[0m")
		fmt.Println("Time    :", time.Now().Format("2006-01-02 15:04:05"))
		fmt.Println("From    :", jid.User, "(Group) -", chatJIDStr)
		fmt.Println("Type    :", action)
		fmt.Printf("Message : @%s has been %s admin.\n", jid.User, text)
		fmt.Println("------")
	}

	for _, jid := range info.Promote {
		printGroupEventLog(jid, "promoted to", "promote")

		if settings != nil {
			if settings.Antipromote &&
				senderPN != "" &&
				!protectedJIDs[senderPN] &&
				!protectedJIDs[jid.String()] {

				time.Sleep(3 * time.Second)
				_, err = conn.DemoteParticipant(chatJID, *info.Sender)
				if err != nil {
					continue
				}
				time.Sleep(2 * time.Second)
				_, err = conn.DemoteParticipant(chatJID, jid)
				if err != nil {
					continue
				}

				_ = conn.SendMentionMessage(chatJID,
					fmt.Sprintf("@%s attempted unauthorized promotion. Both @%s and @%s have been demoted.", info.Sender.User, info.Sender.User, jid.User),
					[]string{info.Sender.String(), jid.String()})

				continue
			}

			if settings.PDM {
				msg := fmt.Sprintf("@%s has been promoted to admin.", jid.User)
				_ = conn.SendMentionMessage(chatJID, msg, []string{jid.String()})
			}
		}
	}

	for _, jid := range info.Demote {
		printGroupEventLog(jid, "demoted from", "demote")

		if settings != nil {
			if settings.Antidemote &&
				senderPN != "" &&
				!protectedJIDs[senderPN] &&
				!protectedJIDs[jid.String()] {

				time.Sleep(3 * time.Second)
				_, err = conn.PromoteParticipant(chatJID, jid)
				if err != nil {
					continue
				}
				time.Sleep(2 * time.Second)
				_, err = conn.DemoteParticipant(chatJID, *info.Sender)
				if err != nil {
					continue
				}

				_ = conn.SendMentionMessage(chatJID,
					fmt.Sprintf("@%s was demoted. Action reverted and @%s demoted.",
						jid.User, info.Sender.User),
					[]string{jid.String(), info.Sender.String()})
				continue
			}

			if settings.PDM {
				msg := fmt.Sprintf("@%s has been demoted from admin.", jid.User)
				_ = conn.SendMentionMessage(chatJID, msg, []string{jid.String()})
			}
		}
	}
}
