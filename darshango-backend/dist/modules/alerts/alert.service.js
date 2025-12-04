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
exports.createAutoAlert = exports.updateAlert = exports.getAlerts = exports.createAlert = void 0;
const supabase_1 = require("../../config/supabase");
const createAlert = (alertData) => __awaiter(void 0, void 0, void 0, function* () {
    const dbAlert = {
        type: alertData.type,
        project_id: alertData.projectId,
        priority: alertData.priority,
        description: alertData.description,
        status: alertData.status || 'Open',
        date: alertData.date || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    const { data, error } = yield supabase_1.supabase
        .from('alerts')
        .insert([dbAlert])
        .select()
        .single();
    if (error)
        throw new Error(error.message);
    return mapAlert(data);
});
exports.createAlert = createAlert;
const getAlerts = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}) {
    let query = supabase_1.supabase.from('alerts').select('*');
    if (filters.projectId) {
        query = query.eq('project_id', filters.projectId);
    }
    if (filters.status) {
        query = query.eq('status', filters.status);
    }
    if (filters.priority) {
        query = query.eq('priority', filters.priority);
    }
    const { data, error } = yield query.order('created_at', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data.map(mapAlert);
});
exports.getAlerts = getAlerts;
const updateAlert = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const dbUpdate = {
        updated_at: new Date().toISOString()
    };
    if (updateData.type)
        dbUpdate.type = updateData.type;
    if (updateData.projectId)
        dbUpdate.project_id = updateData.projectId;
    if (updateData.priority)
        dbUpdate.priority = updateData.priority;
    if (updateData.description)
        dbUpdate.description = updateData.description;
    if (updateData.status)
        dbUpdate.status = updateData.status;
    if (updateData.date)
        dbUpdate.date = updateData.date;
    const { data, error } = yield supabase_1.supabase
        .from('alerts')
        .update(dbUpdate)
        .eq('id', id)
        .select()
        .single();
    if (error)
        throw new Error(error.message);
    return mapAlert(data);
});
exports.updateAlert = updateAlert;
const createAutoAlert = (type, projectId, description, priority) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if similar open alert exists to avoid duplicates
    const { data: existing } = yield supabase_1.supabase
        .from('alerts')
        .select('id')
        .eq('project_id', projectId)
        .eq('type', type)
        .in('status', ['Open', 'New', 'In Progress']);
    if (existing && existing.length > 0)
        return;
    yield (0, exports.createAlert)({
        type,
        projectId,
        description,
        priority,
        status: 'New',
        date: new Date().toISOString()
    });
});
exports.createAutoAlert = createAutoAlert;
const mapAlert = (a) => ({
    id: a.id,
    type: a.type,
    projectId: a.project_id,
    priority: a.priority,
    description: a.description,
    status: a.status,
    date: a.date,
    createdAt: a.created_at,
    updatedAt: a.updated_at
});
