import { Request, Response } from 'express';
import * as reportService from './report.service';
import { successResponse, errorResponse } from '../../utils/response';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const stats = await reportService.getDashboardStats();
        successResponse(res, stats);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const getStatePerformance = async (req: Request, res: Response) => {
    try {
        const data = await reportService.getStatePerformance();
        successResponse(res, data);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const getComponentUtilization = async (req: Request, res: Response) => {
    try {
        const data = await reportService.getComponentUtilization();
        successResponse(res, data);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};
