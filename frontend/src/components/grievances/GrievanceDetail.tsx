import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { Grievance, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
    ArrowLeft, Send, Clock, CheckCircle2,
    AlertCircle, User as UserIcon, Building, MapPin,
    History, RotateCcw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';

export function GrievanceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, hasPermission } = useAuth();
    const [grievance, setGrievance] = useState<Grievance | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [resolution, setResolution] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchGrievance(id);
            fetchUsers();
        }
    }, [id]);

    const fetchGrievance = async (gId: string) => {
        setIsLoading(true);
        try {
            const data = await api.grievances.getById(gId);
            setGrievance(data);
            if (data.resolution) setResolution(data.resolution);
        } catch (error) {
            console.error('Failed to fetch grievance', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await api.users.getAll();
            // Filter users: allowed types for assignment
            const relevantRoles = ['Admin', 'StateNodalOfficer', 'DistrictOfficer', 'AgencyAdmin'];
            setUsers(data.filter(u => relevantRoles.includes(u.role)));
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const handleAssign = async (userId: string) => {
        if (!grievance) return;
        try {
            await api.grievances.update(grievance.id, {
                assignedTo: userId,
                status: 'Assigned'
            });
            toast.success('Assigned successfully');
            fetchGrievance(grievance.id);
        } catch (error) {
            console.error(error);
            toast.error('Failed to assign');
        }
    };

    const handleStatusUpdate = async (status: any) => {
        if (!grievance) return;

        // Workflow Validation
        if (grievance.status === 'Closed' && status !== 'Reopened') {
            toast.error('Closed grievances can only be Reopened');
            return;
        }

        try {
            await api.grievances.update(grievance.id, { status });
            toast.success(`Status updated to ${status}`);
            fetchGrievance(grievance.id);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update status');
        }
    };

    const submitResolution = async () => {
        if (!grievance) return;
        try {
            await api.grievances.update(grievance.id, {
                resolution,
                status: 'Resolution Submitted'
            });
            toast.success('Resolution submitted');
            fetchGrievance(grievance.id);
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit resolution');
        }
    };

    if (isLoading) return <div className="p-8 flex items-center justify-center">Loading...</div>;
    if (!grievance) return <div className="p-8">Grievance not found</div>;

    const isAssignedToMe = user?.id === grievance.assignedTo;
    const canManage = hasPermission('Grievances', 'Edit') || user?.role === 'Admin';

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate('/grievances')} className="pl-0 hover:bg-transparent hover:text-blue-600">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Redressal
                </Button>
                <div className="flex gap-2">
                    {grievance.status === 'Closed' && (
                        <Button variant="outline" onClick={() => handleStatusUpdate('Reopened')}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reopen Grievance
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: Details & Resolution (8 Cols) */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="h-full border-gray-200 shadow-sm">
                        <CardHeader className="bg-gray-50/50 border-b pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                                        {grievance.category || 'General Grievance'}
                                    </h1>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">#{grievance.id.slice(0, 8).toUpperCase()}</span>
                                        <span>•</span>
                                        <span>{new Date(grievance.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <Badge className={grievance.priority === 'High' ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500'}>
                                        {grievance.priority} Priority
                                    </Badge>
                                    <span className="text-xs text-gray-500 font-medium">
                                        Created by <span className="text-gray-900">{grievance.creatorName || grievance.source || 'Unknown'}</span>
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Description</h3>
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{grievance.description}</p>
                            </div>

                            {(isAssignedToMe || canManage) && (
                                <>
                                    <Separator />
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Resolution</h3>
                                        <div className="space-y-3">
                                            <Textarea
                                                value={resolution}
                                                onChange={(e) => setResolution(e.target.value)}
                                                placeholder="Provide detailed resolution remarks..."
                                                className="min-h-[120px]"
                                            />
                                            <div className="flex justify-end">
                                                <Button onClick={submitResolution} className="bg-green-600 hover:bg-green-700 border border-green-800 shadow-sm text-black">
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}




                        </CardContent>
                    </Card>
                </div>

                {/* Middle Column: Status & Assignment (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-base font-semibold">Workflow Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">

                            {/* Current Status */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Current Status</label>
                                <Select
                                    onValueChange={handleStatusUpdate}
                                    value={grievance.status}
                                    disabled={!canManage && !isAssignedToMe}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending" disabled>Pending</SelectItem>
                                        <SelectItem value="Assigned">Assigned</SelectItem>
                                        <SelectItem value="In Review">In Review</SelectItem>
                                        <SelectItem value="Resolution Submitted">Resolution Submitted</SelectItem>
                                        {canManage && <SelectItem value="Closed">Closed</SelectItem>}
                                        {canManage && <SelectItem value="Rejected">Rejected</SelectItem>}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Assignment */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Assigned Officer</label>
                                <Select
                                    onValueChange={handleAssign}
                                    value={grievance.assignedTo || ''}
                                    disabled={!canManage}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Unassigned" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map(u => (
                                            <SelectItem key={u.id} value={u.id}>
                                                <div className="flex flex-col text-left">
                                                    <span className="font-medium">{u.name}</span>
                                                    <span className="text-xs text-gray-500">{u.role}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Verification Info */}
                            {grievance.verifiedBy && (
                                <div className="bg-green-50 border border-green-100 p-4 rounded-lg flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-green-800">Verified & Closed</p>
                                        <p className="text-xs text-green-600 mt-1">
                                            By Admin on {new Date(grievance.verifiedAt!).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* SLA Status */}
                            <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-orange-900">SLA Status</span>
                                    <Badge variant="outline" className="border-orange-200 bg-white text-orange-700">
                                        {grievance.slaStatus || 'On Track'}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-orange-700">
                                    <Clock className="w-4 h-4" />
                                    <span>Due by {new Date(grievance.slaDueDate || Date.now()).toLocaleDateString()}</span>
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* Linked Alerts Section (Mock) */}
                    {['Project Delay', 'Fund Misuse'].includes(grievance.type || '') && (
                        <Card className="border-red-200 bg-red-50/30">
                            <CardHeader className="py-3">
                                <CardTitle className="text-sm font-semibold flex items-center text-red-700">
                                    <AlertCircle className="w-4 h-4 mr-2" /> Linked Alerts
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="py-3">
                                <p className="text-xs text-gray-600">
                                    A system alert was automatically triggered for this high-severity grievance.
                                </p>
                                <Button variant="link" className="text-red-600 h-auto p-0 text-xs mt-2">View Alert Details</Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

            </div>
        </div>
    );
}
