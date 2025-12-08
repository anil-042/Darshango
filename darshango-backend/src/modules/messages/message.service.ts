import { supabase } from '../../config/supabase';
import { Message } from './message.model';

export const createMessage = async (projectId: string, message: Message): Promise<Message> => {
    const dbMessage = {
        project_id: projectId,
        sender_id: message.senderId,
        sender_name: message.senderName,
        content: message.content,
        created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('messages')
        .insert([dbMessage])
        .select()
        .single();

    if (error) {
        console.error("SUPABASE CREATE MESSAGE ERROR:", error);
        throw new Error(error.message);
    }

    return {
        id: data.id,
        senderId: data.sender_id,
        senderName: data.sender_name,
        content: data.content,
        createdAt: data.created_at,
        timestamp: data.created_at, // Map timestamp to createdAt for compatibility
        projectId: data.project_id
    };
};

export const getProjectMessages = async (projectId: string): Promise<Message[]> => {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);

    return data.map((m: any) => ({
        id: m.id,
        senderId: m.sender_id,
        senderName: m.sender_name,
        content: m.content,
        createdAt: m.created_at,
        timestamp: m.created_at, // Map timestamp to createdAt for compatibility
        projectId: m.project_id
    }));
};
