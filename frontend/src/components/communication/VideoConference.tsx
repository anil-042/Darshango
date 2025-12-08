import { useState, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users, MessageSquare, History, Copy, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/services/api';
import { User } from '@/types';
import { toast } from 'sonner';

export function VideoConference() {
  const [meetingId, setMeetingId] = useState('');
  const [meetingWith, setMeetingWith] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.users.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await api.meetings.getAll();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch meeting history', error);
    }
  };

  const generateMeetingLink = async () => {
    // Generate random room name
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const segment = (length: number) => Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const roomName = `${segment(3)}-${segment(4)}-${segment(3)}`;
    const link = `https://meet.jit.si/${roomName}`;
    setGeneratedLink(link);
    setMeetingId(roomName); // Also set the input

    try {
      // Record the meeting immediately
      await api.meetings.create({
        meetingWith: meetingWith || 'Shared Link',
        meetingId: roomName
      });

      // Refresh history
      await fetchHistory();
      toast.success("Meeting link generated and recorded");
    } catch (error) {
      console.error('Failed to record generated meeting', error);
      toast.error("Link generated but failed to save to history");
    }
  };

  const handleJoin = async () => {
    if (meetingId && meetingWith) {
      setIsLoading(true);
      try {
        // Record the meeting
        await api.meetings.create({
          meetingWith,
          meetingId
        });

        // Refresh history
        await fetchHistory();

        // Check if input is a full URL or just a code
        let url = meetingId;
        if (!meetingId.startsWith('http')) {
          // Default to Jitsi for consistency with current flow, or Google Meet if previously preferred.
          // Screenshot shows Jitsi.
          url = `https://meet.jit.si/${meetingId}`;
        }

        // Open in new tab
        window.open(url, '_blank');

        // Reset form
        setMeetingId('');
        setMeetingWith('');
        setGeneratedLink('');
      } catch (error) {
        console.error('Failed to join meeting', error);
        alert('Failed to record meeting. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Join Meeting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="meeting-with">Meeting With</Label>
              <Select value={meetingWith} onValueChange={setMeetingWith}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={`${user.name} (${user.role})`}>
                      {user.name} - {user.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting-id">Meeting ID / Room Name</Label>
              <div className="flex gap-2">
                <Input
                  id="meeting-id"
                  placeholder="Enter room name (e.g., project-review-2024)"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleJoin} disabled={!meetingId || !meetingWith || isLoading}>
                  {isLoading ? 'Joining...' : 'Join Meeting'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a unique room name. Meeting will open within this page.
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or create a shareable meeting link
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={generateMeetingLink}>
              <Video className="w-4 h-4 mr-2" />
              Create Meeting
            </Button>

            {generatedLink && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border relative animate-in fade-in slide-in-from-top-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => setGeneratedLink('')}
                >
                  <X className="h-4 w-4" />
                </Button>
                <h4 className="text-sm font-medium mb-2">Meeting Link Generated</h4>
                <div className="flex items-center gap-2">
                  <Input readOnly value={generatedLink} className="bg-white" />
                  <Button variant="outline" size="icon" onClick={copyLink} title="Copy Link">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="icon" onClick={() => window.open(generatedLink, '_blank')} title="Open Meeting">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Share this link with the selected user to join the meeting.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Meeting History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No meeting history found.</p>
              </div>
            ) : (
              history.map((meeting, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="font-medium">Meeting with {meeting.meetingWith}</h4>
                    <p className="text-sm text-slate-500">
                      {new Date(meeting.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      ID: {meeting.meetingId}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.open(meeting.meetingId.startsWith('http') ? meeting.meetingId : `https://meet.jit.si/${meeting.meetingId}`, '_blank')}>
                    Rejoin
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
