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
exports.deleteMilestone = exports.updateMilestone = exports.getMilestones = exports.createMilestone = void 0;
const milestoneService = __importStar(require("./milestone.service"));
const response_1 = require("../../utils/response");
const createMilestone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // FRONTEND → BACKEND FLOW
    // MilestonesTab.tsx → POST /projects/:id/milestones → milestone.controller.createMilestone → milestone.service.createMilestone
    try {
        const milestone = yield milestoneService.createMilestone(req.params.id, req.body);
        (0, response_1.successResponse)(res, milestone, 'Milestone created successfully', 201);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.createMilestone = createMilestone;
const getMilestones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = req.params.id;
        if (projectId) {
            const milestones = yield milestoneService.getMilestones(projectId);
            (0, response_1.successResponse)(res, milestones);
        }
        else {
            const milestones = yield milestoneService.getAllMilestones();
            (0, response_1.successResponse)(res, milestones);
        }
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.getMilestones = getMilestones;
const updateMilestone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const milestone = yield milestoneService.updateMilestone(req.params.id, req.params.mid, req.body);
        (0, response_1.successResponse)(res, milestone);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.updateMilestone = updateMilestone;
const deleteMilestone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield milestoneService.deleteMilestone(req.params.id, req.params.mid);
        (0, response_1.successResponse)(res, null, 'Milestone deleted successfully');
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.deleteMilestone = deleteMilestone;
