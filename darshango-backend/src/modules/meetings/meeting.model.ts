export interface Meeting {
    id?: string;
    hostId: string;
    hostName: string;
    meetingWith: string;
    meetingId: string; // The Google Meet ID or URL
    timestamp: string;
    createdAt?: any;
}
