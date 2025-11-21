import { Router } from 'express';
import * as milestoneController from './milestone.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorize } from '../../middleware/roleMiddleware';
import { validate, milestoneSchema } from '../../utils/validators';

const router = Router({ mergeParams: true });

router.use(protect);

router.post('/', authorize('Admin', 'StateNodalOfficer', 'DistrictOfficer'), validate(milestoneSchema), milestoneController.createMilestone);
router.get('/', milestoneController.getMilestones);
router.put('/:mid', authorize('Admin', 'StateNodalOfficer', 'DistrictOfficer'), milestoneController.updateMilestone);
router.delete('/:mid', authorize('Admin', 'StateNodalOfficer'), milestoneController.deleteMilestone);

export default router;
