package libs

import (
	"aurora/bot/helpers"
	"context"
	"os"
	"regexp"
	"strings"

	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/proto/waE2E"
	"go.mau.fi/whatsmeow/types/events"
	"google.golang.org/protobuf/proto"
)

func SerializeMessage(mess *events.Message, conn *IClient) *IMessage {
	var media whatsmeow.DownloadableMessage
	var text string
	var args []string
	var owner []string
	var isOwner = false
	var isMedia string

	mess.Message = helpers.ParseMessage(mess)
	body := helpers.GetTextMessage(mess)
	command := strings.ToLower(strings.Split(body, " ")[0])
	owner = strings.Split(os.Getenv("OWNER"), ",")

	for _, v := range owner {
		if strings.Contains(regexp.MustCompile(`\D+`).ReplaceAllString(v, ""), mess.Info.Sender.ToNonAD().User) {
			isOwner = true
		}
	}

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

	return &IMessage{
		Info:       mess.Info,
		IsOwner:    isOwner,
		Body:       body,
		Text:       text,
		Args:       args,
		Command:    command,
		Message:    mess.Message,
		IsMedia:    isMedia,
		Media:      media,
		Expiration: helpers.GetContextInfo(mess.Message).GetExpiration(),
		Quoted:     helpers.GetContextInfo(mess.Message),
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
	}
}
