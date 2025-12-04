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
exports.getMeetingHistory = exports.createMeeting = void 0;
const supabase_1 = require("../../config/supabase");
const createMeeting = (meeting) => __awaiter(void 0, void 0, void 0, function* () {
    const dbMeeting = {
        host_id: meeting.hostId,
        host_name: meeting.hostName,
        meeting_with: meeting.meetingWith,
        meeting_id: meeting.meetingId,
        timestamp: meeting.timestamp,
        created_at: new Date().toISOString()
    };
    const { data, error } = yield supabase_1.supabase
        .from('meetings')
        .insert([dbMeeting])
        .select()
        .single();
    if (error)
        throw new Error(error.message);
    return mapMeeting(data);
});
exports.createMeeting = createMeeting;
const getMeetingHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // In a real app, we might filter by userId. For now, we'll fetch all.
    const { data, error } = yield supabase_1.supabase
        .from('meetings')
        .select('*')
        .order('created_at', { ascending: false });
    if (error)
        throw new Error(error.message);
    return data.map(mapMeeting);
});
exports.getMeetingHistory = getMeetingHistory;
const mapMeeting = (m) => ({
    id: m.id,
    hostId: m.host_id,
    hostName: m.host_name,
    meetingWith: m.meeting_with,
    meetingId: m.meeting_id,
    timestamp: m.timestamp,
    createdAt: m.created_at
});
