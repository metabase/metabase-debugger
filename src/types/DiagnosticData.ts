export interface DiagnosticData {
  url: string
  entityInfo: {
    bugReportDetails?: Record<string, any>
    'metabase-info'?: Record<string, any>
    'system-info'?: Record<string, any>
  }
  frontendErrors: any[]
  backendErrors: any[]
  userLogs: any[]
  logs: any[]
  description: string
  browserInfo?: Record<string, any>
}
