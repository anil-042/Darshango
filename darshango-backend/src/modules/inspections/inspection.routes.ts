import { Router } from 'express';
import * as inspectionController from './inspection.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorize } from '../../middleware/roleMiddleware';
import { validate, inspectionSchema } from '../../utils/validators';

const router = Router({ mergeParams: true });

router.use(protect);

router.post('/', authorize('Admin', 'StateNodalOfficer', 'Inspector'), validate(inspectionSchema), inspectionController.createInspection);
router.get('/', inspectionController.getInspections);
router.put('/:iid', authorize('Admin', 'Inspector'), inspectionController.updateInspection);
router.delete('/:iid', authorize('Admin', 'Inspector'), inspectionController.deleteInspection);

export default router;
