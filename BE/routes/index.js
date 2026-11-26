import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import genreRoutes from './genreRoutes.js';
import bookRoutes from './bookRoutes.js';
import borrowingRoutes from './borrowingRoutes.js';
import ratingRoutes from './ratingRoutes.js';
import favoriteRoutes from './favoriteRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/genres', genreRoutes);
router.use('/books', bookRoutes);
router.use('/borrowings', borrowingRoutes);
router.use('/ratings', ratingRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/notifications', notificationRoutes);

export default router;
