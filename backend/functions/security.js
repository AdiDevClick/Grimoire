import crypto from 'crypto';
export function generateComplexSecretKey(length = 64) {
    // Inclure des caractères spéciaux
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let secretKey = '';
    while (secretKey.length < length) {
        const byte = crypto.randomBytes(1);
        const charIndex = byte[0] % chars.length;
        secretKey += chars.charAt(charIndex);
    }
    return secretKey;
}

// const sessionSecret = generateComplexSecretKey();
// console.log('Votre clé secrète de session :', sessionSecret);

// Fonction de chiffrement
export function encrypt(text) {
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(process.env.ENCRYPTION_KEY, 'hex'),
        Buffer.from(process.env.IV, 'hex')
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Fonction de déchiffrement
export function decrypt(text) {
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(process.env.ENCRYPTION_KEY, 'hex'),
        Buffer.from(process.env.IV, 'hex')
    );
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Générer une clé de chiffrement de 256 bits (32 octets)
export const encryptionKey = () => crypto.randomBytes(32).toString('hex');
// Générer un vecteur d'initialisation (IV) de 128 bits (16 octets)
export const iv = () => crypto.randomBytes(16).toString('hex');
