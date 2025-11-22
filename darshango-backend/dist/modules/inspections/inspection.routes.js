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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inspectionController = __importStar(require("./inspection.controller"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const roleMiddleware_1 = require("../../middleware/roleMiddleware");
const validators_1 = require("../../utils/validators");
const router = (0, express_1.Router)({ mergeParams: true });
router.use(authMiddleware_1.protect);
router.post('/', (0, roleMiddleware_1.authorize)('Admin', 'StateNodalOfficer', 'Inspector'), (0, validators_1.validate)(validators_1.inspectionSchema), inspectionController.createInspection);
router.get('/', inspectionController.getInspections);
router.put('/:iid', (0, roleMiddleware_1.authorize)('Admin', 'Inspector'), inspectionController.updateInspection);
router.delete('/:iid', (0, roleMiddleware_1.authorize)('Admin', 'Inspector'), inspectionController.deleteInspection);
exports.default = router;
