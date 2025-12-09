import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface GrievanceSubmitModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function GrievanceSubmitModal({ open, onOpenChange, onSuccess }: GrievanceSubmitModalProps) {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneral, setIsGeneral] = useState(true);

    const [formData, setFormData] = useState({
        projectId: '',
        type: '',
        category: '',
        level: '',
        priority: 'Normal',
        description: ''
    });



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Get selected project details to auto-fill component/district if project mode
            let component = '';
            let district = '';

            await api.grievances.create({
                ...formData,
                isGeneral,
                projectId: null, // Always null for general
                type: null, // Always null for general
                component: undefined,
                district: user?.district || undefined,
                source: user?.role || 'Public',
                createdBy: user?.id,
            } as any);

            toast.success('Grievance submitted successfully');
            onSuccess();
            onOpenChange(false);
            setFormData({
                projectId: '',
                type: '',
                category: '',
                level: '',
                priority: 'Normal',
                description: ''
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit grievance');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Submit Grievance</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val) => setFormData({ ...formData, category: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Fund Delay">Fund Release Delay</SelectItem>
                                    <SelectItem value="Clarification">Policy Clarification</SelectItem>
                                    <SelectItem value="System Issue">Portal/System Issue</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Escalation Level</Label>
                            <Select
                                value={formData.level}
                                onValueChange={(val) => setFormData({ ...formData, level: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="State → Central">State → Central</SelectItem>
                                    <SelectItem value="District → State">District → State</SelectItem>
                                    <SelectItem value="Central → State">Central → State</SelectItem>
                                    <SelectItem value="State → District">State → District</SelectItem>
                                    <SelectItem value="District → Agency">District → Agency</SelectItem>
                                    <SelectItem value="Agency → District">Agency → District</SelectItem>
                                    <SelectItem value="Agency → Village">Agency → Village</SelectItem>
                                    <SelectItem value="Village → Agency">Village → Agency</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select
                            value={formData.priority}
                            onValueChange={(val) => setFormData({ ...formData, priority: val })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Normal">Normal</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe your grievance in detail..."
                            className="h-32"
                            required
                        />
                    </div>



                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                            {isLoading ? 'Submitting...' : 'Submit Grievance'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
