import { Router } from 'express';
import * as inspectionController from './inspection.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorize } from '../../middleware/roleMiddleware';

const router = Router({ mergeParams: true });

router.use(protect);

router.post('/', authorize('Admin', 'StateNodalOfficer', 'Inspector'), inspectionController.createInspection);
router.get('/', inspectionController.getInspections);
router.patch('/:iid', authorize('Admin', 'Inspector'), inspectionController.updateInspection);

export default router;
