import { supabase } from '../../config/supabase';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (filters: any = {}) => {
    let query = supabase.from('users').select('*');

    if (filters.role) query = query.eq('role', filters.role);
    if (filters.agencyId) query = query.eq('agency_id', filters.agencyId);
    if (filters.state) query = query.eq('state', filters.state);
    if (filters.district) query = query.eq('district', filters.district);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    // Map snake_case to camelCase
    return data.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        agencyId: user.agency_id,
        state: user.state,
        district: user.district,
        status: user.status,
        createdAt: user.created_at
    }));
};

export const getUserById = async (id: string) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;

    return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        agencyId: data.agency_id,
        state: data.state,
        district: data.district,
        status: data.status,
        createdAt: data.created_at
    };
};

export const createUser = async (userData: any) => {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    const userDoc = {
        name: userData.name,
        email: userData.email,
        password_hash: passwordHash,
        role: userData.role,
        status: userData.status || 'Active',
        agency_id: userData.agencyId || null,
        state: userData.state || null,
        district: userData.district || null,
        created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from('users')
        .insert([userDoc])
        .select()
        .single();

    if (error) throw new Error(error.message);

    return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        agencyId: data.agency_id,
        state: data.state,
        district: data.district,
        status: data.status,
        createdAt: data.created_at
    };
};

export const updateUser = async (id: string, updateData: any) => {
    // Map camelCase to snake_case for DB update
    const dbUpdateData: any = {};
    if (updateData.name) dbUpdateData.name = updateData.name;
    if (updateData.role) dbUpdateData.role = updateData.role;
    if (updateData.status) dbUpdateData.status = updateData.status;
    if (updateData.agencyId) dbUpdateData.agency_id = updateData.agencyId;
    if (updateData.state) dbUpdateData.state = updateData.state;
    if (updateData.district) dbUpdateData.district = updateData.district;

    // If password update is needed, it should be hashed, but keeping it simple for now as per original

    const { error } = await supabase
        .from('users')
        .update(dbUpdateData)
        .eq('id', id);

    if (error) throw new Error(error.message);
    return getUserById(id);
};

export const deleteUser = async (id: string) => {
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
};
