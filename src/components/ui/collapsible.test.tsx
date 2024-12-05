import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible'
import { render, screen } from '../../test/test-utils'

describe('Collapsible', () => {
  it('renders without crashing', () => {
    expect(() =>
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Test Content</CollapsibleContent>
        </Collapsible>
      )
    ).not.toThrow()
  })

  it('toggles content visibility when clicked', async () => {
    const user = userEvent.setup()

    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Test Content</CollapsibleContent>
      </Collapsible>
    )

    // Content should be hidden initially
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument()

    // Click the trigger
    const trigger = screen.getByText('Toggle')
    await user.click(trigger)

    // Content should be visible
    expect(screen.getByText('Test Content')).toBeInTheDocument()

    // Click again to hide
    await user.click(trigger)

    // Content should be hidden again
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
  })

  it('respects defaultOpen prop', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Test Content</CollapsibleContent>
      </Collapsible>
    )

    // Content should be visible initially when defaultOpen is true
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('handles disabled state', async () => {
    const user = userEvent.setup()

    render(
      <Collapsible disabled>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Test Content</CollapsibleContent>
      </Collapsible>
    )

    // Click the trigger
    const trigger = screen.getByText('Toggle')
    await user.click(trigger)

    // Content should remain hidden when disabled
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
  })

  it('calls onOpenChange callback', async () => {
    const user = userEvent.setup()
    const handleOpenChange = vi.fn()

    render(
      <Collapsible onOpenChange={handleOpenChange}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Test Content</CollapsibleContent>
      </Collapsible>
    )

    // Click the trigger
    const trigger = screen.getByText('Toggle')
    await user.click(trigger)

    // Callback should be called with true
    expect(handleOpenChange).toHaveBeenCalledWith(true)

    // Click again to close
    await user.click(trigger)

    // Callback should be called with false
    expect(handleOpenChange).toHaveBeenCalledWith(false)
    expect(handleOpenChange).toHaveBeenCalledTimes(2)
  })
})
