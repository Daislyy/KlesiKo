import { Router } from 'express';
import * as borrowingController from '../controllers/borrowingController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.post('/', borrowingController.createBorrowing);
router.get('/my', borrowingController.getMyBorrowings);
router.get('/', authorize('admin'), borrowingController.getAllBorrowings);
router.get('/:id', borrowingController.getBorrowingById);
router.patch('/:id/status', borrowingController.updateBorrowingStatus);

export default router;
