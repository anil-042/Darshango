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

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return errorResponse(res, 'Email and code are required', 400);
        }
        const result = await authService.verifyEmail(email, code);
        successResponse(res, result, 'Email verified successfully', 200);
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

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        if (!token) {
            return errorResponse(res, 'Google token is required', 400);
        }
        const user = await authService.loginWithGoogle(token);
        sendTokenResponse(user, 200, res);
    } catch (error: any) {
        errorResponse(res, error.message, 401);
    }
};
