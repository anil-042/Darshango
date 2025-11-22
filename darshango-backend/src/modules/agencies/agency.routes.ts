import { Router } from 'express';
import * as agencyController from './agency.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorize } from '../../middleware/roleMiddleware';
import { validate, agencySchema } from '../../utils/validators';

const router = Router();

router.use(protect);

router.post('/', authorize('Admin'), validate(agencySchema), agencyController.createAgency);
router.get('/', agencyController.getAgencies);
router.put('/:id', authorize('Admin'), agencyController.updateAgency);
router.delete('/:id', authorize('Admin'), agencyController.deleteAgency);

export default router;
