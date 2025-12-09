import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { Grievance } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Plus, Search, Filter, Eye, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GrievanceSubmitModal } from './GrievanceSubmitModal';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function GrievanceList() {
    const [grievances, setGrievances] = useState<Grievance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const navigate = useNavigate();

    // Filters
    const [filters, setFilters] = useState({
        status: 'all',
        priority: 'all',
        type: 'all', // General or Project based filter logic can be complex, sticking to basic for now
        isGeneral: 'all' // 'true', 'false', 'all'
    });

    useEffect(() => {
        fetchGrievances();
    }, []);

    const fetchGrievances = async () => {
        setIsLoading(true);
        try {
            const data = await api.grievances.getAll();
            setGrievances(data);
        } catch (error) {
            console.error('Failed to fetch grievances', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this grievance?')) return;
        try {
            await api.grievances.delete(id);
            toast.success('Grievance deleted successfully');
            fetchGrievances();
        } catch (error) {
            console.error('Failed to delete grievance', error);
            toast.error('Failed to delete grievance');
        }
    };

    const filteredGrievances = grievances.filter(g => {
        const matchesSearch =
            g.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.category?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filters.status === 'all' || g.status === filters.status;
        const matchesPriority = filters.priority === 'all' || g.priority === filters.priority;
        const matchesGeneral = filters.isGeneral === 'all'
            ? true
            : filters.isGeneral === 'true' ? g.isGeneral : !g.isGeneral;

        return matchesSearch && matchesStatus && matchesPriority && matchesGeneral;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'In Review': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Resolution Submitted': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Closed': return 'bg-green-100 text-green-800 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
            case 'Reopened': return 'bg-pink-100 text-pink-800 border-pink-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getSlaBadge = (g: Grievance) => {
        if (g.status === 'Closed' || g.status === 'Rejected') return null;

        // Simple logic for demo
        if (g.slaStatus === 'Overdue') {
            return <Badge variant="destructive" className="ml-2 text-[10px] h-5"><AlertCircle className="w-3 h-3 mr-1" />Overdue</Badge>;
        }
        if (g.slaStatus === 'Near Breach') {
            return <Badge variant="outline" className="ml-2 text-[10px] h-5 border-orange-500 text-orange-600"><Clock className="w-3 h-3 mr-1" />Due Soon</Badge>;
        }
        return null;
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Grievance Redressal</h1>
                    <p className="text-gray-500 mt-1">Manage, track, and resolve citizen and agency issues</p>
                </div>
                <Button onClick={() => setIsSubmitModalOpen(true)} className="bg-blue-600 shadow-sm hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Grievance
                </Button>
            </div>

            <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search by ID, Project, or Description..."
                                    className="pl-10 bg-white border-gray-300 shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                                <CollapsibleTrigger asChild>
                                    <Button variant="outline" className={isFiltersOpen ? "bg-gray-100" : ""}>
                                        <Filter className="w-4 h-4 mr-2" />
                                        Filters
                                    </Button>
                                </CollapsibleTrigger>
                            </Collapsible>
                        </div>

                        <Collapsible open={isFiltersOpen}>
                            <CollapsibleContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                                    <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                                        <SelectTrigger className="bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Assigned">Assigned</SelectItem>
                                            <SelectItem value="In Review">In Review</SelectItem>
                                            <SelectItem value="Closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={filters.priority} onValueChange={(v) => setFilters({ ...filters, priority: v })}>
                                        <SelectTrigger className="bg-white"><SelectValue placeholder="Priority" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Priorities</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Normal">Normal</SelectItem>
                                            <SelectItem value="Low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>


                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 hover:bg-gray-50">
                                <TableHead className="w-[100px]">Reference ID</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">Loading...</TableCell>
                                </TableRow>
                            ) : filteredGrievances.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                                        No grievances found matching your criteria
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredGrievances.map((g) => (
                                    <TableRow key={g.id} className="hover:bg-gray-50/50">
                                        <TableCell className="font-mono text-xs font-medium text-gray-600">
                                            #{g.id.slice(0, 8).toUpperCase()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 line-clamp-1">
                                                    {g.category || 'General Grievance'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-gray-50">
                                                {g.level || '-'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={g.priority === 'High' ? 'destructive' : 'secondary'} className="font-normal">
                                                {g.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-600">
                                            {g.source || 'Public'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(g.status)}`}>
                                                    {g.status}
                                                </span>
                                                {getSlaBadge(g)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {new Date(g.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {g.assigneeName ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                                        {g.assigneeName.charAt(0)}
                                                    </div>
                                                    <span className="text-gray-700">{g.assigneeName}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">Unassigned</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => navigate(`/grievances/${g.id}`)} className="h-8 w-8 p-0">
                                                    <Eye className="w-4 h-4 text-gray-500" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(g.id)} className="h-8 w-8 p-0 hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <GrievanceSubmitModal
                open={isSubmitModalOpen}
                onOpenChange={setIsSubmitModalOpen}
                onSuccess={fetchGrievances}
            />
        </div>
    );
}
