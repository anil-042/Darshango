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
exports.recalculateProjectStats = exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getAllProjects = exports.createProject = void 0;
const firebase_1 = require("../../config/firebase");
const createProject = (projectData) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = yield firebase_1.db.collection('projects').add(Object.assign(Object.assign({}, projectData), { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), progress: 0, totalFundsReleased: 0, totalFundsUtilized: 0, pendingUCs: 0, milestoneCount: 0, inspectionCount: 0, documentCount: 0 }));
    return Object.assign({ id: docRef.id }, projectData);
});
exports.createProject = createProject;
const getAllProjects = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}) {
    let query = firebase_1.db.collection('projects');
    if (filters.state)
        query = query.where('state', '==', filters.state);
    if (filters.district)
        query = query.where('district', '==', filters.district);
    if (filters.agencyId)
        query = query.where('implementingAgencyId', '==', filters.agencyId); // Or executingAgencyId
    if (filters.component)
        query = query.where('component', '==', filters.component);
    if (filters.status)
        query = query.where('status', '==', filters.status);
    const snapshot = yield query.orderBy('updatedAt', 'desc').get();
    return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getAllProjects = getAllProjects;
const getProjectById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield firebase_1.db.collection('projects').doc(id).get();
    if (!doc.exists)
        return null;
    return Object.assign({ id: doc.id }, doc.data());
});
exports.getProjectById = getProjectById;
const updateProject = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.db.collection('projects').doc(id).update(Object.assign(Object.assign({}, updateData), { updatedAt: new Date().toISOString() }));
    const doc = yield firebase_1.db.collection('projects').doc(id).get();
    return Object.assign({ id: doc.id }, doc.data());
});
exports.updateProject = updateProject;
const deleteProject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.db.collection('projects').doc(id).delete();
    return true;
});
exports.deleteProject = deleteProject;
const recalculateProjectStats = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const projectRef = firebase_1.db.collection('projects').doc(projectId);
    // Milestones
    const milestonesSnap = yield projectRef.collection('milestones').get();
    const totalMilestones = milestonesSnap.size;
    const completedMilestones = milestonesSnap.docs.filter(d => d.data().status === 'Completed').length;
    const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
    // Funds
    const fundsSnap = yield projectRef.collection('funds').get();
    const released = fundsSnap.docs
        .filter(d => d.data().type === 'Release')
        .reduce((acc, d) => acc + (d.data().amount || 0), 0);
    const utilized = fundsSnap.docs
        .filter(d => d.data().type === 'Utilization')
        .reduce((acc, d) => acc + (d.data().amount || 0), 0);
    // Pending UCs (Funds released but not fully utilized/UC submitted - simplified logic)
    // A better logic: Count funds with type 'Release' that don't have a corresponding 'Utilization' or UC status 'Approved'
    // For now, let's count funds with ucStatus === 'Pending'
    const pendingUCs = fundsSnap.docs.filter(d => d.data().ucStatus === 'Pending').length;
    // Inspections
    const inspectionsSnap = yield projectRef.collection('inspections').get();
    const inspectionCount = inspectionsSnap.size;
    // Documents
    const documentsSnap = yield projectRef.collection('documents').get();
    const documentCount = documentsSnap.size;
    yield projectRef.update({
        progress,
        totalFundsReleased: released,
        totalFundsUtilized: utilized,
        pendingUCs,
        milestoneCount: totalMilestones,
        inspectionCount,
        documentCount,
        updatedAt: new Date().toISOString()
    });
});
exports.recalculateProjectStats = recalculateProjectStats;
