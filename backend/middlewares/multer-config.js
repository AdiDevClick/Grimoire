import multer, { MulterError } from 'multer';
import path from 'path';
import {
    FILE_SIZE_ERROR_SIZE,
    IMG_QUALITY,
    LIMIT_FILE_SIZE,
    MIME_TYPES,
} from '../configs/config.js';
import sharp from 'sharp';

/**
 * Compresse les images au format webP avec Sharp -
 * La qualité est définie dans le fichier config.js
 * @param {multer} multerConfig
 * @param {Request} req
 */
const uploadHandler = (multerConfig, req, res, next) => {
    const upload = multer(multerConfig).single('image');
    upload(req, res, async (err) => {
        try {
            if (err instanceof multer.MulterError) {
                switch (err.code) {
                    case 'LIMIT_INVALID_TYPE':
                        throw new Error(
                            'Invalid file type! Only PNG and JPEG are allowed',
                            {
                                cause: { status: 403 },
                            }
                        );
                    case 'LIMIT_FILE_SIZE':
                        throw new Error(
                            `File size is too large! Max size is ${FILE_SIZE_ERROR_SIZE}MB`,
                            {
                                cause: { status: 403 },
                            }
                        );
                    default:
                        throw new Error(err, {
                            cause: { status: 500 },
                        });
                }
            } else if (err) {
                // Unexpected error
                throw new Error(err, {
                    cause: { status: 500 },
                });
            }

            // User did not select a new file -
            if (!req.file) return next();

            const filename = `${Date.now()}${path.extname(
                req.file.originalname
            )}`;

            const filePath = path.join('images', filename);

            await sharp(req.file.buffer)
                // .resize({ width: 0, height: 0 })
                .webp({ quality: IMG_QUALITY })
                .toFile(filePath);

            req.file.filename = filename;
            next();
        } catch (err) {
            next(
                res
                    .status(err.cause ? err.cause.status : 400)
                    .json({ message: err.message })
            );
        }
    });
};

/**
 * Configuration de multer pour la réception de fichiers
 * @returns {Function}
 */
const multerConfig = (req, res, next) => {
    const upload = {
        fileFilter: (req, file, cb) => {
            if (!MIME_TYPES[file.mimetype]) {
                return cb(new MulterError('LIMIT_INVALID_TYPE'));
            } else {
                return cb(null, true);
            }
        },
        limits: {
            fileSize: LIMIT_FILE_SIZE,
        },
        storage: multer.memoryStorage(),
    };
    return uploadHandler(upload, req, res, next);
};

export default multerConfig;
