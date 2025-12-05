import { supabase } from '../../config/supabase';
import { createNotification } from '../notifications/notification.service';

export const createAlert = async (alertData: any) => {
    const dbAlert: any = {
        type: alertData.type,
        project_id: alertData.projectId,
        priority: alertData.priority,
        description: alertData.description,
        status: alertData.status || 'Open',
        date: alertData.date || new Date().toISOString(),
        alert_id: alertData.id || alertData.customId, // Save Custom ID to new column
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('alerts')
        .insert([dbAlert])
        .select()
        .single();

    if (error) throw new Error(error.message);

    // Normalize priority for check
    const prio = (alertData.priority || 'Low').toString().toLowerCase();

    console.log(`[AlertService] Creating Alert. Input Priority: ${alertData.priority}, Normalized: ${prio}`);

    // Trigger Notification for Important Alerts
    if (prio === 'high' || prio === 'medium' || alertData.priority === 'High' || alertData.priority === 'Medium') {
        console.log("[AlertService] Priority threshold met. Attempting to create notification...");
        try {
            await createNotification(
                `New Alert: ${alertData.type}`,
                alertData.description || 'New alert created',
                (prio === 'high' || alertData.priority === 'High') ? 'Error' : 'Warning',
                `/alerts`
            );
        } catch (notifError) {
            console.error("Failed to send alert notification:", notifError);
        }
    }

    return mapAlert(data);
};

export const getAlerts = async (filters: any = {}) => {
    let query = supabase.from('alerts').select('*');

    if (filters.projectId) {
        query = query.eq('project_id', filters.projectId);
    }
    if (filters.status) {
        query = query.eq('status', filters.status);
    }
    if (filters.priority) {
        query = query.eq('priority', filters.priority);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data.map(mapAlert);
};

export const updateAlert = async (id: string, updateData: any) => {
    const dbUpdate: any = {
        updated_at: new Date().toISOString()
    };

    if (updateData.type) dbUpdate.type = updateData.type;
    if (updateData.projectId) dbUpdate.project_id = updateData.projectId;
    if (updateData.priority) dbUpdate.priority = updateData.priority;
    if (updateData.description) dbUpdate.description = updateData.description;
    if (updateData.status) dbUpdate.status = updateData.status;
    if (updateData.date) dbUpdate.date = updateData.date;

    const { data, error } = await supabase
        .from('alerts')
        .update(dbUpdate)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return mapAlert(data);
};

export const createAutoAlert = async (type: string, projectId: string, description: string, priority: 'High' | 'Medium' | 'Low') => {
    // Check if similar open alert exists to avoid duplicates
    const { data: existing } = await supabase
        .from('alerts')
        .select('id')
        .eq('project_id', projectId)
        .eq('type', type)
        .in('status', ['Open', 'New', 'In Progress']);

    if (existing && existing.length > 0) return;



    await createAlert({
        type,
        projectId,
        description,
        priority,
        status: 'New',
        date: new Date().toISOString()
    });


};

const mapAlert = (a: any) => ({
    id: a.id,
    type: a.type,
    projectId: a.project_id,
    priority: a.priority,
    description: a.description,
    status: a.status,
    customId: a.alert_id, // Map DB column to frontend property
    date: a.date,
    createdAt: a.created_at,
    updatedAt: a.updated_at
});
