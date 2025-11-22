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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const firebase_1 = require("../../config/firebase");
const getAllUsers = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}) {
    // BACKEND → FIRESTORE FLOW
    let query = firebase_1.db.collection('users');
    if (filters.role)
        query = query.where('role', '==', filters.role);
    if (filters.agencyId)
        query = query.where('agencyId', '==', filters.agencyId);
    if (filters.state)
        query = query.where('state', '==', filters.state);
    if (filters.district)
        query = query.where('district', '==', filters.district);
    const snapshot = yield query.get();
    return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getAllUsers = getAllUsers;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // BACKEND → FIRESTORE FLOW
    const doc = yield firebase_1.db.collection('users').doc(id).get();
    if (!doc.exists)
        return null;
    return Object.assign({ id: doc.id }, doc.data());
});
exports.getUserById = getUserById;
const updateUser = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    // BACKEND → FIRESTORE FLOW
    yield firebase_1.db.collection('users').doc(id).update(updateData);
    return (0, exports.getUserById)(id);
});
exports.updateUser = updateUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // BACKEND → FIRESTORE FLOW
    yield firebase_1.db.collection('users').doc(id).delete();
    return true;
});
exports.deleteUser = deleteUser;
