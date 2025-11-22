"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.deleteProject = exports.updateProject = exports.getProject = exports.getProjects = exports.createProject = void 0;
const projectService = __importStar(require("./project.service"));
const response_1 = require("../../utils/response");
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // FRONTEND → BACKEND FLOW
    // ProjectManagement.tsx → POST /projects → project.controller.createProject → project.service.createProject
    try {
        const project = yield projectService.createProject(req.body);
        (0, response_1.successResponse)(res, project, 'Project created successfully', 201);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.createProject = createProject;
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // FRONTEND → BACKEND FLOW
    // ProjectManagement.tsx → GET /projects → project.controller.getProjects → project.service.getAllProjects
    try {
        const filters = req.query;
        const projects = yield projectService.getAllProjects(filters);
        (0, response_1.successResponse)(res, projects, 'Projects fetched successfully');
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message, 500);
    }
});
exports.getProjects = getProjects;
const getProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield projectService.getProjectById(req.params.id);
        if (!project)
            return (0, response_1.errorResponse)(res, 'Project not found', 404);
        (0, response_1.successResponse)(res, project);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.getProject = getProject;
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield projectService.updateProject(req.params.id, req.body);
        (0, response_1.successResponse)(res, project);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.updateProject = updateProject;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield projectService.deleteProject(req.params.id);
        (0, response_1.successResponse)(res, null, 'Project deleted successfully');
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.deleteProject = deleteProject;
