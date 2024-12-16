import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'

import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'
import { render, screen } from '../../test/test-utils'

describe('Tabs', () => {
  it('renders without crashing', () => {
    expect(() =>
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
    ).not.toThrow()
  })

  it('switches tabs correctly', async () => {
    const user = userEvent.setup()

    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )

    // Check initial content
    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument()

    // Click second tab using userEvent
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' })
    await user.click(tab2)

    // Check that the content has switched
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })
})
