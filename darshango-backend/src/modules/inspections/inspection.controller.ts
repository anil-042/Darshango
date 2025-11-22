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
        const projectId = req.params.id;
        if (projectId) {
            const inspections = await inspectionService.getInspections(projectId);
            successResponse(res, inspections);
        } else {
            // Global fetch
            const inspections = await inspectionService.getAllInspections();
            successResponse(res, inspections);
        }
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const updateInspection = async (req: Request, res: Response) => {
    try {
        // If no projectId in params, we need it from body or find it.
        // For now, assuming nested route usage mostly.
        // If global update needed, we'd need to look up the project.
        const projectId = req.params.id || req.body.projectId;
        if (!projectId) {
            // Fallback: if we have a global update route, we might need to fetch the inspection first to get projectId
            // For MVP, let's require projectId in body if not in params
            return errorResponse(res, 'Project ID is required for update', 400);
        }
        const inspection = await inspectionService.updateInspection(projectId, req.params.iid, req.body);
        successResponse(res, inspection);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};
export const deleteInspection = async (req: Request, res: Response) => {
    try {
        await inspectionService.deleteInspection(req.params.id, req.params.iid);
        successResponse(res, null, 'Inspection deleted successfully');
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};
