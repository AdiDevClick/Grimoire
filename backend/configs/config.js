/**
 * Spéficier les fichier à accepter ici
 */
export const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

/**
 * Spéficier la taille limite des fichiers uploadés sur le serveur
 */
export const LIMIT_FILE_SIZE = 1024 * 1024 * 2;
export const FILE_SIZE_ERROR_SIZE = LIMIT_FILE_SIZE / (1024 * 1024);

/**
 * Spéficier la qualité d'image -
 * Par défaut : 80
 */
export const IMG_QUALITY = 80;

/**
 * Email validator
 */
export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;

/**
 * Password validator
 */
export const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
