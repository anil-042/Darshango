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
exports.deleteMilestone = exports.updateMilestone = exports.getAllMilestones = exports.getMilestones = exports.createMilestone = void 0;
const supabase_1 = require("../../config/supabase");
const project_service_1 = require("../projects/project.service");
const createMilestone = (projectId, milestoneData) => __awaiter(void 0, void 0, void 0, function* () {
    const dbMilestone = {
        project_id: projectId,
        title: milestoneData.title,
        status: milestoneData.status || 'Pending',
        owner: milestoneData.owner,
        start_date: milestoneData.startDate,
        due_date: milestoneData.dueDate,
        completion_date: milestoneData.completionDate,
        progress: milestoneData.progress || 0,
        remarks: milestoneData.remarks,
        order_index: milestoneData.orderIndex || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    const { data, error } = yield supabase_1.supabase
        .from('milestones')
        .insert([dbMilestone])
        .select()
        .single();
    if (error)
        throw new Error(error.message);
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    return mapMilestone(data);
});
exports.createMilestone = createMilestone;
const getMilestones = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase_1.supabase
        .from('milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('order_index', { ascending: true });
    if (error)
        throw new Error(error.message);
    return data.map(mapMilestone);
});
exports.getMilestones = getMilestones;
const getAllMilestones = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase_1.supabase
        .from('milestones')
        .select('*')
        .order('created_at', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data.map(mapMilestone);
});
exports.getAllMilestones = getAllMilestones;
const updateMilestone = (projectId, milestoneId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const dbUpdate = {
        updated_at: new Date().toISOString()
    };
    if (updateData.title)
        dbUpdate.title = updateData.title;
    if (updateData.status)
        dbUpdate.status = updateData.status;
    if (updateData.owner)
        dbUpdate.owner = updateData.owner;
    if (updateData.startDate)
        dbUpdate.start_date = updateData.startDate;
    if (updateData.dueDate)
        dbUpdate.due_date = updateData.dueDate;
    if (updateData.completionDate)
        dbUpdate.completion_date = updateData.completionDate;
    if (updateData.progress !== undefined)
        dbUpdate.progress = updateData.progress;
    if (updateData.remarks)
        dbUpdate.remarks = updateData.remarks;
    if (updateData.orderIndex !== undefined)
        dbUpdate.order_index = updateData.orderIndex;
    const { data, error } = yield supabase_1.supabase
        .from('milestones')
        .update(dbUpdate)
        .eq('id', milestoneId)
        .select()
        .single();
    if (error)
        throw new Error(error.message);
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    return mapMilestone(data);
});
exports.updateMilestone = updateMilestone;
const deleteMilestone = (projectId, milestoneId) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = yield supabase_1.supabase
        .from('milestones')
        .delete()
        .eq('id', milestoneId);
    if (error)
        throw new Error(error.message);
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    return true;
});
exports.deleteMilestone = deleteMilestone;
const mapMilestone = (m) => ({
    id: m.id,
    projectId: m.project_id,
    title: m.title,
    status: m.status,
    owner: m.owner,
    startDate: m.start_date,
    dueDate: m.due_date,
    completionDate: m.completion_date,
    progress: m.progress,
    remarks: m.remarks,
    orderIndex: m.order_index,
    createdAt: m.created_at,
    updatedAt: m.updated_at
});
