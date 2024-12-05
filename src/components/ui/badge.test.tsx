import { describe, it, expect } from 'vitest'

import { Badge } from './badge'
import { render, screen } from '../../test/test-utils'

describe('Badge', () => {
  it('renders without crashing', () => {
    expect(() => render(<Badge>Test Badge</Badge>)).not.toThrow()
  })

  it('displays the correct text', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('applies the correct variant class', () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>)
    const badgeElement = screen.getByText('Destructive Badge')
    expect(badgeElement).toHaveClass('bg-destructive')
  })
})
