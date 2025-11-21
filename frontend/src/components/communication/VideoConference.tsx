import { useState } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function VideoConference() {
  const [isInCall, setIsInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [meetingId, setMeetingId] = useState('');

  const handleJoin = () => {
    if (meetingId) {
      setIsInCall(true);
    }
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setMeetingId('');
  };

  if (isInCall) {
    return (
      <div className="flex flex-col h-[600px] bg-slate-900 rounded-lg overflow-hidden">
        <div className="flex-1 p-4 relative">
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute bottom-4 left-4 text-white bg-black/50 px-2 py-1 rounded text-sm">
                You (Host)
              </div>
              {videoOn ? (
                <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                  <Users className="h-20 w-20 text-slate-500" />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-full bg-slate-600 flex items-center justify-center text-white text-2xl font-bold">
                  YO
                </div>
              )}
            </div>
            <div className="bg-slate-800 rounded-lg flex items-center justify-center relative">
              <div className="absolute bottom-4 left-4 text-white bg-black/50 px-2 py-1 rounded text-sm">
                District Officer (Patna)
              </div>
              <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                DO
              </div>
            </div>
          </div>
        </div>

        <div className="h-20 bg-slate-800 flex items-center justify-center gap-4 px-4">
          <Button
            variant={micOn ? "secondary" : "destructive"}
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={() => setMicOn(!micOn)}
          >
            {micOn ? <Mic /> : <MicOff />}
          </Button>

          <Button
            variant={videoOn ? "secondary" : "destructive"}
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={() => setVideoOn(!videoOn)}
          >
            {videoOn ? <Video /> : <VideoOff />}
          </Button>

          <Button
            variant="destructive"
            size="icon"
            className="rounded-full h-12 w-12 px-8 w-auto"
            onClick={handleEndCall}
          >
            <PhoneOff className="mr-2 h-5 w-5" /> End Call
          </Button>

          <Button variant="secondary" size="icon" className="rounded-full h-12 w-12">
            <Users />
          </Button>

          <Button variant="secondary" size="icon" className="rounded-full h-12 w-12">
            <MessageSquare />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Join Meeting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="meeting-id">Meeting ID</Label>
            <div className="flex gap-4">
              <Input
                id="meeting-id"
                placeholder="Enter meeting code"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleJoin} disabled={!meetingId}>
                Join Meeting
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: "Weekly Progress Review", time: "10:00 AM", date: "Today", host: "State Nodal Officer" },
              { title: "Adarsh Gram Planning", time: "2:00 PM", date: "Tomorrow", host: "District Magistrate" },
            ].map((meeting, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                <div>
                  <h4 className="font-medium">{meeting.title}</h4>
                  <p className="text-sm text-slate-500">
                    {meeting.date} at {meeting.time} • {meeting.host}
                  </p>
                </div>
                <Button variant="outline" size="sm">Join</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
