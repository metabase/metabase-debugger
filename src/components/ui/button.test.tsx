import { describe, it, expect, vi } from 'vitest'

import { Button } from './button'
import { render, screen, fireEvent } from '../../test/test-utils'

describe('Button', () => {
  it('renders without crashing', () => {
    expect(() => render(<Button>Test Button</Button>)).not.toThrow()
  })

  it('displays the correct text', () => {
    render(<Button>Test Button</Button>)
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)
    fireEvent.click(screen.getByText('Click Me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
