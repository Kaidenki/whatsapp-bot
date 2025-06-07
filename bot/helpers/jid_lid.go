package helpers

import (
	"fmt"
	"strings"

	"go.mau.fi/whatsmeow/types/events"
)

func GetNormalizedSenderJID(mess *events.Message) string {
	info := mess.Info
	fmt.Println(info.MessageSource.Sender.String())
	if info.IsGroup {
		if info.MessageSource.SenderAlt.String() != "" {
			return info.MessageSource.SenderAlt.String()
		}
		return ""
	}
	return info.MessageSource.Sender.String()
}

func GetSenderLid(mess *events.Message) string {
	info := mess.Info
	if info.IsGroup {
		return info.MessageSource.Sender.String()
	}
	return info.Sender.String()
}

func ExtractPhoneNumber(jid string) string {
	parts := strings.Split(jid, "@")
	if len(parts) == 0 {
		return ""
	}
	user := strings.Split(parts[0], ":")[0]
	return user
}

func ParseLID(jid string) string {
	parts := strings.Split(jid, "@")
	if len(parts) < 2 {
		return ""
	}
	userPart := parts[0]
	userOnly := strings.Split(userPart, ":")[0]
	domainPart := parts[1]
	return userOnly + "@" + domainPart
}

func NormalizeJID(jid string) string {
	parts := strings.Split(jid, ":")
	userPart := parts[0]
	return userPart + "@s.whatsapp.net"
}
