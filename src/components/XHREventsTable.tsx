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
import { Input } from "@/components/ui/input";

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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => 
    xhrEvents.filter(event => 
      event.data.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.data.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.data.responseStatus.toString().includes(searchQuery)
    ),
    [xhrEvents, searchQuery]
  );

  const sortedEvents = useMemo(() => 
    [...filteredEvents].sort((a, b) => a.timestamp - b.timestamp),
    [filteredEvents]
  );

  const currentEventIndex = useMemo(() => {
    return sortedEvents.findIndex(event => event.timestamp > currentTime) - 1;
  }, [sortedEvents, currentTime, startTimestamp]);

  const handleRowClick = (event: XHREvent) => {
    setSelectedEvent(event);
    setIsSheetOpen(true);
  };

  return (
    <>
      <Input
        type="text"
        placeholder="Search network requests..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="h-[calc(100vh-240px)] w-full rounded-md border">
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
                className={`${getRowStyle(index, currentEventIndex, event.data.responseStatus)} cursor-pointer hover:bg-muted/50`}
                onClick={() => handleRowClick(event)}
              >
                <TableCell>{event.data.method}</TableCell>
                <TableCell className="font-mono">
                  {event.data.url.length > 60
                    ? `${event.data.url.substring(0, 57)}...`
                    : event.data.url}
                </TableCell>
                <TableCell className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${getStatusDotColor(event.data.responseStatus)}`}></div>
                  {event.data.responseStatus}
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
