import { Router } from 'express';
import * as dashboardController from './dashboard.controller';
import { protect } from '../../middleware/authMiddleware';

const router = Router();

router.get('/stats', protect, dashboardController.getStats);

export default router;
