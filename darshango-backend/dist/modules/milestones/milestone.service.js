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
const firebase_1 = require("../../config/firebase");
const project_service_1 = require("../projects/project.service");
const createMilestone = (projectId, milestoneData) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = yield firebase_1.db.collection('projects').doc(projectId).collection('milestones').add(Object.assign(Object.assign({}, milestoneData), { projectId, createdAt: new Date().toISOString(), orderIndex: milestoneData.orderIndex || 0 }));
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    return Object.assign({ id: docRef.id }, milestoneData);
});
exports.createMilestone = createMilestone;
const getMilestones = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const snapshot = yield firebase_1.db.collection('projects').doc(projectId).collection('milestones').orderBy('orderIndex', 'asc').get();
    return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getMilestones = getMilestones;
const getAllMilestones = () => __awaiter(void 0, void 0, void 0, function* () {
    const snapshot = yield firebase_1.db.collectionGroup('milestones').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getAllMilestones = getAllMilestones;
const updateMilestone = (projectId, milestoneId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.db.collection('projects').doc(projectId).collection('milestones').doc(milestoneId).update(Object.assign(Object.assign({}, updateData), { updatedAt: new Date().toISOString() }));
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    const doc = yield firebase_1.db.collection('projects').doc(projectId).collection('milestones').doc(milestoneId).get();
    return Object.assign({ id: doc.id }, doc.data());
});
exports.updateMilestone = updateMilestone;
const deleteMilestone = (projectId, milestoneId) => __awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.db.collection('projects').doc(projectId).collection('milestones').doc(milestoneId).delete();
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    return true;
});
exports.deleteMilestone = deleteMilestone;
