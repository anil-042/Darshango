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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectMessages = exports.createMessage = void 0;
const supabase_1 = require("../../config/supabase");
const createMessage = (projectId, message) => __awaiter(void 0, void 0, void 0, function* () {
    const dbMessage = {
        project_id: projectId,
        sender_id: message.senderId,
        sender_name: message.senderName,
        content: message.content,
        created_at: new Date().toISOString()
    };
    const { data, error } = yield supabase_1.supabase
        .from('messages')
        .insert([dbMessage])
        .select()
        .single();
    if (error)
        throw new Error(error.message);
    return {
        id: data.id,
        senderId: data.sender_id,
        senderName: data.sender_name,
        content: data.content,
        createdAt: data.created_at,
        timestamp: data.created_at, // Map timestamp to createdAt for compatibility
        projectId: data.project_id
    };
});
exports.createMessage = createMessage;
const getProjectMessages = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield supabase_1.supabase
        .from('messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });
    if (error)
        throw new Error(error.message);
    return data.map((m) => ({
        id: m.id,
        senderId: m.sender_id,
        senderName: m.sender_name,
        content: m.content,
        createdAt: m.created_at,
        timestamp: m.created_at, // Map timestamp to createdAt for compatibility
        projectId: m.project_id
    }));
});
exports.getProjectMessages = getProjectMessages;
