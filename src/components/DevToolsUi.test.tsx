import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { DiagnosticData } from '@/types/DiagnosticData'

import { DevToolsUI } from './DevToolsUi'
import { render, screen, sampleDiagnosticData } from '../test/test-utils'

describe('DevToolsUI', () => {
  beforeEach(() => {
    // Mock window.open for GitHub issue creation
    vi.spyOn(window, 'open').mockImplementation(() => null)
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { href: 'https://debugger.test.com' },
      writable: true,
    })
  })

  it('renders without crashing', () => {
    expect(() => render(<DevToolsUI diagnosticData={sampleDiagnosticData} />)).not.toThrow()
  })

  it('displays GitHub issue button', () => {
    render(<DevToolsUI diagnosticData={sampleDiagnosticData} />)
    expect(screen.getByText('Create GitHub Issue')).toBeInTheDocument()
  })

  it('creates GitHub issue with correct data', async () => {
    const user = userEvent.setup()
    render(<DevToolsUI diagnosticData={sampleDiagnosticData} slackFileId="TEST123" />)

    await user.click(screen.getByText('Create GitHub Issue'))

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('https://github.com/metabase/metabase/issues/new'),
      '_blank'
    )

    const openCall = vi.mocked(window.open).mock.calls[0][0] as string
    const url = new URL(openCall)

    expect(url.searchParams.get('title')).toBe('[Bug Report] question - https://test.com')
    expect(url.searchParams.get('body')).toContain('Test description')
    expect(url.searchParams.get('body')).toContain(
      'https://metaboat.slack.com/files/U02T6V8MXN2/TEST123/diagnostic-info.json'
    )
  })

  it('displays basic info correctly', () => {
    render(<DevToolsUI diagnosticData={sampleDiagnosticData} />)

    // Check URL and description
    expect(screen.getByText('Occurred at:')).toBeInTheDocument()
    expect(screen.getByText('https://test.com')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()

    // Check browser info
    expect(screen.getByText('Chrome 100.0.0')).toBeInTheDocument()
    expect(screen.getByText('Windows 10')).toBeInTheDocument()
    expect(screen.getByText('en-US')).toBeInTheDocument()
  })

  it('switches tabs correctly', async () => {
    const user = userEvent.setup()
    render(<DevToolsUI diagnosticData={sampleDiagnosticData} />)

    // Click Console output tab
    await user.click(screen.getByRole('tab', { name: 'Browser console 4' }))
    expect(
      screen.getByText('[webpack-dev-server] ERROR in ./components/ErrorPages/utils.ts')
    ).toBeInTheDocument()
  })

  it('is smart about selecting the details tab', async () => {
    const defaultsToDetails: DiagnosticData = {
      url: 'https://test.com',
      bugReportDetails: {
        'metabase-info': {},
        'system-info': {},
      },
      browserInfo: undefined,
      frontendErrors: [],
      entityInfo: {
        entityName: 'question',
        name: "Test Question's Name",
      },
      backendErrors: [],
      userLogs: [],
      logs: [],
    }

    render(<DevToolsUI diagnosticData={defaultsToDetails} />)

    // Should default to the bug report details tab
    expect(screen.getByText(/metabase-info/)).toBeInTheDocument()
  })

  it('is smart about selecting the entity tab', async () => {
    const defaultsToDetails: DiagnosticData = {
      url: 'https://test.com',
      bugReportDetails: undefined,
      browserInfo: undefined,
      frontendErrors: [],
      entityInfo: {
        entityName: 'question',
        name: "Test Question's Name",
      },
      backendErrors: [],
      userLogs: [],
      logs: [],
    }

    render(<DevToolsUI diagnosticData={defaultsToDetails} />)

    // Should default to the bug report details tab
    expect(screen.getByText(/entityName/)).toBeInTheDocument()
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
    expect(screen.getByText(/system-info/)).toBeInTheDocument()
    expect(screen.getByText(/metabase-info/)).toBeInTheDocument()
  })

  it('handles empty diagnostic data', () => {
    const emptyData: DiagnosticData = {
      url: '',
      bugReportDetails: {},
      description: '',
      browserInfo: {},
      entityInfo: {
        entityName: '',
        name: '',
      },
      frontendErrors: [],
      backendErrors: [],
      userLogs: [],
      logs: [],
    }

    render(<DevToolsUI diagnosticData={emptyData} />)

    // Should still render without errors
    expect(screen.getByText('No description provided')).toBeInTheDocument()
  })

  it('updates frontend error count', async () => {
    const user = userEvent.setup()
    render(<DevToolsUI diagnosticData={sampleDiagnosticData} />)

    // Switch to console output tab
    await user.click(screen.getByRole('tab', { name: 'Browser console 4' }))

    // Check if error count badge is updated
    const frontendErrorsBadge = screen.getByText('3')
    expect(frontendErrorsBadge).toBeInTheDocument()
    expect(frontendErrorsBadge.className).toContain('destructive')
  })
})
