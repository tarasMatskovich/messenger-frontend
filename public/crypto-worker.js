self.window = self // This is required for the jsencrypt library to work within the web worker

// Import the jsencrypt library
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/2.3.1/jsencrypt.min.js');

let crypt = null;
let privateKey = localStorage.getItem('privateKey');
let publicKey = localStorage.getItem('publicKey');

/** Webworker onmessage listener */
onmessage = function(e) {
    const [ messageType, messageId, text, key ] = e.data
    let result
    switch (messageType) {
        case 'generate-keys':
            result = generateKeypair()
            break
        case 'encrypt':
            result = encrypt(text, key)
            break
        case 'decrypt':
            result = decrypt(text)
            break
        case 'set-public':
            result = setPublicKey(key);
            break;
        case 'get-private':
            result = getPrivateKey();
            break;
    }

    // Return result to the UI thread
    postMessage([ messageId, result ])
}

/** Generate and store keypair */
function generateKeypair () {
    if (null === privateKey || null === publicKey) {
        crypt = new JSEncrypt({default_key_size: 2056});
        privateKey = crypt.getPrivateKey();
        localStorage.setItem('privateKey', privateKey);
        publicKey = crypt.getPublicKey();
        localStorage.setItem('publicKey', publicKey);
    } else {
        crypt = new JSEncrypt({default_key_size: 2056});
        crypt.setPrivateKey(privateKey);
        crypt.setPublicKey(publicKey);
    }
    return publicKey;
}

function getPrivateKey() {
    if (null === privateKey) {
        generateKeypair();
    }
    return privateKey;
}

/** Encrypt the provided string with the destination public key */
function encrypt (content, publicKey) {
    crypt.setKey(publicKey)
    return crypt.encrypt(content)
}

function setPublicKey(publicKey) {
    crypt.setPublicKey(publicKey);
}

/** Decrypt the provided string with the local private key */
function decrypt (content) {
    crypt.setKey(privateKey)
    console.log("IN DECRYPT");
    console.log(privateKey);
    console.log(crypt);
    console.log(content);
    console.log("RESULT");
    console.log(crypt.decrypt(content));
    return crypt.decrypt(content)
}
