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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load env from the root directory
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
console.log('--- Seeding Admin User ---');
console.log('Reading .env from:', path_1.default.resolve(__dirname, '../../.env'));
console.log('SUPABASE_URL found:', !!supabaseUrl);
console.log('SUPABASE_SERVICE_ROLE_KEY found:', !!supabaseKey);
if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL ERROR: Missing Supabase credentials in .env file.');
    console.error('Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
    process.exit(1);
}
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const email = 'admin@darshango.com';
    const password = 'admin123'; // Default password
    const name = 'Admin User';
    try {
        console.log(`Checking if user ${email} exists...`);
        // Check if admin exists
        const { data: existingUser, error: fetchError } = yield supabase
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
        const salt = yield bcryptjs_1.default.genSalt(10);
        const passwordHash = yield bcryptjs_1.default.hash(password, salt);
        const newUser = {
            name,
            email,
            password_hash: passwordHash,
            role: 'Admin',
            status: 'Active',
            created_at: new Date().toISOString(),
        };
        const { data: createdUser, error: insertError } = yield supabase
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
    }
    catch (error) {
        console.error('Unexpected error seeding admin:', error.message || error);
    }
});
seedAdmin().then(() => process.exit(0));
