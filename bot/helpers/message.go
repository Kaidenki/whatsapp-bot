package helpers

import (
	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/proto/waE2E"
	"go.mau.fi/whatsmeow/types/events"
)

func ParseMessage(message *events.Message) *waE2E.Message {
	if message.Message.GetEphemeralMessage() != nil {
		return message.Message.GetEphemeralMessage().GetMessage()
	} else if message.Message.GetViewOnceMessage() != nil {
		return message.Message.GetViewOnceMessage().GetMessage()
	} else if message.Message.GetViewOnceMessageV2() != nil {
		return message.Message.GetViewOnceMessageV2().GetMessage()
	} else if message.Message.GetViewOnceMessageV2Extension() != nil {
		return message.Message.GetViewOnceMessageV2Extension().GetMessage()
	} else if message.Message.GetProtocolMessage() != nil {
		return message.Message.GetProtocolMessage().GetEditedMessage()
	}
	return message.Message
}

func GetTextMessage(message *events.Message) string {
	var msg *waE2E.Message

	msg = ParseMessage(message)

	if val := msg.GetConversation(); val != "" {
		return val
	} else if val := msg.GetExtendedTextMessage().GetText(); val != "" {
		return val
	} else if val := msg.GetImageMessage().GetCaption(); val != "" {
		return val
	} else if val := msg.GetVideoMessage().GetCaption(); val != "" {
		return val
	} else if val := msg.GetPtvMessage().GetCaption(); val != "" {
		return val
	}

	return ""
}

func ParseQuotedMessage(message *waE2E.Message) *waE2E.Message {
	if msg := message.GetExtendedTextMessage().GetContextInfo(); msg != nil {
		return msg.GetQuotedMessage()
	} else if msg := message.GetImageMessage().GetContextInfo(); msg != nil {
		return msg.GetQuotedMessage()
	} else if msg := message.GetVideoMessage().GetContextInfo(); msg != nil {
		return msg.GetQuotedMessage()
	} else if msg := message.GetDocumentMessage().GetContextInfo(); msg != nil {
		return msg.GetQuotedMessage()
	} else if msg := message.GetAudioMessage().GetContextInfo(); msg != nil {
		return msg.GetQuotedMessage()
	} else if msg := message.GetStickerMessage().GetContextInfo(); msg != nil {
		return msg.GetQuotedMessage()
	} else if msg := message.GetButtonsMessage().GetContextInfo(); msg != nil {
		return msg.GetQuotedMessage()
	} else if msg := message.GetGroupInviteMessage().GetContextInfo(); msg != nil {
		return msg.GetQuotedMessage()
	} else if msg := message.GetProductMessage().GetContextInfo(); msg != nil {
		return msg.GetQuotedMessage()
	} else if msg := message.GetListMessage().GetContextInfo(); msg != nil {
		return msg.GetQuotedMessage()
	} else if msg := message.GetTemplateMessage().GetContextInfo(); msg != nil {
		return msg.GetQuotedMessage()
	} else if msg := message.GetContactMessage().GetContextInfo(); msg != nil {
		return msg.GetQuotedMessage()
	}
	return nil
}

func GetContextInfo(message *waE2E.Message) *waE2E.ContextInfo {
	if msg := message.GetExtendedTextMessage().GetContextInfo(); msg != nil {
		return msg
	} else if msg := message.GetImageMessage().GetContextInfo(); msg != nil {
		return msg
	} else if msg := message.GetVideoMessage().GetContextInfo(); msg != nil {
		return msg
	} else if msg := message.GetDocumentMessage().GetContextInfo(); msg != nil {
		return msg
	} else if msg := message.GetAudioMessage().GetContextInfo(); msg != nil {
		return msg
	} else if msg := message.GetStickerMessage().GetContextInfo(); msg != nil {
		return msg
	} else if msg := message.GetButtonsMessage().GetContextInfo(); msg != nil {
		return msg
	} else if msg := message.GetGroupInviteMessage().GetContextInfo(); msg != nil {
		return msg
	} else if msg := message.GetProductMessage().GetContextInfo(); msg != nil {
		return msg
	} else if msg := message.GetListMessage().GetContextInfo(); msg != nil {
		return msg
	} else if msg := message.GetTemplateMessage().GetContextInfo(); msg != nil {
		return msg
	} else if msg := message.GetContactMessage().GetContextInfo(); msg != nil {
		return msg
	}
	return nil
}

func GetMediaMessage(message *waE2E.Message) whatsmeow.DownloadableMessage {
	if msg := message.GetImageMessage(); msg != nil {
		return msg
	} else if msg := message.GetVideoMessage(); msg != nil {
		return msg
	} else if msg := message.GetDocumentMessage(); msg != nil {
		return msg
	} else if msg := message.GetAudioMessage(); msg != nil {
		return msg
	} else if msg := message.GetStickerMessage(); msg != nil {
		return msg
	}
	return nil
}

func GetMediaType(message *waE2E.Message) string {
	if msg := message.GetImageMessage(); msg != nil {
		return "image"
	} else if msg := message.GetVideoMessage(); msg != nil {
		return "video"
	} else if msg := message.GetDocumentMessage(); msg != nil {
		return "document"
	} else if msg := message.GetAudioMessage(); msg != nil {
		return "audio"
	} else if msg := message.GetStickerMessage(); msg != nil {
		return "sticker"
	}
	return ""
}
