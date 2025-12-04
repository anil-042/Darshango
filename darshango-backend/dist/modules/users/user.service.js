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
exports.deleteUser = exports.getAllUsers = void 0;
const supabase_1 = require("../../config/supabase");
const getAllUsers = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}) {
    let query = supabase_1.supabase.from('users').select('*').neq('status', 'Deleted'); // Exclude deleted users
    if (filters.role)
        query = query.eq('role', filters.role);
    if (filters.agencyId)
        query = query.eq('agency_id', filters.agencyId);
    if (filters.state)
        query = query.eq('state', filters.state);
    if (filters.district)
        query = query.eq('district', filters.district);
    const { data, error } = yield query;
    if (error)
        throw new Error(error.message);
    // Map snake_case to camelCase
    return data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        agencyId: user.agency_id,
        state: user.state,
        district: user.district,
        status: user.status,
        createdAt: user.created_at
    }));
});
exports.getAllUsers = getAllUsers;
// ... (keep other functions)
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Soft delete to avoid foreign key constraints
    const { error } = yield supabase_1.supabase
        .from('users')
        .update({ status: 'Deleted' })
        .eq('id', id);
    if (error)
        throw new Error(error.message);
    return true;
});
exports.deleteUser = deleteUser;
