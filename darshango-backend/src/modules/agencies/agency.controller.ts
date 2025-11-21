import { Request, Response } from 'express';
import * as agencyService from './agency.service';
import { successResponse, errorResponse } from '../../utils/response';

export const createAgency = async (req: Request, res: Response) => {
    // FRONTEND → BACKEND FLOW
    // AgencyRegistration.tsx → POST /agencies → agency.controller.createAgency → agency.service.createAgency
    try {
        const agency = await agencyService.createAgency(req.body);
        successResponse(res, agency, 'Agency created successfully', 201);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const getAgencies = async (req: Request, res: Response) => {
    // FRONTEND → BACKEND FLOW
    // AgencyMapping.tsx → GET /agencies → agency.controller.getAgencies → agency.service.getAllAgencies
    try {
        const agencies = await agencyService.getAllAgencies();
        successResponse(res, agencies);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const updateAgency = async (req: Request, res: Response) => {
    try {
        const agency = await agencyService.updateAgency(req.params.id, req.body);
        successResponse(res, agency);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const deleteAgency = async (req: Request, res: Response) => {
    try {
        await agencyService.deleteAgency(req.params.id);
        successResponse(res, null, 'Agency deleted successfully');
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};
