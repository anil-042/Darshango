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
exports.updateAlert = exports.getAlerts = exports.createAlert = void 0;
const alertService = __importStar(require("./alert.service"));
const response_1 = require("../../utils/response");
const createAlert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const alert = yield alertService.createAlert(req.body);
        return (0, response_1.successResponse)(res, alert, 'Alert created successfully', 201);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message, 500);
    }
});
exports.createAlert = createAlert;
const getAlerts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = {
            projectId: req.query.projectId,
            status: req.query.status,
            priority: req.query.priority
        };
        const alerts = yield alertService.getAlerts(filters);
        return (0, response_1.successResponse)(res, alerts, 'Alerts fetched successfully');
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message, 500);
    }
});
exports.getAlerts = getAlerts;
const updateAlert = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedAlert = yield alertService.updateAlert(req.params.id, req.body);
        return (0, response_1.successResponse)(res, updatedAlert, 'Alert updated successfully');
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, error.message, 500);
    }
});
exports.updateAlert = updateAlert;
