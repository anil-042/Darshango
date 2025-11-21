import { useState } from 'react';
import { Send, Paperclip, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
    isMe: boolean;
}

export function MessageBoard() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'State Nodal Officer',
            content: 'Please update the status of the Adarsh Gram projects in Patna district by EOD.',
            timestamp: '10:30 AM',
            isMe: false,
        },
        {
            id: '2',
            sender: 'You',
            content: 'Sure, we are compiling the reports now. Will submit shortly.',
            timestamp: '10:35 AM',
            isMe: true,
        },
        {
            id: '3',
            sender: 'District Magistrate',
            content: 'Also ensure the utilization certificates are attached.',
            timestamp: '10:40 AM',
            isMe: false,
        }
    ]);

    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (!newMessage.trim()) return;

        setMessages([
            ...messages,
            {
                id: Date.now().toString(),
                sender: 'You',
                content: newMessage,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: true,
            }
        ]);
        setNewMessage('');
    };

    return (
        <div className="flex h-[600px] border rounded-lg overflow-hidden bg-white shadow-sm">
            {/* Sidebar - Channels */}
            <div className="w-64 bg-slate-50 border-r flex flex-col">
                <div className="p-4 border-b font-semibold text-lg">Channels</div>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {['General', 'Adarsh Gram', 'GIA Grants', 'Hostel Construction', 'Announcements'].map((channel, i) => (
                            <Button
                                key={channel}
                                variant={i === 0 ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                            >
                                # {channel}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-white">
                    <div>
                        <h3 className="font-bold"># General</h3>
                        <p className="text-xs text-slate-500">General coordination and updates</p>
                    </div>
                    <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
                </div>

                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-3 max-w-[70%] ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className={`flex items-baseline gap-2 mb-1 ${msg.isMe ? 'justify-end' : ''}`}>
                                            <span className="text-sm font-semibold">{msg.sender}</span>
                                            <span className="text-xs text-slate-400">{msg.timestamp}</span>
                                        </div>
                                        <div className={`p-3 rounded-lg text-sm ${msg.isMe
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t bg-white">
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <Input
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <Button onClick={handleSend}>
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
