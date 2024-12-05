import { describe, it, expect } from 'vitest'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'
import { render } from '../../test/test-utils'

describe('Table', () => {
  it('renders without crashing', () => {
    expect(() =>
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
    ).not.toThrow()
  })
})
