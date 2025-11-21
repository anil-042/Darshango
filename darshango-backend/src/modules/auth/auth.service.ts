import { db } from '../../config/firebase';
import bcrypt from 'bcryptjs';
import { signToken } from '../../utils/jwt';

export const registerUser = async (userData: any) => {
    // BACKEND → FIRESTORE FLOW
    // Check if user exists
    const userQuery = await db.collection('users').where('email', '==', userData.email).get();
    if (!userQuery.empty) {
        throw new Error('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(userData.password, salt);

    const newUser = {
        ...userData,
        passwordHash,
        createdAt: new Date().toISOString(),
        role: userData.role || 'Viewer',
        status: 'Pending', // Default status
    };

    delete newUser.password; // Remove plain password

    // Create user in Firestore
    const docRef = await db.collection('users').add(newUser);

    return { id: docRef.id, ...newUser };
};

export const loginUser = async (email: string, password: string) => {
    // BACKEND → FIRESTORE FLOW
    const userQuery = await db.collection('users').where('email', '==', email).get();

    if (userQuery.empty) {
        throw new Error('Invalid credentials');
    }

    const userDoc = userQuery.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() } as any;

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    if (user.status !== 'Active') {
        throw new Error('Account is not active');
    }

    return user;
};
