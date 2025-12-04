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
exports.generateUCReport = exports.generateFundReport = exports.generateProjectReport = void 0;
const supabase_1 = require("../../config/supabase");
const generateProjectReport = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    let query = supabase_1.supabase.from('projects').select('*');
    if (filters.state)
        query = query.eq('state', filters.state);
    if (filters.district)
        query = query.eq('district', filters.district);
    if (filters.status)
        query = query.eq('status', filters.status);
    const { data, error } = yield query;
    if (error)
        throw new Error(error.message);
    return data.map((p) => ({
        id: p.id,
        title: p.title,
        component: p.component,
        agency: p.implementing_agency_id,
        status: p.status,
        progress: p.progress,
        fundsReleased: p.total_funds_released,
        fundsUtilized: p.total_funds_utilized
    }));
});
exports.generateProjectReport = generateProjectReport;
const generateFundReport = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase_1.supabase
        .from('funds')
        .select('*')
        .order('date', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data.map((f) => ({
        id: f.id,
        projectId: f.project_id,
        type: f.type,
        amount: f.amount,
        date: f.date,
        status: f.status,
        ucStatus: f.uc_status
    }));
});
exports.generateFundReport = generateFundReport;
const generateUCReport = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase_1.supabase
        .from('projects')
        .select('id, title, pending_ucs')
        .gt('pending_ucs', 0);
    if (error)
        throw new Error(error.message);
    return data.map((p) => ({
        projectId: p.id,
        projectTitle: p.title,
        pendingUCs: p.pending_ucs,
        // lastUCSubmitted: p.last_uc_submitted // Field not in schema yet, omitting or assuming it might be added later
    }));
});
exports.generateUCReport = generateUCReport;
