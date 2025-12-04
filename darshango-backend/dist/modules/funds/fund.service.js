"use strict";
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
exports.deleteFundTransaction = exports.updateFundTransaction = exports.getAllFundTransactions = exports.getFundTransactions = exports.createFundTransaction = void 0;
const supabase_1 = require("../../config/supabase");
const project_service_1 = require("../projects/project.service");
const createFundTransaction = (projectId, fundData) => __awaiter(void 0, void 0, void 0, function* () {
    const dbFund = {
        project_id: projectId || null,
        type: fundData.type,
        from_level: fundData.fromLevel,
        to_level: fundData.toLevel,
        amount: fundData.amount,
        utr_number: fundData.utrNumber,
        date: fundData.date,
        status: fundData.status,
        description: fundData.description,
        proof_file: fundData.proofFile,
        created_by: fundData.createdBy,
        uc_status: fundData.ucStatus || 'Pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    const { data, error } = yield supabase_1.supabase
        .from('funds')
        .insert([dbFund])
        .select()
        .single();
    if (error)
        throw new Error(error.message);
    if (projectId) {
        yield (0, project_service_1.recalculateProjectStats)(projectId);
    }
    return mapFund(data);
});
exports.createFundTransaction = createFundTransaction;
const getFundTransactions = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase_1.supabase
        .from('funds')
        .select('*')
        .eq('project_id', projectId)
        .order('date', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data.map(mapFund);
});
exports.getFundTransactions = getFundTransactions;
const getAllFundTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase_1.supabase
        .from('funds')
        .select('*')
        .order('date', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data.map(mapFund);
});
exports.getAllFundTransactions = getAllFundTransactions;
const updateFundTransaction = (projectId, fundId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const dbUpdate = {
        updated_at: new Date().toISOString()
    };
    if (updateData.type)
        dbUpdate.type = updateData.type;
    if (updateData.fromLevel)
        dbUpdate.from_level = updateData.fromLevel;
    if (updateData.toLevel)
        dbUpdate.to_level = updateData.toLevel;
    if (updateData.amount)
        dbUpdate.amount = updateData.amount;
    if (updateData.utrNumber)
        dbUpdate.utr_number = updateData.utrNumber;
    if (updateData.date)
        dbUpdate.date = updateData.date;
    if (updateData.status)
        dbUpdate.status = updateData.status;
    if (updateData.description)
        dbUpdate.description = updateData.description;
    if (updateData.proofFile)
        dbUpdate.proof_file = updateData.proofFile;
    if (updateData.ucStatus)
        dbUpdate.uc_status = updateData.ucStatus;
    const { data, error } = yield supabase_1.supabase
        .from('funds')
        .update(dbUpdate)
        .eq('id', fundId)
        .select()
        .single();
    if (error)
        throw new Error(error.message);
    if (projectId) {
        yield (0, project_service_1.recalculateProjectStats)(projectId);
    }
    return mapFund(data);
});
exports.updateFundTransaction = updateFundTransaction;
const deleteFundTransaction = (projectId, fundId) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = yield supabase_1.supabase
        .from('funds')
        .delete()
        .eq('id', fundId);
    if (error)
        throw new Error(error.message);
    if (projectId) {
        yield (0, project_service_1.recalculateProjectStats)(projectId);
    }
    return true;
});
exports.deleteFundTransaction = deleteFundTransaction;
const mapFund = (f) => ({
    id: f.id,
    projectId: f.project_id,
    type: f.type,
    fromLevel: f.from_level,
    toLevel: f.to_level,
    amount: f.amount,
    utrNumber: f.utr_number,
    date: f.date,
    status: f.status,
    description: f.description,
    proofFile: f.proof_file,
    createdBy: f.created_by,
    ucStatus: f.uc_status,
    createdAt: f.created_at,
    updatedAt: f.updated_at
});
