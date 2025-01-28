import { describe, it, expect } from 'vitest'

import { BrowserInfo } from './BrowserInfo'
import { render, screen } from '../test/test-utils'

const sampleBrowserInfo = {
  platform: 'mobile',
  os: 'Windows',
  osVersion: '10.0.0',
  language: 'en-US',
  browserName: 'Chrome',
  browserVersion: '32.1.1',
}

describe('BrowserInfo', () => {
  it('renders without crashing', () => {
    expect(() => render(<BrowserInfo browserInfo={{}} />)).not.toThrow()
  })

  it('displays basic info', () => {
    render(<BrowserInfo browserInfo={sampleBrowserInfo} />)

    expect(screen.getByTitle('mobile')).toBeInTheDocument()
    expect(screen.getByText('Chrome 32.1.1')).toBeInTheDocument()
    expect(screen.getByText('Windows 10.0.0')).toBeInTheDocument()
    expect(screen.getByText('en-US')).toBeInTheDocument()
  })

  it('displays the Safari and macOS', () => {
    render(
      <BrowserInfo
        browserInfo={{
          sampleBrowserInfo,
          ...{
            browserName: 'Safari',
            browserVersion: '1.2.3.4',
            os: 'macOS',
            osVersion: 'Sierra nevada',
          },
        }}
      />
    )

    expect(screen.getByText('Safari 1.2.3.4')).toBeInTheDocument()
    expect(screen.getByText('macOS Sierra nevada')).toBeInTheDocument()
  })
  it('displays the Firefox and Linux', () => {
    render(
      <BrowserInfo
        browserInfo={{
          sampleBrowserInfo,
          ...{
            browserName: 'Firefox',
            browserVersion: '1.2.3.4',
            os: 'Linux',
            osVersion: 'debian foreva',
          },
        }}
      />
    )

    expect(screen.getByText('Firefox 1.2.3.4')).toBeInTheDocument()
    expect(screen.getByText('Linux debian foreva')).toBeInTheDocument()
  })
})
