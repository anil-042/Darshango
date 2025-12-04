import { createUser } from '../modules/users/user.service';

const createAdmin = async () => {
    try {
        console.log('Creating admin user...');
        const adminData = {
            name: 'Admin User',
            email: 'admin@pmajay.com',
            password: 'admin123',
            role: 'Admin',
            status: 'Active'
        };

        const user = await createUser(adminData);
        console.log('Admin user created successfully:', user);
    } catch (error: any) {
        console.error('Failed to create admin user:', error.message);
    }
};

createAdmin();
