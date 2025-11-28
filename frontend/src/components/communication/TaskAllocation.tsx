import { useState } from 'react';
import { Plus, Calendar, User, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type TaskStatus = 'pending' | 'in-progress' | 'completed';

interface Task {
    id: string;
    title: string;
    assignee: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    status: TaskStatus;
}

export function TaskAllocation() {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: '1',
            title: 'Submit Utilization Certificate for GIA',
            assignee: 'NGO - Seva Foundation',
            dueDate: '2024-03-25',
            priority: 'high',
            status: 'pending'
        },
        {
            id: '2',
            title: 'Site Inspection - Hostel Block A',
            assignee: 'Junior Engineer (PWD)',
            dueDate: '2024-03-28',
            priority: 'medium',
            status: 'in-progress'
        },
        {
            id: '3',
            title: 'Update Beneficiary List',
            assignee: 'District Welfare Officer',
            dueDate: '2024-03-20',
            priority: 'low',
            status: 'completed'
        }
    ]);

    const [newTaskOpen, setNewTaskOpen] = useState(false);

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskAssignee, setNewTaskAssignee] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');

    const handleCreateTask = () => {
        if (!newTaskTitle || !newTaskAssignee || !newTaskDueDate) {
            alert('Please fill in all required fields');
            return;
        }

        const newTask: Task = {
            id: Date.now().toString(),
            title: newTaskTitle,
            assignee: newTaskAssignee,
            dueDate: newTaskDueDate,
            priority: newTaskPriority,
            status: 'pending'
        };

        setTasks([newTask, ...tasks]);
        setNewTaskOpen(false);

        // Reset form
        setNewTaskTitle('');
        setNewTaskAssignee('');
        setNewTaskDescription('');
        setNewTaskDueDate('');
        setNewTaskPriority('medium');
    };

    const getStatusIcon = (status: TaskStatus) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'in-progress': return <Clock className="h-5 w-5 text-blue-500" />;
            default: return <Circle className="h-5 w-5 text-slate-400" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-green-100 text-green-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-slate-200"></div>
                        <span className="text-sm text-slate-600">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-100"></div>
                        <span className="text-sm text-slate-600">In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-100"></div>
                        <span className="text-sm text-slate-600">Completed</span>
                    </div>
                </div>

                <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Assign New Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Assign New Task</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Task Title</Label>
                                    <Input
                                        placeholder="Enter task title"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Assignee</Label>
                                    <Select onValueChange={setNewTaskAssignee} value={newTaskAssignee}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select officer/agency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PWD Engineer">PWD Engineer</SelectItem>
                                            <SelectItem value="NGO Representative">NGO Representative</SelectItem>
                                            <SelectItem value="District Welfare Officer">District Welfare Officer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input
                                    placeholder="Enter detailed task description"
                                    value={newTaskDescription}
                                    onChange={(e) => setNewTaskDescription(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Due Date</Label>
                                    <Input
                                        type="date"
                                        value={newTaskDueDate}
                                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select onValueChange={(val: any) => setNewTaskPriority(val)} value={newTaskPriority}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button className="w-full mt-4" onClick={handleCreateTask}>Create Task</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {tasks.map((task) => (
                    <Card key={task.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-start gap-4">
                                <div className="mt-1">{getStatusIcon(task.status)}</div>
                                <div>
                                    <h3 className="font-medium text-lg">{task.title}</h3>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <User className="h-4 w-4" /> {task.assignee}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" /> {task.dueDate}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                                    {task.priority.toUpperCase()}
                                </Badge>
                                <Select
                                    defaultValue={task.status}
                                    onValueChange={(value: TaskStatus) => {
                                        setTasks(tasks.map(t =>
                                            t.id === task.id ? { ...t, status: value } : t
                                        ));
                                    }}
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
