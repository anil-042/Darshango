import { Request, Response } from 'express';
import * as dashboardService from './dashboard.service';
import { successResponse, errorResponse } from '../../utils/response';

export const getStats = async (req: Request, res: Response) => {
    try {
        const filters = req.query;
        const stats = await dashboardService.getDashboardStats(filters);
        return successResponse(res, stats, 'Dashboard stats fetched successfully');
    } catch (error: any) {
        return errorResponse(res, error.message, 500);
    }
};
