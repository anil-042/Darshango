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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatController = void 0;
const axios_1 = __importDefault(require("axios"));
exports.chatController = {
    sendMessage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { chatInput } = req.body;
            if (!chatInput) {
                return res.status(400).json({ error: 'chatInput is required' });
            }
            const n8nUrl = 'https://sjaffer9019.app.n8n.cloud/webhook/62cec866-a049-43be-91ee-8a6e7bfdafe5/chat';
            // Generate a session ID (simple random string) to maintain context if supported
            const sessionId = req.body.sessionId || `session-${Math.random().toString(36).substring(7)}`;
            const response = yield axios_1.default.post(n8nUrl, {
                chatInput,
                sessionId
            });
            return res.status(200).json(response.data);
        }
        catch (error) {
            console.error('Error in chat proxy:', error.message);
            let errorResponse = {
                error: 'Failed to communicate with chat assistant',
                details: error.message
            };
            if (axios_1.default.isAxiosError(error) && error.response) {
                console.error('n8n response status:', error.response.status);
                console.error('n8n response data:', JSON.stringify(error.response.data));
                // Pass the n8n error back to the frontend if it's an object
                if (typeof error.response.data === 'object') {
                    errorResponse = Object.assign(Object.assign({}, errorResponse), { n8nError: error.response.data });
                }
                else {
                    errorResponse.n8nError = error.response.data;
                }
            }
            return res.status(500).json(errorResponse);
        }
    })
};
