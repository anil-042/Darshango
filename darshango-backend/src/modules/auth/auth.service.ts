import { supabase } from '../../config/supabase';
import bcrypt from 'bcryptjs';
import { signToken } from '../../utils/jwt';

export const registerUser = async (userData: any) => {
    // Check if user exists
    const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email);

    if (checkError) throw new Error(checkError.message);
    if (existingUsers && existingUsers.length > 0) {
        throw new Error('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    const newUser = {
        email: userData.email,
        password_hash: passwordHash,
        name: userData.fullName || userData.name, // Handle both naming conventions
        role: userData.role || 'Viewer',
        agency_id: userData.agencyId || null,
        state: userData.state || null,
        district: userData.district || null,
        phone: userData.phone || null,
        designation: userData.designation || null,
        status: 'Pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    // Create user in Supabase
    const { data, error } = await supabase
        .from('users')
        .insert([newUser])
        .select()
        .single();

    if (error) throw new Error(error.message);

    const { password_hash, ...userWithoutPassword } = data;
    return { id: data.id, ...userWithoutPassword };
};

export const loginUser = async (email: string, password: string) => {
    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

    if (error) throw new Error(error.message);
    if (!users || users.length === 0) {
        throw new Error('Invalid credentials');
    }

    const user = users[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    if (user.status !== 'Active') {
        throw new Error('Account is not active');
    }

    // Map back to camelCase for frontend compatibility if needed, 
    // but for now returning the raw DB object + id. 
    // Ideally we should transform it.
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        agencyId: user.agency_id,
        state: user.state,
        district: user.district,
        status: user.status
    };
};
