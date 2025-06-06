package plugins

import (
	"aurora/bot/libs"
	"math/rand"
	"os"

	"go.mau.fi/whatsmeow/types"
)

func init() {
	libs.Newplugin(&libs.Iplugin{
		Description: "Auto Reacts to status",
		Before: func(conn *libs.IClient, m *libs.IMessage) {
			if m.Info.Chat.String() == "status@broadcast" {
				conn.WA.MarkRead([]types.MessageID{m.Info.ID}, m.Info.Timestamp, m.Info.Chat, m.Info.Sender)

				if os.Getenv("REACT_STATUS") == "true" {
					emojis := []string{"😀", "😃", "😄", "😁", "😆", "🥹", "😅", "😂", "🤣", "🥲", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "🤪", "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😶‍🌫️", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🫣", "🤭", "🫢", "🫡", "🤫", "🫠", "🤥", "😶", "🫥", "😐", "🫤", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😮‍💨", "😵", "😵‍💫", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤡", "💩", "👻", "💀", "☠️", "🙌", "👏", "👍", "👎", "👊", "✊", "🤛", "🤞", "✌️", "🫰", "🤟", "🤘", "👌", "🤏", "☝️", "✋", "🤚", "🖖", "👋", "🤙", "🫲", "🫱", "💪", "🖕", "✍️", "🙏", "🫵", "🦶", "👣", "👀", "🧠"}
					randomEmoji := emojis[rand.Intn(len(emojis))]

					m.React(randomEmoji)
				}
			}
		},
	})
}
