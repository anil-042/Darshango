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
exports.deleteAgency = exports.updateAgency = exports.getAgencies = exports.createAgency = void 0;
const agencyService = __importStar(require("./agency.service"));
const response_1 = require("../../utils/response");
const createAgency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // FRONTEND → BACKEND FLOW
    // AgencyRegistration.tsx → POST /agencies → agency.controller.createAgency → agency.service.createAgency
    try {
        const agency = yield agencyService.createAgency(req.body);
        (0, response_1.successResponse)(res, agency, 'Agency created successfully', 201);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.createAgency = createAgency;
const getAgencies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // FRONTEND → BACKEND FLOW
    // AgencyMapping.tsx → GET /agencies → agency.controller.getAgencies → agency.service.getAllAgencies
    try {
        const filters = req.query;
        const agencies = yield agencyService.getAllAgencies(filters);
        (0, response_1.successResponse)(res, agencies);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.getAgencies = getAgencies;
const updateAgency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agency = yield agencyService.updateAgency(req.params.id, req.body);
        (0, response_1.successResponse)(res, agency);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.updateAgency = updateAgency;
const deleteAgency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield agencyService.deleteAgency(req.params.id);
        (0, response_1.successResponse)(res, null, 'Agency deleted successfully');
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.deleteAgency = deleteAgency;
