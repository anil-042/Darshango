import axios from 'axios';

const API_URL = 'http://localhost:5001/api/v1';

const debugLogin = async () => {
    try {
        console.log('Attempting login with CORS headers...');
        const res = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@darshango.com',
            password: 'admin123'
        }, {
            headers: {
                'Origin': 'http://localhost:3000', // Simulate frontend origin
                'Content-Type': 'application/json'
            }
        });

        console.log('Login Successful!');
        console.log('Status:', res.status);
        console.log('Token:', res.data.token ? 'Received' : 'Missing');

    } catch (error: any) {
        console.error('Login Failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
};

debugLogin();
