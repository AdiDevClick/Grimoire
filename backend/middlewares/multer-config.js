import multer, { MulterError } from 'multer';
import path from 'path';
import { MIME_TYPES } from '../configs/config.js';
import sharp from 'sharp';

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

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
                            'File size is too large! Max size is 2MB',
                            {
                                cause: { status: 403 },
                            }
                        );
                    default:
                        throw new Error('Something went wrong!', {
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

            // const saveTo = path.resolve(__dirname, 'public', 'images');
            const filePath = path.join('images', filename);
            console.log(filePath);

            await sharp(req.file.buffer)
                // .resize({ width: 0, height: 0 })
                .webp({ quality: 80 })
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
    console.log('Je suis à lentrée dans le multer config');
    const upload = {
        fileFilter: (req, file, cb) => {
            if (!MIME_TYPES[file.mimetype]) {
                return cb(new MulterError('LIMIT_INVALID_TYPE'));
            } else {
                return cb(null, true);
            }
        },
        limits: {
            fileSize: 1024 * 1024 * 2,
        },
        storage: multer.memoryStorage(),
    };
    console.log('Je suis dans le multer config');
    // (cb) => upload.single('image');
    return uploadHandler(upload, req, res, next);
    // return multer({ storage }).single('image');
};

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images');
//     },
//     filename: async (req, file, cb) => {
//         const name = file.originalname.split(' ').join('_');
//         const extension = MIME_TYPES[file.mimetype];
//         cb(null, name + Date.now() + '.' + extension);
//     },
// });

export default multerConfig;
// export default {
//     fileFilter: (req, file, cb) => {
//         if (!MIME_TYPES[file.mimetype]) {
//             return cb(new MulterError('LIMIT_INVALID_TYPE'));
//         }

//         return cb(null, true);
//     },
//     limits: {
//         fileSize: 1024 * 1024 * 2,
//     },
//     storage: multer.memoryStorage(),
// };
// export default upload.single('image').then((cb) => uploadHandler(cb));
// export default multer({ storage })
//     .single('image')
