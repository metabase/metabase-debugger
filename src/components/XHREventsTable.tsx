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
import XHREventDetails from './XHREventDetails';
import { XHREvent } from '@/types/XHREvent';

interface XHREventsTableProps {
  xhrEvents: XHREvent[];
  currentTime: number;
  startTimestamp: number;
}

const getStatusDotColor = (status: number) => {
  if (status >= 200 && status < 300) return 'bg-green-500';
  if (status >= 300 && status < 400) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getRowStyle = (index: number, currentEventIndex: number, status: number) => {
  let baseStyle = '';
  if (index === currentEventIndex) {
    baseStyle = 'bg-accent/20';
  }

  if (status >= 300 && status < 400) {
    return `${baseStyle} bg-yellow-100/50 dark:bg-yellow-900/20`;
  } else if (status >= 400) {
    return `${baseStyle} bg-red-100/50 dark:bg-red-900/20 text-red-600 dark:text-red-400`;
  }

  return baseStyle;
};

const XHREventsTable: React.FC<XHREventsTableProps> = ({ xhrEvents, currentTime, startTimestamp }) => {
  const [selectedEvent, setSelectedEvent] = useState<XHREvent | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const sortedEvents = useMemo(() => 
    [...xhrEvents].sort((a, b) => a.request.timestamp - b.request.timestamp),
    [xhrEvents]
  );

  const currentEventIndex = useMemo(() => {
    return sortedEvents.findIndex(event => event.request.timestamp > currentTime) - 1;
  }, [sortedEvents, currentTime, startTimestamp]);

  const handleRowClick = (event: XHREvent) => {
    setSelectedEvent(event);
    setIsSheetOpen(true);
  };

  return (
    <>
      <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Method</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEvents.map((event, index) => (
              <TableRow 
                key={index} 
                className={`${getRowStyle(index, currentEventIndex, event.response.status)} cursor-pointer hover:bg-muted/50`}
                onClick={() => handleRowClick(event)}
              >
                <TableCell>{event.request.method}</TableCell>
                <TableCell className="font-mono">
                  {event.request.url.length > 60
                    ? `${event.request.url.substring(0, 57)}...`
                    : event.request.url}
                </TableCell>
                <TableCell className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${getStatusDotColor(event.response.status)}`}></div>
                  {event.response.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      {selectedEvent && (
        <XHREventDetails 
          event={selectedEvent} 
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
        />
      )}
    </>
  );
};

export default XHREventsTable;