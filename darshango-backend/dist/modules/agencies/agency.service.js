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
exports.deleteAgency = exports.updateAgency = exports.getAllAgencies = exports.createAgency = void 0;
const firebase_1 = require("../../config/firebase");
const createAgency = (agencyData) => __awaiter(void 0, void 0, void 0, function* () {
    // BACKEND → FIRESTORE FLOW
    const docRef = yield firebase_1.db.collection('agencies').add(Object.assign(Object.assign({}, agencyData), { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), activeProjects: agencyData.activeProjects || 0, performance: agencyData.performance || 0, assignedProjects: agencyData.assignedProjects || [] }));
    return Object.assign({ id: docRef.id }, agencyData);
});
exports.createAgency = createAgency;
const getAllAgencies = () => __awaiter(void 0, void 0, void 0, function* () {
    // BACKEND → FIRESTORE FLOW
    const snapshot = yield firebase_1.db.collection('agencies').get();
    return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getAllAgencies = getAllAgencies;
const updateAgency = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    // BACKEND → FIRESTORE FLOW
    yield firebase_1.db.collection('agencies').doc(id).update(Object.assign(Object.assign({}, updateData), { lastUpdated: new Date().toISOString() }));
    const doc = yield firebase_1.db.collection('agencies').doc(id).get();
    return Object.assign({ id: doc.id }, doc.data());
});
exports.updateAgency = updateAgency;
const deleteAgency = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // BACKEND → FIRESTORE FLOW
    yield firebase_1.db.collection('agencies').doc(id).delete();
    return true;
});
exports.deleteAgency = deleteAgency;
