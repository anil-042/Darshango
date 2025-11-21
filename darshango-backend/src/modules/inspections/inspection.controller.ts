import { Request, Response } from 'express';
import * as inspectionService from './inspection.service';
import { successResponse, errorResponse } from '../../utils/response';

export const createInspection = async (req: Request, res: Response) => {
    // FRONTEND → BACKEND FLOW
    // InspectionsTab.tsx → POST /projects/:id/inspections → inspection.controller.createInspection → inspection.service.createInspection
    try {
        const inspection = await inspectionService.createInspection(req.params.id, req.body);
        successResponse(res, inspection, 'Inspection scheduled successfully', 201);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const getInspections = async (req: Request, res: Response) => {
    try {
        const inspections = await inspectionService.getInspections(req.params.id);
        successResponse(res, inspections);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const updateInspection = async (req: Request, res: Response) => {
    try {
        const inspection = await inspectionService.updateInspection(req.params.id, req.params.iid, req.body);
        successResponse(res, inspection);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};
