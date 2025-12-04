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
const supabase_1 = require("../../config/supabase");
const getDashboardStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}) {
    // Fetch all projects with necessary fields
    const { data: projects, error } = yield supabase_1.supabase
        .from('projects')
        .select('status, total_funds_released, total_funds_utilized, pending_ucs, district');
    if (error)
        throw new Error(error.message);
    const totalProjects = projects.length;
    const completedProjects = projects.filter((p) => p.status === 'Completed').length;
    const ongoingProjects = projects.filter((p) => p.status === 'In Progress').length;
    const delayedProjects = projects.filter((p) => p.status === 'Delayed').length;
    const totalFundsReleased = projects.reduce((acc, p) => acc + (p.total_funds_released || 0), 0);
    const totalFundsUtilized = projects.reduce((acc, p) => acc + (p.total_funds_utilized || 0), 0);
    const pendingUCs = projects.reduce((acc, p) => acc + (p.pending_ucs || 0), 0);
    // Active Alerts
    const { count: activeAlerts, error: alertError } = yield supabase_1.supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .in('status', ['Open', 'New', 'In Progress']);
    if (alertError)
        throw new Error(alertError.message);
    // Geo distribution
    const districtDistribution = {};
    projects.forEach((p) => {
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
        activeAlerts: activeAlerts || 0,
        districtDistribution
    };
});
exports.getDashboardStats = getDashboardStats;
