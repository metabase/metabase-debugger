import React, { useMemo } from 'react';

interface XHREvent {
  request: {
    timestamp: number;
    method: string;
    url: string;
  };
  response: {
    status: number;
  };
}

interface XHREventsTableProps {
  xhrEvents: XHREvent[];
  currentTime: number;
  startTimestamp: number;
}

const XHREventsTable: React.FC<XHREventsTableProps> = ({ xhrEvents, currentTime, startTimestamp }) => {
  const sortedEvents = useMemo(() => 
    [...xhrEvents].sort((a, b) => a.request.timestamp - b.request.timestamp),
    [xhrEvents]
  );

  const currentEventIndex = useMemo(() => {
    return sortedEvents.findIndex(event => event.request.timestamp > currentTime) - 1;
  }, [sortedEvents, currentTime, startTimestamp]);

  const getRowStyle = (index: number) => {
    return index === currentEventIndex ? 'bg-yellow-200' : '';
  };

  return (
    <div className="overflow-auto h-[600px] w-[400px]">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Method</th>
            <th className="px-4 py-2">URL</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedEvents.map((event, index) => (
            <tr
              key={index}
              className={getRowStyle(index)}
            >
              <td className="px-4 py-2">{event.request.method}</td>
              <td className="px-4 py-2">{event.request.url}</td>
              <td className="px-4 py-2">{event.response.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default XHREventsTable;