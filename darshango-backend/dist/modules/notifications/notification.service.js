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
exports.getRecentNotifications = exports.createNotification = void 0;
const supabase_1 = require("../../config/supabase");
const createNotification = (title, message, type, link) => __awaiter(void 0, void 0, void 0, function* () {
    const dbNotification = {
        title,
        message,
        type,
        link,
        is_read: false, // Global read status for simplicity in this MVP
        created_at: new Date().toISOString()
    };
    const { data, error } = yield supabase_1.supabase
        .from('notifications')
        .insert([dbNotification])
        .select()
        .single();
    if (error) {
        console.error("!!! NOTIFICATION CREATION FAILED !!!");
        console.dir(error, { depth: null });
        // Fallback: If table doesn't exist, log it. In a real app, we'd ensure migration.
        return null;
    }
    return mapNotification(data);
});
exports.createNotification = createNotification;
const getRecentNotifications = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 10) {
    const { data, error } = yield supabase_1.supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error) {
        console.error("Failed to fetch notifications", error);
        return [];
    }
    return data.map(mapNotification);
});
exports.getRecentNotifications = getRecentNotifications;
const mapNotification = (n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    link: n.link,
    isRead: n.is_read,
    createdAt: n.created_at
});
