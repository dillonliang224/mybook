package main

import (
	"io/ioutil"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestEncrypt(t *testing.T) {
	baseId := "123456789abc"
	data := "hello aes gcm!!"
	// secret
	key := []byte("AES256Key-32Characters1234567890")

	res, err := encrypt(baseId, []byte(data), key)
	assert.NoError(t, err)
	t.Log(res)
}

func TestDecrypt(t *testing.T) {
	baseId := "123456789abc"
	data := "hello aes gcm!!"
	// secret
	key := []byte("AES256Key-32Characters1234567890")
	msg := "208f10dbf9c4d1c029e318b42f3452f8b1684239cab6a7a787a60ef3d3a4e23ab5c48b84ecb3eae6783760"

	res, err := decrypt(baseId, msg, key)
	assert.NoError(t, err)

	resData, err := ioutil.ReadAll(res)
	assert.NoError(t, err)

	t.Log("res: ", string(resData))
	assert.Equal(t, data, string(resData))
}

func BenchmarkEncrypt(b *testing.B) {
	baseId := "123456789abc"
	data := "hello aes gcm!!"
	key := []byte("AES256Key-32Characters1234567890")

	for i := 0; i < b.N; i++ {
		_, _ = encrypt(baseId, []byte(data), key)
	}
}

func BenchmarkDecrypt(b *testing.B) {
	baseId := "123456789abc"
	key := []byte("AES256Key-32Characters1234567890")
	msg := "3b036d07b53216cec6b72ae5818e6ab888c891503fda37ff534f2b266df81885ab5965ce512f661ca10a63"

	for i := 0; i < b.N; i++ {
		_, _ = decrypt(baseId, msg, key)
	}
}
