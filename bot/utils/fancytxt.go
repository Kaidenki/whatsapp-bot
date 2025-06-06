/*
 * Originally built by https://github.com/X-Electra (2022)
 * Ported / Maintained by: https://github.com/kaidenki
 * License: GPL-3.0 License
 *
 * Usage of this file is governed by the License.
 */

package utils

import "strings"

var tinyChrmap = map[rune]rune{
	'0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
	'5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
	'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ',
	'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ',
	'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ',
	'p': 'ᴘ', 'q': 'ϙ', 'r': 'ʀ', 's': 'ꜱ', 't': 'ᴛ',
	'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ',
	'z': 'ᴢ', 'A': 'A', 'B': 'ʙ', 'C': 'C', 'D': 'D',
	'E': 'E', 'F': 'F', 'G': 'G', 'H': 'H', 'I': 'I',
	'J': 'J', 'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N',
	'O': 'O', 'P': 'P', 'Q': 'Q', 'R': 'R', 'S': 'S',
	'T': 'T', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X',
	'Y': 'Y', 'Z': 'Z',
}

var fancy1Chrmap = map[rune]rune{
	'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼',
	'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
}

func Tiny(text string) string {
	var sb strings.Builder
	for _, ch := range text {
		if mapped, ok := tinyChrmap[ch]; ok {
			sb.WriteRune(mapped)
		} else {
			sb.WriteRune(ch)
		}
	}
	return sb.String()
}

func Fancy1(text string) string {
	var sb strings.Builder
	for _, ch := range strings.ToUpper(text) {
		if mapped, ok := fancy1Chrmap[ch]; ok {
			sb.WriteRune(mapped)
		} else {
			sb.WriteRune(ch)
		}
	}
	return sb.String()
}
