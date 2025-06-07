package libs

import (
	"context"
	"fmt"
	"io"
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

func (conn *IClient) DeleteMsg(chat types.JID, messageID string, sender types.JID) error {
	revokeMsg := conn.WA.BuildRevoke(chat, sender, types.MessageID(messageID))
	_, err := conn.WA.SendMessage(context.Background(), chat, revokeMsg)
	return err
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

func (conn *IClient) BuildEdit(chat types.JID, id types.MessageID, newContent *waE2E.Message) *waE2E.Message {
	return &waE2E.Message{
		ProtocolMessage: &waE2E.ProtocolMessage{
			Type: waE2E.ProtocolMessage_MESSAGE_EDIT.Enum(),
			Key: &waCommon.MessageKey{
				FromMe:    proto.Bool(true),
				ID:        proto.String(id),
				RemoteJID: proto.String(chat.String()),
			},
			EditedMessage: newContent,
		},
	}
}

func (conn *IClient) AddParticipant(groupJID types.JID, participantJID types.JID) ([]types.GroupParticipant, error) {
	bareJID := types.JID{
		User:   participantJID.User,
		Server: participantJID.Server,
		Device: 0,
	}

	participants, err := conn.WA.UpdateGroupParticipants(groupJID, []types.JID{bareJID}, whatsmeow.ParticipantChangeAdd)
	if err != nil {
		return nil, fmt.Errorf("failed to add participant %s to group %s: %w", bareJID.String(), groupJID.String(), err)
	}
	return participants, nil
}

func (conn *IClient) RemoveParticipant(groupJID types.JID, participantJID types.JID) ([]types.GroupParticipant, error) {
	bareJID := types.JID{
		User:   participantJID.User,
		Server: participantJID.Server,
		Device: 0,
	}

	participants, err := conn.WA.UpdateGroupParticipants(groupJID, []types.JID{bareJID}, whatsmeow.ParticipantChangeRemove)
	if err != nil {
		return nil, fmt.Errorf("failed to remove participant %s from group %s: %w", bareJID.String(), groupJID.String(), err)
	}
	return participants, nil
}

func (conn *IClient) PromoteParticipant(groupJID types.JID, participantJID types.JID) ([]types.GroupParticipant, error) {
	bareJID := types.JID{
		User:   participantJID.User,
		Server: participantJID.Server,
		Device: 0,
	}

	participants, err := conn.WA.UpdateGroupParticipants(groupJID, []types.JID{bareJID}, whatsmeow.ParticipantChangePromote)
	if err != nil {
		return nil, fmt.Errorf("failed to promote participant %s in group %s: %w", bareJID.String(), groupJID.String(), err)
	}
	return participants, nil
}

func (conn *IClient) DemoteParticipant(groupJID types.JID, participantJID types.JID) ([]types.GroupParticipant, error) {
	bareJID := types.JID{
		User:   participantJID.User,
		Server: participantJID.Server,
		Device: 0,
	}

	participants, err := conn.WA.UpdateGroupParticipants(groupJID, []types.JID{bareJID}, whatsmeow.ParticipantChangeDemote)
	if err != nil {
		return nil, fmt.Errorf("failed to demote participant %s in group %s: %w", bareJID.String(), groupJID.String(), err)
	}
	return participants, nil
}

func (conn *IClient) GetBytes(url string) ([]byte, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	bytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return bytes, nil
}

/*

func (cli *NewClientImpl) GenerateMessageID(cust string) types.MessageID {
	data := make([]byte, 8, 8+20+16)
	binary.BigEndian.PutUint64(data, uint64(time.Now().Unix()))
	data = append(data, random.Bytes(16)...)
	hash := sha256.Sum256(data)
	return cust + strings.ToUpper(hex.EncodeToString(hash[:12])) + "NM4O"
}

func (client *NewClientImpl) FetchGroupAdmin(Jid types.JID) ([]string, error) {
	var Admin []string
	resp, err := client.WA.GetGroupInfo(Jid)
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

func (client *NewClientImpl) UploadImage(data []byte) (string, error) {
	bodyy := &bytes.Buffer{}
	writer := multipart.NewWriter(bodyy)
	part, _ := writer.CreateFormFile("file", "file")
	_, err := io.Copy(part, bytes.NewBuffer(data))
	if err != nil {
		return "", err
	}
	writer.Close()

	// Create request
	req, err := http.NewRequest("POST", "https://telegra.ph/upload", bodyy)
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", writer.FormDataContentType())

	// Send request and handle response
	htt := &http.Client{}
	resp, err := htt.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return "", fmt.Errorf("HTTP Error: %d", resp.StatusCode)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var uploads []struct {
		Path string `json:"src"`
	}
	if err := json.Unmarshal(body, &uploads); err != nil {
		m := map[string]string{}
		if err := json.Unmarshal(data, &m); err != nil {
			return "", err
		}
		return "", fmt.Errorf("telegraph: %s", m["error"])
	}

	return "https://telegra.ph/" + uploads[0].Path, nil
}
*/
