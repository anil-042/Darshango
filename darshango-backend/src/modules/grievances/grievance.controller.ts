import { Request, Response } from 'express';
import * as GrievanceService from './grievance.service';

export const createGrievance = async (req: Request, res: Response) => {
    try {
        const grievance = await GrievanceService.createGrievance(req.body);
        res.status(201).json({ success: true, data: grievance });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllGrievances = async (req: Request, res: Response) => {
    try {
        const grievances = await GrievanceService.getAllGrievances(req.query);
        res.status(200).json({ success: true, data: grievances });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getGrievanceById = async (req: Request, res: Response) => {
    try {
        const grievance = await GrievanceService.getGrievanceById(req.params.id);
        if (!grievance) {
            return res.status(404).json({ success: false, message: 'Grievance not found' });
        }
        res.status(200).json({ success: true, data: grievance });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateGrievance = async (req: Request, res: Response) => {
    try {
        const grievance = await GrievanceService.updateGrievance(req.params.id, req.body);
        res.status(200).json({ success: true, data: grievance });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteGrievance = async (req: Request, res: Response) => {
    try {
        await GrievanceService.deleteGrievance(req.params.id);
        res.status(200).json({ success: true, message: 'Grievance deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
