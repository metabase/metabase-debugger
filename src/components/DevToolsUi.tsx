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
  count: number | null
  variant?: 'destructive' | 'light'
}

const TabHeader = ({ id, title, count, variant = 'light' }: TabHeaderProps) => {
  if (count == null) {
    return null
  }

  const hasCount = count > -1

  return (
    <TabsTrigger value={id} className="tabs-trigger">
      {title}
      {hasCount && (
        <Badge variant={variant} className="ml-2">
          {count}
        </Badge>
      )}
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
              <TabHeader id="details" title="Details" count={-1} />
              <TabHeader
                id="backendErrors"
                title="Backend Errors"
                count={diagnosticData?.backendErrors?.length}
                variant="destructive"
              />
              <TabHeader id="userLogs" title="User Logs" count={diagnosticData?.userLogs?.length} />
              <TabHeader id="logs" title="System Logs" count={diagnosticData?.logs?.length} />
              <TabHeader
                id="frontendErrors"
                title="Browser errors"
                count={frontendErrorCount}
                variant="destructive"
              />
              <TabHeader
                id="entity"
                title="Entity info"
                count={diagnosticData.entityInfo ? -1 : null}
                variant="destructive"
              />
              <TabHeader
                id="queryResults"
                title="Query Results"
                count={diagnosticData?.queryResults?.row_count ?? null}
              />
              <TabHeader id="raw" title="Raw Data" count={-1} />
            </TabsList>
          </div>

          <TabsContent value="details" className="h-[calc(100%-3rem)]">
            <RawContent content={diagnosticData.bugReportDetails} />
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
          <TabsContent value="frontendErrors" className="h-[calc(100%-3rem)]">
            <ConsoleOutput
              errors={diagnosticData.frontendErrors}
              onErrorCountChange={setFrontendErrorCount}
            />
          </TabsContent>
          <TabsContent value="entity" className="h-[calc(100%-3rem)]">
            <RawContent content={diagnosticData.entityInfo} />
          </TabsContent>
          <TabsContent value="queryResults" className="h-[calc(100%-3rem)]">
            <QueryResultsPanel data={diagnosticData.queryResults} />
          </TabsContent>
          <TabsContent value="raw" className="h-[calc(100%-3rem)]">
            <RawContent content={diagnosticData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
