import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { db } from '../config/firebase';

export interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        const userDoc = await db.collection('users').doc(decoded.id).get();

        if (!userDoc.exists) {
            return res.status(401).json({ success: false, message: 'User no longer exists' });
        }

        req.user = { id: userDoc.id, ...userDoc.data() };
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
};
