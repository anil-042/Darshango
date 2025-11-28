import { Router } from 'express';
import * as meetingController from './meeting.controller';
import { protect } from '../../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.post('/', meetingController.createMeeting);
router.get('/', meetingController.getHistory);

export default router;
