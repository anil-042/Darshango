import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Alert, Project } from '../../types';

interface AlertFormProps {
    formData: Partial<Alert>;
    setFormData: (data: Partial<Alert>) => void;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
    projects: Project[];
}

export function AlertForm({ formData, setFormData, onSubmit, submitLabel, projects }: AlertFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Alert ID (Optional)</label>
                <Input
                    value={formData.id || ''}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="Custom Alert ID"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                                <SelectItem key={p.id} value={p.id}>{p.title} ({p.projectId})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Alert Type</label>
                    <Select
                        value={formData.type}
                        onValueChange={(val: any) => setFormData({ ...formData, type: val })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Delay">Delay</SelectItem>
                            <SelectItem value="Fund Misuse">Fund Misuse</SelectItem>
                            <SelectItem value="Quality Issue">Quality Issue</SelectItem>
                            <SelectItem value="Missing Document">Missing Document</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                    value={formData.priority}
                    onValueChange={(val: any) => setFormData({ ...formData, priority: val })}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${target.scrollHeight}px`;
                    }}
                    placeholder="Describe the issue..."
                    className="min-h-[2.5rem] resize-none overflow-hidden"
                    required
                />
            </div>

            <Button type="submit" className="w-full" variant="destructive">{submitLabel}</Button>
        </form>
    );
}
