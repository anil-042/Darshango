import { Router } from 'express';
import * as reportController from './report.controller';
import { protect } from '../../middleware/authMiddleware';

const router = Router();

router.get('/projects', protect, reportController.getProjectReport);
router.get('/funds', protect, reportController.getFundReport);
router.get('/ucs', protect, reportController.getUCReport);

export default router;
