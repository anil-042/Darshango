import { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { FileText, Download, Eye, Trash2, Upload } from 'lucide-react';
import { api } from '../../services/api';
import { Document } from '../../types';
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

interface DocumentsTabProps {
  projectId: string;
}

const categoryColors: Record<string, string> = {
  Planning: 'bg-blue-100 text-blue-700',
  Compliance: 'bg-green-100 text-green-700',
  Technical: 'bg-purple-100 text-purple-700',
  Finance: 'bg-yellow-100 text-yellow-700',
  Progress: 'bg-cyan-100 text-cyan-700',
  Inspection: 'bg-orange-100 text-orange-700',
};

export function DocumentsTab({ projectId }: DocumentsTabProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Report',
    category: 'Progress',
    size: '1.5 MB', // Mock size
    url: '#'
  });

  useEffect(() => {
    fetchDocuments();
  }, [projectId]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const allDocs = await api.documents.getAll();
      const projectDocs = allDocs.filter(d => d.projectId === projectId);
      setDocuments(projectDocs);
    } catch (error) {
      console.error('Failed to fetch documents', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newDoc: Omit<Document, 'id'> = {
        projectId,
        title: formData.title,
        type: formData.type,
        category: formData.category,
        uploadedBy: user?.name || 'Unknown',
        uploadDate: new Date().toISOString().split('T')[0],
        size: formData.size,
        url: formData.url
      };

      await api.documents.create(newDoc);
      setIsAddSheetOpen(false);
      fetchDocuments();
      setFormData({
        title: '',
        type: 'Report',
        category: 'Progress',
        size: '1.5 MB',
        url: '#'
      });
    } catch (error) {
      console.error('Failed to create document', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.documents.delete(id);
      fetchDocuments();
    } catch (error) {
      console.error('Failed to delete document', error);
    }
  };

  const canEdit = user?.role === 'Admin' || user?.role === 'StateNodalOfficer' || user?.role === 'AgencyAdmin';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">{documents.length} documents available</p>
        {canEdit && (
          <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Upload New Document</SheetTitle>
              </SheetHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Document Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Q3 Progress Report"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Document Type</label>
                  <Select
                    value={formData.type}
                    onValueChange={(val: string) => setFormData({ ...formData, type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Report">Report</SelectItem>
                      <SelectItem value="Certificate">Certificate</SelectItem>
                      <SelectItem value="Proposal">Proposal</SelectItem>
                      <SelectItem value="Letter">Letter</SelectItem>
                      <SelectItem value="Inspection">Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(val: string) => setFormData({ ...formData, category: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="Compliance">Compliance</SelectItem>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Progress">Progress</SelectItem>
                      <SelectItem value="Inspection">Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">File</label>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({
                          ...formData,
                          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                          url: URL.createObjectURL(file)
                        });
                      }
                    }}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">Upload Document</Button>
              </form>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading documents...</div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No documents found for this project.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex gap-3">
                <div className="p-3 bg-blue-50 rounded-lg h-fit">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-gray-900 font-medium truncate pr-2">{doc.title}</h4>
                    {canEdit && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Document</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this document? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button variant="destructive" onClick={() => handleDelete(doc.id)}>
                              Delete
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="outline">{doc.type}</Badge>
                    {doc.category && categoryColors[doc.category] && (
                      <Badge className={categoryColors[doc.category]}>{doc.category}</Badge>
                    )}
                  </div>

                  <div className="space-y-1 text-gray-600 mb-3 text-sm">
                    <p>Uploaded by {doc.uploadedBy}</p>
                    <p>{doc.uploadDate} • {doc.size}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1 h-8">
                      <Eye className="w-3 h-3" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 h-8">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
