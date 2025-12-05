import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, Filter, FileText, Download, Eye, Folder, Plus, Trash2, X } from 'lucide-react';
import { api } from '../services/api';
import { Document, Project } from '../types';
import { useAuth } from '../context/AuthContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
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

const categoryColors: Record<string, string> = {
  'UC': 'bg-blue-100 text-blue-700',
  'Progress Report': 'bg-cyan-100 text-cyan-700',
  'Inspection Report': 'bg-orange-100 text-orange-700',
  'Other': 'bg-gray-100 text-gray-700',
};

import { DocumentForm } from './forms/DocumentForm';

export function DocumentRepository() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // CRUD States
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    // Fetch Projects
    try {
      const projectsData = await api.projects.getAll();
      setProjects(projectsData);
      console.log('Fetched projects:', projectsData);
    } catch (error: any) {
      console.error('Failed to fetch projects', error);
      setError(prev => prev ? `${prev} | Projects: ${error.message}` : `Projects: ${error.message}`);
    }

    // Fetch Documents
    try {
      const docsData = await api.documents.getAll();
      setDocuments(docsData);
    } catch (error: any) {
      console.error('Failed to fetch documents', error);
      const msg = error.response?.data?.message || error.message || 'Failed to load documents';
      // Don't block UI if only documents fail, just show error
      setError(prev => prev ? `${prev} | Documents: ${msg}` : `Documents: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!docToDelete) return;
    try {
      await api.documents.delete(docToDelete);
      setDocToDelete(null);
      fetchData();
    } catch (error) {
      console.error('Failed to delete document', error);
    }
  };

  const canEdit = user?.role === 'Admin' || user?.role === 'StateNodalOfficer' || user?.role === 'AgencyAdmin';

  const getProjectDetails = (projectId?: string) => {
    if (!projectId) return undefined;
    return projects.find(p => p.id === projectId);
  };

  const filteredDocuments = documents.filter(doc => {
    const project = getProjectDetails(doc.projectId);
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.projectId && doc.projectId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project?.title && project.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === 'all' || doc.type === filterType;

    return matchesSearch && matchesType;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
  };

  const hasActiveFilters = searchQuery !== '' || filterType !== 'all';

  const types = ['UC', 'Progress Report', 'Inspection Report', 'Other'];

  return (
    <div className="p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Repository</h1>
          <p className="text-gray-500">Centralized document storage and management</p>
        </div>

        {canEdit && (
          <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
            <SheetTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Upload New Document</SheetTitle>
              </SheetHeader>
              <DocumentForm
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
                placeholder="Search documents by title, project, or uploader..."
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
                <label className="text-gray-700 mb-2 block">Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Category Folders (Visual only based on types for now) */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {types.map(type => {
              const count = documents.filter(d => d.type === type).length;
              return (
                <div
                  key={type}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setFilterType(type)}
                >
                  <Folder className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-gray-900 mb-1 text-sm font-medium truncate">{type}</p>
                  <p className="text-gray-500 text-xs">{count} files</p>
                </div>
              );
            })}
          </div>

          {/* Document Cards */}
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading documents...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc) => {
                const project = getProjectDetails(doc.projectId);
                return (
                  <div
                    key={doc.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all relative group"
                  >
                    <div className="flex gap-3">
                      <div className="p-3 bg-blue-50 rounded-lg h-fit">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 mb-2 font-medium truncate" title={doc.title}>{doc.title}</h4>

                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge className={categoryColors[doc.type] || 'bg-gray-100 text-gray-700'}>{doc.type}</Badge>
                          <Badge variant="outline" className={
                            doc.status === 'Verified' ? 'text-green-600 border-green-200 bg-green-50' :
                              doc.status === 'Pending' ? 'text-yellow-600 border-yellow-200 bg-yellow-50' :
                                'text-red-600 border-red-200 bg-red-50'
                          }>{doc.status}</Badge>
                        </div>

                        <div className="space-y-1 text-gray-600 mb-3 text-sm">
                          <p className="truncate" title={project?.title}>Project: {project?.title || doc.projectId}</p>
                          <p>By {doc.uploadedBy}</p>
                          <p>{doc.uploadDate}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1 flex-1">
                            <Eye className="w-3 h-3" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1 flex-1">
                            <Download className="w-3 h-3" />
                            Download
                          </Button>
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 px-2"
                              onClick={() => setDocToDelete(doc.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Alert */}
      <AlertDialog open={!!docToDelete} onOpenChange={() => setDocToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
