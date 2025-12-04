import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(__dirname, '../../data/permissions.json');

export const getPermissions = async () => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty object or default
        return {};
    }
};

export const updatePermissions = async (permissions: any) => {
    await fs.writeFile(DATA_FILE, JSON.stringify(permissions, null, 2));
    return permissions;
};
