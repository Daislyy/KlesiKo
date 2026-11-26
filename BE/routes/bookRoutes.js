import { Router } from 'express';
import * as bookController from '../controllers/bookController.js';
import * as ratingController from '../controllers/ratingController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', authenticate, authorize('admin'), bookController.createBook);
router.put('/:id', authenticate, authorize('admin'), bookController.updateBook);
router.delete('/:id', authenticate, authorize('admin'), bookController.deleteBook);

// Nested book ratings
router.get('/:bookId/ratings', ratingController.getBookRatings);
router.post('/:bookId/ratings', authenticate, ratingController.upsertRating);

export default router;
