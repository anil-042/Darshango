import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User as UserIcon, Mail, Phone, Building2, Calendar, Shield, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState<User | null>(authUser);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!authUser?.id) {
                setIsLoading(false);
                return;
            }

            try {
                const userData = await api.users.getById(authUser.id);
                setUser(userData);
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    department: userData.department || '',
                });
            } catch (error) {
                console.error('Failed to fetch user details:', error);
                toast.error('Failed to load profile details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserDetails();
    }, [authUser]);

    const handleSave = async () => {
        if (!user?.id) return;

        try {
            await api.users.update(user.id, formData);
            setUser({ ...user, ...formData });
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            department: user?.department || '',
        });
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center h-64">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6">
                <p className="text-gray-500">User not found</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
                <p className="text-gray-500">Manage your account information</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <Avatar className="h-32 w-32">
                                <AvatarImage
                                    src={`https://ui-avatars.com/api/?name=${user.name || 'User'}&background=0D8ABC&color=fff&size=256`}
                                />
                                <AvatarFallback className="text-4xl">{user.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h2 className="text-xl font-semibold">{user.name}</h2>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="text-sm">
                                    {user.role === 'AgencyAdmin' ? 'Agency Manager' : user.role}
                                </Badge>
                                <Badge className={
                                    user.status === 'Active' ? 'bg-green-100 text-green-700' :
                                        user.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                }>
                                    {user.status}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Details Card */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Profile Information</CardTitle>
                            {!isEditing ? (
                                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button onClick={handleSave} size="sm">
                                        <Save className="w-4 h-4 mr-2" />
                                        Save
                                    </Button>
                                    <Button onClick={handleCancel} variant="outline" size="sm">
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2 text-gray-700">
                                    <UserIcon className="w-4 h-4" />
                                    Full Name
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-gray-900 font-medium">{user.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2 text-gray-700">
                                    <Mail className="w-4 h-4" />
                                    Email Address
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-gray-900 font-medium">{user.email}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-2 text-gray-700">
                                    <Phone className="w-4 h-4" />
                                    Phone Number
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Enter phone number"
                                    />
                                ) : (
                                    <p className="text-gray-900 font-medium">{user.phone || 'Not provided'}</p>
                                )}
                            </div>

                            {/* Department */}
                            <div className="space-y-2">
                                <Label htmlFor="department" className="flex items-center gap-2 text-gray-700">
                                    <Building2 className="w-4 h-4" />
                                    Department
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="department"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        placeholder="Enter department"
                                    />
                                ) : (
                                    <p className="text-gray-900 font-medium">{user.department || 'Not provided'}</p>
                                )}
                            </div>

                            {/* Role (Read-only) */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-gray-700">
                                    <Shield className="w-4 h-4" />
                                    Role
                                </Label>
                                <p className="text-gray-900 font-medium">
                                    {user.role === 'AgencyAdmin' ? 'Agency Manager' : user.role}
                                </p>
                            </div>

                            {/* Member Since (Read-only) */}
                            {user.createdAt && (
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-700">
                                        <Calendar className="w-4 h-4" />
                                        Member Since
                                    </Label>
                                    <p className="text-gray-900 font-medium">
                                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Additional Info */}
                        {(user.state || user.district) && (
                            <div className="pt-4 border-t">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Location Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {user.state && (
                                        <div>
                                            <p className="text-sm text-gray-500">State</p>
                                            <p className="text-gray-900 font-medium">{user.state}</p>
                                        </div>
                                    )}
                                    {user.district && (
                                        <div>
                                            <p className="text-sm text-gray-500">District</p>
                                            <p className="text-gray-900 font-medium">{user.district}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
