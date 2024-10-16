import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"

interface LogEntry {
  timestamp: string;
  level: string;
  fqns: string;
  msg: string;
  exception: string | null;
  process_uuid: string;
}

interface LogsTableProps {
  logs: LogEntry[];
  title: string;
}

const getLevelColor = (level: string) => {
  switch (level.toUpperCase()) {
    case 'DEBUG': return 'text-blue-500';
    case 'INFO': return 'text-green-500';
    case 'WARN': return 'text-yellow-500';
    case 'ERROR': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

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
  };

  const parts = text.split(/\x1b\[(\d+)m/);
  return parts.map((part, index) => {
    if (index % 2 === 0) {
      return part;
    }
    const colorClass = colorMap[part] || '';
    return `<span class="${colorClass}">`;
  }).join('');
};

const formatMessage = (msg: string) => {
  try {
    const jsonObj = JSON.parse(msg);
    return (
      <pre className="whitespace-pre-wrap break-words">
        {JSON.stringify(jsonObj, null, 2)}
      </pre>
    );
  } catch {
    const parsedMsg = parseAnsiColors(msg);
    return (
      <div 
        className="whitespace-pre-wrap break-words text-white"
        dangerouslySetInnerHTML={{ __html: parsedMsg }}
      />
    );
  }
};

const stripAnsiCodes = (text: string) => {
  return text.replace(/\x1b\[\d+m/g, '');
};

const LogsTable: React.FC<LogsTableProps> = ({ logs }) => {
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = useMemo(() => 
    logs.filter(log => 
      log.msg.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.fqns.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [logs, searchQuery]
  );

  const sortedLogs = useMemo(() => 
    [...filteredLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [filteredLogs]
  );

  const handleRowClick = (log: LogEntry) => {
    setSelectedLog(log);
  };

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
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead className="w-[80px]">Level</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLogs.map((log, index) => (
              <TableRow 
                key={index} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(log)}
              >
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                <TableCell className={getLevelColor(log.level)}>{log.level}</TableCell>
                <TableCell className="font-mono max-w-[500px] truncate">
                  {stripAnsiCodes(log.msg)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      {selectedLog && (
        <Sheet open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <SheetContent className='w-[600px] sm:w-[740px] sm:max-w-[calc(100vw-2rem)] overflow-y-auto'>
            <SheetHeader>
              <SheetTitle>Log Details</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <p><strong>Timestamp:</strong> {new Date(selectedLog.timestamp).toLocaleString()}</p>
              <p><strong>Level:</strong> <span className={getLevelColor(selectedLog.level)}>{selectedLog.level}</span></p>
              <p><strong>FQNS:</strong> {selectedLog.fqns}</p>
              <div>
                <strong>Message:</strong>
                <div className="mt-2 p-2 bg-slate-900 rounded-md font-mono">
                  {formatMessage(selectedLog.msg)}
                </div>
              </div>
              {selectedLog.exception && (
                <div>
                  <strong>Exception:</strong>
                  <pre className="mt-2 p-2 bg-muted rounded-md whitespace-pre-wrap break-words">
                    {selectedLog.exception}
                  </pre>
                </div>
              )}
              <p><strong>Process UUID:</strong> {selectedLog.process_uuid}</p>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

export default LogsTable;
