import { describe, it, expect } from 'vitest'

import { DiagnosticData } from '@/types/DiagnosticData'

import { LogsTable } from './LogsTable'
import { render, screen, fireEvent } from '../test/test-utils'

const sampleLogs: DiagnosticData['logs'] = [
  {
    timestamp: '2024-12-02T10:57:22.705Z',
    level: 'INFO',
    fqns: 'metabase.server.middleware.log',
    msg: 'GET /api/health 503 313.9 µs (0 DB calls) {:metabase-user-id nil} \n{:status "initializing", :progress 0.95}',
    process_uuid: '2d2fddae-3437-4eb3-ac72-3afd7efb60df',
  },
  {
    timestamp: '2024-12-02T10:57:22.197Z',
    level: 'WARN',
    fqns: 'metabase.server.middleware.log',
    msg: 'GET /api/health 302 179.4 µs (0 DB calls) {:metabase-user-id nil} \n{:status "redirect", :progress 0.3}',
    process_uuid: '2d2fddae-3437-4eb3-ac72-3afd7efb60df',
  },
  {
    timestamp: '2024-12-13T19:33:27.528Z',
    level: 'ERROR',
    fqns: 'metabase.query-processor.middleware.process-userland-query',
    msg: 'Error saving field usages',
    exception: [
      'clojure.lang.ExceptionInfo: Unknown type of ref {...}',
      '\tat metabase.lib.equality$find_matching_column32424__32427.invokeStatic(equality.cljc:308)',
      '\tat clojure.lang.AFn.run(AFn.java:22)',
      '\tat java.base/java.lang.Thread.run(Unknown Source)',
    ],
    process_uuid: '498155e1-83a8-4c5f-927e-7a81fd74eeac',
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
    fireEvent.change(searchInput, { target: { value: 'process-userland-query' } })

    expect(screen.getByText('ERROR')).toBeInTheDocument()

    fireEvent.change(searchInput, { target: { value: 'redirect' } })
    expect(screen.getByText('WARN')).toBeInTheDocument()

    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })
    expect(screen.queryByText('ERROR')).not.toBeInTheDocument()
    expect(screen.queryByText('WARN')).not.toBeInTheDocument()
  })

  it('filters out non Metabase frames from exceptions', () => {
    render(<LogsTable logs={sampleLogs} title="Test Logs" />)

    const filterCheckbox = screen.getByTitle('Show only metabase stack frames')

    expect(screen.queryByText('clojure.lang.AFn')).not.toBeInTheDocument()
    expect(
      screen.queryByText('metabase.lib.equality$find_matching_column32424__32427')
    ).toBeInTheDocument()

    fireEvent.click(filterCheckbox)
    expect(
      screen.queryByText('metabase.lib.equality$find_matching_column32424__32427')
    ).toBeInTheDocument()
    expect(screen.queryByText('clojure.lang.AFn')).toBeInTheDocument()
  })
})
