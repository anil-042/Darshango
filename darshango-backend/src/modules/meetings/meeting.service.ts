import { supabase } from '../../config/supabase';
import { Meeting } from './meeting.model';

export const createMeeting = async (meeting: Meeting): Promise<Meeting> => {
    const dbMeeting = {
        host_id: meeting.hostId,
        host_name: meeting.hostName,
        meeting_with: meeting.meetingWith,
        meeting_id: meeting.meetingId,
        timestamp: meeting.timestamp,
        created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('meetings')
        .insert([dbMeeting])
        .select()
        .single();

    if (error) {
        console.error("SUPABASE CREATE MEETING ERROR:", error);
        throw new Error(error.message);
    }

    return mapMeeting(data);
};

export const getMeetingHistory = async (userId: string): Promise<Meeting[]> => {
    // In a real app, we might filter by userId. For now, we'll fetch all.
    const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data.map(mapMeeting);
};

const mapMeeting = (m: any) => ({
    id: m.id,
    hostId: m.host_id,
    hostName: m.host_name,
    meetingWith: m.meeting_with,
    meetingId: m.meeting_id,
    timestamp: m.timestamp,
    createdAt: m.created_at
});
