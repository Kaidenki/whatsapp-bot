package helpers

import (
	"regexp"
	"strings"
)

const DefaultPattern = "[?!.#]"

var logger Logger

type PatternType int

const (
	RegexPattern PatternType = iota
	LiteralPattern
)

type ParsedPattern struct {
	Type    PatternType
	Raw     string
	Regex   *regexp.Regexp
	Literal string
}

func ParsePattern(raw string) ParsedPattern {
	if raw == "" {
		raw = DefaultPattern
	}

	if strings.Contains(raw, "@") {
		logger.Warn("Invalid PATTERN: cannot contain '@'. Falling back to default.")
		raw = DefaultPattern
	}

	if strings.HasPrefix(raw, "[") && strings.HasSuffix(raw, "]") {
		re, err := regexp.Compile(raw)
		if err != nil {

			logger.Warn("Invalid regex in PATTERN. Falling back to default.")
			re = regexp.MustCompile(DefaultPattern)
			return ParsedPattern{Type: RegexPattern, Raw: DefaultPattern, Regex: re}
		}
		return ParsedPattern{Type: RegexPattern, Raw: raw, Regex: re}
	}

	if len(raw) > 3 {
		logger.Warn("Invalid literal PATTERN: too long. Falling back to default.")
		return ParsedPattern{Type: RegexPattern, Raw: DefaultPattern, Regex: regexp.MustCompile(DefaultPattern)}
	}

	return ParsedPattern{Type: LiteralPattern, Raw: raw, Literal: raw}
}
