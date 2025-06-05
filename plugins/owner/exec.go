package commands

import (
	"aurora/bot/libs"
	"fmt"
	"os/exec"
	"runtime"
)

func init() {
	libs.Newplugin(&libs.Iplugin{
		Name:     `\$`,
		As:       []string{"$"},
		Tags:     "owner",
		IsPrefix: false,
		FromMe:   true,
		Execute: func(conn *libs.IClient, m *libs.IMessage) bool {
			var cmd *exec.Cmd

			switch runtime.GOOS {
			case "windows":
				cmd = exec.Command("cmd", "/C", m.Text)
			default:
				cmd = exec.Command("sh", "-c", m.Text)
			}

			out, err := cmd.Output()
			if err != nil {
				m.Reply(fmt.Sprintf("%s", err))
				return true
			}
			m.Reply(string(out))

			return true
		},
	})
}
