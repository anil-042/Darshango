"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const agency_routes_1 = __importDefault(require("./modules/agencies/agency.routes"));
const project_routes_1 = __importDefault(require("./modules/projects/project.routes"));
const milestone_routes_1 = __importDefault(require("./modules/milestones/milestone.routes"));
const fund_routes_1 = __importDefault(require("./modules/funds/fund.routes"));
const inspection_routes_1 = __importDefault(require("./modules/inspections/inspection.routes"));
const document_routes_1 = __importDefault(require("./modules/documents/document.routes"));
const alert_routes_1 = __importDefault(require("./modules/alerts/alert.routes"));
const report_routes_1 = __importDefault(require("./modules/reports/report.routes"));
const dashboard_routes_1 = __importDefault(require("./modules/dashboard/dashboard.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/agencies', agency_routes_1.default);
router.use('/projects', project_routes_1.default);
router.use('/alerts', alert_routes_1.default);
router.use('/reports', report_routes_1.default);
router.use('/dashboard', dashboard_routes_1.default);
router.use('/funds', fund_routes_1.default); // Global funds route
router.use('/inspections', inspection_routes_1.default); // Global inspections route
router.use('/documents', document_routes_1.default); // Global documents route
router.use('/milestones', milestone_routes_1.default); // Global milestones route
// Nested routes for project sub-resources
router.use('/projects/:id/milestones', milestone_routes_1.default);
router.use('/projects/:id/funds', fund_routes_1.default);
router.use('/projects/:id/inspections', inspection_routes_1.default);
router.use('/projects/:id/documents', document_routes_1.default);
exports.default = router;
