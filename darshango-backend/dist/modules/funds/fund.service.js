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
const firebase_1 = require("../../config/firebase");
const project_service_1 = require("../projects/project.service");
const createFundTransaction = (projectId, fundData) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = yield firebase_1.db.collection('projects').doc(projectId).collection('funds').add(Object.assign(Object.assign({}, fundData), { projectId, createdAt: new Date().toISOString(), ucStatus: fundData.ucStatus || 'Pending' }));
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    return Object.assign({ id: docRef.id }, fundData);
});
exports.createFundTransaction = createFundTransaction;
const getFundTransactions = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const snapshot = yield firebase_1.db.collection('projects').doc(projectId).collection('funds').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getFundTransactions = getFundTransactions;
const getAllFundTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const snapshot = yield firebase_1.db.collectionGroup('funds').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getAllFundTransactions = getAllFundTransactions;
const updateFundTransaction = (projectId, fundId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.db.collection('projects').doc(projectId).collection('funds').doc(fundId).update(Object.assign(Object.assign({}, updateData), { updatedAt: new Date().toISOString() }));
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    // Check for UC status change
    if (updateData.ucStatus === 'Pending' && updateData.type === 'Release') {
        // Logic to check if UC is overdue could go here or in a scheduled job
    }
    const doc = yield firebase_1.db.collection('projects').doc(projectId).collection('funds').doc(fundId).get();
    return Object.assign({ id: doc.id }, doc.data());
});
exports.updateFundTransaction = updateFundTransaction;
const deleteFundTransaction = (projectId, fundId) => __awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.db.collection('projects').doc(projectId).collection('funds').doc(fundId).delete();
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    return true;
});
exports.deleteFundTransaction = deleteFundTransaction;
