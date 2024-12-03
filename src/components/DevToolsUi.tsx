import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DiagnosticData } from '@/types/DiagnosticData'

import { ConsoleOutput } from './ConsoleOutput'
import LogsTable from './LogsTable'
import MetadataTable from './MetadataTable'
import { RawContent } from './RawContent'

interface DevToolsUIProps {
  diagnosticData: DiagnosticData
}

export default function DevToolsUI({ diagnosticData }: DevToolsUIProps) {
  const [frontendErrorCount, setFrontendErrorCount] = useState(0)

  const jsonString = JSON.stringify(diagnosticData, null, 2)

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="w-full p-4 overflow-auto relative">
        <Tabs defaultValue="basicInfo" className="w-full">
          <div className="sticky top-0 left-0 w-full bg-background z-10">
            <TabsList className="tabs-list mb-4">
              <TabsTrigger value="basicInfo">Basic Info</TabsTrigger>
              <TabsTrigger value="entityInfo">Entity Info</TabsTrigger>
              <TabsTrigger value="frontendErrors" className="tabs-trigger relative">
                Frontend Errors
                {frontendErrorCount > 0 && (
                  <Badge variant="destructive" className="ml-2 absolute -top-2 -right-2 z-10">
                    {frontendErrorCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="backendErrors" className="tabs-trigger relative">
                Backend Errors
                {diagnosticData.backendErrors.length > 0 && (
                  <Badge variant="destructive" className="ml-2 absolute -top-2 -right-2">
                    {diagnosticData.backendErrors.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="userLogs">User Logs</TabsTrigger>
              <TabsTrigger value="logs">System Logs</TabsTrigger>
              <TabsTrigger value="raw">Raw Data</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="basicInfo" className="h-[calc(100%-3rem)]">
            <div className="space-y-2">
              <p>
                <strong>URL:</strong> {diagnosticData.url}
              </p>
              <p>
                <strong>Description:</strong> {diagnosticData.description}
              </p>
              {diagnosticData.browserInfo && (
                <>
                  <p>
                    <strong>Browser:</strong> {diagnosticData.browserInfo.browserName} {diagnosticData.browserInfo.browserVersion}
                  </p>
                  <p>
                    <strong>OS:</strong> {diagnosticData.browserInfo.os} {diagnosticData.browserInfo.osVersion}
                  </p>
                  <p>
                    <strong>Platform:</strong> {diagnosticData.browserInfo.platform}
                  </p>
                  <p>
                    <strong>Language:</strong> {diagnosticData.browserInfo.language}
                  </p>
                </>
              )}
            </div>
          </TabsContent>
          <TabsContent value="entityInfo" className="h-[calc(100%-3rem)]">
            <MetadataTable metadata={diagnosticData.entityInfo} />
          </TabsContent>
          <TabsContent value="frontendErrors" className="h-[calc(100%-3rem)]">
            <ConsoleOutput
              errors={diagnosticData.frontendErrors}
              onErrorCountChange={setFrontendErrorCount}
            />
          </TabsContent>
          <TabsContent value="backendErrors" className="h-[calc(100%-3rem)]">
            <LogsTable logs={diagnosticData.backendErrors} title="Backend Errors" />
          </TabsContent>
          <TabsContent value="userLogs" className="h-[calc(100%-3rem)]">
            <LogsTable logs={diagnosticData.userLogs} title="User Logs" />
          </TabsContent>
          <TabsContent value="logs" className="h-[calc(100%-3rem)]">
            <LogsTable logs={diagnosticData.logs} title="System Logs" />
          </TabsContent>
          <TabsContent value="raw" className="h-[calc(100%-3rem)]">
            <RawContent content={jsonString} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
