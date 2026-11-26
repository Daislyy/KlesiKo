import { Router } from 'express';
import * as genreController from '../controllers/genreController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', genreController.getAllGenres);
router.get('/:id', genreController.getGenreById);
router.post('/', authenticate, authorize('admin'), genreController.createGenre);
router.put('/:id', authenticate, authorize('admin'), genreController.updateGenre);
router.delete('/:id', authenticate, authorize('admin'), genreController.deleteGenre);

export default router;
