import { supabase } from '../../config/supabase';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { signToken } from '../../utils/jwt';
import { sendVerificationEmail } from '../../utils/email';

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

    // Generate 6-digit OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

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
        verification_code: verificationCode,
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

    // Send verification email
    await sendVerificationEmail(newUser.email, verificationCode);

    const { password_hash, verification_code, ...userWithoutPassword } = data;
    return { id: data.id, ...userWithoutPassword };
};

export const verifyEmail = async (email: string, code: string) => {
    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

    if (error) throw new Error(error.message);
    if (!users || users.length === 0) {
        throw new Error('User not found');
    }

    const user = users[0];

    if (user.verification_code !== code) {
        throw new Error('Invalid verification code');
    }

    // Update user status and clear code
    // Set to 'PendingApproval' so Admin must approve it before login
    const { error: updateError } = await supabase
        .from('users')
        .update({ status: 'PendingApproval', verification_code: null })
        .eq('id', user.id);

    if (updateError) throw new Error(updateError.message);

    return { message: 'Email verified successfully' };
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

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginWithGoogle = async (token: string) => {
    // Try to verify as ID Token first (if frontend sends ID Token)
    let email, name;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        email = payload?.email;
        name = payload?.name;
    } catch (e: any) {
        console.log('ID Token verification failed, trying Access Token:', e.message);
        // If ID Token verification fails, try as Access Token
        try {
            const tokenInfo = await client.getTokenInfo(token);
            email = tokenInfo.email;

            if (!email) throw new Error('Invalid token');

            // Fetch user profile for name
            const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
            const { data } = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            name = data.name;

        } catch (err: any) {
            console.log('Access Token verification failed:', err.message);
            throw new Error('Invalid Google token');
        }
    }

    if (!email) {
        throw new Error('Invalid Google token');
    }

    // Check if user exists
    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

    if (error) throw new Error(error.message);

    let user;

    if (users && users.length > 0) {
        user = users[0];
        // Optional: Update user info if needed, e.g. profile picture
    } else {
        // Create new user
        const newUser = {
            email: email,
            password_hash: '', // No password for Google users
            name: name || 'Google User',
            role: 'Viewer', // Default role
            status: 'Active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data, error: createError } = await supabase
            .from('users')
            .insert([newUser])
            .select()
            .single();

        if (createError) throw new Error(createError.message);
        user = data;
    }

    if (user.status !== 'Active') {
        throw new Error('Account is not active');
    }

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
