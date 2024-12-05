import { describe, it, expect, vi } from 'vitest'

import { Input } from './input'
import { render, screen, fireEvent } from '../../test/test-utils'

describe('Input', () => {
  it('renders without crashing', () => {
    expect(() => render(<Input placeholder="Test Input" />)).not.toThrow()
  })

  it('displays the correct placeholder', () => {
    render(<Input placeholder="Test Input" />)
    expect(screen.getByPlaceholderText('Test Input')).toBeInTheDocument()
  })

  it('handles input changes', () => {
    const handleChange = vi.fn()
    render(<Input placeholder="Test Input" onChange={handleChange} />)
    fireEvent.change(screen.getByPlaceholderText('Test Input'), { target: { value: 'New Value' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })
})
