//AES encryption

const AesEncryption = require("aes-encryption");
const values = require("./../values");

const aes = new AesEncryption();

aes.setSecretKey(values.key);

async function encrypt(plaintext) {
    return aes.encrypt(plaintext);
}

module.exports.encrypt = encrypt;

async function decrypt(ciphertext) {
    return aes.decrypt(ciphertext);
}

module.exports.decrypt = decrypt;