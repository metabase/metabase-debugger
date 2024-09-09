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

interface XHREvent {
  request: {
    timestamp: number;
    method: string;
    url: string;
  };
  response: {
    status: number;
    responseText: string;
  };
}

interface XHREventsTableProps {
  xhrEvents: XHREvent[];
  currentTime: number;
  startTimestamp: number;
}

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

  const getRowStyle = (index: number) => {
    return index === currentEventIndex ? 'bg-accent/20' : '';
  };

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
                className={`${getRowStyle(index)} cursor-pointer hover:bg-muted/50`}
                onClick={() => handleRowClick(event)}
              >
                <TableCell>{event.request.method}</TableCell>
                <TableCell className="font-mono">
                  {event.request.url.length > 60
                    ? `${event.request.url.substring(0, 57)}...`
                    : event.request.url}
                </TableCell>
                <TableCell>{event.response.status}</TableCell>
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