import { Request, Response } from 'express';
import * as permissionService from './permissions.service';

export const getPermissions = async (req: Request, res: Response) => {
    try {
        const permissions = await permissionService.getPermissions();
        res.json({ success: true, data: permissions });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updatePermissions = async (req: Request, res: Response) => {
    try {
        const permissions = req.body;
        const updated = await permissionService.updatePermissions(permissions);
        res.json({ success: true, data: updated });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
