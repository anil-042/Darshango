import { Request, Response } from 'express';
import * as alertService from './alert.service';
import { successResponse, errorResponse } from '../../utils/response';

export const createAlert = async (req: Request, res: Response) => {
    try {
        const alert = await alertService.createAlert(req.body);
        return successResponse(res, alert, 'Alert created successfully', 201);
    } catch (error: any) {
        return errorResponse(res, error.message, 500);
    }
};

export const getAlerts = async (req: Request, res: Response) => {
    try {
        const filters = {
            projectId: req.query.projectId as string,
            status: req.query.status as string,
            priority: req.query.priority as string
        };
        const alerts = await alertService.getAlerts(filters);
        return successResponse(res, alerts, 'Alerts fetched successfully');
    } catch (error: any) {
        return errorResponse(res, error.message, 500);
    }
};

export const updateAlert = async (req: Request, res: Response) => {
    try {
        const updatedAlert = await alertService.updateAlert(req.params.id, req.body);
        return successResponse(res, updatedAlert, 'Alert updated successfully');
    } catch (error: any) {
        return errorResponse(res, error.message, 500);
    }
};
