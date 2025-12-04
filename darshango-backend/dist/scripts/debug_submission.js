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
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:5001/api/v1';
const debug = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('1. Logging in...');
        // Assuming we have a seeded admin or we can create one. 
        // Let's try to login with default admin credentials if known, or create a user first.
        // Since I don't know the password for existing users, I'll try to signup a new test admin.
        const email = 'admin@darshango.com';
        const password = 'admin123';
        let token = '';
        try {
            yield axios_1.default.post(`${API_URL}/auth/signup`, {
                fullName: 'Debug Admin',
                email,
                password,
                role: 'Admin'
            });
            console.log('   Signup successful.');
        }
        catch (e) {
            console.log('   Signup failed (maybe user exists), trying login...');
        }
        const loginRes = yield axios_1.default.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        token = loginRes.data.token;
        console.log('   Login successful. Token obtained.');
        const headers = { Authorization: `Bearer ${token}` };
        console.log('2. Fetching Agencies...');
        const agenciesRes = yield axios_1.default.get(`${API_URL}/agencies`, { headers });
        const agencies = agenciesRes.data.data;
        console.log(`   Fetched ${agencies.length} agencies.`);
        if (agencies.length === 0) {
            console.log('   Creating a test agency...');
            const newAgencyRes = yield axios_1.default.post(`${API_URL}/agencies`, {
                name: 'Test Agency',
                code: 'TA001',
                type: 'NGO',
                role: 'Implementing',
                state: 'Test State',
                district: 'Test District',
                contactPerson: 'Test Person',
                phone: '1234567890',
                email: 'test@agency.com',
                address: 'Test Address',
                componentsHandled: ['Adarsh Gram'],
                assignedProjects: [],
                activeProjects: 0,
                performance: 0,
                lastUpdated: new Date().toISOString()
            }, { headers });
            agencies.push(newAgencyRes.data.data);
            console.log('   Test Agency created.');
        }
        const agencyId = agencies[0].id;
        console.log(`   Using Agency ID: ${agencyId}`);
        console.log('3. Creating Project...');
        const projectData = {
            title: 'Debug Project',
            component: 'Adarsh Gram',
            implementingAgencyId: agencyId,
            executingAgencyId: agencyId,
            state: 'Test State',
            district: 'Test District',
            startDate: '2023-01-01',
            endDate: '2023-12-31',
            status: 'In Progress',
            estimatedCost: 100000,
            progress: 0,
            location: { lat: 0, lng: 0 },
            tags: ['debug'],
            description: 'Debug project description'
        };
        const projectRes = yield axios_1.default.post(`${API_URL}/projects`, projectData, { headers });
        console.log('   Project created successfully:', projectRes.data.data.id);
    }
    catch (error) {
        console.error('ERROR OCCURRED:');
        console.error('Message:', error.message);
        console.error('Code:', error.code);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
        else {
            console.error('Stack:', error.stack);
        }
    }
});
debug();
