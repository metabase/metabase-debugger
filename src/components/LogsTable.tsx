import { ChevronRight } from 'lucide-react'
import React, { useMemo, useState } from 'react'

import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { parseStacktraceLines } from '@/lib/stacktraces'
import type { FrameLine, ExceptionLine } from '@/lib/stacktraces'

interface LogEntry {
  timestamp: string
  level: string
  fqns: string
  msg: string
  exception: string[] | null
  process_uuid: string
}

interface LogsTableProps {
  logs: LogEntry[] | null
  title: string
}

interface FrameLineProps {
  line: FrameLine
}

const FrameLineRenderer: React.FC<FrameLineProps> = ({ line }) => {
  const formattedLine = (
    <>
      <span className={line.isMetabaseFrame ? 'text-gray-400' : 'text-gray-600'}>
        {line.namespace}
      </span>
      <span className={`${line.isMetabaseFrame ? 'text-gray-200 font-bold' : 'text-gray-600 '}`}>
        .{line.method}
      </span>
      <span className="text-gray-500"> (</span>
      <span className="text-purple-500">{line.file}</span>
      <span className="text-purple-900">:</span>
      <span className="text-purple-700">{line.lineNum}</span>
      <span className="text-gray-600">)</span>
    </>
  )

  return (
    <div
      className={`font-mono text-sm mb-1 pl-4 border-l-4  ${line.isMetabaseFrame ? 'border-teal-500' : ' border-gray-700'}`}
    >
      <span className={line.isMetabaseFrame ? 'text-gray-600' : 'text-gray-700'}>at </span>
      {line.codeUrl ? (
        <a
          href={line.codeUrl}
          target="_blank"
          title={`Open ${line.file} at line ${line.lineNum}`}
          className="hover:bg-blend-lighten hover:bg-gray-800"
        >
          {formattedLine}
        </a>
      ) : (
        formattedLine
      )}
    </div>
  )
}

const ExceptionLineRenderer: React.FC<{ line: ExceptionLine }> = ({ line }) => {
  return (
    <div className="font-mono text-sm mb-4 pl-4 border-l-4 border-red-500">
      <div className="text-gray-200 whitespace-pre">{line.formatted}</div>
    </div>
  )
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

function FormattedException({
  lines,
  showOnlyMetabaseFrames,
}: {
  lines: string[]
  showOnlyMetabaseFrames: boolean
}) {
  const parsedLines = parseStacktraceLines(lines, showOnlyMetabaseFrames)

  return (
    <div>
      <strong>Exception:</strong>
      <pre className="mt-2 p-2 bg-slate-900 rounded-md whitespace-pre-wrap break-words">
        {parsedLines.map((line, i) =>
          line.type === 'exception' ? (
            <ExceptionLineRenderer key={i} line={line} />
          ) : (
            <FrameLineRenderer key={i} line={line} />
          )
        )}
      </pre>
    </div>
  )
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
      logs?.filter(
        (log) =>
          log.msg?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.level?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.fqns?.toLowerCase().includes(searchQuery.toLowerCase())
      ) ?? [],
    [logs, searchQuery]
  )

  const sortedLogs = useMemo(
    () =>
      [...filteredLogs].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
    [filteredLogs]
  )

  const [showOnlyMetabaseFrames, setShowOnlyMetabaseFrames] = useState(true);

  if (!logs?.length) {
    return <div className="p-5">No logs to show 🙂</div>;
  }

  return (
    <>
      <Input
        type="text"
        placeholder="Search logs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      <div className="mb-4 flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showOnlyMetabaseFrames}
            onChange={(e) => setShowOnlyMetabaseFrames(e.target.checked)}
            className="rounded"
            title="Show only metabase stack frames"
          />
          <span className="text-sm">Show only metabase stack frames</span>
        </label>
      </div>
      <ScrollArea className="h-[calc(100vh-240px)] w-full rounded-md border">
        <Table>
          <TableBody>
            {sortedLogs.map((log, index) => (
              <React.Fragment key={index}>
                <TableRow className="cursor-pointer" onClick={() => toggleItem(index)}>
                  <TableCell className="p-2">
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
                    {log.msg}
                  </TableCell>
                </TableRow>
                <TableRow className="bg-gray-700 text-white h-0">
                  <TableCell colSpan={4} className="p-0">
                    <div
                      className={`transition-all duration-200 ease-in-out ${
                        openItems.includes(index)
                          ? 'opacity-100 max-h-[1000px]'
                          : 'opacity-0 max-h-0 overflow-hidden'
                      }`}
                    >
                      <div className="p-4 space-y-4">
                        <p>
                          <strong>FQNS:</strong> {log.fqns}
                        </p>
                        <div>
                          <strong>Message:</strong>
                          <div className="mt-2 p-2 bg-slate-900 rounded-md font-mono">
                            <div className="whitespace-pre-wrap break-words text-white">
                              {log.msg}
                            </div>
                          </div>
                        </div>
                        {log.exception && (
                          <FormattedException
                            lines={log.exception}
                            showOnlyMetabaseFrames={showOnlyMetabaseFrames}
                          />
                        )}
                        <p>
                          <strong>Process UUID:</strong> {log.process_uuid}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  )
}

export { LogsTable }
