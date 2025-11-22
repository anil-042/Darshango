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
exports.generateUCReport = exports.generateFundReport = exports.generateProjectReport = void 0;
const firebase_1 = require("../../config/firebase");
const generateProjectReport = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    let query = firebase_1.db.collection('projects');
    if (filters.state)
        query = query.where('state', '==', filters.state);
    if (filters.district)
        query = query.where('district', '==', filters.district);
    if (filters.status)
        query = query.where('status', '==', filters.status);
    const snapshot = yield query.get();
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            component: data.component,
            agency: data.implementingAgencyId, // Should ideally fetch agency name
            status: data.status,
            progress: data.progress,
            fundsReleased: data.totalFundsReleased,
            fundsUtilized: data.totalFundsUtilized
        };
    });
});
exports.generateProjectReport = generateProjectReport;
const generateFundReport = () => __awaiter(void 0, void 0, void 0, function* () {
    const snapshot = yield firebase_1.db.collectionGroup('funds').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
});
exports.generateFundReport = generateFundReport;
const generateUCReport = () => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch projects with pending UCs
    const snapshot = yield firebase_1.db.collection('projects').where('pendingUCs', '>', 0).get();
    return snapshot.docs.map(doc => ({
        projectId: doc.id,
        projectTitle: doc.data().title,
        pendingUCs: doc.data().pendingUCs,
        lastUCSubmitted: doc.data().lastUCSubmitted
    }));
});
exports.generateUCReport = generateUCReport;
