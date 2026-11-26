import { Router } from 'express';
import * as favoriteController from '../controllers/favoriteController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/', favoriteController.getMyFavorites);
router.post('/', favoriteController.addFavorite);
router.post('/:bookId', favoriteController.addFavorite);
router.delete('/:bookId', favoriteController.removeFavorite);

export default router;
