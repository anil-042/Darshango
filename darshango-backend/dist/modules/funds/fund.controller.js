"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFund = exports.updateFund = exports.getFundTransactions = exports.createFundTransaction = void 0;
const fundService = __importStar(require("./fund.service"));
const response_1 = require("../../utils/response");
const createFundTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = req.params.id || req.body.projectId;
        // ProjectId is optional now (if missing, it's a global fund)
        const fund = yield fundService.createFundTransaction(projectId, req.body);
        return (0, response_1.successResponse)(res, fund, 'Fund transaction created successfully', 201);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message, 500);
    }
});
exports.createFundTransaction = createFundTransaction;
const getFundTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = req.params.id;
        let funds;
        if (projectId) {
            funds = yield fundService.getFundTransactions(projectId);
        }
        else {
            funds = yield fundService.getAllFundTransactions();
        }
        return (0, response_1.successResponse)(res, funds, 'Fund transactions fetched successfully');
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message, 500);
    }
});
exports.getFundTransactions = getFundTransactions;
const updateFund = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = req.params.id || req.body.projectId;
        const fundId = req.params.fid;
        const updatedFund = yield fundService.updateFundTransaction(projectId, fundId, req.body);
        return (0, response_1.successResponse)(res, updatedFund, 'Fund transaction updated successfully');
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message, 500);
    }
});
exports.updateFund = updateFund;
const deleteFund = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = req.params.id || req.body.projectId || req.query.projectId;
        const fundId = req.params.fid;
        yield fundService.deleteFundTransaction(projectId, fundId);
        return (0, response_1.successResponse)(res, null, 'Fund transaction deleted successfully');
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message, 500);
    }
});
exports.deleteFund = deleteFund;
