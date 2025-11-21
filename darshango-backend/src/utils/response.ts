import { Response } from 'express';

export const successResponse = (res: Response, data: any, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const errorResponse = (res: Response, message = 'Server Error', statusCode = 500, error?: any) => {
    res.status(statusCode).json({
        success: false,
        message,
        error: error?.message || error,
    });
};
