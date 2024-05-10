export const cryptoService = {
    encryptionKey: undefined,
    deriveKey,
    exportKey,
    encryptData,
    decryptData,
    generateIV,
    base64ToUint8Array,
};

async function deriveKey(password, salt, iterations, hash, length) {
    // Convert password to ArrayBuffer
    let enc = new TextEncoder();
    let passwordBuffer = enc.encode(password);

    // Import the password into a CryptoKey
    let keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        passwordBuffer,
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );

    // Set up the PBKDF2 parameters
    let params = {
        name: "PBKDF2",
        salt: enc.encode(salt),
        iterations: iterations,
        hash: hash,
    };

    // Derive the key
    let derivedKey = await window.crypto.subtle.deriveKey(
        params,
        keyMaterial,
        { name: "AES-GCM", length: length },
        true,
        ["encrypt", "decrypt"]
    );
    return derivedKey;
}

async function exportKey(key) {
    try {
        const exportedKey = await window.crypto.subtle.exportKey("raw", key);
        const keyBuffer = new Uint8Array(exportedKey);
        let binary = "";
        for (let i = 0; i < keyBuffer.byteLength; i++) {
            binary += String.fromCharCode(keyBuffer[i]);
        }
        return window.btoa(binary);
    } catch (error) {
        console.error("Error exporting key:", error);
    }
}

async function encryptData(data, derivedKey, ivStr) {
    const iv = base64ToUint8Array(ivStr);

    let enc = new TextEncoder();
    let encodedData = enc.encode(data);
    console.log(encodedData)
    // Revisar que derivedKey sea un CryptoKey
    if (!(derivedKey instanceof CryptoKey)) {
        throw new Error(
            "El segundo parámetro 'derivedKey' no es un CryptoKey."
        );
    }

    let encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        derivedKey,
        encodedData
    );
    const base64String = uint8ArrayToBase64(new Uint8Array(encryptedData));
    return base64String;
}

async function decryptData(encryptedDataStr, derivedKey, ivStr) {
    const encryptedData = base64ToUint8Array(encryptedDataStr);
    const iv = base64ToUint8Array(ivStr);
    try {
        let decryptedData = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            derivedKey,
            encryptedData
        );

        let dec = new TextDecoder();
        return dec.decode(decryptedData);
    } catch (e) {
        throw new Error("El proceso de desencriptado falló.");
    }
}

function generateIV() {
    let iv = window.crypto.getRandomValues(new Uint8Array(12));
    return uint8ArrayToBase64(iv);
}

function uint8ArrayToBase64(buffer) {
    let binaryString = "";
    for (let i = 0; i < buffer.byteLength; i++) {
        binaryString += String.fromCharCode(buffer[i]);
    }
    return window.btoa(binaryString);
}


function base64ToUint8Array(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
