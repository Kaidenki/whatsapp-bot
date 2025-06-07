package plugins

import (
	"aurora/bot/config"
	"aurora/bot/libs"
	"aurora/bot/utils"
	"context"
	"strings"
)

func sticker(conn *libs.IClient, m *libs.IMessage) bool {
	data, err := conn.WA.Download(context.Background(), m.Media)
	if err != nil {
		m.Reply("❌ Failed to download media")
		return false
	}

	circle := false
	for _, arg := range m.Args {
		if strings.ToLower(arg) == "-c" {
			circle = true
			break
		}
	}

	var mediaType libs.MediaType

	switch {
	case m.IsImage || m.IsQuotedImage || m.IsQuotedSticker:
		mediaType = libs.IMAGE
	case m.IsVideo || m.IsQuotedVideo:
		mediaType = libs.VIDEO
	default:
		m.Reply("❌ Unsupported media type for sticker")
		return false
	}

	stickerObj := &libs.Sticker{
		File: data,
		Tipe: mediaType,
	}

	metadata := &libs.MetadataSticker{
		Author:    config.GlobalConfig.StickerAuthor,
		Pack:      config.GlobalConfig.StickerPackName,
		KeepScale: true,
		Removebg:  "false",
		Circle:    circle,
	}

	s := utils.StickerApi(stickerObj, metadata)
	conn.SendSticker(m.From, s.Build(), m.ID)
	return true
}
func init() {
	libs.Newplugin(&libs.Iplugin{
		Name:     "(s|sticker)",
		As:       []string{"sticker"},
		Tags:     "convert",
		IsPrefix: true,
		IsMedia:  true,
		Execute:  sticker,
	})
}
