package libs

import (
	"regexp"
	"strings"
)

var lists []Iplugin

func Newplugin(cmd *Iplugin) {
	lists = append(lists, *cmd)
}

func GetList() []Iplugin {
	return lists
}

func HasCommand(name string) bool {
	var prefix string
	pattern := regexp.MustCompile(`[?!.#]`)
	for _, f := range pattern.FindAllString(name, -1) {
		prefix = f
	}
	for _, cmd := range lists {
		re := regexp.MustCompile(`^` + cmd.Name + `$`)
		if valid := len(re.FindAllString(strings.ReplaceAll(name, prefix, ""), -1)) > 0; valid {
			return true
		}
	}
	return false
}
