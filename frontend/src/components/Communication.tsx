import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoConference } from "./communication/VideoConference";
import { MessageBoard } from "./communication/MessageBoard";
import { Video, MessageSquare } from "lucide-react";

export function Communication() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Communication & Coordination</h1>
                <p className="text-muted-foreground mt-2">
                    Central hub for meetings and team messaging.
                </p>
            </div>

            <Tabs defaultValue="video" className="space-y-4">
                <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 rounded-lg">
                    <TabsTrigger value="video" className="flex-1 sm:flex-none px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Video className="h-4 w-4 mr-2" />
                        Video Conference
                    </TabsTrigger>
                    <TabsTrigger value="messages" className="flex-1 sm:flex-none px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Messages
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="video" className="space-y-4">
                    <VideoConference />
                </TabsContent>

                <TabsContent value="messages" className="space-y-4">
                    <MessageBoard />
                </TabsContent>
            </Tabs>
        </div>
    );
}
