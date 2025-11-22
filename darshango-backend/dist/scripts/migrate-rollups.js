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
const firebase_1 = require("../config/firebase");
const migrateRollups = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Starting rollup migration...');
    const projectsSnapshot = yield firebase_1.db.collection('projects').get();
    for (const doc of projectsSnapshot.docs) {
        const projectId = doc.id;
        console.log(`Processing project: ${projectId}`);
        // 1. Milestones Progress
        const milestonesSnap = yield firebase_1.db.collection('projects').doc(projectId).collection('milestones').get();
        const totalMilestones = milestonesSnap.size;
        const completedMilestones = milestonesSnap.docs.filter(m => m.data().status === 'Completed').length;
        const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
        // 2. Funds Utilized
        const fundsSnap = yield firebase_1.db.collection('projects').doc(projectId).collection('funds').where('type', '==', 'Utilization').get();
        const spent = fundsSnap.docs.reduce((acc, f) => acc + (f.data().amount || 0), 0);
        // 3. Inspection Stats
        const inspectionsSnap = yield firebase_1.db.collection('projects').doc(projectId).collection('inspections').get();
        const totalInspections = inspectionsSnap.size;
        const completedInspections = inspectionsSnap.docs.filter(i => i.data().status === 'Completed').length;
        // Update Project
        yield firebase_1.db.collection('projects').doc(projectId).update({
            progress,
            spent,
            totalInspections,
            completedInspections,
            updatedAt: new Date().toISOString()
        });
        console.log(`Updated project ${projectId}: Progress=${progress}%, Spent=${spent}`);
    }
    console.log('Migration completed successfully.');
});
migrateRollups().catch(console.error);
