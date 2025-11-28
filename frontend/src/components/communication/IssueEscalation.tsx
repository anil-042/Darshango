import { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

interface Issue {
    id: string;
    title: string;
    description: string;
    raisedBy: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    status: 'open' | 'resolved' | 'escalated';
    date: string;
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from 'lucide-react';

export function IssueEscalation() {
    const [issues, setIssues] = useState<Issue[]>([
        {
            id: '1',
            title: 'Fund Release Delay - Project #1024',
            description: 'Second installment pending from State Treasury for over 30 days.',
            raisedBy: 'District Magistrate',
            severity: 'critical',
            status: 'escalated',
            date: '2024-03-15'
        },
        {
            id: '2',
            title: 'Land Dispute - Hostel Site B',
            description: 'Local encroachment issue halting construction.',
            raisedBy: 'PWD Engineer',
            severity: 'high',
            status: 'open',
            date: '2024-03-18'
        }
    ]);

    const [isRaiseIssueOpen, setIsRaiseIssueOpen] = useState(false);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-600 text-white hover:bg-red-600/80';
            case 'high': return 'bg-orange-500 text-white hover:bg-orange-500/80';
            case 'medium': return 'bg-yellow-500 text-white hover:bg-yellow-500/80';
            default: return 'bg-blue-500 text-white hover:bg-blue-500/80';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'resolved': return <Badge className="bg-green-500">Resolved</Badge>;
            case 'escalated': return <Badge className="bg-red-500">Escalated to Ministry</Badge>;
            default: return <Badge variant="secondary">Open</Badge>;
        }
    };

    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

    const handleResolve = (id: string) => {
        setIssues(issues.map(issue =>
            issue.id === id ? { ...issue, status: 'resolved' as const } : issue
        ));
    };

    const handleEscalate = (id: string) => {
        setIssues(issues.map(issue =>
            issue.id === id ? { ...issue, status: 'escalated' as const } : issue
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Active Issues</h3>
                    <p className="text-sm text-slate-500">Track and resolve project-related issues</p>
                </div>

                <Dialog open={isRaiseIssueOpen} onOpenChange={setIsRaiseIssueOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-red-600 hover:bg-red-700">
                            <Plus className="mr-2 h-4 w-4" /> Raise New Issue
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Raise New Issue</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Issue Title</Label>
                                <Input placeholder="Brief title of the issue" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Related Project ID</Label>
                                    <Input placeholder="e.g., AG-2024-001" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Severity</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select severity" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="critical">Critical (Stalls Project)</SelectItem>
                                            <SelectItem value="high">High (Major Delay)</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea placeholder="Detailed description of the issue..." className="min-h-[100px]" />
                            </div>

                            <Button className="w-full bg-red-600 hover:bg-red-700 mt-2" onClick={() => setIsRaiseIssueOpen(false)}>
                                <AlertTriangle className="mr-2 h-4 w-4" /> Submit Issue
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {issues.map((issue) => (
                    <Card key={issue.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-lg font-bold">{issue.title}</h4>
                                        <Badge className={getSeverityColor(issue.severity)}>
                                            {issue.severity.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        Raised by {issue.raisedBy} on {issue.date}
                                    </p>
                                </div>
                                {getStatusBadge(issue.status)}
                            </div>

                            <p className="text-slate-700 mb-4 bg-slate-50 p-3 rounded-md">
                                {issue.description}
                            </p>

                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedIssue(issue)}
                                >
                                    View Details
                                </Button>
                                {issue.status !== 'resolved' && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-green-600 hover:text-green-700"
                                            onClick={() => handleResolve(issue.id)}
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" /> Mark Resolved
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-red-600 hover:bg-red-700"
                                            onClick={() => handleEscalate(issue.id)}
                                        >
                                            <ArrowUpRight className="mr-2 h-4 w-4" /> Escalate
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* View Details Dialog */}
            <Dialog open={!!selectedIssue} onOpenChange={(open) => !open && setSelectedIssue(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Issue Details</DialogTitle>
                    </DialogHeader>
                    {selectedIssue && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-start border-b pb-4">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{selectedIssue.title}</h3>
                                    <div className="flex gap-2">
                                        <Badge className={getSeverityColor(selectedIssue.severity)}>
                                            {selectedIssue.severity.toUpperCase()}
                                        </Badge>
                                        {getStatusBadge(selectedIssue.status)}
                                    </div>
                                </div>
                                <div className="text-right text-sm text-slate-500">
                                    <p>ID: {selectedIssue.id}</p>
                                    <p>{selectedIssue.date}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-500 mb-1">Description</h4>
                                    <div className="bg-slate-50 p-4 rounded-lg text-slate-800">
                                        {selectedIssue.description}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-500 mb-1">Raised By</h4>
                                        <p className="font-medium">{selectedIssue.raisedBy}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-500 mb-1">Current Status</h4>
                                        <p className="font-medium capitalize">{selectedIssue.status}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button variant="outline" onClick={() => setSelectedIssue(null)}>Close</Button>
                                {selectedIssue.status !== 'resolved' && (
                                    <Button
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => {
                                            handleResolve(selectedIssue.id);
                                            setSelectedIssue(null);
                                        }}
                                    >
                                        Mark as Resolved
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
