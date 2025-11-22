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
exports.deleteDocument = exports.getDocuments = exports.uploadDocument = void 0;
const documentService = __importStar(require("./document.service"));
const upload_1 = require("../../storage/upload");
const response_1 = require("../../utils/response");
const uploadDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return (0, response_1.errorResponse)(res, 'No file uploaded', 400);
        }
        const publicUrl = yield (0, upload_1.uploadFileToStorage)(req.file, 'documents');
        const documentData = {
            title: req.body.title || req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size.toString(),
            url: publicUrl,
            uploadedBy: req.user.id,
            category: req.body.category,
            agencyId: req.body.agencyId,
            status: 'Verified' // Auto-verify for now, or 'Pending' if approval needed
        };
        const document = yield documentService.uploadDocument(req.params.id, documentData);
        (0, response_1.successResponse)(res, document, 'Document uploaded successfully', 201);
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.uploadDocument = uploadDocument;
const getDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = req.params.id;
        if (projectId) {
            const documents = yield documentService.getDocuments(projectId);
            (0, response_1.successResponse)(res, documents);
        }
        else {
            const documents = yield documentService.getAllDocuments();
            (0, response_1.successResponse)(res, documents);
        }
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.getDocuments = getDocuments;
const deleteDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield documentService.deleteDocument(req.params.id, req.params.docId);
        (0, response_1.successResponse)(res, null, 'Document deleted successfully');
    }
    catch (error) {
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.deleteDocument = deleteDocument;
