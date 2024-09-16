import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RRWebPlayer from './RRWebPlayer'
import XHREventsTable from './XHREventsTable'

interface DevToolsUIProps {
  jsonData: {
    rrwebEvents: any[];
    xhrEvents: any[];
  };
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  startTimestamp: number;
}

export default function DevToolsUI({ jsonData, currentTime, onTimeUpdate, startTimestamp }: DevToolsUIProps) {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background text-foreground">
      {/* Session Player */}
      <div className="w-full lg:w-3/5 p-4 border-b lg:border-b-0 lg:border-r">
        <h2 className="text-2xl font-bold mb-4">Session Player</h2>
        <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-2rem)]">
          <RRWebPlayer jsonData={jsonData} onTimeUpdate={onTimeUpdate} />
        </div>
      </div>

      {/* DevTools */}
      <div className="w-full lg:w-2/5 p-4 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">DevTools</h2>
        <Tabs defaultValue="network" className="w-full">
          <TabsList>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="console">Console</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
          <TabsContent value="network" className="h-[calc(100%-3rem)]">
            <XHREventsTable
              xhrEvents={jsonData.xhrEvents}
              currentTime={currentTime}
              startTimestamp={startTimestamp}
            />
          </TabsContent>
          <TabsContent value="console">
            Coming soon
          </TabsContent>
          <TabsContent value="metadata">
            Coming soon
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}