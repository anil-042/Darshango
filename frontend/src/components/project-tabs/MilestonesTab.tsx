import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Circle, Plus, Calendar, User, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
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
import { api } from '../../services/api';
import { Milestone } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface MilestonesTabProps {
  projectId: string;
}

export function MilestonesTab({ projectId }: MilestonesTabProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const { user } = useAuth();

  const [formData, setFormData] = useState<Partial<Milestone>>({
    title: '',
    status: 'Pending',
    owner: '',
    dueDate: '',
    progress: 0
  });

  useEffect(() => {
    fetchMilestones();
  }, [projectId]);

  const fetchMilestones = async () => {
    setIsLoading(true);
    try {
      const allMilestones = await api.milestones.getAll();
      const projectMilestones = allMilestones.filter(m => m.projectId === projectId);
      setMilestones(projectMilestones);
    } catch (error) {
      console.error('Failed to fetch milestones', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const milestoneData = {
        ...formData,
        projectId,
        completionDate: formData.status === 'Completed' ? new Date().toISOString().split('T')[0] : null
      };

      if (editingMilestone) {
        await api.milestones.update(editingMilestone.id, milestoneData);
      } else {
        await api.milestones.create(milestoneData as any);
      }

      setIsSheetOpen(false);
      setEditingMilestone(null);
      fetchMilestones();
      resetForm();
    } catch (error) {
      console.error('Failed to save milestone', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.milestones.delete(id);
      fetchMilestones();
    } catch (error) {
      console.error('Failed to delete milestone', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      status: 'Pending',
      owner: '',
      dueDate: '',
      progress: 0
    });
    setEditingMilestone(null);
  };

  const openAddSheet = () => {
    resetForm();
    setIsSheetOpen(true);
  };

  const openEditSheet = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setFormData({
      title: milestone.title,
      status: milestone.status,
      owner: milestone.owner,
      dueDate: milestone.dueDate,
      progress: milestone.progress
    });
    setIsSheetOpen(true);
  };

  const canEdit = user?.role !== 'Viewer';

  const getIcon = (status: string) => {
    switch (status) {
      case 'Completed': return CheckCircle;
      case 'In Progress': return Clock;
      default: return Circle;
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600';
      case 'In Progress': return 'text-blue-600';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Project Milestones</h3>
        {canEdit && (
          <Sheet open={isSheetOpen} onOpenChange={(open: boolean) => {
            setIsSheetOpen(open);
            if (!open) resetForm();
          }}>
            <SheetTrigger asChild>
              <Button onClick={openAddSheet}>
                <Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}</SheetTitle>
              </SheetHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Owner</label>
                  <Input
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(val: string) => setFormData({ ...formData, status: val as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Progress (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingMilestone ? 'Update Milestone' : 'Create Milestone'}
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading milestones...</div>
      ) : milestones.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
          No milestones found for this project.
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-6">
            {milestones.map((milestone) => {
              const Icon = getIcon(milestone.status);
              return (
                <div key={milestone.id} className="relative flex gap-6">
                  <div className={`relative z-10 w-16 h-16 rounded-full bg-white border-2 ${milestone.progress === 100 ? 'border-green-600' : milestone.progress > 0 ? 'border-blue-600' : 'border-gray-300'} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${getIconColor(milestone.status)}`} />
                  </div>

                  <div className="flex-1 pb-6">
                    <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow group">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-gray-900 mb-1 font-medium">{milestone.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <User className="w-3 h-3" />
                            <span>{milestone.owner}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(milestone.status)}>{milestone.status}</Badge>
                          {canEdit && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditSheet(milestone)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Milestone</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this milestone? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <Button variant="destructive" onClick={() => handleDelete(milestone.id)}>
                                      Delete
                                    </Button>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-gray-500">Due Date</p>
                          <div className="flex items-center gap-1 text-gray-900">
                            <Calendar className="w-3 h-3" />
                            {milestone.dueDate}
                          </div>
                        </div>
                        {milestone.completionDate && (
                          <div>
                            <p className="text-gray-500">Completed On</p>
                            <div className="flex items-center gap-1 text-gray-900">
                              <CheckCircle className="w-3 h-3" />
                              {milestone.completionDate}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2 text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-900 font-medium">{milestone.progress}%</span>
                        </div>
                        <Progress value={milestone.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
