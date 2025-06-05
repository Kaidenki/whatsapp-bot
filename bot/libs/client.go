package libs

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/proto/waCommon"
	"go.mau.fi/whatsmeow/proto/waE2E"
	"go.mau.fi/whatsmeow/types"
	"google.golang.org/protobuf/proto"
)

func SerializeClient(conn *whatsmeow.Client) *IClient {
	return &IClient{
		WA: conn,
	}
}

func (conn *IClient) SendText(from types.JID, txt string, opts *waE2E.ContextInfo, optn ...whatsmeow.SendRequestExtra) (whatsmeow.SendResponse, error) {
	ok, er := conn.WA.SendMessage(context.Background(), from, &waE2E.Message{
		ExtendedTextMessage: &waE2E.ExtendedTextMessage{
			Text:        proto.String(txt),
			ContextInfo: opts,
		},
	}, optn...)
	if er != nil {
		return whatsmeow.SendResponse{}, er
	}
	return ok, nil
}

func (conn *IClient) SendWithNewsLestter(from types.JID, text string, newjid string, newserver int32, name string, opts *waE2E.ContextInfo) (whatsmeow.SendResponse, error) {
	ok, er := conn.SendText(from, text, &waE2E.ContextInfo{
		ForwardedNewsletterMessageInfo: &waE2E.ContextInfo_ForwardedNewsletterMessageInfo{
			NewsletterJID:     proto.String(newjid),
			NewsletterName:    proto.String(name),
			ServerMessageID:   proto.Int32(newserver),
			ContentType:       waE2E.ContextInfo_ForwardedNewsletterMessageInfo_UPDATE.Enum(),
			AccessibilityText: proto.String(""),
		},
		IsForwarded:   proto.Bool(true),
		StanzaID:      opts.StanzaID,
		Participant:   opts.Participant,
		QuotedMessage: opts.QuotedMessage,
	})

	if er != nil {
		return whatsmeow.SendResponse{}, er
	}
	return ok, nil
}

func (conn *IClient) SendImage(from types.JID, data []byte, caption string, opts *waE2E.ContextInfo) (whatsmeow.SendResponse, error) {
	uploaded, err := conn.WA.Upload(context.Background(), data, whatsmeow.MediaImage)
	if err != nil {
		fmt.Printf("Failed to upload file: %v\n", err)
		return whatsmeow.SendResponse{}, err
	}
	resultImg := &waE2E.Message{
		ImageMessage: &waE2E.ImageMessage{
			URL:           proto.String(uploaded.URL),
			DirectPath:    proto.String(uploaded.DirectPath),
			MediaKey:      uploaded.MediaKey,
			Caption:       proto.String(caption),
			Mimetype:      proto.String(http.DetectContentType(data)),
			FileEncSHA256: uploaded.FileEncSHA256,
			FileSHA256:    uploaded.FileSHA256,
			FileLength:    proto.Uint64(uint64(len(data))),
			ContextInfo:   opts,
		},
	}
	ok, _ := conn.WA.SendMessage(context.Background(), from, resultImg)
	return ok, nil
}

func (conn *IClient) SendVideo(from types.JID, data []byte, caption string, opts *waE2E.ContextInfo) (whatsmeow.SendResponse, error) {
	uploaded, err := conn.WA.Upload(context.Background(), data, whatsmeow.MediaVideo)
	if err != nil {
		fmt.Printf("Failed to upload file: %v\n", err)
		return whatsmeow.SendResponse{}, err
	}
	resultVideo := &waE2E.Message{
		VideoMessage: &waE2E.VideoMessage{
			URL:           proto.String(uploaded.URL),
			DirectPath:    proto.String(uploaded.DirectPath),
			MediaKey:      uploaded.MediaKey,
			Caption:       proto.String(caption),
			Mimetype:      proto.String(http.DetectContentType(data)),
			FileEncSHA256: uploaded.FileEncSHA256,
			FileSHA256:    uploaded.FileSHA256,
			FileLength:    proto.Uint64(uint64(len(data))),
			ContextInfo:   opts,
		},
	}
	ok, er := conn.WA.SendMessage(context.Background(), from, resultVideo)
	if er != nil {
		return whatsmeow.SendResponse{}, er
	}
	return ok, nil
}

func (conn *IClient) SendDocument(from types.JID, data []byte, fileName string, caption string, opts *waE2E.ContextInfo) (whatsmeow.SendResponse, error) {
	uploaded, err := conn.WA.Upload(context.Background(), data, whatsmeow.MediaDocument)
	if err != nil {
		fmt.Printf("Failed to upload file: %v\n", err)
		return whatsmeow.SendResponse{}, err
	}
	resultDoc := &waE2E.Message{
		DocumentMessage: &waE2E.DocumentMessage{
			URL:           proto.String(uploaded.URL),
			DirectPath:    proto.String(uploaded.DirectPath),
			MediaKey:      uploaded.MediaKey,
			FileName:      proto.String(fileName),
			Caption:       proto.String(caption),
			Mimetype:      proto.String(http.DetectContentType(data)),
			FileEncSHA256: uploaded.FileEncSHA256,
			FileSHA256:    uploaded.FileSHA256,
			FileLength:    proto.Uint64(uint64(len(data))),
			ContextInfo:   opts,
		},
	}
	ok, er := conn.WA.SendMessage(context.Background(), from, resultDoc)
	if er != nil {
		return whatsmeow.SendResponse{}, er
	}
	return ok, nil
}

func (conn *IClient) DeleteMsg(from types.JID, id string, me bool) {
	conn.WA.SendMessage(context.Background(), from, &waE2E.Message{
		ProtocolMessage: &waE2E.ProtocolMessage{
			Type: waE2E.ProtocolMessage_REVOKE.Enum(),
			Key: &waCommon.MessageKey{
				FromMe: proto.Bool(me),
				ID:     proto.String(id),
			},
		},
	})
}

func (conn *IClient) ParseJID(arg string) (types.JID, bool) {
	if arg[0] == '+' {
		arg = arg[1:]
	}
	if !strings.ContainsRune(arg, '@') {
		return types.NewJID(arg, types.DefaultUserServer), true
	} else {
		recipient, err := types.ParseJID(arg)
		if err != nil {
			return recipient, false
		} else if recipient.User == "" {
			return recipient, false
		}
		return recipient, true
	}
}

func (conn *IClient) FetchGroupAdmin(Jid types.JID) ([]string, error) {
	var Admin []string
	resp, err := conn.WA.GetGroupInfo(Jid)
	if err != nil {
		return Admin, err
	} else {
		for _, group := range resp.Participants {
			if group.IsAdmin || group.IsSuperAdmin {
				Admin = append(Admin, group.JID.String())
			}
		}
	}
	return Admin, err
}

func (conn *IClient) SendSticker(jid types.JID, data []byte, opts *waE2E.ContextInfo) (whatsmeow.SendResponse, error) {
	uploaded, err := conn.WA.Upload(context.Background(), data, whatsmeow.MediaImage)
	if err != nil {
		fmt.Printf("Failed to upload file: %v\n", err)
		return whatsmeow.SendResponse{}, err
	}

	ok, er := conn.WA.SendMessage(context.Background(), jid, &waE2E.Message{
		StickerMessage: &waE2E.StickerMessage{
			URL:           proto.String(uploaded.URL),
			DirectPath:    proto.String(uploaded.DirectPath),
			MediaKey:      uploaded.MediaKey,
			Mimetype:      proto.String(http.DetectContentType(data)),
			FileEncSHA256: uploaded.FileEncSHA256,
			FileSHA256:    uploaded.FileSHA256,
			FileLength:    proto.Uint64(uint64(len(data))),
			ContextInfo:   opts,
		},
	})

	if er != nil {
		return whatsmeow.SendResponse{}, er
	}

	return ok, nil
}

func (conn *IClient) GetBytes(url string) ([]byte, error) {
	resp, err := http.Get(url)
	if err != nil {
		return []byte{}, err
	}

	bytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return []byte{}, err
	}

	return bytes, nil
}
