import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DiagnosticData } from '@/types/DiagnosticData'

import { ConsoleOutput } from './ConsoleOutput'
import { DescriptionInfo } from './DescriptionInfo'
import { Header } from './Header'
import { LogsTable } from './LogsTable'
import { QueryResultsPanel } from './QueryResultsPanel'
import { RawContent } from './RawContent'

interface DevToolsUIProps {
  diagnosticData: DiagnosticData
  slackFileId?: string
}

interface TabHeaderProps {
  id: string
  title: string
  count: number | undefined
  variant?: 'destructive' | 'light'
}

const TabHeader = ({ id, title, count, variant = 'light' }: TabHeaderProps) => {
  return (
    <TabsTrigger value={id} className="tabs-trigger">
      {title}
      <Badge variant={variant} className="ml-2">
        {count}
      </Badge>
    </TabsTrigger>
  )
}

export const DevToolsUI = ({ diagnosticData, slackFileId }: DevToolsUIProps) => {
  const [frontendErrorCount, setFrontendErrorCount] = useState(
    diagnosticData.frontendErrors?.length
  )

  // Since quite a bit is optional, be smart about what to show first based on importance and fallback to the raw content
  const initialTab =
    diagnosticData.backendErrors && diagnosticData.backendErrors.length > 0
      ? 'backendErrors'
      : diagnosticData.bugReportDetails
        ? 'details'
        : diagnosticData.entityInfo
          ? 'entity'
          : 'raw'

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header diagnosticData={diagnosticData} slackFileId={slackFileId} />
      <DescriptionInfo diagnosticData={diagnosticData} />
      <div className="w-full p-4 overflow-auto relative">
        <Tabs defaultValue={initialTab} className="w-full">
          <div className="w-full bg-background z-10">
            <TabsList className="tabs-list mb-4">
              {diagnosticData.bugReportDetails && (
                <TabsTrigger value="details">Details</TabsTrigger>
              )}
              {diagnosticData.backendErrors && (
                <TabHeader
                  id="backendErrors"
                  title="Backend Errors"
                  count={diagnosticData.backendErrors.length}
                  variant="destructive"
                />
              )}
              {diagnosticData.userLogs && (
                <TabHeader id="userLogs" title="User Logs" count={diagnosticData.userLogs.length} />
              )}
              {diagnosticData.logs && (
                <TabHeader id="logs" title="System Logs" count={diagnosticData.logs.length} />
              )}
              <TabHeader
                id="frontendErrors"
                title="Console output"
                count={frontendErrorCount}
                variant="destructive"
              />
              {diagnosticData.entityInfo && <TabsTrigger value="entity">Entity info</TabsTrigger>}
              {diagnosticData.queryResults && (
                <TabHeader
                  id="queryResults"
                  title="Query Results"
                  count={diagnosticData.queryResults.row_count}
                />
              )}
              <TabsTrigger value="raw">Raw Data</TabsTrigger>
            </TabsList>
          </div>

          {diagnosticData.bugReportDetails && (
            <TabsContent value="details" className="h-[calc(100%-3rem)]">
              <RawContent content={diagnosticData.bugReportDetails} />
            </TabsContent>
          )}
          {diagnosticData.backendErrors && (
            <TabsContent value="backendErrors" className="h-[calc(100%-3rem)]">
              <LogsTable logs={diagnosticData.backendErrors} title="Backend Errors" />
            </TabsContent>
          )}
          {diagnosticData.userLogs && (
            <TabsContent value="userLogs" className="h-[calc(100%-3rem)]">
              <LogsTable logs={diagnosticData.userLogs} title="User Logs" />
            </TabsContent>
          )}
          {diagnosticData.logs && (
            <TabsContent value="logs" className="h-[calc(100%-3rem)]">
              <LogsTable logs={diagnosticData.logs} title="System Logs" />
            </TabsContent>
          )}
          <TabsContent value="frontendErrors" className="h-[calc(100%-3rem)]">
            <ConsoleOutput
              errors={diagnosticData.frontendErrors}
              onErrorCountChange={setFrontendErrorCount}
            />
          </TabsContent>
          {diagnosticData.entityInfo && (
            <TabsContent value="entity" className="h-[calc(100%-3rem)]">
              <RawContent content={diagnosticData.entityInfo} />
            </TabsContent>
          )}
          {diagnosticData.queryResults && (
            <TabsContent value="queryResults" className="h-[calc(100%-3rem)]">
              <QueryResultsPanel data={diagnosticData.queryResults} />
            </TabsContent>
          )}
          <TabsContent value="raw" className="h-[calc(100%-3rem)]">
            <RawContent content={diagnosticData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
