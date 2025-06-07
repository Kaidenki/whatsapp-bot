package plugins

import (
	"aurora/bot/config"
	"aurora/bot/helpers"
	"aurora/bot/libs"
	"aurora/bot/utils"
	"fmt"
	"os"
	"sort"
	"strings"
	"time"
)

type item struct {
	Name     []string
	IsPrefix bool
}

type tagSlice []string

func (t tagSlice) Len() int           { return len(t) }
func (t tagSlice) Less(i, j int) bool { return t[i] < t[j] }
func (t tagSlice) Swap(i, j int)      { t[i], t[j] = t[j], t[i] }

var botPrefix string

func menu(conn *libs.IClient, m *libs.IMessage) bool {
	var version string
	data, err := os.ReadFile("version.txt")
	if err != nil {
		version = "unknown"
	} else {
		version = strings.TrimSpace(string(data))
	}

	now := time.Now()
	timeStr := now.Format("03:04 PM")
	dayStr := now.Format("Monday")
	dateStr := now.Format("02/01/2006")
	ramStr, err := utils.GetRAMUsage()
	if err != nil {
		ramStr = "Unknown"
	}
	uptimeSeconds := utils.UptimeSeconds()
	runtimeStr := utils.Runtime(uptimeSeconds)

	var strBuilder strings.Builder

	strBuilder.WriteString(fmt.Sprintf("╭━〔  *%s* 〕━◉\n", strings.ToUpper(config.GlobalConfig.Bot_Name)))
	strBuilder.WriteString("┃╭━━━━━━━━━━━━━━◉\n")
	strBuilder.WriteString(fmt.Sprintf("┃┃ *Prefix(s) :* %s\n", botPrefix))
	strBuilder.WriteString(fmt.Sprintf("┃┃ *User :* %s\n", m.Info.PushName))
	strBuilder.WriteString(fmt.Sprintf("┃┃ *Time :* %s\n", timeStr))
	strBuilder.WriteString(fmt.Sprintf("┃┃ *Day :* %s\n", dayStr))
	strBuilder.WriteString(fmt.Sprintf("┃┃ *Date :* %s\n", dateStr))
	strBuilder.WriteString(fmt.Sprintf("┃┃ *Version :* %s\n", version))
	strBuilder.WriteString(fmt.Sprintf("┃┃ *Plugins :* %d\n", len(libs.GetList())))
	strBuilder.WriteString(fmt.Sprintf("┃┃ *Ram :* %s\n", ramStr))
	strBuilder.WriteString(fmt.Sprintf("┃┃ *Uptime :* %s\n", runtimeStr))
	strBuilder.WriteString("┃╰━━━━━━━━━━━━━◉\n")
	strBuilder.WriteString("╰═════════════════⊷\n")

	var tags = make(map[string][]item)
	for _, list := range libs.GetList() {
		if _, ok := tags[list.Tags]; !ok {
			tags[list.Tags] = []item{}
		}
		tags[list.Tags] = append(tags[list.Tags], item{Name: list.As, IsPrefix: list.IsPrefix})
	}

	var keys tagSlice
	for key := range tags {
		if key != "" {
			keys = append(keys, key)
		}
	}
	sort.Sort(keys)

	for _, key := range keys {
		strBuilder.WriteString(fmt.Sprintf(" ╭─❏ *%s* ❏\n", utils.Fancy1(strings.ToUpper(key))))
		for _, e := range tags[key] {
			for _, nm := range e.Name {
				strBuilder.WriteString(fmt.Sprintf(" │ %s\n", utils.Fancy1(nm)))
			}
		}
		strBuilder.WriteString(" ╰─────────────────\n")
	}

	m.Reply(strBuilder.String())
	return true
}

func init() {
	p := config.GlobalConfig.Pattern

	if p.Type == helpers.LiteralPattern {
		botPrefix = p.Literal
	} else if p.Regex != nil {
		botPrefix = p.Regex.String()
	} else {
		botPrefix = helpers.DefaultPattern
	}

	libs.Newplugin(&libs.Iplugin{
		Name:        "menu",
		As:          []string{"menu"},
		Description: "Sends the list of commands",
		Tags:        "main",
		IsPrefix:    true,
		Execute:     menu,
		FromMe:      true,
	})
}
