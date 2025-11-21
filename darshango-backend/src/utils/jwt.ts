import jwt from 'jsonwebtoken';
import { Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const signToken = (payload: object, expiresIn: string | number = '24h'): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
    const token = signToken({ id: user.id, role: user.role });

    // Remove password from output
    const { passwordHash, ...userData } = user;

    res.status(statusCode).json({
        success: true,
        token,
        user: userData,
    });
};
