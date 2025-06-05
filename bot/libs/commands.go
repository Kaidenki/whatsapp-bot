package libs

import (
	"aurora/bot/config"
	"aurora/bot/helpers"
	"math/rand"
	"regexp"
	"strings"
)

var lists []Iplugin
var log helpers.Logger

func Newplugin(cmd *Iplugin) {
	lists = append(lists, *cmd)
}

func GetList() []Iplugin {
	return lists
}

func HasCommand(name string) bool {
	parsed := config.GlobalConfig.Pattern
	var prefix string
	var withoutPrefix string

	switch parsed.Type {
	case helpers.RegexPattern:
		matches := parsed.Regex.FindAllString(name, -1)
		if len(matches) == 0 {
			return false
		}
		prefix = matches[rand.Intn(len(matches))]
		withoutPrefix = strings.TrimPrefix(name, prefix)

	case helpers.LiteralPattern:
		if !strings.HasPrefix(name, parsed.Literal) {
			return false
		}
		prefix = parsed.Literal
		withoutPrefix = strings.TrimPrefix(name, prefix)
	}

	for _, cmd := range lists {
		re := regexp.MustCompile(`^` + cmd.Name + `$`)
		if re.MatchString(withoutPrefix) {
			return true
		}
	}

	return false
}
