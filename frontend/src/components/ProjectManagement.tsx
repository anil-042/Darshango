import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Calendar,
  MapPin,
  Building2,
  Pencil,
  Trash2,
  Eye
} from 'lucide-react';
import { api } from '../services/api';
import { Project, Agency } from '../types';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
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
import { districtCoordinates, stateCoordinates } from '../data/districtCoordinates';

interface ProjectManagementProps {
  component?: 'Adarsh Gram' | 'GIA' | 'Hostel';
}

interface ProjectFormProps {
  formData: Partial<Project>;
  setFormData: (data: Partial<Project>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  component?: string;
  agencies: Agency[];
}

const ProjectForm = ({ formData, setFormData, onSubmit, submitLabel, component, agencies }: ProjectFormProps) => {
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (formData.state && locationData[formData.state]) {
      setAvailableDistricts(locationData[formData.state]);
    } else {
      setAvailableDistricts([]);
    }
  }, [formData.state]);

  const handleStateChange = (value: string) => {
    setFormData({ ...formData, state: value, district: '' });
  };

  const handleDistrictChange = (value: string) => {
    // 1. Try specific district coordinates
    let coords = districtCoordinates[value];

    // 2. Fallback to State coordinates if district not found
    if (!coords && formData.state) {
      coords = stateCoordinates[formData.state];
    }

    // 3. Fallback to default if neither found
    if (!coords) {
      coords = districtCoordinates['Default'];
    }

    setFormData({
      ...formData,
      district: value,
      location: {
        lat: coords.lat,
        lng: coords.lng
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Project ID</label>
          <Input
            value={formData.projectId || ''}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Component</label>
          <Select
            value={formData.component}
            onValueChange={(val: any) => setFormData({ ...formData, component: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Adarsh Gram">Adarsh Gram</SelectItem>
              <SelectItem value="GIA">GIA</SelectItem>
              <SelectItem value="Hostel">Hostel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={formData.status}
            onValueChange={(val: any) => setFormData({ ...formData, status: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Implementing Agency</label>
          <Select
            value={formData.implementingAgencyId}
            onValueChange={(val) => setFormData({ ...formData, implementingAgencyId: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Agency" />
            </SelectTrigger>
            <SelectContent>
              {agencies
                .filter(a => a.roleType === 'Implementing')
                .map((agency) => (
                  <SelectItem key={agency.id} value={agency.id}>
                    {agency.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Executing Agency</label>
          <Select
            value={formData.executingAgencyId}
            onValueChange={(val) => setFormData({ ...formData, executingAgencyId: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Agency" />
            </SelectTrigger>
            <SelectContent>
              {agencies
                .filter(a => a.roleType === 'Executing')
                .map((agency) => (
                  <SelectItem key={agency.id} value={agency.id}>
                    {agency.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">End Date</label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">State</label>
          <Select
            value={formData.state}
            onValueChange={handleStateChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(locationData).map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">District</label>
          <Select
            value={formData.district}
            onValueChange={handleDistrictChange}
            disabled={!formData.state}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              {availableDistricts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Est. Cost (₹)</label>
          <Input
            type="number"
            value={formData.estimatedCost}
            onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Latitude</label>
          <Input
            type="number"
            value={formData.location?.lat || ''}
            readOnly
            className="bg-gray-50"
            placeholder="Auto-filled"
          />
          <p className="text-xs text-gray-500">Auto-filled based on District</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Longitude</label>
          <Input
            type="number"
            value={formData.location?.lng || ''}
            readOnly
            className="bg-gray-50"
            placeholder="Auto-filled"
          />
          <p className="text-xs text-gray-500">Auto-filled based on District</p>
        </div>
      </div>

      <Button type="submit" className="w-full">{submitLabel}</Button>
    </form >
  );
};

export function ProjectManagement({ component }: ProjectManagementProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [componentFilter, setComponentFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [availableDistrictsForFilter, setAvailableDistrictsForFilter] = useState<string[]>([]);

  // Update available districts when state filter changes
  useEffect(() => {
    if (stateFilter !== 'all' && locationData[stateFilter]) {
      setAvailableDistrictsForFilter(locationData[stateFilter]);
      setDistrictFilter('all'); // Reset district filter when state changes
    } else {
      setAvailableDistrictsForFilter([]);
      setDistrictFilter('all');
    }
  }, [stateFilter]);

  // CRUD States
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Project>>({
    projectId: '',
    title: '',
    component: component || 'Adarsh Gram',
    state: '',
    district: '',
    status: 'In Progress',
    estimatedCost: 0,
    progress: 0,
    implementingAgencyId: '',
    executingAgencyId: '',
    startDate: '',
    endDate: '',
    location: { lat: 0, lng: 0 }
  });

  const fetchAgencies = async () => {
    try {
      const data = await api.agencies.getAll();
      setAgencies(data);
    } catch (error) {
      console.error('Failed to fetch agencies', error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchAgencies();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await api.projects.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating project with data:', formData);
    try {
      await api.projects.create(formData as any);
      setIsAddSheetOpen(false);
      fetchProjects();
      setFormData({
        title: '',
        component: component || 'Adarsh Gram',
        state: '',
        district: '',
        status: 'In Progress',
        estimatedCost: 0,
        progress: 0,
        implementingAgencyId: '',
        executingAgencyId: '',
        startDate: '',
        endDate: '',
        projectId: ''
      });
      toast.success('Project created successfully');
    } catch (error: any) {
      console.error('Failed to create project', error);
      toast.error(`Failed to create project: ${error.response?.data?.message || error.message}`);
      if (error.response?.data?.errors) {
        console.error('Validation errors:', error.response.data.errors);
        // Optionally show validation errors in toast
        error.response.data.errors.forEach((err: any) => {
          toast.error(`${err.path.join('.')}: ${err.message}`);
        });
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    try {
      await api.projects.update(selectedProject.id, formData);
      setIsEditSheetOpen(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Failed to update project', error);
    }
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await api.projects.delete(projectToDelete);
      setProjectToDelete(null);
      fetchProjects();
    } catch (error) {
      console.error('Failed to delete project', error);
    }
  };

  const handleDelete = (id: string) => {
    setProjectToDelete(id);
  };

  const openEditSheet = (project: Project) => {
    setSelectedProject(project);
    setFormData(project);
    setIsEditSheetOpen(true);
  };

  const canEdit = user?.role === 'Admin' || user?.role === 'StateNodalOfficer';

  const filteredProjects = projects.filter(project => {
    const matchesComponentProp = !component || project.component === component;
    const matchesComponentFilter = componentFilter === 'all' || project.component === componentFilter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.projectId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesState = stateFilter === 'all' || project.state === stateFilter;
    const matchesDistrict = districtFilter === 'all' || project.district === districtFilter;

    return matchesComponentProp && matchesComponentFilter && matchesSearch && matchesStatus && matchesState && matchesDistrict;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {component ? `${component} Projects` : 'All Projects'}
          </h1>
          <p className="text-gray-500">Manage and monitor project progress</p>
        </div>

        {canEdit && (
          <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
            <SheetTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto sm:max-w-2xl">
              <SheetHeader>
                <SheetTitle>Create New Project</SheetTitle>
              </SheetHeader>
              <ProjectForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleCreate}
                submitLabel="Create Project"
                component={component}
                agencies={agencies}
              />
            </SheetContent>
          </Sheet>
        )}
      </div>

      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Project</SheetTitle>
          </SheetHeader>
          <ProjectForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdate}
            submitLabel="Update Project"
            component={component}
            agencies={agencies}
          />
        </SheetContent>
      </Sheet>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search projects..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {!component && (
                <Select value={componentFilter} onValueChange={setComponentFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Component" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Components</SelectItem>
                    <SelectItem value="Adarsh Gram">Adarsh Gram</SelectItem>
                    <SelectItem value="GIA">GIA</SelectItem>
                    <SelectItem value="Hostel">Hostel</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="State" />
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

              <Select
                value={districtFilter}
                onValueChange={setDistrictFilter}
                disabled={stateFilter === 'all'}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {availableDistrictsForFilter.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading projects...</div>
          ) : (
            <div className="grid gap-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {project.component}
                      </Badge>
                      <span className="text-xs text-gray-500 font-mono">{project.projectId || 'N/A'}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {project.district}, {project.state}
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {agencies.find(a => a.id === project.implementingAgencyId)?.name || project.implementingAgencyId}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {project.startDate?.split('T')[0]}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {project.progress}% Complete
                      </div>
                      <div className="w-32 h-2 bg-gray-100 rounded-full mt-1">
                        <div
                          className={`h-full rounded-full ${project.status === 'Delayed' ? 'bg-red-500' :
                            project.status === 'Completed' ? 'bg-green-500' :
                              'bg-blue-600'
                            }`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>

                      {canEdit && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditSheet(project)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(project.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
