import { Router } from 'express';
import * as notificationController from './notification.controller';

const router = Router();

router.get('/', notificationController.getNotifications);

export default router;
