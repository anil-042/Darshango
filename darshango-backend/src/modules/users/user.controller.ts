import { Request, Response } from 'express';
import * as userService from './user.service';
import { successResponse, errorResponse } from '../../utils/response';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const filters = req.query;
        const users = await userService.getAllUsers(filters);
        successResponse(res, users, 'Users fetched successfully');
    } catch (error: any) {
        errorResponse(res, error.message, 500);
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

export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await userService.createUser(req.body);
        successResponse(res, user, 'User created successfully');
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
        console.log(`[UserController] Deleting user with ID: ${req.params.id}`);
        await userService.deleteUser(req.params.id);
        successResponse(res, null, 'User deleted successfully');
    } catch (error: any) {
        console.error(`[UserController] Failed to delete user: ${error.message}`);
        errorResponse(res, error.message);
    }
};
