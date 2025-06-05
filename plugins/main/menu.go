package commands

import (
	"aurora/bot/helpers"
	"aurora/bot/libs"
	"aurora/bot/utils"
	"fmt"
	"sort"
)

type item struct {
	Name     []string
	IsPrefix bool
}

type tagSlice []string

func (t tagSlice) Len() int           { return len(t) }
func (t tagSlice) Less(i, j int) bool { return t[i] < t[j] }
func (t tagSlice) Swap(i, j int)      { t[i], t[j] = t[j], t[i] }

func menu(conn *libs.IClient, m *libs.IMessage) bool {
	dateStr := utils.GetDate()
	ramStr, err := utils.GetRAMUsage()
	if err != nil {
		ramStr = "Ram: Unknown"
	}
	uptimeSeconds := utils.UptimeSeconds()
	runtimeStr := utils.Runtime(uptimeSeconds)

	var str string
	str += fmt.Sprintf("Date: %s\n", dateStr)
	str += fmt.Sprintf("Ram: %s\n", ramStr)
	str += fmt.Sprintf("Uptime: %s\n\n", runtimeStr)
	totalplugins := len(libs.GetList())
	str += fmt.Sprintf("Plugins : %d\n", totalplugins)
	str += fmt.Sprintf("User : %s\n", m.Info.PushName)

	var tags map[string][]item
	for _, list := range libs.GetList() {
		if tags == nil {
			tags = make(map[string][]item)
		}
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
		str += fmt.Sprintf(" *%s*\n", helpers.CapitalizeWords(key))
		for _, e := range tags[key] {
			for _, nm := range e.Name {
				str += fmt.Sprintf("```%s```\n", nm)
			}
		}
		str += "\n"
	}

	m.Reply(str)
	return true
}

func init() {
	libs.Newplugin(&libs.Iplugin{
		Name:        "menu",
		As:          []string{"menu"},
		Description: "Sends the list of commands",
		Tags:        "main",
		IsPrefix:    true,
		Execute:     menu,
	})
}
