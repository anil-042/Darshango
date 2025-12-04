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
exports.getMessages = exports.createMessage = void 0;
const messageService = __importStar(require("./message.service"));
const response_1 = require("../../utils/response");
const upload_1 = require("../../storage/upload");
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const { content } = req.body;
        const file = req.file;
        if (!content && !file) {
            return (0, response_1.errorResponse)(res, 'Message content or file is required', 400);
        }
        let attachment = undefined;
        if (file) {
            const fileUrl = yield (0, upload_1.uploadFileToStorage)(file);
            attachment = {
                url: fileUrl,
                name: file.originalname,
                type: file.mimetype.startsWith('image/') ? 'image' : 'document'
            };
        }
        const messageData = {
            projectId,
            senderId: req.user.id,
            senderName: req.user.name || 'User',
            content: content || '', // Allow empty content if file is present
            attachment,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const message = yield messageService.createMessage(projectId, messageData);
        (0, response_1.successResponse)(res, message, 'Message sent successfully', 201);
    }
    catch (error) {
        console.error('Create message error:', error);
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.createMessage = createMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const messages = yield messageService.getProjectMessages(projectId);
        (0, response_1.successResponse)(res, messages);
    }
    catch (error) {
        console.error('Get messages error:', error);
        (0, response_1.errorResponse)(res, error.message);
    }
});
exports.getMessages = getMessages;
