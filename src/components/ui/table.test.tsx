import { describe, it, expect } from 'vitest'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption, TableFooter } from './table'
import { render } from '../../test/test-utils'

describe('Table', () => {
  it('renders without crashing', () => {
    expect(() =>
      render(
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableFooter>Footer</TableFooter>
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
