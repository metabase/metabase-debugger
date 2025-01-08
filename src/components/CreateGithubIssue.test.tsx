import { describe, it, expect, vi, beforeEach } from 'vitest'

import { CreateGithubIssue } from './CreateGithubIssue'
import { render, screen, fireEvent } from '../test/test-utils'

describe('CreateGithubIssue', () => {
  const mockDiagnosticData = {
    basicInfo: {
      url: 'https://test.metabase.com',
      description: 'Test description',
    },
    entityInfo: {
      entityName: 'Test Entity',
    }
  }

  beforeEach(() => {
    // Mock window.open
    vi.spyOn(window, 'open').mockImplementation(() => null)
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { href: 'https://debugger.test.com' },
      writable: true,
    })
  })

  it('renders without crashing', () => {
    expect(() => render(<CreateGithubIssue diagnosticData={mockDiagnosticData} />)).not.toThrow()
  })

  it('displays the correct button text', () => {
    render(<CreateGithubIssue diagnosticData={mockDiagnosticData} />)
    expect(screen.getByText('Create GitHub Issue')).toBeInTheDocument()
  })

  it('opens GitHub with correct URL when clicked', () => {
    render(<CreateGithubIssue diagnosticData={mockDiagnosticData} />)

    fireEvent.click(screen.getByText('Create GitHub Issue'))

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('https://github.com/metabase/metabase/issues/new'),
      '_blank'
    )
  })

  it('includes Slack file link when slackFileId is provided', () => {
    render(<CreateGithubIssue diagnosticData={mockDiagnosticData} slackFileId="123ABC" />)

    fireEvent.click(screen.getByText('Create GitHub Issue'))

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://github.com/metabase/metabase/issues/new?title=%5BBug+Report%5D+Test+Entity+-+https%3A%2F%2Ftest.metabase.com&body=%0A%23%23%23+Description%0ATest+description%0A%0A%23%23%23+Links%0A-+Original+URL%3A+https%3A%2F%2Ftest.metabase.com%0A-+Slack+File%3A+https%3A%2F%2Fmetaboat.slack.com%2Ffiles%2FU02T6V8MXN2%2F123ABC%2Fdiagnostic-info.json%0A-+Bug+Report+Debugger%3A+https%3A%2F%2Fdebugger.test.com%0A&labels=Bug'
      ),
      '_blank'
    )
  })

  it('creates correct issue title and body', () => {
    render(<CreateGithubIssue diagnosticData={mockDiagnosticData} />)

    fireEvent.click(screen.getByText('Create GitHub Issue'))

    const openCall = vi.mocked(window.open).mock.calls[0][0] as string
    const url = new URL(openCall)

    expect(url.searchParams.get('title')).toBe(
      '[Bug Report] Test Entity - https://test.metabase.com'
    )
    expect(url.searchParams.get('body')).toContain('Test description')
    expect(url.searchParams.get('body')).toContain('https://debugger.test.com')
    expect(url.searchParams.get('labels')).toBe('Bug')
  })

  it('handles missing optional data gracefully', () => {
    const minimalData = {
      basicInfo: {
        url: '',
      },
      entityInfo: {
        entityName: '',
      }
    }

    render(<CreateGithubIssue diagnosticData={minimalData} />)

    fireEvent.click(screen.getByText('Create GitHub Issue'))

    const openCall = vi.mocked(window.open).mock.calls[0][0] as string
    const url = new URL(openCall)

    expect(url.searchParams.get('title')).toBe('[Bug Report] Issue - No URL')
    expect(url.searchParams.get('body')).toContain('No description provided')
  })
})
