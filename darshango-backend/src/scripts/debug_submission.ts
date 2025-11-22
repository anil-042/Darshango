import axios from 'axios';

const API_URL = 'http://localhost:5001/api/v1';

const debug = async () => {
    try {
        console.log('1. Logging in...');
        // Assuming we have a seeded admin or we can create one. 
        // Let's try to login with default admin credentials if known, or create a user first.
        // Since I don't know the password for existing users, I'll try to signup a new test admin.
        const email = 'admin@darshango.com';
        const password = 'admin123';

        let token = '';

        try {
            await axios.post(`${API_URL}/auth/signup`, {
                fullName: 'Debug Admin',
                email,
                password,
                role: 'Admin'
            });
            console.log('   Signup successful.');
        } catch (e: any) {
            console.log('   Signup failed (maybe user exists), trying login...');
        }

        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        token = loginRes.data.token;
        console.log('   Login successful. Token obtained.');

        const headers = { Authorization: `Bearer ${token}` };

        console.log('2. Fetching Agencies...');
        const agenciesRes = await axios.get(`${API_URL}/agencies`, { headers });
        const agencies = agenciesRes.data.data;
        console.log(`   Fetched ${agencies.length} agencies.`);

        if (agencies.length === 0) {
            console.log('   Creating a test agency...');
            const newAgencyRes = await axios.post(`${API_URL}/agencies`, {
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

        const projectRes = await axios.post(`${API_URL}/projects`, projectData, { headers });
        console.log('   Project created successfully:', projectRes.data.data.id);

    } catch (error: any) {
        console.error('ERROR OCCURRED:');
        console.error('Message:', error.message);
        console.error('Code:', error.code);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Stack:', error.stack);
        }
    }
};

debug();
