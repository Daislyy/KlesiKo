import { Router } from 'express';
import * as ratingController from '../controllers/ratingController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.delete('/:id', authenticate, ratingController.deleteRating);

export default router;
