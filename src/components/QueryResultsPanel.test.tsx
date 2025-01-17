import { describe, it, expect } from 'vitest'

import { QueryResultsPanel } from './QueryResultsPanel'
import { render, screen } from '../test/test-utils'

describe('QueryResultsPanel', () => {
  const sampleData = {
    data: {
      rows: [
        ['1', 'John Doe', 'john@example.com'],
        ['2', 'Jane Smith', 'jane@example.com'],
      ],
      cols: [
        { name: 'id', display_name: 'ID' },
        { name: 'name', display_name: 'Name' },
        { name: 'email', display_name: 'Email' },
      ],
      rows_truncated: 2,
      native_form: {
        query: 'SELECT * FROM users LIMIT 2',
      },
    },
  }

  it('renders without crashing', () => {
    expect(() => render(<QueryResultsPanel data={undefined} />)).not.toThrow()
  })

  it('displays no results message when data is missing', () => {
    render(<QueryResultsPanel data={undefined} />)
    expect(screen.getByText('No query results available')).toBeInTheDocument()
  })

  it('renders table headers correctly', () => {
    render(<QueryResultsPanel data={sampleData} />)

    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders table data correctly', () => {
    render(<QueryResultsPanel data={sampleData} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
  })

  it('displays native query when available', () => {
    render(<QueryResultsPanel data={sampleData} />)

    expect(screen.getByText('SELECT * FROM users LIMIT 2')).toBeInTheDocument()
  })

  it('shows truncated rows message', () => {
    render(<QueryResultsPanel data={sampleData} />)

    expect(screen.getByText('Showing 2 rows (truncated)')).toBeInTheDocument()
  })

  it('handles null values in cells', () => {
    const dataWithNull = {
      data: {
        rows: [['1', null, 'test@example.com']],
        cols: [
          { name: 'id', display_name: 'ID' },
          { name: 'name', display_name: 'Name' },
          { name: 'email', display_name: 'Email' },
        ],
      },
    }

    render(<QueryResultsPanel data={dataWithNull} />)
    expect(screen.getByText('null')).toBeInTheDocument()
  })

  it('handles object values in cells', () => {
    const dataWithObject = {
      data: {
        rows: [['1', { firstName: 'John', lastName: 'Doe' }, 'test@example.com']],
        cols: [
          { name: 'id', display_name: 'ID' },
          { name: 'name', display_name: 'Name' },
          { name: 'email', display_name: 'Email' },
        ],
      },
    }

    render(<QueryResultsPanel data={dataWithObject} />)
    expect(screen.getByText('{"firstName":"John","lastName":"Doe"}')).toBeInTheDocument()
  })

  it('shows total rows when not truncated', () => {
    const nonTruncatedData = {
      data: {
        ...sampleData.data,
        rows_truncated: undefined,
      },
    }

    render(<QueryResultsPanel data={nonTruncatedData} />)
    expect(screen.getByText('Total rows: 2')).toBeInTheDocument()
  })
})
