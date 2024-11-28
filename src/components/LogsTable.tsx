import { ChevronRight } from 'lucide-react'
import React, { useMemo, useState } from 'react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

interface LogEntry {
  timestamp: string
  level: string
  fqns: string
  msg: string
  exception: string | null
  process_uuid: string
}

interface LogsTableProps {
  logs: LogEntry[]
  title: string
}

const getLevelColor = (level: string) => {
  switch (level.toUpperCase()) {
    case 'DEBUG':
      return 'text-blue-500'
    case 'INFO':
      return 'text-green-500'
    case 'WARN':
      return 'text-yellow-500'
    case 'ERROR':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

const parseAnsiColors = (text: string) => {
  const colorMap: { [key: string]: string } = {
    '30': 'text-white',
    '31': 'text-red-500',
    '32': 'text-green-500',
    '33': 'text-yellow-500',
    '34': 'text-blue-500',
    '35': 'text-purple-500',
    '36': 'text-cyan-500',
    '37': 'text-white',
  }

  const parts = text.split(/\x1b\[(\d+)m/)
  return parts
    .map((part, index) => {
      if (index % 2 === 0) {
        return part
      }
      const colorClass = colorMap[part] || ''
      return `<span class="${colorClass}">`
    })
    .join('')
}

const formatMessage = (msg: string) => {
  try {
    const jsonObj = JSON.parse(msg)
    return <pre className="whitespace-pre-wrap break-words">{JSON.stringify(jsonObj, null, 2)}</pre>
  } catch {
    const parsedMsg = parseAnsiColors(msg)
    return (
      <div
        className="whitespace-pre-wrap break-words text-white"
        dangerouslySetInnerHTML={{ __html: parsedMsg }}
      />
    )
  }
}

const stripAnsiCodes = (text: string) => {
  return text.replace(/\x1b\[\d+m/g, '')
}

const LogsTable: React.FC<LogsTableProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setOpenItems((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]
    )
  }

  const filteredLogs = useMemo(
    () =>
      logs.filter(
        (log) =>
          log.msg?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.level?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.fqns?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [logs, searchQuery]
  )

  const sortedLogs = useMemo(
    () =>
      [...filteredLogs].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
    [filteredLogs]
  )

  return (
    <>
      <Input
        type="text"
        placeholder="Search logs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="h-[calc(100vh-240px)] w-full rounded-md border">
        <Table>
          <TableBody>
            {sortedLogs.map((log, index) => (
              <Collapsible
                key={index}
                open={openItems.includes(index)}
                onOpenChange={() => toggleItem(index)}
              >
                <CollapsibleTrigger asChild>
                  <TableRow className="cursor-pointer">
                    <TableCell className="w-[40px] p-0">
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                          openItems.includes(index) ? 'rotate-90' : ''
                        }`}
                      />
                    </TableCell>
                    <TableCell className="w-[180px] block">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className={getLevelColor(log.level)}>{log.level}</TableCell>
                    <TableCell className="font-mono max-w-[500px] truncate w-full">
                      {stripAnsiCodes(log.msg)}
                    </TableCell>
                  </TableRow>
                </CollapsibleTrigger>
                <CollapsibleContent className="w-full bg-gray-700 text-white CollapsibleContent">
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="p-4 space-y-4">
                        <p>
                          <strong>FQNS:</strong> {log.fqns}
                        </p>
                        <div>
                          <strong>Message:</strong>
                          <div className="mt-2 p-2 bg-slate-900 rounded-md font-mono">
                            {formatMessage(log.msg)}
                          </div>
                        </div>
                        {log.exception && (
                          <div>
                            <strong>Exception:</strong>
                            <pre className="mt-2 p-2 bg-muted rounded-md whitespace-pre-wrap break-words">
                              {log.exception}
                            </pre>
                          </div>
                        )}
                        <p>
                          <strong>Process UUID:</strong> {log.process_uuid}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  )
}

export default LogsTable
