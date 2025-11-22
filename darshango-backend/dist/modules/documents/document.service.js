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
exports.deleteDocument = exports.getAllDocuments = exports.getDocuments = exports.uploadDocument = void 0;
const firebase_1 = require("../../config/firebase");
const project_service_1 = require("../projects/project.service");
const uploadDocument = (projectId, documentData) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = yield firebase_1.db.collection('projects').doc(projectId).collection('documents').add(Object.assign(Object.assign({}, documentData), { projectId, uploadedAt: new Date().toISOString(), status: documentData.status || 'Pending' }));
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    return Object.assign({ id: docRef.id }, documentData);
});
exports.uploadDocument = uploadDocument;
const getDocuments = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const snapshot = yield firebase_1.db.collection('projects').doc(projectId).collection('documents').orderBy('uploadedAt', 'desc').get();
    return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getDocuments = getDocuments;
const getAllDocuments = () => __awaiter(void 0, void 0, void 0, function* () {
    const snapshot = yield firebase_1.db.collectionGroup('documents').orderBy('uploadedAt', 'desc').get();
    return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getAllDocuments = getAllDocuments;
const deleteDocument = (projectId, documentId) => __awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.db.collection('projects').doc(projectId).collection('documents').doc(documentId).delete();
    yield (0, project_service_1.recalculateProjectStats)(projectId);
    return true;
});
exports.deleteDocument = deleteDocument;
