import { Request, Response } from 'express';
import * as authService from './auth.service';
import { successResponse, errorResponse } from '../../utils/response';
import { sendTokenResponse } from '../../utils/jwt';

export const register = async (req: Request, res: Response) => {
    // FRONTEND → BACKEND FLOW
    // Signup.tsx → POST /auth/signup → auth.controller.register → auth.service.registerUser
    try {
        const user = await authService.registerUser(req.body);
        successResponse(res, user, 'User registered successfully', 201);
    } catch (error: any) {
        errorResponse(res, error.message, 400);
    }
};

export const login = async (req: Request, res: Response) => {
    // FRONTEND → BACKEND FLOW
    // Login.tsx → POST /auth/login → auth.controller.login → auth.service.loginUser
    try {
        const { email, password } = req.body;
        const user = await authService.loginUser(email, password);
        sendTokenResponse(user, 200, res);
    } catch (error: any) {
        errorResponse(res, error.message, 401);
    }
};
