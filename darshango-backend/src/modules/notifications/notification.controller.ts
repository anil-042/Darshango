import { Request, Response } from 'express';
import * as notificationService from './notification.service';
import { successResponse, errorResponse } from '../../utils/response';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const notifications = await notificationService.getRecentNotifications(20);
        successResponse(res, notifications);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};
