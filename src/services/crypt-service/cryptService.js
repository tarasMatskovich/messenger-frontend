
import JSEncrypt from 'jsencrypt'

class CryptService {

    constructor() {
        this.crypt = new JSEncrypt({default_key_size: 2056});
        this.publicKey = localStorage.getItem('publicKey');
        this.privateKey = localStorage.getItem('privateKey');
        if (null === this.publicKey || null === this.privateKey) {
            this.publicKey = this.crypt.getPublicKey();
            this.privateKey = this.crypt.getPrivateKey();
            localStorage.setItem('publicKey', this.publicKey);
            localStorage.setItem('privateKey', this.privateKey);
        }
        this.crypt.setPublicKey(this.publicKey);
        this.crypt.setPrivateKey(this.privateKey);
    }

    getPublicKey() {
        return this.publicKey;
    }

    getPrivateKey() {
        return this.privateKey;
    }

    encrypt(content, receiverPublicKey) {
        this.crypt.setPublicKey(receiverPublicKey);
        return this.crypt.encrypt(content);
    }

    encryptForMe(content) {
        this.crypt.setPublicKey(this.publicKey);
        return this.crypt.encrypt(content);
    }

    decrypt(content) {
        this.crypt.setPrivateKey(this.privateKey);
        return this.crypt.decrypt(content);
    }

    decryptWithSenderPublicKey(content, key) {
        this.crypt.setPublicKey(key);
        let result = this.crypt.decrypt(content);
        this.crypt.setPublicKey(this.publicKey);
        return result;
    }
}

export default new CryptService();
