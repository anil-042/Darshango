import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, MoreVertical, Hash, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Project } from '@/types';

interface Message {
    id: string;
    senderName: string;
    senderId: string;
    content: string;
    attachment?: {
        url: string;
        type: string;
        name: string;
    };
    timestamp: string;
    createdAt: string;
}

export function MessageBoard() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchMessages(selectedProject.id);
            const interval = setInterval(() => fetchMessages(selectedProject.id), 5000);
            return () => clearInterval(interval);
        }
    }, [selectedProject]);

    const fetchProjects = async () => {
        try {
            const data = await api.projects.getAll();
            setProjects(data);
            if (data.length > 0) {
                setSelectedProject(data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch projects', error);
        }
    };

    const fetchMessages = async (projectId: string) => {
        try {
            const data = await api.messages.getByProject(projectId);
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        }
    };

    const handleSend = async () => {
        if ((!newMessage.trim() && !selectedFile) || !selectedProject) return;

        try {
            await api.messages.create(selectedProject.id, newMessage, selectedFile || undefined);
            setNewMessage('');
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            fetchMessages(selectedProject.id);
        } catch (error) {
            console.error('Failed to send message', error);
            alert('Failed to send message');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <div className="flex h-[600px] border rounded-lg overflow-hidden bg-white shadow-sm">
            {/* Sidebar - Channels (Projects) */}
            <div className="w-64 bg-slate-50 border-r flex flex-col">
                <div className="p-4 border-b font-semibold text-lg">Project Channels</div>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {projects.length === 0 ? (
                            <p className="text-sm text-slate-500 p-4">No projects found.</p>
                        ) : (
                            projects.map((project) => (
                                <Button
                                    key={project.id}
                                    variant={selectedProject?.id === project.id ? 'secondary' : 'ghost'}
                                    className="w-full justify-start truncate"
                                    onClick={() => setSelectedProject(project)}
                                    title={project.title}
                                >
                                    <Hash className="h-4 w-4 mr-2 opacity-50" />
                                    <span className="truncate">{project.title}</span>
                                </Button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedProject ? (
                    <>
                        <div className="p-4 border-b flex justify-between items-center bg-white">
                            <div>
                                <h3 className="font-bold flex items-center">
                                    <Hash className="h-5 w-5 mr-2 text-slate-400" />
                                    {selectedProject.title}
                                </h3>
                                <p className="text-xs text-slate-500">{selectedProject.district}, {selectedProject.state}</p>
                            </div>
                            <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
                        </div>

                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.length === 0 ? (
                                    <div className="text-center text-slate-400 py-10">
                                        No messages yet. Start the conversation!
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isMe = msg.senderId === user?.id;
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`flex gap-3 max-w-[70%] ${isMe ? 'flex-row-reverse' : ''}`}>
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{msg.senderName[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className={`flex items-baseline gap-2 mb-1 ${isMe ? 'justify-end' : ''}`}>
                                                            <span className="text-sm font-semibold">{msg.senderName}</span>
                                                            <span className="text-xs text-slate-400">{msg.timestamp}</span>
                                                        </div>
                                                        <div className={`p-3 rounded-lg text-sm ${isMe
                                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                                            : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                                            }`}>
                                                            {msg.content && <p className="mb-2">{msg.content}</p>}
                                                            {msg.attachment && (
                                                                <div className="mt-2">
                                                                    {msg.attachment.type === 'image' ? (
                                                                        <img
                                                                            src={msg.attachment.url}
                                                                            alt="attachment"
                                                                            className="max-w-full rounded-md max-h-[200px] object-cover"
                                                                        />
                                                                    ) : (
                                                                        <a
                                                                            href={msg.attachment.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="flex items-center gap-2 text-blue-100 hover:underline"
                                                                        >
                                                                            <File className="h-4 w-4" />
                                                                            {msg.attachment.name}
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t bg-white">
                            {selectedFile && (
                                <div className="flex items-center gap-2 mb-2 p-2 bg-slate-100 rounded-md">
                                    <File className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm text-slate-700 truncate max-w-[200px]">{selectedFile.name}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                                        setSelectedFile(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                                <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
                                    <Paperclip className="h-5 w-5" />
                                </Button>
                                <Input
                                    placeholder={`Message #${selectedProject.title}`}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <Button onClick={handleSend}>
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400">
                        Select a project channel to start chatting
                    </div>
                )}
            </div>
        </div>
    );
}
