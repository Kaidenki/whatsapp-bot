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
