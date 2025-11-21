import { Router } from 'express';
import * as fundController from './fund.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorize } from '../../middleware/roleMiddleware';
import { validate, fundSchema } from '../../utils/validators';

const router = Router({ mergeParams: true });

router.use(protect);

router.post('/', authorize('Admin', 'StateNodalOfficer'), validate(fundSchema), fundController.createFund);
router.get('/', fundController.getFunds);
router.put('/:fid', authorize('Admin', 'StateNodalOfficer'), fundController.updateFund);
router.delete('/:fid', authorize('Admin', 'StateNodalOfficer'), fundController.deleteFund);

export default router;
