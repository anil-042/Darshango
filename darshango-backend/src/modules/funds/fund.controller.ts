import { Request, Response } from 'express';
import * as fundService from './fund.service';
import { successResponse, errorResponse } from '../../utils/response';

export const createFund = async (req: Request, res: Response) => {
    // FRONTEND → BACKEND FLOW
    // FundFlowTab.tsx → POST /projects/:id/funds → fund.controller.createFund → fund.service.createFundTransaction
    try {
        const fund = await fundService.createFundTransaction(req.params.id, req.body);
        successResponse(res, fund, 'Fund transaction created successfully', 201);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const getFunds = async (req: Request, res: Response) => {
    try {
        const funds = await fundService.getFundTransactions(req.params.id);
        successResponse(res, funds);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};

export const updateFund = async (req: Request, res: Response) => {
    try {
        const fund = await fundService.updateFundTransaction(req.params.id, req.params.fid, req.body);
        successResponse(res, fund);
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};
export const deleteFund = async (req: Request, res: Response) => {
    try {
        await fundService.deleteFundTransaction(req.params.id, req.params.fid);
        successResponse(res, null, 'Fund transaction deleted successfully');
    } catch (error: any) {
        errorResponse(res, error.message);
    }
};
