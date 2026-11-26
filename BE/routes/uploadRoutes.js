import { Router } from 'express';
import * as uploadController from '../controllers/uploadController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/cover', authenticate, authorize('admin'), uploadController.uploadCover);

export default router;
