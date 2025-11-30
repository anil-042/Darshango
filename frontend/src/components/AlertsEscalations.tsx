import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, Filter, CheckCircle, Plus, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { Alert, Project } from '../types';
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
import { Textarea } from './ui/textarea';

import { AlertForm } from './forms/AlertForm';

export function AlertsEscalations() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // CRUD States
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Alert>>({
    projectId: '',
    type: 'Delay',
    priority: 'Medium',
    description: '',
    status: 'New',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [alertsData, projectsData] = await Promise.all([
        api.alerts.getAll(),
        api.projects.getAll()
      ]);
      setAlerts(alertsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.alerts.create(formData as any);
      setIsAddSheetOpen(false);
      fetchData();
      setFormData({
        projectId: '',
        type: 'Delay',
        priority: 'Medium',
        description: '',
        status: 'New',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Failed to raise alert', error);
    }
  };

  const handleResolve = async (alert: Alert) => {
    try {
      // Visual update only for now as API lacks update
      const updatedAlerts = alerts.map(a =>
        a.id === alert.id ? { ...a, status: 'Resolved' as const } : a
      );
      setAlerts(updatedAlerts);
    } catch (error) {
      console.error('Failed to resolve alert', error);
    }
  };

  const canEdit = user?.role !== 'Viewer';

  const getProjectDetails = (projectId?: string) => {
    if (!projectId) return undefined;
    return projects.find(p => p.id === projectId);
  };

  const filteredAlerts = alerts.filter(alert => {
    const project = getProjectDetails(alert.projectId);
    const matchesSearch =
      alert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alert.projectId && alert.projectId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (project?.title && project.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (alert.description || alert.message || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = filterPriority === 'all' || (alert.priority || alert.severity) === filterPriority;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts & Escalations</h1>
          <p className="text-gray-500">Monitor and resolve project alerts and escalations</p>
        </div>

        {canEdit && (
          <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="destructive">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Raise Alert
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-2xl">
              <SheetHeader>
                <SheetTitle>Raise New Alert</SheetTitle>
              </SheetHeader>
              <AlertForm
                onSubmit={handleCreate}
                submitLabel="Raise Alert"
                formData={formData}
                setFormData={setFormData}
                projects={projects}
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
                placeholder="Search alerts by ID, type, project, or description..."
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-gray-700 mb-2 block">Priority</label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
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
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Investigating">Investigating</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Alert ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Loading alerts...
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAlerts.map((alert) => {
                    const project = getProjectDetails(alert.projectId);
                    return (
                      <TableRow key={alert.id}>
                        <TableCell className="font-mono text-xs">{alert.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{alert.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-gray-900 font-medium">{project?.title || alert.projectId || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{alert.projectId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            (alert.priority || alert.severity) === 'High' ? 'bg-red-100 text-red-700' :
                              (alert.priority || alert.severity) === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                          }>
                            {alert.priority || alert.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={alert.description || alert.message}>
                          {alert.description || alert.message}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            alert.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                              alert.status === 'Investigating' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'
                          }>
                            {alert.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{alert.date?.split('T')[0]}</TableCell>
                        <TableCell>
                          {alert.status !== 'Resolved' && canEdit && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleResolve(alert)}
                            >
                              <CheckCircle className="w-3 h-3" />
                              Resolve
                            </Button>
                          )}
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
    </div>
  );
}
