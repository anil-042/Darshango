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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const supabase_1 = require("../../config/supabase");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase_1.supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
    if (error)
        return null;
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        agencyId: data.agency_id,
        state: data.state,
        district: data.district,
        status: data.status,
        createdAt: data.created_at
    };
});
exports.getUserById = getUserById;
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // Hash password
    const salt = yield bcryptjs_1.default.genSalt(10);
    const passwordHash = yield bcryptjs_1.default.hash(userData.password, salt);
    const userDoc = {
        name: userData.name,
        email: userData.email,
        password_hash: passwordHash,
        role: userData.role,
        status: userData.status || 'Active',
        agency_id: userData.agencyId || null,
        state: userData.state || null,
        district: userData.district || null,
        created_at: new Date().toISOString(),
    };
    const { data, error } = yield supabase_1.supabase
        .from('users')
        .insert([userDoc])
        .select()
        .single();
    if (error)
        throw new Error(error.message);
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        agencyId: data.agency_id,
        state: data.state,
        district: data.district,
        status: data.status,
        createdAt: data.created_at
    };
});
exports.createUser = createUser;
const updateUser = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    // Map camelCase to snake_case for DB update
    const dbUpdateData = {};
    if (updateData.name)
        dbUpdateData.name = updateData.name;
    if (updateData.role)
        dbUpdateData.role = updateData.role;
    if (updateData.status)
        dbUpdateData.status = updateData.status;
    if (updateData.agencyId)
        dbUpdateData.agency_id = updateData.agencyId;
    if (updateData.state)
        dbUpdateData.state = updateData.state;
    if (updateData.district)
        dbUpdateData.district = updateData.district;
    // If password update is needed, it should be hashed, but keeping it simple for now as per original
    const { error } = yield supabase_1.supabase
        .from('users')
        .update(dbUpdateData)
        .eq('id', id);
    if (error)
        throw new Error(error.message);
    return (0, exports.getUserById)(id);
});
exports.updateUser = updateUser;
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
