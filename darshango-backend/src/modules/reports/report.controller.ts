import { Request, Response } from 'express';
import * as reportService from './report.service';
import { successResponse, errorResponse } from '../../utils/response';

export const getProjectReport = async (req: Request, res: Response) => {
    try {
        const report = await reportService.generateProjectReport(req.query);
        return successResponse(res, report, 'Project report generated');
    } catch (error: any) {
        return errorResponse(res, error.message, 500);
    }
};

export const getFundReport = async (req: Request, res: Response) => {
    try {
        const report = await reportService.generateFundReport();
        return successResponse(res, report, 'Fund report generated');
    } catch (error: any) {
        return errorResponse(res, error.message, 500);
    }
};

export const getUCReport = async (req: Request, res: Response) => {
    try {
        const report = await reportService.generateUCReport();
        return successResponse(res, report, 'UC report generated');
    } catch (error: any) {
        return errorResponse(res, error.message, 500);
    }
};
