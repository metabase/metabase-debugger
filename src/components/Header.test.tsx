import { fail } from 'assert'

import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'

import { Header } from './Header'
import { render, screen, sampleDiagnosticData } from '../test/test-utils'

describe('Header', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { href: 'https://debugger.test.com/' },
      writable: true,
    })
  })

  it('renders without crashing', () => {
    expect(() =>
      render(<Header diagnosticData={sampleDiagnosticData} slackFileId="" />)
    ).not.toThrow()
  })

  it('navigates when clicking the logo', async () => {
    const user = userEvent.setup()

    render(<Header diagnosticData={sampleDiagnosticData} slackFileId="" />)
    const titleHeader = screen.getByText('Metabase Debugger').closest('h1')
    expect(titleHeader).toBeInTheDocument()
    if (!titleHeader) fail('No title found')

    await user.click(titleHeader)

    expect(window.location.href).toBe('/')
  })
})
