import { QueryResults } from './QueryResults'

export interface DiagnosticData {
  url: string
  description?: string
  bugReportDetails?: {
    'metabase-info'?: Record<string, any>
    'system-info'?: Record<string, any>
    [key: string]: any
  }
  browserInfo?: Record<string, any>
  entityInfo: {
    entityName: string
    name: string
    [key: string]: any
  }
  frontendErrors: any[]
  backendErrors: any[]
  userLogs: any[]
  logs: any[]
  queryResults?: QueryResults
}
