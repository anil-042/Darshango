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
exports.deleteInspection = exports.updateInspection = exports.getInspections = exports.createInspection = void 0;
const inspectionService = __importStar(require("./inspection.service"));
const response_1 = require("../../utils/response");
const createInspection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // FRONTEND → BACKEND FLOW
    // InspectionsTab.tsx → POST /projects/:id/inspections → inspection.controller.createInspection → inspection.service.createInspection
    try {
        const inspection = yield inspectionService.createInspection(req.params.id, req.body);
        (0, response_1.successResponse)(res, inspection, 'Inspection scheduled successfully', 201);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.createInspection = createInspection;
const getInspections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = req.params.id;
        if (projectId) {
            const inspections = yield inspectionService.getInspections(projectId);
            (0, response_1.successResponse)(res, inspections);
        }
        else {
            // Global fetch
            const inspections = yield inspectionService.getAllInspections();
            (0, response_1.successResponse)(res, inspections);
        }
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.getInspections = getInspections;
const updateInspection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // If no projectId in params, we need it from body or find it.
        // For now, assuming nested route usage mostly.
        // If global update needed, we'd need to look up the project.
        const projectId = req.params.id || req.body.projectId;
        if (!projectId) {
            // Fallback: if we have a global update route, we might need to fetch the inspection first to get projectId
            // For MVP, let's require projectId in body if not in params
            return (0, response_1.errorResponse)(res, 'Project ID is required for update', 400);
        }
        const inspection = yield inspectionService.updateInspection(projectId, req.params.iid, req.body);
        (0, response_1.successResponse)(res, inspection);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.updateInspection = updateInspection;
const deleteInspection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield inspectionService.deleteInspection(req.params.id, req.params.iid);
        (0, response_1.successResponse)(res, null, 'Inspection deleted successfully');
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.deleteInspection = deleteInspection;
