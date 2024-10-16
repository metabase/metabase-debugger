import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RRWebPlayer from './RRWebPlayer'
import XHREventsTable from './XHREventsTable'
import ConsoleOutput from './ConsoleOutput'
import MetadataTable from './MetadataTable'
import LogsTable from "./LogsTable"
import { Badge } from "@/components/ui/badge"

interface DevToolsUIProps {
  jsonData: {
    rrwebEvents: any[];
    xhrEvents: any[];
    metadata?: Record<string, any>;
    logs?: any[];
    userLogs?: any[];
    backendErrors?: any[];
    basicInfo?: {
      currentUrl: string;
      id: number;
      name: string;
    };
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
        {jsonData.basicInfo && (
          <div className="mb-4 p-4 bg-muted rounded-md">
            <p><strong>Name:</strong> {jsonData.basicInfo.name}</p>
            <p><strong>ID:</strong> {jsonData.basicInfo.id}</p>
            <p><strong>Current URL:</strong> {jsonData.basicInfo.currentUrl}</p>
          </div>
        )}
        <div className="h-[calc(100vh-12rem)] lg:h-[calc(100vh-6rem)]">
          <RRWebPlayer jsonData={jsonData} onTimeUpdate={onTimeUpdate} />
        </div>
      </div>

      {/* DevTools */}
      <div className="w-full lg:w-2/5 p-4 overflow-auto relative">
        <h2 className="text-2xl font-bold mb-4">DevTools</h2>
        <Tabs defaultValue="network" className="w-full">
          <TabsList className="tabs-list">
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="console">Console</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="userLogs">User Logs</TabsTrigger>
            <TabsTrigger value="backendErrors" className="tabs-trigger relative">
              Backend Errors
              {jsonData.backendErrors && jsonData.backendErrors.length > 0 && (
                <Badge variant="destructive" className="ml-2 absolute -top-2 -right-2">
                  {jsonData.backendErrors.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="network" className="h-[calc(100%-3rem)]">
            <XHREventsTable
              xhrEvents={jsonData.xhrEvents}
              currentTime={currentTime}
              startTimestamp={startTimestamp}
            />
          </TabsContent>
          <TabsContent value="console" className="h-[calc(100%-3rem)]">
            <ConsoleOutput
              jsonData={jsonData}
              startTimestamp={startTimestamp}
            />
          </TabsContent>
          <TabsContent value="metadata" className="h-[calc(100%-3rem)]">
            <MetadataTable metadata={jsonData?.metadata || {}} />
          </TabsContent>
          <TabsContent value="logs" className="h-[calc(100%-3rem)]">
            <LogsTable logs={jsonData.logs || []} title="Logs"/>
          </TabsContent>
          <TabsContent value="userLogs" className="h-[calc(100%-3rem)]">
            <LogsTable logs={jsonData.userLogs || []} title="User Logs" />
          </TabsContent>
          <TabsContent value="backendErrors" className="h-[calc(100%-3rem)]">
            <LogsTable logs={jsonData.backendErrors || []} title="Backend Errors" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
