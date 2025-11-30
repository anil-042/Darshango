import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import axiosInstance from '../services/axiosInstance';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
}

export function HelpChatbox() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm your PM-AJAY assistant. How can I help you today?",
            sender: 'assistant',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        console.log("HelpChatbox mounted. isOpen:", isOpen);
    }, [isOpen]);

    const handleSendMessage = async (textOverride?: string) => {
        const textToSend = textOverride || inputValue;
        if (!textToSend.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: textToSend,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Send message to backend proxy
            const response = await axiosInstance.post('/chat', {
                chatInput: textToSend
            });

            console.log('Backend proxy response:', response.data);

            let responseText = "I received your message but couldn't parse the response.";

            // Handle various potential response formats from n8n (proxied)
            if (typeof response.data === 'string') {
                responseText = response.data;
            } else if (typeof response.data === 'object') {
                if (response.data.output) responseText = response.data.output;
                else if (response.data.text) responseText = response.data.text;
                else if (response.data.message) responseText = response.data.message;
                else if (response.data.response) responseText = response.data.response;
                else responseText = JSON.stringify(response.data); // Fallback
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'assistant',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);

        } catch (error) {
            console.error('Error sending message to backend proxy:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting to the assistant right now. Please try again later.",
                sender: 'assistant',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: '24px',
                    zIndex: 99999,
                    backgroundColor: '#2563eb', // blue-600
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    borderRadius: '9999px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    border: 'none'
                }}
                className="hover:scale-105 transition-transform duration-200"
            >
                <MessageCircle className="w-5 h-5" />
                <span>Need Help?</span>
            </button>
        );
    }

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '24px',
                left: '24px',
                zIndex: 99999,
                height: isMinimized ? '60px' : '500px',
                width: isMinimized ? '320px' : '384px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                transition: 'all 200ms',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white rounded-t-lg">
                <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>PM-AJAY Assistant</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1.5 hover:bg-blue-700 rounded transition-colors"
                    >
                        <Minimize2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 hover:bg-blue-700 rounded transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            {!isMinimized && (
                <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: '380px' }}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg px-4 py-2 ${message.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                        }`}
                                >
                                    <p className="whitespace-pre-line">{message.text}</p>
                                    <span
                                        className={`text-xs mt-1 block ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                                            }`}
                                    >
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm">Typing...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions */}
                    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleSendMessage('What can you help me with?')}
                                className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-700"
                            >
                                Help Topics
                            </button>
                            <button
                                onClick={() => handleSendMessage('How do I create a new project?')}
                                className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-700"
                            >
                                Create Project
                            </button>
                            <button
                                onClick={() => handleSendMessage('Show me fund flow details')}
                                className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-700"
                            >
                                Fund Tracking
                            </button>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1 border-gray-300"
                            disabled={isLoading}
                        />
                        <Button
                            onClick={() => handleSendMessage()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2"
                            disabled={!inputValue.trim() || isLoading}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}