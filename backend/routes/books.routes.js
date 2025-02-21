import { Router } from 'express';
import {
    createBook,
    deleteBook,
    getAllBooks,
    getBestRatedBooks,
    getOneBook,
    modifyBook,
    rateOneBook,
} from '../controllers/Book.controller.js';
import { auth } from '../middlewares/auth.js';
import multerConfig from '../middlewares/multer-config.js';
// import multerConfig from '../middlewares/uploadImageMiddleware.js';

const router = Router();

router.post('/', auth, multerConfig, createBook);
router.post('/:id/rating', auth, rateOneBook);
router.put('/:id', auth, multerConfig, modifyBook);
router.delete('/:id', auth, deleteBook);
router.get('/', getAllBooks);
router.get('/bestrating', getBestRatedBooks);
router.get('/:id', getOneBook);

export default router;
