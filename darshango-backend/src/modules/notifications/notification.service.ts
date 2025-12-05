import { supabase } from '../../config/supabase';

export const createNotification = async (title: string, message: string, type: 'Info' | 'Warning' | 'Success' | 'Error', link?: string) => {
    const dbNotification = {
        title,
        message,
        type,
        link,
        is_read: false, // Global read status for simplicity in this MVP
        created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
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
};

export const getRecentNotifications = async (limit: number = 10) => {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Failed to fetch notifications", error);
        return [];
    }
    return data.map(mapNotification);
};

const mapNotification = (n: any) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    link: n.link,
    isRead: n.is_read,
    createdAt: n.created_at
});
