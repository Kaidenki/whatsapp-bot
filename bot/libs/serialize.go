package libs

import (
	"aurora/bot/helpers"
	"context"
	"fmt"
	"strings"

	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/proto/waE2E"
	"go.mau.fi/whatsmeow/types"
	"go.mau.fi/whatsmeow/types/events"
	"google.golang.org/protobuf/proto"
)

func SerializeMessage(mess *events.Message, conn *IClient) *IMessage {
	var media whatsmeow.DownloadableMessage
	var text string
	var args []string
	var FromMe = false
	var isMedia string
	var Botnumber1 = helpers.ExtractPhoneNumber(conn.WA.Store.ID.String())
	mess.Message = helpers.ParseMessage(mess)
	body := helpers.GetTextMessage(mess)
	command := strings.ToLower(strings.Split(body, " ")[0])
	senderJID := helpers.GetNormalizedSenderJID(mess)
	senderlid := helpers.GetSenderLid(mess)
	senderLID := helpers.ParseLID(senderlid)
	FromMe = mess.Info.IsFromMe

	if strings.HasPrefix(body, "@"+conn.WA.Store.ID.ToNonAD().User) {
		body = strings.Trim(strings.Replace(body, "@"+conn.WA.Store.ID.ToNonAD().User, "", 1), " ")
	}

	if HasCommand(command) {
		text = strings.Join(strings.Split(body, " ")[1:], ` `)
		args = helpers.ArrayFilter(strings.Split(text, " "), "")
	} else {
		text = body
		args = helpers.ArrayFilter(strings.Split(body, " "), "")
	}

	quotedMsg := helpers.ParseQuotedMessage(mess.Message)

	if quotedMsg != nil {
		media = helpers.GetMediaMessage(quotedMsg)
		isMedia = helpers.GetMediaType(quotedMsg)
	} else if mess.Message != nil {
		media = helpers.GetMediaMessage(mess.Message)
		isMedia = helpers.GetMediaType(mess.Message)
	} else {
		media = nil
	}

	senderJIDVal, err := types.ParseJID(senderJID)
	if err != nil {
		panic(err)
	}

	return &IMessage{
		ID: &waE2E.ContextInfo{
			StanzaID:      &mess.Info.ID,
			Participant:   proto.String(mess.Info.Sender.String()),
			QuotedMessage: mess.Message,
		},
		From:       mess.Info.Chat,
		Sender:     senderJIDVal,
		BotNumber:  Botnumber1,
		Omessage:   mess,
		Info:       mess.Info,
		IsGroup:    strings.HasSuffix(mess.Info.Chat.String(), "@g.us"),
		FromMe:     FromMe,
		Body:       body,
		Text:       text,
		Args:       args,
		Command:    command,
		Message:    mess.Message,
		IsMedia:    isMedia,
		Media:      media,
		Expiration: helpers.GetContextInfo(mess.Message).GetExpiration(),
		Quoted:     helpers.GetContextInfo(mess.Message),
		IsImage:    mess.Message.GetImageMessage() != nil,
		IsQuotedImage: func() bool {
			return helpers.ParseQuotedMessage(mess.Message).GetImageMessage() != nil
		}(),
		IsQuotedSticker: func() bool {
			return helpers.ParseQuotedMessage(mess.Message).GetStickerMessage() != nil
		}(),
		IsVideo: func() bool {
			return mess.Message != nil && mess.Message.GetVideoMessage() != nil
		}(),
		IsQuotedVideo: func() bool {
			qm := helpers.ParseQuotedMessage(mess.Message)
			return qm != nil && qm.GetVideoMessage() != nil
		}(),
		IsAdmin: func() bool {
			if !mess.Info.IsGroup {
				return false
			}
			groupInfo, err := conn.WA.GetGroupInfo(mess.Info.Chat)
			if err != nil {
				fmt.Println("GetGroupInfo error:", err)
				return false
			}
			for _, participant := range groupInfo.Participants {
				pjid := participant.JID.String()
				if (pjid == senderLID || pjid == senderJID) && participant.IsAdmin {
					return true
				}
			}
			return false
		}(),
		IsBotAdmin: func() bool {
			if !mess.Info.IsGroup {
				return false
			}
			groupInfo, err := conn.WA.GetGroupInfo(mess.Info.Chat)
			if err != nil {
				return false
			}
			rawBotJID := conn.WA.Store.ID.String()
			botPhone := helpers.ExtractPhoneNumber(rawBotJID)

			for _, participant := range groupInfo.Participants {
				if participant.PhoneNumber.User == botPhone {
					return participant.IsAdmin
				}
			}
			return false
		}(),
		Reply: func(text string, opts ...whatsmeow.SendRequestExtra) (whatsmeow.SendResponse, error) {
			var Expiration uint32
			if helpers.GetContextInfo(mess.Message) != nil {
				Expiration = helpers.GetContextInfo(mess.Message).GetExpiration()
			} else {
				Expiration = uint32(0)
			}
			return conn.SendText(mess.Info.Chat, text, &waE2E.ContextInfo{
				StanzaID:      &mess.Info.ID,
				Participant:   proto.String(mess.Info.Sender.String()),
				QuotedMessage: mess.Message,
				Expiration:    &Expiration,
			}, opts...)
		},
		React: func(emoji string, opts ...whatsmeow.SendRequestExtra) (whatsmeow.SendResponse, error) {
			return conn.WA.SendMessage(context.Background(), mess.Info.Chat, conn.WA.BuildReaction(mess.Info.Chat, mess.Info.Sender, mess.Info.ID, emoji), opts...)
		},
		Edit: func(messageID string, newContent *waE2E.Message, opts ...whatsmeow.SendRequestExtra) (whatsmeow.SendResponse, error) {
			editMsg := conn.BuildEdit(mess.Info.Chat, messageID, newContent)
			return conn.WA.SendMessage(context.Background(), mess.Info.Chat, editMsg, opts...)
		},
	}
}
