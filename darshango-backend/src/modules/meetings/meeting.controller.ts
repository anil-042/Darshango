import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import * as meetingService from './meeting.service';
import { successResponse, errorResponse } from '../../utils/response';

export const createMeeting = async (req: AuthRequest, res: Response) => {
    try {
        const { meetingWith, meetingId } = req.body;

        if (!meetingWith || !meetingId) {
            return errorResponse(res, 'Meeting With and Meeting ID are required', 400);
        }

        const meetingData = {
            hostId: req.user.id,
            hostName: req.user.name || 'User',
            meetingWith,
            meetingId,
            timestamp: new Date().toISOString()
        };

        const meeting = await meetingService.createMeeting(meetingData);
        successResponse(res, meeting, 'Meeting recorded successfully', 201);
    } catch (error: any) {
        console.error('Create meeting error:', error);
        errorResponse(res, error.message);
    }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
    try {
        const meetings = await meetingService.getMeetingHistory(req.user.id);
        successResponse(res, meetings);
    } catch (error: any) {
        console.error('Get meeting history error:', error);
        errorResponse(res, error.message);
    }
};
