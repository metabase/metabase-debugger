import { describe, it, expect, beforeEach, vi } from 'vitest'

import { RawContent } from './RawContent'
import { render, screen } from '../test/test-utils'

describe('RawContent', () => {
  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn()
  })

  const sampleContent = {
    first: 'apple',
    second: 'banana',
    third: 'apple',
    fourth: 'cherry',
  }

  it('renders without crashing', () => {
    expect(() => render(<RawContent content={{}} />)).not.toThrow()
  })

  it.only('displays JSON content correctly', () => {
    render(<RawContent content={sampleContent} />)
    expect(screen.getByText(/first/)).toBeInTheDocument()
    expect(screen.getByText(/cherry/)).toBeInTheDocument()
  })
})
