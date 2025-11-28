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
import { api } from '../../services/api';
import { Inspection, Project } from '../../types';

interface InspectionFormProps {
    projects: Project[];
    onSuccess: () => void;
}

export function InspectionForm({ projects, onSuccess }: InspectionFormProps) {
    const [formData, setFormData] = useState<Partial<Inspection>>({
        projectId: '',
        inspectorId: '',
        inspectorName: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Scheduled',
        rating: 'Pending',
        comments: '',
        findings: '',
        location: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.projectId || !formData.inspectorId) {
            alert('Please select a project and enter inspector details');
            return;
        }

        try {
            await api.inspections.create(formData as any);
            // Reset form
            setFormData({
                projectId: '',
                inspectorId: '',
                inspectorName: '',
                date: new Date().toISOString().split('T')[0],
                status: 'Scheduled',
                rating: 'Pending',
                comments: '',
                findings: '',
                location: ''
            });
            onSuccess();
        } catch (error) {
            console.error('Failed to schedule inspection', error);
            alert('Failed to schedule inspection. Please try again.');
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
                        <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                        {projects.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.title} ({p.id})</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Inspector Name/ID</label>
                <Input
                    value={formData.inspectorId}
                    onChange={(e) => setFormData({
                        ...formData,
                        inspectorId: e.target.value,
                        inspectorName: e.target.value
                    })}
                    placeholder="e.g., INS-001"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                    <label className="text-sm font-medium">Status</label>
                    <Select
                        value={formData.status}
                        onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Reported">Reported</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Initial Findings/Notes</label>
                <Input
                    value={formData.findings}
                    onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                    placeholder="Optional"
                />
            </div>

            <Button type="submit" className="w-full">Schedule Inspection</Button>
        </form>
    );
}
