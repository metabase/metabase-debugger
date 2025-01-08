import { describe, it, expect } from 'vitest'

import { MetadataTable } from './MetadataTable'
import { render, screen } from '../test/test-utils'

describe('MetadataTable', () => {
  const sampleMetadata = {
    'metabase-info': {
      databases: ['h2'],
      'run-mode': 'dev',
      'plan-alias': '',
      version: {
        date: '2024-11-22',
        src_hash: '282c501f2f3f6d6c3b0b13585ece73a707676311',
        tag: 'v0.52.3-SNAPSHOT',
        hash: '686c589',
      },
      settings: {
        'report-timezone': null,
      },
      'hosting-env': 'unknown',
      'application-database': 'h2',
      'application-database-details': {
        database: {
          name: 'H2',
          version: '2.1.214 (2022-06-13)',
        },
        'jdbc-driver': {
          name: 'H2 JDBC Driver',
          version: '2.1.214 (2022-06-13)',
        },
      },
    },
    'system-info': {
      'java.vm.name': 'OpenJDK 64-Bit Server VM',
      'java.vm.version': '21.0.1+12-LTS',
      'java.runtime.name': 'OpenJDK Runtime Environment',
      'os.name': 'Mac OS X',
    },
  }

  it('renders without crashing', () => {
    expect(() => render(<MetadataTable metadata={{}} />)).not.toThrow()
  })

  it('displays metadata keys and values correctly', () => {
    render(<MetadataTable metadata={sampleMetadata} />)

    // Check for metabase-info section
    expect(screen.getByText('run-mode')).toBeInTheDocument()
    expect(screen.getByText('dev')).toBeInTheDocument()
    expect(screen.getByText('hosting-env')).toBeInTheDocument()
    expect(screen.getByText('unknown')).toBeInTheDocument()
  })

  it('handles empty metadata object', () => {
    render(<MetadataTable metadata={{}} />)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByText('No data 🙁')).toBeInTheDocument()
  })

  it('renders nested objects correctly', () => {
    render(<MetadataTable metadata={sampleMetadata} />)

    // Check version object rendering
    expect(screen.getByText('date')).toBeInTheDocument()
    expect(screen.getByText('2024-11-22')).toBeInTheDocument()
    expect(screen.getByText('tag')).toBeInTheDocument()
    expect(screen.getByText('v0.52.3-SNAPSHOT')).toBeInTheDocument()
  })

  it('handles null values', () => {
    render(<MetadataTable metadata={sampleMetadata} />)

    // Check report-timezone null value
    expect(screen.getByText('report-timezone')).toBeInTheDocument()
    expect(screen.getByText('null')).toBeInTheDocument()
  })

  it('displays system info correctly', () => {
    render(<MetadataTable metadata={sampleMetadata} />)

    // Check system-info section
    expect(screen.getByText('java.vm.name')).toBeInTheDocument()
    expect(screen.getByText('OpenJDK 64-Bit Server VM')).toBeInTheDocument()
    expect(screen.getByText('os.name')).toBeInTheDocument()
    expect(screen.getByText('Mac OS X')).toBeInTheDocument()
  })
})
