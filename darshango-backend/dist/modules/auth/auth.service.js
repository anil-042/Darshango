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
exports.loginUser = exports.registerUser = void 0;
const firebase_1 = require("../../config/firebase");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const registerUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // BACKEND → FIRESTORE FLOW
    // Check if user exists
    const userQuery = yield firebase_1.db.collection('users').where('email', '==', userData.email).get();
    if (!userQuery.empty) {
        throw new Error('Email already exists');
    }
    // Hash password
    const salt = yield bcryptjs_1.default.genSalt(10);
    const passwordHash = yield bcryptjs_1.default.hash(userData.password, salt);
    const newUser = Object.assign(Object.assign({}, userData), { passwordHash, createdAt: new Date().toISOString(), role: userData.role || 'Viewer', status: 'Pending' });
    delete newUser.password; // Remove plain password
    // Create user in Firestore
    const docRef = yield firebase_1.db.collection('users').add(newUser);
    return Object.assign({ id: docRef.id }, newUser);
});
exports.registerUser = registerUser;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // BACKEND → FIRESTORE FLOW
    const userQuery = yield firebase_1.db.collection('users').where('email', '==', email).get();
    if (userQuery.empty) {
        throw new Error('Invalid credentials');
    }
    const userDoc = userQuery.docs[0];
    const user = Object.assign({ id: userDoc.id }, userDoc.data());
    // Verify password
    const isMatch = yield bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    if (user.status !== 'Active') {
        throw new Error('Account is not active');
    }
    return user;
});
exports.loginUser = loginUser;
