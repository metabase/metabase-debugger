import { describe, it, expect } from 'vitest'

import { ConsoleOutput } from './ConsoleOutput'
import { fireEvent, render, screen } from '../test/test-utils'

const sampleErrors = [
  '"[webpack-dev-server] ERROR in ./components/ErrorPages/utils.ts\\n  × Module not found: Error message 1"',
  '"Warning: Something went wrong\\nStack trace for warning"',
  '"[webpack-dev-server] Another error occurred\\nStack trace for error"',
]

describe('ConsoleOutput', () => {
  it('renders without crashing', () => {
    expect(() => render(<ConsoleOutput errors={[]} />)).not.toThrow()
  })

  it('displays errors correctly', () => {
    render(<ConsoleOutput errors={sampleErrors} />)

    // Using more precise text matching
    expect(
      screen.getByText('[webpack-dev-server] ERROR in ./components/ErrorPages/utils.ts')
    ).toBeInTheDocument()
    expect(screen.getByText('Warning: Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('[webpack-dev-server] Another error occurred')).toBeInTheDocument()
  })

  it('filters errors based on search input', () => {
    render(<ConsoleOutput errors={sampleErrors} />)

    const searchInput = screen.getByPlaceholderText('Search errors...')
    fireEvent.change(searchInput, { target: { value: 'message 1' } })

    expect(
      screen.getByText('[webpack-dev-server] ERROR in ./components/ErrorPages/utils.ts')
    ).toBeInTheDocument()
    expect(screen.queryByText('Warning: Something went wrong')).not.toBeInTheDocument()
    expect(
      screen.queryByText('[webpack-dev-server] Another error occurred')
    ).not.toBeInTheDocument()
  })

  it('toggles error details when clicked', () => {
    render(<ConsoleOutput errors={sampleErrors} />)

    // Find and click the first error
    const firstError = screen.getByText(
      '[webpack-dev-server] ERROR in ./components/ErrorPages/utils.ts'
    )
    fireEvent.click(firstError)

    // Check if stack trace is visible
    expect(screen.getByText('× Module not found: Error message 1')).toBeInTheDocument()
  })

  it('applies correct styling based on error level', () => {
    render(<ConsoleOutput errors={sampleErrors} />)

    // Error should have red styling
    const errorElement = screen
      .getByText('[webpack-dev-server] ERROR in ./components/ErrorPages/utils.ts')
      .closest('.bg-red-100')
    expect(errorElement).toBeInTheDocument()

    // Warning should have yellow styling
    const warningElement = screen
      .getByText('Warning: Something went wrong')
      .closest('.bg-yellow-100')
    expect(warningElement).toBeInTheDocument()
  })

  it('handles empty error list', () => {
    render(<ConsoleOutput errors={[]} />)
    const searchInput = screen.getByPlaceholderText('Search errors...')
    expect(searchInput).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
