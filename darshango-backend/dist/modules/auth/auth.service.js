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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const supabase_1 = require("../../config/supabase");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const registerUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user exists
    const { data: existingUsers, error: checkError } = yield supabase_1.supabase
        .from('users')
        .select('id')
        .eq('email', userData.email);
    if (checkError)
        throw new Error(checkError.message);
    if (existingUsers && existingUsers.length > 0) {
        throw new Error('Email already exists');
    }
    // Hash password
    const salt = yield bcryptjs_1.default.genSalt(10);
    const passwordHash = yield bcryptjs_1.default.hash(userData.password, salt);
    const newUser = {
        email: userData.email,
        password_hash: passwordHash,
        name: userData.fullName || userData.name, // Handle both naming conventions
        role: userData.role || 'Viewer',
        agency_id: userData.agencyId || null,
        state: userData.state || null,
        district: userData.district || null,
        phone: userData.phone || null,
        designation: userData.designation || null,
        status: 'Pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    // Create user in Supabase
    const { data, error } = yield supabase_1.supabase
        .from('users')
        .insert([newUser])
        .select()
        .single();
    if (error)
        throw new Error(error.message);
    const { password_hash } = data, userWithoutPassword = __rest(data, ["password_hash"]);
    return Object.assign({ id: data.id }, userWithoutPassword);
});
exports.registerUser = registerUser;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const { data: users, error } = yield supabase_1.supabase
        .from('users')
        .select('*')
        .eq('email', email);
    if (error)
        throw new Error(error.message);
    if (!users || users.length === 0) {
        throw new Error('Invalid credentials');
    }
    const user = users[0];
    // Verify password
    const isMatch = yield bcryptjs_1.default.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    if (user.status !== 'Active') {
        throw new Error('Account is not active');
    }
    // Map back to camelCase for frontend compatibility if needed, 
    // but for now returning the raw DB object + id. 
    // Ideally we should transform it.
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        agencyId: user.agency_id,
        state: user.state,
        district: user.district,
        status: user.status
    };
});
exports.loginUser = loginUser;
