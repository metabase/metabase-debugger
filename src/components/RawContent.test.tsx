import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { RawContent } from './RawContent'
import { render, screen } from '../test/test-utils'

describe('RawContent', () => {
  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn()
  })

  const sampleContent = `{
    "first": "apple",
    "second": "banana",
    "third": "apple",
    "fourth": "cherry"
  }`

  it('renders without crashing', () => {
    expect(() => render(<RawContent content="{}" />)).not.toThrow()
  })

  it('displays JSON content correctly', () => {
    render(<RawContent content={sampleContent} />)
    expect(screen.getByText(/"first": "apple"/)).toBeInTheDocument()
  })

  it('highlights search matches', async () => {
    const user = userEvent.setup()
    render(<RawContent content={sampleContent} />)

    const searchInput = screen.getByPlaceholderText('Search...')
    await user.type(searchInput, 'apple')

    // Should show match count
    expect(screen.getByText('1 of 2 matches')).toBeInTheDocument()

    // Should highlight matches
    const pre = screen.getByRole('presentation')
    expect(pre.innerHTML).toContain('bg-yellow-500') // Current match
    expect(pre.innerHTML).toContain('bg-yellow-200') // Other match

    // Verify scrollIntoView was called
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    })
  })

  it('navigates between multiple matches', async () => {
    const user = userEvent.setup()
    render(<RawContent content={sampleContent} />)

    // Search for a term with multiple matches
    await user.type(screen.getByPlaceholderText('Search...'), 'apple')

    // Initially shows first match
    expect(screen.getByText('1 of 2 matches')).toBeInTheDocument()

    // Click next button
    const nextButton = screen.getByText('Next')
    await user.click(nextButton)

    // Should show second match
    expect(screen.getByText('2 of 2 matches')).toBeInTheDocument()

    // Click previous button
    const prevButton = screen.getByText('Previous')
    await user.click(prevButton)

    // Should return to first match
    expect(screen.getByText('1 of 2 matches')).toBeInTheDocument()
  })

  it('handles case-insensitive search', async () => {
    const user = userEvent.setup()
    render(<RawContent content={sampleContent} />)

    const searchInput = screen.getByPlaceholderText('Search...')
    await user.type(searchInput, 'APPLE')

    // Should find both lowercase "apple" occurrences
    expect(screen.getByText(/2 matches/)).toBeInTheDocument()
  })

  it('updates matches when search term changes', async () => {
    const user = userEvent.setup()
    render(<RawContent content={sampleContent} />)

    const searchInput = screen.getByPlaceholderText('Search...')

    // Search for "apple"
    await user.type(searchInput, 'apple')
    expect(screen.getByText(/2 matches/)).toBeInTheDocument()

    // Clear and search for "banana"
    await user.clear(searchInput)
    await user.type(searchInput, 'banana')
    expect(screen.getByText('1 match found')).toBeInTheDocument()
  })

  it('hides navigation buttons when only one match', async () => {
    const user = userEvent.setup()
    render(<RawContent content={sampleContent} />)

    await user.type(screen.getByPlaceholderText('Search...'), 'banana')

    // Should not show navigation buttons for single match
    expect(screen.queryByText('Next')).not.toBeInTheDocument()
    expect(screen.queryByText('Previous')).not.toBeInTheDocument()
  })

  it('clears highlights when search is empty', async () => {
    const user = userEvent.setup()
    render(<RawContent content={sampleContent} />)

    const searchInput = screen.getByPlaceholderText('Search...')

    // First search for something
    await user.type(searchInput, 'apple')
    expect(screen.getByText(/2 matches/)).toBeInTheDocument()

    // Clear search
    await user.clear(searchInput)

    // Should not show any match count or highlights
    expect(screen.queryByText(/matches/)).not.toBeInTheDocument()
    const pre = screen.getByRole('presentation')
    expect(pre.innerHTML).not.toContain('bg-yellow')
  })
})
