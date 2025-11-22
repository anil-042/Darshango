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
exports.createAutoAlert = exports.updateAlert = exports.getAlerts = exports.createAlert = void 0;
const firebase_1 = require("../../config/firebase");
const createAlert = (alertData) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = yield firebase_1.db.collection('alerts').add(Object.assign(Object.assign({}, alertData), { createdAt: new Date().toISOString(), status: alertData.status || 'Open' }));
    return Object.assign({ id: docRef.id }, alertData);
});
exports.createAlert = createAlert;
const getAlerts = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}) {
    let query = firebase_1.db.collection('alerts');
    if (filters.projectId) {
        query = query.where('projectId', '==', filters.projectId);
    }
    if (filters.status) {
        query = query.where('status', '==', filters.status);
    }
    if (filters.priority) {
        query = query.where('priority', '==', filters.priority);
    }
    const snapshot = yield query.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
});
exports.getAlerts = getAlerts;
const updateAlert = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.db.collection('alerts').doc(id).update(Object.assign(Object.assign({}, updateData), { updatedAt: new Date().toISOString() }));
    const doc = yield firebase_1.db.collection('alerts').doc(id).get();
    return Object.assign({ id: doc.id }, doc.data());
});
exports.updateAlert = updateAlert;
const createAutoAlert = (type, projectId, description, priority) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if similar open alert exists to avoid duplicates
    const existing = yield firebase_1.db.collection('alerts')
        .where('projectId', '==', projectId)
        .where('type', '==', type)
        .where('status', 'in', ['Open', 'New', 'In Progress'])
        .get();
    if (!existing.empty)
        return;
    yield (0, exports.createAlert)({
        type,
        projectId,
        description,
        priority,
        status: 'New',
        date: new Date().toISOString()
    });
});
exports.createAutoAlert = createAutoAlert;
