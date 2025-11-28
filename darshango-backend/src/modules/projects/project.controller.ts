import { Request, Response } from 'express';
import * as projectService from './project.service';
import { successResponse, errorResponse } from '../../utils/response';

export const createProject = async (req: Request, res: Response) => {
    // FRONTEND → BACKEND FLOW
    // ProjectManagement.tsx → POST /projects → project.controller.createProject → project.service.createProject
    try {
        const project = await projectService.createProject(req.body);
        successResponse(res, project, 'Project created successfully', 201);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const getProjects = async (req: Request, res: Response) => {
    // FRONTEND → BACKEND FLOW
    // ProjectManagement.tsx → GET /projects → project.controller.getProjects → project.service.getAllProjects
    try {
        const filters = req.query;
        const projects = await projectService.getAllProjects(filters);
        successResponse(res, projects, 'Projects fetched successfully');
    } catch (error: any) {
        console.error("[ProjectController] Error fetching projects:", error);
        errorResponse(res, error.message, 500);
    }
};

export const getProject = async (req: Request, res: Response) => {
    try {
        const project = await projectService.getProjectById(req.params.id);
        if (!project) return errorResponse(res, 'Project not found', 404);
        successResponse(res, project);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const updateProject = async (req: Request, res: Response) => {
    try {
        const project = await projectService.updateProject(req.params.id, req.body);
        successResponse(res, project);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        await projectService.deleteProject(req.params.id);
        successResponse(res, null, 'Project deleted successfully');
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};
