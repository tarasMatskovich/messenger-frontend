
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
    }

    getPublicKey() {
        return this.publicKey;
    }

    getPrivateKey() {
        return this.privateKey;
    }

    encrypt(content, receiverPublicKey) {
        let tempPublicKey = this.crypt.getPublicKey();
        this.crypt.setPublicKey(receiverPublicKey);
        let result = this.crypt.encrypt(content);
        this.crypt.setPublicKey(tempPublicKey);
        return result;
    }

    decrypt(content) {
        return this.crypt.decrypt(content);
    }

}

export default new CryptService();
