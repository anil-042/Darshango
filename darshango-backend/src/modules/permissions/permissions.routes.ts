import { Router } from 'express';
import * as permissionController from './permissions.controller';
import { protect, authorize } from '../../middleware/authMiddleware';

const router = Router();

router.get('/', protect, permissionController.getPermissions);
router.post('/', protect, authorize('Admin'), permissionController.updatePermissions);

export default router;
