import { Router } from 'express';
import * as alertController from './alert.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorize } from '../../middleware/roleMiddleware';
import { validate, alertSchema } from '../../utils/validators';

const router = Router();

router.use(protect);

router.post('/', authorize('Admin', 'StateNodalOfficer', 'DistrictOfficer'), validate(alertSchema), alertController.createAlert);
router.get('/', alertController.getAlerts);
router.put('/:id', authorize('Admin', 'StateNodalOfficer'), alertController.updateAlert);
router.delete('/:id', authorize('Admin'), alertController.deleteAlert);

export default router;
