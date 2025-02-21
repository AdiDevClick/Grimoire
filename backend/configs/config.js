/**
 * Spéficier les fichier à accepter ici
 */
export const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

/**
 * Email validator
 */
export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;

/**
 * Password validator
 */
export const passwordRegex =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*W)(?!.*s).{8,16}$/;
