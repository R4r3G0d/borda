package main

import (
	"fmt"
	"strings"
)

func main() {
	// A encodes to Z, B to Y, ...
	alphabet := []byte("abcdefghijklmnopqrstuvwxyz")
	len := len(alphabet)
	alphabetMap := make(map[string]byte)
	for idx, val := range alphabet {
		alphabetMap[string(val)] = alphabet[len-idx-1]
	}
	
	cipher := strings.Split("nzpziz_rh_nb_uze_fmrevihrgb", "_")
	flag := func(s []string) { fmt.Printf("ADM{%s}", strings.Join(s, "_")) }
	result := make([]string, 0)

	for i := range cipher {
		word := []byte(cipher[i])
		for i, char := range word {
			word[i] = alphabetMap[string(char)]
		}
		result = append(result, string(word))
	}

	flag(result)
}
