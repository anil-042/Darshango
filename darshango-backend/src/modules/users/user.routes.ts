import { Router } from 'express';
import * as userController from './user.controller';
import { protect } from '../../middleware/authMiddleware';
import { authorize } from '../../middleware/roleMiddleware';

const router = Router();

router.use(protect); // Protect all routes

router.get('/', authorize('Admin', 'StateNodalOfficer'), userController.getUsers);
router.get('/:id', userController.getUser);
router.patch('/:id', authorize('Admin'), userController.updateUser);
router.delete('/:id', authorize('Admin'), userController.deleteUser);

export default router;
