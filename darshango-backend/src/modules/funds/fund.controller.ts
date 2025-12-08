import { Request, Response } from 'express';
import * as fundService from './fund.service';
import { successResponse, errorResponse } from '../../utils/response';

export const createFundTransaction = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id || req.body.projectId;
        // ProjectId is optional now (if missing, it's a global fund)
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
        const fundId = req.params.fid;

        const updatedFund = await fundService.updateFundTransaction(projectId, fundId, req.body);
        return successResponse(res, updatedFund, 'Fund transaction updated successfully');
    } catch (error: any) {
        return errorResponse(res, error.message, 500);
    }
};


