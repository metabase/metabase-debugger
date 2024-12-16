import { ScrollArea } from './ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

interface QueryResultsProps {
  data?: {
    data: {
      rows: any[][]
      cols?: any[]
      rows_truncated?: number
      native_form?: {
        query: string
      }
    }
  }
}

export function QueryResults({ data }: QueryResultsProps) {
  if (!data?.data?.rows || !data?.data?.cols) {
    return <div className="p-4 text-gray-500">No query results available</div>
  }

  const rows = data.data.rows
  const rowsTruncated = data.data.rows_truncated
  const nativeQuery = data.data.native_form?.query

  const columns = data?.data?.cols.map((col) => ({
    name: col.name,
    display_name: col.display_name,
  }))

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Query Results</h2>
      {nativeQuery && (
        <div className="mb-4">
          <pre className="p-4 bg-gray-100 rounded-md overflow-x-auto text-sm whitespace-pre-wrap">
            <code className="language-sql">{nativeQuery}</code>
          </pre>
        </div>
      )}
      <ScrollArea className="h-[600px] rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100 sticky top-0 z-10">
            <TableRow>
              {columns.map((col, index) => (
                <TableHead key={index}>{col.display_name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>
                    {cell === null ? (
                      <span className="text-gray-400">null</span>
                    ) : typeof cell === 'object' ? (
                      JSON.stringify(cell)
                    ) : (
                      String(cell)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="mt-2 text-sm text-gray-500">
        {rowsTruncated ? `Showing ${rowsTruncated} rows (truncated)` : `Total rows: ${rows.length}`}
      </div>
    </div>
  )
}
