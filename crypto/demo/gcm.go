package main

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"io"
)

func encrypt(baseId string, data []byte, key []byte) (string, error) {
	plainText := []byte(data)

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, 12)
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		panic(err.Error())
	}

	cipherText := aesGCM.Seal(nil, nonce, plainText, []byte(baseId))

	return hex.EncodeToString(nonce) + hex.EncodeToString(cipherText), nil
}

func decrypt(baseId string, msg string, key []byte) (io.Reader, error) {
	data, err := hex.DecodeString(msg)
	if err != nil {
		return nil, err
	}

	nonce := data[:12]
	cipherText := data[12:]

	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	plainText, err := aesGCM.Open(nil, nonce, cipherText, []byte(baseId))
	if err != nil {
		return nil, err
	}

	return bytes.NewBuffer(plainText), nil
}
