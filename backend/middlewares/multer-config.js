import multer from 'multer';
import { MIME_TYPES } from '../configs/config.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        cb(null, name + Date.now() + '.' + extension);
    },
});

export default multer({ storage }).single('image');
