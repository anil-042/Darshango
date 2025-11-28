import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load env from the root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('--- Seeding Admin User ---');
console.log('Reading .env from:', path.resolve(__dirname, '../../.env'));
console.log('SUPABASE_URL found:', !!supabaseUrl);
console.log('SUPABASE_SERVICE_ROLE_KEY found:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL ERROR: Missing Supabase credentials in .env file.');
    console.error('Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const seedAdmin = async () => {
    const email = 'admin@darshango.com';
    const password = 'admin123'; // Default password
    const name = 'Admin User';

    try {
        console.log(`Checking if user ${email} exists...`);
        // Check if admin exists
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
            console.error('Error checking existing user:', fetchError.message);
            return;
        }

        if (existingUser) {
            console.log('Admin user already exists in the database.');
            console.log('User ID:', existingUser.id);
            return;
        }

        console.log('User not found. Creating new admin user...');

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = {
            name,
            email,
            password_hash: passwordHash,
            role: 'Admin',
            status: 'Active',
            created_at: new Date().toISOString(),
        };

        const { data: createdUser, error: insertError } = await supabase
            .from('users')
            .insert([newUser])
            .select()
            .single();

        if (insertError) {
            console.error('Error inserting admin user:', insertError.message);
            console.error('Details:', insertError);
            throw new Error(insertError.message);
        }

        console.log(`Admin user created successfully!`);
        console.log(`ID: ${createdUser.id}`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

    } catch (error: any) {
        console.error('Unexpected error seeding admin:', error.message || error);
    }
};

seedAdmin().then(() => process.exit(0));
