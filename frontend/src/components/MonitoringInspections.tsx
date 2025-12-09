import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, Filter, Eye, Plus, Trash2, Calendar, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Inspection, Project } from '../types';
import { useAuth } from '../context/AuthContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { locationData } from '../data/locations';
import { InspectionForm } from './forms/InspectionForm';

export function MonitoringInspections() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterState, setFilterState] = useState('all');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // CRUD States
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [inspectionToDelete, setInspectionToDelete] = useState<{ id: string, projectId: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [inspectionsData, projectsData] = await Promise.all([
        api.inspections.getAll(),
        api.projects.getAll()
      ]);
      setInspections(inspectionsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!inspectionToDelete) return;
    try {
      await api.inspections.delete(inspectionToDelete.id, inspectionToDelete.projectId);
      setInspectionToDelete(null);
      fetchData();
    } catch (error) {
      console.error('Failed to delete inspection', error);
      alert('Failed to delete inspection. Please try again.');
    }
  };

  const canEdit = user?.role === 'Admin' || user?.role === 'StateNodalOfficer';

  const getProjectDetails = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  const filteredInspections = inspections.filter(inspection => {
    const project = getProjectDetails(inspection.projectId);
    const matchesSearch =
      inspection.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.inspectorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project?.title && project.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || inspection.status === filterStatus;
    const matchesState = filterState === 'all' || project?.state === filterState;
    const matchesDistrict = filterDistrict === 'all' || project?.district === filterDistrict;

    return matchesSearch && matchesStatus && matchesState && matchesDistrict;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterState('all');
    setFilterDistrict('all');
  };

  const hasActiveFilters = searchQuery !== '' || filterStatus !== 'all' || filterState !== 'all' || filterDistrict !== 'all';

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitoring & Inspections</h1>
          <p className="text-gray-500">Track site inspections and monitoring activities</p>
        </div>

        {canEdit && (
          <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
            <SheetTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Inspection
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Schedule New Inspection</SheetTitle>
              </SheetHeader>
              <InspectionForm
                projects={projects}
                onSuccess={() => {
                  setIsAddSheetOpen(false);
                  fetchData();
                }}
              />
            </SheetContent>
          </Sheet>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by inspection ID, project, or inspector..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-gray-700 mb-2 block">State</label>
                <Select
                  value={filterState}
                  onValueChange={(val) => {
                    setFilterState(val);
                    setFilterDistrict('all');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {Object.keys(locationData).map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-gray-700 mb-2 block">District</label>
                <Select
                  value={filterDistrict}
                  onValueChange={setFilterDistrict}
                  disabled={filterState === 'all'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {filterState !== 'all' && locationData[filterState]?.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-gray-700 mb-2 block">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Reported">Reported</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Inspection ID</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Loading inspections...
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInspections.map((inspection) => {
                    const project = getProjectDetails(inspection.projectId);
                    return (
                      <TableRow key={inspection.id}>
                        <TableCell className="font-mono text-xs">
                          {inspection.customId || (inspection.comments?.match(/^\[ID: (.+?)\]/)?.[1]) || inspection.id.substring(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-gray-900 font-medium">{project?.title || inspection.projectId}</p>
                            <p className="text-xs text-gray-500">{project?.projectId || inspection.projectId}</p>
                          </div>
                        </TableCell>
                        <TableCell>{project?.state || '-'}</TableCell>
                        <TableCell>{project?.district || '-'}</TableCell>
                        <TableCell>{inspection.inspectorName}</TableCell>
                        <TableCell className="text-gray-600">{inspection.date?.split('T')[0]}</TableCell>
                        <TableCell>
                          <Badge className={
                            inspection.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              inspection.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'
                          }>
                            {inspection.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Link to={`/monitoring/${inspection.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            {canEdit && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setInspectionToDelete({ id: inspection.id, projectId: inspection.projectId })}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Alert */}
      <AlertDialog open={!!inspectionToDelete} onOpenChange={() => setInspectionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the inspection record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
