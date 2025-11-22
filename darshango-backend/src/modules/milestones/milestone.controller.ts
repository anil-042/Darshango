import { Request, Response } from 'express';
import * as milestoneService from './milestone.service';
import { successResponse, errorResponse } from '../../utils/response';

export const createMilestone = async (req: Request, res: Response) => {
    // FRONTEND → BACKEND FLOW
    // MilestonesTab.tsx → POST /projects/:id/milestones → milestone.controller.createMilestone → milestone.service.createMilestone
    try {
        const milestone = await milestoneService.createMilestone(req.params.id, req.body);
        successResponse(res, milestone, 'Milestone created successfully', 201);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const getMilestones = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id;
        if (projectId) {
            const milestones = await milestoneService.getMilestones(projectId);
            successResponse(res, milestones);
        } else {
            const milestones = await milestoneService.getAllMilestones();
            successResponse(res, milestones);
        }
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const updateMilestone = async (req: Request, res: Response) => {
    try {
        const milestone = await milestoneService.updateMilestone(req.params.id, req.params.mid, req.body);
        successResponse(res, milestone);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const deleteMilestone = async (req: Request, res: Response) => {
    try {
        await milestoneService.deleteMilestone(req.params.id, req.params.mid);
        successResponse(res, null, 'Milestone deleted successfully');
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};
