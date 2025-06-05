package helpers

import (
	"strings"
	"unicode"
)

func CapitalizeWords(text string) string {
	words := strings.Fields(text)
	for i, word := range words {
		if len(word) > 0 {
			words[i] = string(unicode.ToUpper(rune(word[0]))) + word[1:]
		}
	}
	return strings.Join(words, " ")
}

func ArrayFilter(input []string, by string) []string {
	var result []string
	for _, str := range input {
		if by != "" {
			if strings.Contains(str, by) {
				result = append(result, str)
			}
		} else {
			if str != "" {
				result = append(result, str)
			}
		}
	}
	return result
}
