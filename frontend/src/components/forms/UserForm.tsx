import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { UserRole } from '../../types';

interface UserFormProps {
    onSubmit: (userData: any) => void;
    isLoading?: boolean;
}

export function UserForm({ onSubmit, isLoading }: UserFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Viewer' as UserRole,
        password: 'password123'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        // Reset form after submit if needed, or let parent handle unmount
        setFormData({
            name: '',
            email: '',
            role: 'Viewer' as UserRole,
            password: 'password123'
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="John Doe"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="john@example.com"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select
                    value={formData.role}
                    onValueChange={(val: string) => setFormData({ ...formData, role: val as UserRole })}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="StateNodalOfficer">State Nodal Officer</SelectItem>
                        <SelectItem value="DistrictOfficer">District Officer</SelectItem>
                        <SelectItem value="AgencyAdmin">Agency Admin</SelectItem>
                        <SelectItem value="Inspector">Inspector</SelectItem>
                        <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Default Password</label>
                <Input
                    value={formData.password}
                    readOnly
                    className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">User can change this after first login</p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create User'}
            </Button>
        </form>
    );
}
