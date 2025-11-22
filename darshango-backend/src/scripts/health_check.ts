import axios from 'axios';

const API_URL = 'http://localhost:5000';

const check = async () => {
    try {
        console.log('Checking server health...');
        const res = await axios.get(API_URL);
        console.log('Server is UP. Status:', res.status);
        console.log('Response:', res.data);
    } catch (error: any) {
        console.error('Server check failed:', error.message);
        if (error.code) console.error('Code:', error.code);
    }
};

check();
