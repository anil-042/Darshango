import { useState, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users, MessageSquare, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/services/api';

export function VideoConference() {
  const [meetingId, setMeetingId] = useState('');
  const [meetingWith, setMeetingWith] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await api.meetings.getAll();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch meeting history', error);
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
          // If it's just a code (e.g., abc-defg-hij), construct the URL
          url = `https://meet.google.com/${meetingId}`;
        }

        // Open in new tab
        window.open(url, '_blank');

        // Reset form
        setMeetingId('');
        setMeetingWith('');
      } catch (error) {
        console.error('Failed to join meeting', error);
        alert('Failed to record meeting. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Join Meeting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-with">Meeting With</Label>
              <Input
                id="meeting-with"
                placeholder="e.g. District Magistrate, Nodal Officer"
                value={meetingWith}
                onChange={(e) => setMeetingWith(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-id">Meeting ID</Label>
              <div className="flex gap-4">
                <Input
                  id="meeting-id"
                  placeholder="Enter meeting code or URL"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleJoin} disabled={!meetingId || !meetingWith || isLoading}>
                  {isLoading ? 'Joining...' : 'Join Meeting'}
                </Button>
              </div>
            </div>
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
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No meeting history found.</p>
            ) : (
              history.map((meeting, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                  <div>
                    <h4 className="font-medium">Meeting with {meeting.meetingWith}</h4>
                    <p className="text-sm text-slate-500">
                      {new Date(meeting.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      ID: {meeting.meetingId}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.open(meeting.meetingId.startsWith('http') ? meeting.meetingId : `https://meet.google.com/${meeting.meetingId}`, '_blank')}>
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
