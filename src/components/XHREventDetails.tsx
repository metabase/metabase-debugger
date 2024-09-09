import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import dynamic from 'next/dynamic';

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

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

interface XHREventDetailsProps {
  event: XHREvent;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const XHREventDetails: React.FC<XHREventDetailsProps> = ({ event, isOpen, onOpenChange }) => {
  const isJsonResponse = (text: string) => {
    try {
      JSON.parse(text);
      return true;
    } catch (e) {
      return false;
    }
  };

  const renderResponse = (responseText: string) => {
    if (isJsonResponse(responseText)) {
      return (
        <ReactJson 
          src={JSON.parse(responseText)} 
          theme="summerfruit:inverted"
          collapsed={1}
          displayDataTypes={false}
          enableClipboard={false}
        />
      );
    } else {
      return <pre className="font-mono text-sm whitespace-pre-wrap">{responseText}</pre>;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange} >
      <SheetContent className="w-[600px] sm:w-[740px] sm:max-w-[calc(100vw-2rem)]">
        <SheetHeader >
          <SheetTitle>Basic Details</SheetTitle>
        </SheetHeader>
          <Table>
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
          <SheetTitle>Response</SheetTitle>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>{renderResponse(event.response.responseText)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
      </SheetContent>
    </Sheet>
  );
};

export default XHREventDetails;
