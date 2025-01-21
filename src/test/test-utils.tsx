import { render } from '@testing-library/react'
import { ReactElement } from 'react'

import { DiagnosticData } from '@/types/DiagnosticData'

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <div className="light">{children}</div>
}

const customRender = (ui: ReactElement, options = {}) =>
  render(ui, {
    wrapper: Providers,
    ...options,
  })

const sampleDiagnosticData: DiagnosticData = {
  url: 'https://test.com',
  description: 'Test description',
  bugReportDetails: {
    'metabase-info': {
      databases: [
        'athena',
        'postgres',
        'mysql',
        'redshift',
        'bigquery-cloud-sdk',
        'h2',
        'druid-jdbc',
        'databricks',
        'mongo',
        'snowflake',
      ],
      'run-mode': 'prod',
      'plan-alias': 'internal',
      version: {
        date: '2025-01-10',
        tag: 'vUNKNOWN',
        hash: '68b5038',
      },
      settings: {
        'report-timezone': 'US/Pacific',
      },
      'hosting-env': 'unknown',
      'application-database': 'postgres',
    },
    'system-info': {},
  },
  browserInfo: {
    browserName: 'Chrome',
    browserVersion: '100.0.0',
    os: 'Windows',
    osVersion: '10',
    platform: 'Desktop',
    language: 'en-US',
  },
  entityInfo: {
    entityName: 'question',
    name: "Test Question's Name",
  },
  frontendErrors: [
    '"[webpack-dev-server] ERROR in ./components/ErrorPages/utils.ts\\n  × Module not found: Error message 1"',
    '"[webpack-dev-server] ERROR in ./components/ErrorPages/tab.ts\\n  × Module not found: Error message 1"',
    '"Warning: Something went wrong\\nStack trace for warning"',
    '"[webpack-dev-server] Another error occurred\\nStack trace for error"',
  ],
  backendErrors: [
    { message: 'Backend Error 1', timestamp: '2024-01-01' },
    { message: 'Backend Error 2', timestamp: '2024-01-02' },
  ],
  userLogs: [{ message: 'User Log 1', timestamp: '2024-01-01' }],
  logs: [{ message: 'System Log 1', timestamp: '2024-01-01' }],
}

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
// override render export
export { customRender as render, sampleDiagnosticData }
