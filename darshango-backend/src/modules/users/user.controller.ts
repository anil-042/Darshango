import { Request, Response } from 'express';
import * as userService from './user.service';
import { successResponse, errorResponse } from '../../utils/response';

export const getUsers = async (req: Request, res: Response) => {
    // FRONTEND → BACKEND FLOW
    // UserManagement.tsx → GET /users → user.controller.getUsers → user.service.getAllUsers
    try {
        const users = await userService.getAllUsers();
        successResponse(res, users);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return errorResponse(res, 'User not found', 404);
        successResponse(res, user);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        successResponse(res, user);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        await userService.deleteUser(req.params.id);
        successResponse(res, null, 'User deleted successfully');
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};
