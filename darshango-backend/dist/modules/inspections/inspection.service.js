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
exports.deleteInspection = exports.updateInspection = exports.getAllInspections = exports.getInspections = exports.createInspection = void 0;
const firebase_1 = require("../../config/firebase");
const alert_service_1 = require("../alerts/alert.service");
const project_service_1 = require("../projects/project.service");
const createInspection = (projectId, inspectionData) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = yield firebase_1.db.collection('projects').doc(projectId).collection('inspections').add(Object.assign(Object.assign({}, inspectionData), { projectId, createdAt: new Date().toISOString() }));
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    if (inspectionData.rating === 'Needs Attention' || inspectionData.rating === 'Critical' || inspectionData.severity === 'Critical') {
        yield (0, alert_service_1.createAutoAlert)('Inspection', projectId, `Critical inspection finding: ${inspectionData.findings}`, 'High');
    }
    return Object.assign({ id: docRef.id }, inspectionData);
});
exports.createInspection = createInspection;
const getInspections = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const snapshot = yield firebase_1.db.collection('projects').doc(projectId).collection('inspections').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getInspections = getInspections;
const getAllInspections = () => __awaiter(void 0, void 0, void 0, function* () {
    const snapshot = yield firebase_1.db.collectionGroup('inspections').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getAllInspections = getAllInspections;
const updateInspection = (projectId, inspectionId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.db.collection('projects').doc(projectId).collection('inspections').doc(inspectionId).update(Object.assign(Object.assign({}, updateData), { updatedAt: new Date().toISOString() }));
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    if (updateData.rating === 'Needs Attention' || updateData.rating === 'Critical') {
        yield (0, alert_service_1.createAutoAlert)('Inspection', projectId, `Critical inspection finding updated: ${updateData.findings}`, 'High');
    }
    const doc = yield firebase_1.db.collection('projects').doc(projectId).collection('inspections').doc(inspectionId).get();
    return Object.assign({ id: doc.id }, doc.data());
});
exports.updateInspection = updateInspection;
const deleteInspection = (projectId, inspectionId) => __awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.db.collection('projects').doc(projectId).collection('inspections').doc(inspectionId).delete();
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    return true;
});
exports.deleteInspection = deleteInspection;
