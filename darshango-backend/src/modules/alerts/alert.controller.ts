import { Request, Response } from 'express';
import * as alertService from './alert.service';
import { successResponse, errorResponse } from '../../utils/response';

export const createAlert = async (req: Request, res: Response) => {
    try {
        const alert = await alertService.createAlert(req.body);
        successResponse(res, alert, 'Alert created successfully', 201);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const getAlerts = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.query;
        let alerts;
        if (projectId) {
            alerts = await alertService.getAlertsByProject(projectId as string);
        } else {
            alerts = await alertService.getAllAlerts();
        }
        successResponse(res, alerts);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const updateAlert = async (req: Request, res: Response) => {
    try {
        const alert = await alertService.updateAlert(req.params.id, req.body);
        successResponse(res, alert, 'Alert updated successfully');
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const deleteAlert = async (req: Request, res: Response) => {
    try {
        await alertService.deleteAlert(req.params.id);
        successResponse(res, null, 'Alert deleted successfully');
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};
