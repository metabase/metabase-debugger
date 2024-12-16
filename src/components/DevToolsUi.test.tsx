import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'

import { DiagnosticData } from '@/types/DiagnosticData'

import { DevToolsUI } from './DevToolsUi'
import { render, screen } from '../test/test-utils'

describe('DevToolsUI', () => {
  const sampleDiagnosticData: DiagnosticData = {
    entityName: 'Test Entity',
    bugReportDetails: {},
    url: 'https://test.com',
    description: 'Test description',
    browserInfo: {
      browserName: 'Chrome',
      browserVersion: '100.0.0',
      os: 'Windows',
      osVersion: '10',
      platform: 'Desktop',
      language: 'en-US',
    },
    entityInfo: {
      bugReportDetails: {},
      'metabase-info': {},
      'system-info': {},
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

  it('renders without crashing', () => {
    expect(() => render(<DevToolsUI diagnosticData={sampleDiagnosticData} />)).not.toThrow()
  })

  it('displays basic info correctly', () => {
    render(<DevToolsUI diagnosticData={sampleDiagnosticData} />)

    // Check URL and description
    expect(screen.getByText('URL:')).toBeInTheDocument()
    expect(screen.getByText('https://test.com')).toBeInTheDocument()
    expect(screen.getByText('Description:')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()

    // Check browser info
    expect(screen.getByText('Browser:')).toBeInTheDocument()
    expect(screen.getByText('Chrome 100.0.0')).toBeInTheDocument()
    expect(screen.getByText('OS:')).toBeInTheDocument()
    expect(screen.getByText('Windows 10')).toBeInTheDocument()
  })

  it('switches tabs correctly', async () => {
    const user = userEvent.setup()
    render(<DevToolsUI diagnosticData={sampleDiagnosticData} />)

    // Click Console output tab
    await user.click(screen.getByRole('tab', { name: 'Console output' }))
    expect(
      screen.getByText('[webpack-dev-server] ERROR in ./components/ErrorPages/utils.ts')
    ).toBeInTheDocument()
  })

  it('displays error badges correctly', () => {
    render(<DevToolsUI diagnosticData={sampleDiagnosticData} />)

    // Check backend errors badge
    const backendErrorsBadge = screen.getByText('2')
    expect(backendErrorsBadge).toBeInTheDocument()
    expect(backendErrorsBadge.className).toContain('destructive')
  })

  it('displays raw data correctly', async () => {
    const user = userEvent.setup()
    render(<DevToolsUI diagnosticData={sampleDiagnosticData} />)

    // Switch to raw data tab
    await user.click(screen.getByRole('tab', { name: 'Raw Data' }))

    // Check if JSON data is displayed
    expect(screen.getByText(/"url":/)).toBeInTheDocument()
    expect(screen.getByText(/"description":/)).toBeInTheDocument()
  })

  it('handles empty diagnostic data', () => {
    const emptyData: DiagnosticData = {
      entityName: '',
      bugReportDetails: {},
      url: '',
      description: '',
      browserInfo: {},
      entityInfo: {},
      frontendErrors: [],
      backendErrors: [],
      userLogs: [],
      logs: [],
    }

    render(<DevToolsUI diagnosticData={emptyData} />)

    // Should still render without errors
    expect(screen.getByText('Unknown URL')).toBeInTheDocument()
    expect(screen.queryByText('Unknown browser')).not.toBeInTheDocument()
  })

  it('updates frontend error count', async () => {
    const user = userEvent.setup()
    render(<DevToolsUI diagnosticData={sampleDiagnosticData} />)

    // Switch to console output tab
    await user.click(screen.getByRole('tab', { name: 'Console output' }))

    // Check if error count badge is updated
    const frontendErrorsBadge = screen.getByText('3')
    expect(frontendErrorsBadge).toBeInTheDocument()
    expect(frontendErrorsBadge.className).toContain('destructive')
  })
})
