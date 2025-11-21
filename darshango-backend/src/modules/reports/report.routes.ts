import { Router } from 'express';
import * as reportController from './report.controller';
import { protect } from '../../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/dashboard-stats', reportController.getDashboardStats);
router.get('/state-performance', reportController.getStatePerformance);
router.get('/component-utilization', reportController.getComponentUtilization);

export default router;
