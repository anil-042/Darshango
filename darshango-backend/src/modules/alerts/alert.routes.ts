import { Router } from 'express';
import * as alertController from './alert.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorize } from '../../middleware/roleMiddleware';
import { validate, alertSchema } from '../../utils/validators';

const router = Router();

router.post('/', protect, authorize('Admin', 'StateNodalOfficer', 'DistrictOfficer'), validate(alertSchema), alertController.createAlert);
router.get('/', protect, alertController.getAlerts);
router.patch('/:id', protect, authorize('Admin', 'StateNodalOfficer', 'DistrictOfficer'), alertController.updateAlert);

export default router;
