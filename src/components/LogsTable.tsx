import { ChevronRight } from 'lucide-react'
import React, { useMemo, useState } from 'react'

import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

interface LogEntry {
  timestamp: string
  level: string
  fqns: string
  msg: string
  exception: string[] | null
  process_uuid: string
}

interface LogsTableProps {
  logs: LogEntry[]
  title: string
}

interface ExceptionLine {
  type: 'exception'
  raw: string
  formatted: string
}

interface FrameLine {
  type: 'frame'
  namespace: string
  method: string
  file: string
  lineNum: number
  raw: string
  isMetabaseFrame: boolean
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

  const prettyPrintClojure = (str: string) => {
    let depth = 0
    let inString = false
    let formatted = ''

    for (let i = 0; i < str.length; i++) {
      const char = str[i]

      // Handle string literals
      if (char === '"' && str[i - 1] !== '\\') {
        inString = !inString
        formatted += char
        continue
      }

      if (inString) {
        formatted += char
        continue
      }

      // Handle brackets and braces
      if (char === '{' || char === '[' || char === '(') {
        depth++
        formatted += char + '\n' + '  '.repeat(depth)
      } else if (char === '}' || char === ']' || char === ')') {
        depth--
        formatted += '\n' + '  '.repeat(depth) + char
      } else if (
        char === ' ' &&
        (str[i - 1] === ',' || str[i - 1] === '}' || str[i - 1] === ']' || str[i - 1] === ')')
      ) {
        formatted += '\n' + '  '.repeat(depth)
      } else {
        formatted += char
      }
    }
    return formatted
  }

  const preprocessStacktrace = (trace: string) => {
    if (!trace) return ''
    return trace.replace(/\t+at\s+|\s+at\s+/g, '\n at ').trim()
  }

  const formatStacktrace = (lines: string[]) => {
    if (!lines) return []

    const formattedLines = new Array<ExceptionLine | FrameLine>()

    // Process first line (exception)
    if (lines[0]) {
      const excLine = preprocessStacktrace(lines[0])
      const match = excLine.match(/^([^{[\n]+)({.+|[.+])/s)
      if (match) {
        // eslint-disable-next-line no-unused-vars
        const [_, prefix, clojureData] = match
        formattedLines.push({
          type: 'exception',
          raw: excLine,
          formatted: prefix + '\n' + prettyPrintClojure(clojureData),
        })
      } else {
        formattedLines.push({
          type: 'exception',
          raw: excLine,
          formatted: excLine,
        })
      }
    }

    // Process stack frames
    const framePattern = /\s*at\s+([a-zA-Z0-9.$_/]+(?:\$[^(]+)?)\s*\(([\w.]+):(\d+)\)/

    lines.slice(1).forEach((line) => {
      const frameLine = preprocessStacktrace(line)
      const match = frameLine.match(framePattern)
      if (match) {
        // eslint-disable-next-line no-unused-vars
        const [_, fullMethod, file, lineNum] = match
        const lastDotIndex = fullMethod.lastIndexOf('.')
        const namespace = fullMethod.substring(0, lastDotIndex)
        const method = fullMethod.substring(lastDotIndex + 1)

        const isMetabaseFrame = namespace.startsWith('metabase')

        if (isMetabaseFrame || !showOnlyMetabaseFrames) {
          formattedLines.push({
            type: 'frame',
            namespace,
            method,
            file,
            lineNum: parseInt(lineNum),
            raw: frameLine,
            isMetabaseFrame,
          })
        }
      }
    })

    return formattedLines
  }

  const [showOnlyMetabaseFrames, setShowOnlyMetabaseFrames] = useState(true)

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
                            {formatMessage(log.msg)}
                          </div>
                        </div>
                        {log.exception && (
                          <div>
                            <strong>Exception:</strong>
                            <pre className="mt-2 p-2 bg-slate-900 rounded-md whitespace-pre-wrap break-words">
                              {formatStacktrace(log.exception).map((line, i) => {
                                if (line.type === 'exception') {
                                  return (
                                    <div
                                      key={i}
                                      className="font-mono text-sm mb-4 pl-4 border-l-4 border-red-500"
                                    >
                                      <div className="text-gray-200 whitespace-pre">
                                        {line.formatted}
                                      </div>
                                    </div>
                                  )
                                }
                                return (
                                  <div
                                    key={i}
                                    className={`font-mono text-sm mb-1 pl-4 border-l-4  ${line.isMetabaseFrame ? 'border-teal-500' : ' border-gray-700'}`}
                                  >
                                    <span
                                      className={
                                        line.isMetabaseFrame ? 'text-gray-600' : 'text-gray-700'
                                      }
                                    >
                                      at{' '}
                                    </span>
                                    <span
                                      className={
                                        line.isMetabaseFrame ? 'text-gray-400' : 'text-gray-600'
                                      }
                                    >
                                      {line.namespace}
                                    </span>
                                    <span
                                      className={`${line.isMetabaseFrame ? 'text-gray-200 font-bold' : 'text-gray-600 '}`}
                                    >
                                      .{line.method}
                                    </span>
                                    <span className="text-gray-500"> (</span>
                                    <span className="text-purple-500">{line.file}</span>
                                    <span className="text-purple-900">:</span>
                                    <span className="text-purple-700">{line.lineNum}</span>
                                    <span className="text-gray-600">)</span>
                                  </div>
                                )
                              })}
                            </pre>
                          </div>
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
