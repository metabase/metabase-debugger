import { describe, it, expect } from 'vitest'

import { DiagnosticData } from '@/types/DiagnosticData'

import { LogsTable } from './LogsTable'
import { render, screen, fireEvent } from '../test/test-utils'

const sampleLogs: DiagnosticData['logs'] = [
  {
    timestamp: '2024-12-02T10:57:22.705Z',
    level: 'ERROR',
    fqns: 'metabase.server.middleware.log',
    msg: 'GET /api/health 503 313.9 µs (0 DB calls) {:metabase-user-id nil} \n{:status "initializing", :progress 0.95}',
    exception: null,
    process_uuid: '2d2fddae-3437-4eb3-ac72-3afd7efb60df',
  },
  {
    timestamp: '2024-12-02T10:57:22.197Z',
    level: 'WARN',
    fqns: 'metabase.server.middleware.log',
    msg: 'GET /api/health 302 179.4 µs (0 DB calls) {:metabase-user-id nil} \n{:status "redirect", :progress 0.3}',
    process_uuid: '2d2fddae-3437-4eb3-ac72-3afd7efb60df',
  },
]

describe('LogsTable', () => {
  it('renders without crashing', () => {
    expect(() => render(<LogsTable logs={[]} title="Test Logs" />)).not.toThrow()
  })

  it('displays logs correctly', () => {
    render(<LogsTable logs={sampleLogs} title="Test Logs" />)

    // Check for log levels that are always visible
    expect(screen.getByText('ERROR')).toBeInTheDocument()
    expect(screen.getByText('WARN')).toBeInTheDocument()

    // Simulate clicking the first log entry to reveal details
    const firstLogRow = screen.getByText('ERROR').closest('tr')
    fireEvent.click(firstLogRow!)

    // Now check for the details in the expanded row
    const details = screen.getAllByText('FQNS:')[0].closest('div')
    expect(details).toHaveTextContent('metabase.server.middleware.log')
    expect(details).toHaveTextContent('Process UUID:')
    expect(details).toHaveTextContent('2d2fddae-3437-4eb3-ac72-3afd7efb60df')
  })

  it('filters logs based on search input', () => {
    render(<LogsTable logs={sampleLogs} title="Test Logs" />)

    const searchInput = screen.getByPlaceholderText('Search logs...')
    fireEvent.change(searchInput, { target: { value: '503' } })

    expect(screen.getByText('ERROR')).toBeInTheDocument()

    fireEvent.change(searchInput, { target: { value: 'redirect' } })
    expect(screen.getByText('WARN')).toBeInTheDocument()

    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })
    expect(screen.queryByText('ERROR')).not.toBeInTheDocument()
    expect(screen.queryByText('WARN')).not.toBeInTheDocument()
  })
})
