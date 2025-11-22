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
exports.getDashboardStats = void 0;
const firebase_1 = require("../../config/firebase");
const getDashboardStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}) {
    // This is a heavy operation, in production we might want to cache this or use counters
    const projectsSnapshot = yield firebase_1.db.collection('projects').get();
    const projects = projectsSnapshot.docs.map(doc => doc.data());
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const ongoingProjects = projects.filter(p => p.status === 'In Progress').length;
    const delayedProjects = projects.filter(p => p.status === 'Delayed').length;
    const totalFundsReleased = projects.reduce((acc, p) => acc + (p.totalFundsReleased || 0), 0);
    const totalFundsUtilized = projects.reduce((acc, p) => acc + (p.totalFundsUtilized || 0), 0);
    const pendingUCs = projects.reduce((acc, p) => acc + (p.pendingUCs || 0), 0);
    const alertsSnapshot = yield firebase_1.db.collection('alerts').where('status', 'in', ['Open', 'New', 'In Progress']).get();
    const activeAlerts = alertsSnapshot.size;
    // Geo distribution (simple count by district)
    const districtDistribution = {};
    projects.forEach(p => {
        const district = p.district || 'Unknown';
        districtDistribution[district] = (districtDistribution[district] || 0) + 1;
    });
    return {
        totalProjects,
        statusCounts: {
            completed: completedProjects,
            ongoing: ongoingProjects,
            delayed: delayedProjects,
            underReview: totalProjects - completedProjects - ongoingProjects - delayedProjects
        },
        funds: {
            released: totalFundsReleased,
            utilized: totalFundsUtilized,
            utilizationPercentage: totalFundsReleased > 0 ? (totalFundsUtilized / totalFundsReleased) * 100 : 0
        },
        pendingUCs,
        activeAlerts,
        districtDistribution
    };
});
exports.getDashboardStats = getDashboardStats;
