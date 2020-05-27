const cryptoUtil = require('./gcm')

const baseId = '123456789abc'
const data = 'hello aes gcm!!'
const key = 'AES256Key-32Characters1234567890'

let encryptedText = cryptoUtil.encrypt(Buffer.from(baseId), data, key)
let decryptedText = cryptoUtil.decrypt(Buffer.from(baseId), encryptedText, key)
if (data === decryptedText) {
	console.log('aes gcm success done...')
} else {
    console.log('aes gcm fail: ', encryptedText, decryptedText)
}
