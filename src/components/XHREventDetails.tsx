import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import dynamic from 'next/dynamic';
import { XHREvent } from '@/types/XHREvent';
import { ScrollArea } from "@/components/ui/scroll-area";

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

interface XHREventDetailsProps {
  event: XHREvent;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const XHREventDetails: React.FC<XHREventDetailsProps> = ({ event, isOpen, onOpenChange }) => {
  const isJson = (text: string) => {
    try {
      JSON.parse(text);
      return true;
    } catch (e) {
      return false;
    }
  };

  const renderBody = (responseText: string) => {
    if (isJson(responseText)) {
      return (
        <ScrollArea>
          <ReactJson 
            src={JSON.parse(responseText)} 
            theme="summerfruit:inverted"
            collapsed={1}
            displayDataTypes={false}
            enableClipboard={false}
          />
        </ScrollArea>
      );
    } else {
      return <pre className="font-mono text-sm whitespace-pre-wrap">{responseText}</pre>;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange} >
      <SheetContent className="w-[600px] sm:w-[740px] sm:max-w-[calc(100vw-2rem)] overflow-y-auto">
        <SheetHeader >
          <SheetTitle>Basic Details</SheetTitle>
        </SheetHeader>
          <Table className='pb-8'>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3 p-2">Property</TableHead>
                <TableHead className="p-2">Value</TableHead>
              </TableRow>
            </TableHeader>
             <TableBody>
                <TableRow>
                  <TableCell>Method</TableCell>
                  <TableCell>{event.request.method}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>URL</TableCell>
                  <TableCell className="font-mono break-all">{event.request.url}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>{event.response.status}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>{new Date(event.request.timestamp).toISOString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {event.request.data && (
            <>
              <SheetTitle className='mt-4'>Request</SheetTitle>
              <Table>         
                <TableRow>
                  <TableCell colSpan={2}>{renderBody(event.request.data)}</TableCell>
                </TableRow>
              </Table>
            </>
          )}
          <SheetTitle className='mt-4'>Response</SheetTitle>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>{renderBody(event.response.responseText)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
      </SheetContent>
    </Sheet>
  );
};

export default XHREventDetails;