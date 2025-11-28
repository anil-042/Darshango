import { Router } from 'express';
import * as messageController from './message.controller';
import { protect } from '../../middleware/authMiddleware';

import upload from '../../storage/upload';

const router = Router({ mergeParams: true }); // Important for accessing :projectId from parent router

router.use(protect);

router.post('/', upload.single('file'), messageController.createMessage);
router.get('/', messageController.getMessages);

export default router;
