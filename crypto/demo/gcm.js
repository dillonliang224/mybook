const crypto = require('crypto')

/**
 * {}
*/
function encrypt(baseId, plaintext, key) {
    let nonce = crypto.randomBytes(12)

    const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce)

    // gcm sets the value used for the additional authenticated data (AAD) input parameter.
    cipher.setAAD(baseId)

    let encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
    let tag = cipher.getAuthTag()
    let ciphertext = Buffer.concat([nonce, encrypted, tag]).toString('hex')
    console.log(ciphertext)
    return ciphertext
}

function decrypt(baseId, encryptedText, key) {
    let bData = Buffer.from(encryptedText, 'hex')

    let nonce = bData.slice(0, 12)
    let tag = bData.slice(bData.length - 16, bData.length)
    let text = bData.slice(12, bData.length - 16)

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce)
    decipher.setAuthTag(tag)
    decipher.setAAD(baseId)
    try {
        let receivedPlaintext = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8')
        console.log(receivedPlaintext)
        return receivedPlaintext
    } catch (error) {
        console.error('Authentication failed!')
        return
    }
}

module.exports = {
    encrypt,
    decrypt,
}