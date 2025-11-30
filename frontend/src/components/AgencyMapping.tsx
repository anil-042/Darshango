import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  Building2,
  Phone,
  Mail,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Globe,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import { Agency } from '../types';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
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
import { Textarea } from './ui/textarea';

import { locationData } from '../data/locations';

interface AgencyFormProps {
  formData: Partial<Agency>;
  setFormData: (data: Partial<Agency>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
}

const AgencyForm = ({ formData, setFormData, onSubmit, submitLabel }: AgencyFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4 mt-6">
    <div className="space-y-2">
      <label className="text-sm font-medium">Agency Name</label>
      <Input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Code</label>
        <Input
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          value={formData.category}
          onValueChange={(val: any) => setFormData({ ...formData, category: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PWD">PWD</SelectItem>
            <SelectItem value="StateDept">State Dept</SelectItem>
            <SelectItem value="PRI">PRI</SelectItem>
            <SelectItem value="ULB">ULB</SelectItem>
            <SelectItem value="DevelopmentAuthority">Development Authority</SelectItem>
            <SelectItem value="HousingBoard">Housing Board</SelectItem>
            <SelectItem value="EngineeringDept">Engineering Dept</SelectItem>
            <SelectItem value="NGO">NGO</SelectItem>
            <SelectItem value="PrivateContractor">Private Contractor</SelectItem>
            <SelectItem value="OtherGovtAgency">Other Govt Agency</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Role Type</label>
        <Select
          value={formData.roleType}
          onValueChange={(val: any) => setFormData({ ...formData, roleType: val })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Implementing">Implementing</SelectItem>
            <SelectItem value="Executing">Executing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Registration Number</label>
        <Input
          value={formData.registrationNumber || ''}
          onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">State</label>
        <Select
          value={formData.state}
          onValueChange={(val) => setFormData({ ...formData, state: val, district: '' })}
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
          onValueChange={(val) => setFormData({ ...formData, district: val })}
          disabled={!formData.state}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select District" />
          </SelectTrigger>
          <SelectContent>
            {formData.state && locationData[formData.state]?.map((district) => (
              <SelectItem key={district} value={district}>
                {district}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium">Address</label>
      <Textarea
        value={formData.address || ''}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Contact Person</label>
        <Input
          value={formData.contactPerson}
          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Designation</label>
        <Input
          value={formData.designation || ''}
          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone</label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">GSTIN</label>
        <Input
          value={formData.gstin || ''}
          onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Website</label>
        <Input
          value={formData.website || ''}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
      </div>
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium">Remarks</label>
      <Textarea
        value={formData.remarks || ''}
        onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
      />
    </div>

    <Button type="submit" className="w-full">{submitLabel}</Button>
  </form>
);

export function AgencyMapping() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // CRUD States
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null); // For View
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null); // For Edit
  const [agencyToDelete, setAgencyToDelete] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Agency>>({
    name: '',
    code: '',
    category: 'NGO',
    roleType: 'Implementing',
    state: '',
    district: '',
    contactPerson: '',
    designation: '',
    phone: '',
    email: '',
    address: '',
    registrationNumber: '',
    gstin: '',
    website: '',
    remarks: '',
    components: [],
    assignedProjects: [],
    activeProjects: 0,
    performance: 0
  });

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    setIsLoading(true);
    try {
      const data = await api.agencies.getAll();
      setAgencies(data);
    } catch (error) {
      console.error('Failed to fetch agencies', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.agencies.create({
        ...formData,
        lastUpdated: new Date().toISOString().split('T')[0]
      } as any);
      setIsAddSheetOpen(false);
      fetchAgencies();
      resetForm();
    } catch (error) {
      console.error('Failed to create agency', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgency) return;
    try {
      await api.agencies.update(editingAgency.id, {
        ...formData,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
      setIsEditSheetOpen(false);
      setEditingAgency(null);
      fetchAgencies();
    } catch (error) {
      console.error('Failed to update agency', error);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!agencyToDelete) return;
    try {
      await api.agencies.delete(agencyToDelete);
      setAgencyToDelete(null);
      fetchAgencies();
    } catch (error) {
      console.error('Failed to delete agency', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      category: 'NGO',
      roleType: 'Implementing',
      state: '',
      district: '',
      contactPerson: '',
      designation: '',
      phone: '',
      email: '',
      address: '',
      registrationNumber: '',
      gstin: '',
      website: '',
      remarks: '',
      components: [],
      assignedProjects: [],
      activeProjects: 0,
      performance: 0
    });
  };

  const openEditSheet = (agency: Agency) => {
    setEditingAgency(agency);
    setFormData(agency);
    setIsEditSheetOpen(true);
  };

  const canEdit = user?.role === 'Admin' || user?.role === 'StateNodalOfficer';

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch =
      (agency.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (agency.code?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (agency.state?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    const matchesState = filterState === 'all' || agency.state === filterState;
    const matchesCategory = filterCategory === 'all' || agency.category === filterCategory;

    return matchesSearch && matchesState && matchesCategory;
  });



  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agency Mapping</h1>
          <p className="text-gray-500">Manage and monitor implementing and executing agencies</p>
        </div>

        {canEdit && (
          <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
            <SheetTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Agency
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto sm:max-w-2xl">
              <SheetHeader>
                <SheetTitle>Register New Agency</SheetTitle>
              </SheetHeader>
              <AgencyForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleCreate}
                submitLabel="Register Agency"
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
                placeholder="Search by agency name, code, state, or district..."
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
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-gray-700 mb-2 block">State</label>
                <Select value={filterState} onValueChange={setFilterState}>
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
                <label className="text-gray-700 mb-2 block">Category</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="PWD">PWD</SelectItem>
                    <SelectItem value="StateDept">State Dept</SelectItem>
                    <SelectItem value="PRI">PRI</SelectItem>
                    <SelectItem value="ULB">ULB</SelectItem>
                    <SelectItem value="DevelopmentAuthority">Development Authority</SelectItem>
                    <SelectItem value="HousingBoard">Housing Board</SelectItem>
                    <SelectItem value="EngineeringDept">Engineering Dept</SelectItem>
                    <SelectItem value="NGO">NGO</SelectItem>
                    <SelectItem value="PrivateContractor">Private Contractor</SelectItem>
                    <SelectItem value="OtherGovtAgency">Other Govt Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Agency Code</TableHead>
                  <TableHead>Agency Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Role Type</TableHead>
                  <TableHead>Components</TableHead>
                  <TableHead>Active Projects</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      Loading agencies...
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAgencies.map((agency) => (
                    <TableRow key={agency.id}>
                      <TableCell>{agency.code}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          {agency.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{agency.category}</Badge>
                      </TableCell>
                      <TableCell>{agency.roleType}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(agency.components || []).map((comp) => (
                            <Badge key={comp} className="bg-blue-50 text-blue-700">
                              {comp}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{agency.activeProjects}</TableCell>
                      <TableCell>{agency.contactPerson}</TableCell>
                      <TableCell className="text-gray-500">{agency.lastUpdated?.split('T')[0]}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedAgency(agency)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {canEdit && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4 text-gray-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditSheet(agency)}>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => setAgencyToDelete(agency.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Agency
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Details Sheet */}
      <Sheet open={!!selectedAgency} onOpenChange={() => setSelectedAgency(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedAgency && (
            <>
              <SheetHeader>
                <SheetTitle>Agency Details</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-6 h-6 text-blue-600" />
                    <h3 className="text-blue-900">{selectedAgency.name}</h3>
                  </div>
                  <p className="text-blue-700">{selectedAgency.code}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 mb-1">Category</p>
                    <Badge variant="outline">{selectedAgency.category}</Badge>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Role Type</p>
                    <p className="text-gray-900">{selectedAgency.roleType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">State</p>
                    <p className="text-gray-900">{selectedAgency.state}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">District</p>
                    <p className="text-gray-900">{selectedAgency.district}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 mb-2">Components Handled</p>
                  <div className="flex flex-wrap gap-2">
                    {(selectedAgency.components || []).map((comp) => (
                      <Badge key={comp} className="bg-blue-50 text-blue-700">
                        {comp}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 mb-2">Contact Information</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-24">Person:</span>
                      <span className="text-gray-900">{selectedAgency.contactPerson}</span>
                    </div>
                    {selectedAgency.designation && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-24">Designation:</span>
                        <span className="text-gray-900">{selectedAgency.designation}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedAgency.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedAgency.email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 mb-2">Additional Details</p>
                  <div className="space-y-2">
                    {selectedAgency.registrationNumber && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-32">Reg. Number:</span>
                        <span className="text-gray-900">{selectedAgency.registrationNumber}</span>
                      </div>
                    )}
                    {selectedAgency.gstin && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-32">GSTIN:</span>
                        <span className="text-gray-900">{selectedAgency.gstin}</span>
                      </div>
                    )}
                    {selectedAgency.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <a href={selectedAgency.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedAgency.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {selectedAgency.remarks && (
                  <div>
                    <p className="text-gray-500 mb-2">Remarks</p>
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-700 text-sm">
                      {selectedAgency.remarks}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-gray-500 mb-2">Statistics</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 mb-1">Active Projects</p>
                      <p className="text-gray-900">{selectedAgency.activeProjects}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 mb-1">Last Updated</p>
                      <p className="text-gray-900">{selectedAgency.lastUpdated?.split('T')[0]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Agency</SheetTitle>
          </SheetHeader>
          <AgencyForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
          />
        </SheetContent>
      </Sheet>

      {/* Delete Alert */}
      <AlertDialog open={!!agencyToDelete} onOpenChange={() => setAgencyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the agency and remove it from our servers.
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
    </div >
  );
}
