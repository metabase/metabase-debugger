import { describe, it, expect } from 'vitest'

import { ScrollArea } from './scroll-area'
import { render } from '../../test/test-utils'

describe('ScrollArea', () => {
  it('renders without crashing', () => {
    expect(() => render(<ScrollArea>Test Content</ScrollArea>)).not.toThrow()
  })
})
