import { Request, Response } from 'express';
import * as fundService from './fund.service';
import { successResponse, errorResponse } from '../../utils/response';

export const createFundTransaction = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id || req.body.projectId;
        if (!projectId) {
            return errorResponse(res, 'Project ID is required', 400);
        }
        const fund = await fundService.createFundTransaction(projectId, req.body);
        return successResponse(res, fund, 'Fund transaction created successfully', 201);
    } catch (error: any) {
        return errorResponse(res, error.message, 500);
    }
};

export const getFundTransactions = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id;
        let funds;
        if (projectId) {
            funds = await fundService.getFundTransactions(projectId);
        } else {
            funds = await fundService.getAllFundTransactions();
        }
        return successResponse(res, funds, 'Fund transactions fetched successfully');
    } catch (error: any) {
        return errorResponse(res, error.message, 500);
    }
};

export const updateFund = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id || req.body.projectId;
        const fundId = req.params.fid; // Assuming /:id/funds/:fid or /funds/:fid (if global, need logic)

        // If global route /funds/:fid is used, projectId might not be in params.
        // For now, assuming update is done via nested route or we need to fetch fund to get projectId if not provided.
        // But let's stick to the pattern. If projectId is not in params, check body.

        if (!projectId) {
            // If we don't have projectId, we can't easily update subcollection without querying all projects (expensive)
            // or we mandate projectId in body for global updates.
            return errorResponse(res, 'Project ID is required for updates', 400);
        }

        const updatedFund = await fundService.updateFundTransaction(projectId, fundId, req.body);
        return successResponse(res, updatedFund, 'Fund transaction updated successfully');
    } catch (error: any) {
        return errorResponse(res, error.message, 500);
    }
};

export const deleteFund = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id || req.body.projectId;
        const fundId = req.params.fid;
        if (!projectId) {
            return errorResponse(res, 'Project ID is required for deletion', 400);
        }
        await fundService.deleteFundTransaction(projectId, fundId);
        return successResponse(res, null, 'Fund transaction deleted successfully');
    } catch (error: any) {
        return errorResponse(res, error.message, 500);
    }
};
