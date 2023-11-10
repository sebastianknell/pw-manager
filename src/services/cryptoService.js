export const cryptoService = {
    encryptionKey: undefined,
    iv: undefined,
    deriveKey,
    encryptData,
    decryptData,
    generateIV
}

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

async function encryptData(data, derivedKey, iv) {
    let enc = new TextEncoder();
    let encodedData = enc.encode(data);

    let encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        derivedKey,
        encodedData
    );

    return new Uint8Array(encryptedData);
}

async function decryptData(encryptedData, derivedKey, iv) {
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
        throw new Error(
            "El proceso de desencriptado falló."
        );
    }
}

function generateIV() {
    // Create a Uint8Array of 12 bytes (96 bits)
    let iv = window.crypto.getRandomValues(new Uint8Array(12));
    return iv;
}