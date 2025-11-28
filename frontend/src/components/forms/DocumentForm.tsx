import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { Project, Document } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface DocumentFormProps {
    projects: Project[];
    onSuccess: () => void;
}

export function DocumentForm({ projects, onSuccess }: DocumentFormProps) {
    const { user } = useAuth();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<Partial<Document>>({
        projectId: '',
        title: '',
        type: 'Other',
        uploadedBy: user?.name || 'User',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Pending'
    });

    const types = ['UC', 'Progress Report', 'Inspection Report', 'Other'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            alert('Please select a file to upload');
            return;
        }

        if (!formData.projectId) {
            alert('Please select a project');
            return;
        }

        try {
            const data = new FormData();
            data.append('file', selectedFile);
            data.append('projectId', formData.projectId || '');
            data.append('title', formData.title || selectedFile.name);
            data.append('type', formData.type || 'Other');
            data.append('uploadedBy', user?.name || 'User');
            data.append('category', formData.type || 'Other');

            await api.documents.create(data);

            onSuccess();

            // Reset form
            setFormData({
                projectId: '',
                title: '',
                type: 'Other',
                uploadedBy: user?.name || 'User',
                uploadDate: new Date().toISOString().split('T')[0],
                status: 'Pending'
            });
            setSelectedFile(null);
        } catch (error: any) {
            console.error('Failed to upload document', error);
            const msg = error.response?.data?.message || error.message || 'Failed to upload document';
            alert(`Error: ${msg}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Project</label>
                <Select
                    value={formData.projectId}
                    onValueChange={(val) => setFormData({ ...formData, projectId: val })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={`Select Project (${projects.length} loaded)`} />
                    </SelectTrigger>
                    <SelectContent className="z-[9999]" position="item-aligned" style={{ zIndex: 100000 }}>
                        {projects.length === 0 ? (
                            <SelectItem value="none" disabled>No projects found</SelectItem>
                        ) : (
                            projects.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.title} ({p.id})</SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Document Title</label>
                <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Q1 Progress Report"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Document Type</label>
                <Select
                    value={formData.type}
                    onValueChange={(val: any) => setFormData({ ...formData, type: val })}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {types.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">File</label>
                <Input
                    type="file"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0]);
                            if (!formData.title) {
                                setFormData({ ...formData, title: e.target.files[0].name });
                            }
                        }
                    }}
                    required
                />
            </div>

            <Button type="submit" className="w-full">Upload</Button>
        </form>
    );
}
