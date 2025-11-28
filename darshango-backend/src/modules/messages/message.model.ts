export interface Message {
    id?: string;
    projectId: string;
    senderId: string;
    senderName: string;
    content: string;
    attachment?: {
        url: string;
        type: string; // 'image', 'document', etc.
        name: string;
    };
    timestamp: string;
    createdAt?: any;
}
