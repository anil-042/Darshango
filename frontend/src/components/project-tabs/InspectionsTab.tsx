import { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Eye, MapPin, Calendar, User, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Inspection } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface InspectionsTabProps {
  projectId: string;
}

export function InspectionsTab({ projectId }: InspectionsTabProps) {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const [formData, setFormData] = useState({
    inspectorName: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Scheduled',
    rating: 'Pending',
    comments: '',
    location: ''
  });

  useEffect(() => {
    fetchInspections();
  }, [projectId]);

  const fetchInspections = async () => {
    setIsLoading(true);
    try {
      const allInspections = await api.inspections.getAll();
      const projectInspections = allInspections.filter(i => i.projectId === projectId);
      setInspections(projectInspections);
    } catch (error) {
      console.error('Failed to fetch inspections', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newInspection: Omit<Inspection, 'id'> = {
        projectId,
        inspectorName: formData.inspectorName,
        date: formData.date,
        status: formData.status as any,
        rating: formData.rating as any,
        comments: formData.comments,
        location: formData.location
      };

      await api.inspections.create(newInspection);
      setIsAddSheetOpen(false);
      fetchInspections();
      setFormData({
        inspectorName: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Scheduled',
        rating: 'Pending',
        comments: '',
        location: ''
      });
    } catch (error) {
      console.error('Failed to create inspection', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.inspections.delete(id);
      fetchInspections();
    } catch (error) {
      console.error('Failed to delete inspection', error);
    }
  };

  const canEdit = user?.role === 'Admin' || user?.role === 'StateNodalOfficer' || user?.role === 'Inspector';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'Scheduled': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Good': return 'bg-green-100 text-green-700';
      case 'Satisfactory': return 'bg-blue-100 text-blue-700';
      case 'Needs Attention': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">{inspections.length} inspections recorded</p>
        {canEdit && (
          <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Inspection
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Schedule New Inspection</SheetTitle>
              </SheetHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Inspector Name</label>
                  <Input
                    value={formData.inspectorName}
                    onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                    placeholder="e.g. A. K. Sharma"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Village Rampur"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(val: string) => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <Select
                    value={formData.rating}
                    onValueChange={(val: string) => setFormData({ ...formData, rating: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Satisfactory">Satisfactory</SelectItem>
                      <SelectItem value="Needs Attention">Needs Attention</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Comments</label>
                  <Input
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    placeholder="Inspection findings..."
                  />
                </div>

                <Button type="submit" className="w-full">Schedule Inspection</Button>
              </form>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading inspections...</div>
      ) : inspections.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No inspections recorded for this project.</div>
      ) : (
        <div className="space-y-3">
          {inspections.map((inspection) => (
            <div
              key={inspection.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-gray-900">{inspection.id}</h4>
                    <Badge className={getStatusColor(inspection.status)}>{inspection.status}</Badge>
                    <Badge className={getRatingColor(inspection.rating)}>{inspection.rating}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {inspection.status === 'Completed' && (
                    <Link to={`/monitoring/${inspection.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                  {canEdit && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Inspection</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this inspection record? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <Button variant="destructive" onClick={() => handleDelete(inspection.id)}>
                            Delete
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500">Inspection Date</p>
                    <p className="text-gray-900">{inspection.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500">Inspector</p>
                    <p className="text-gray-900">{inspection.inspectorName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="text-gray-900">{inspection.location || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded">
                <p className="text-gray-600">{inspection.comments}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
