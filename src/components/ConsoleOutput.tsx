import React, { useMemo, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface ConsoleEvent {
  type: number;
  data: {
    plugin: string;
    payload: {
      level: string;
      payload: any[];
    };
  };
  timestamp: number;
}

interface ConsoleOutputProps {
  jsonData: {
    rrwebEvents: any[];
  };
  startTimestamp: number;
}

const getLevelStyle = (level: string) => {
  switch (level) {
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
    case 'warn':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200';
    case 'info':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

const parseConsoleStyles = (message: string, styles: string[]) => {
  const parts = message.split('%c');
  return parts.map((part, index) => {
    if (index === 0) return <span key={index}>{part}</span>;
    const style = styles[index - 1] || '';
    return <span key={index} style={parseInlineStyles(style.replace(/^"|"$/g, ''))}>{part}</span>;
  });
};

const parseInlineStyles = (styleString: string) => {
  const styleObject: { [key: string]: string } = {};
  styleString.split(';').forEach(style => {
    const [property, value] = style.split(':');
    if (property && value) {
      styleObject[property.trim()] = value.trim();
    }
  });
  return styleObject;
};

const formatConsoleMessage = (payload: any[]) => {
  if (Array.isArray(payload) && payload.length > 0 && typeof payload[0] === 'string') {
    const message = payload[0].replace(/^"|"$/g, '');
    if (message.includes('%c')) {
      const styles = payload.slice(1).map(item => 
        typeof item === 'string' ? item.replace(/^"|"$/g, '') : ''
      );
      return parseConsoleStyles(message, styles);
    }
  }

  return payload.map((item, index) => {
    if (typeof item === 'string') {
      const formattedString = item.replace(/\\n/g, '\n').replace(/^"|"$/g, '');
      return (
        <pre key={index} className="whitespace-pre-wrap break-words">
          {formattedString}
        </pre>
      );
    } else if (typeof item === 'object') {
      return (
        <pre key={index} className="whitespace-pre-wrap break-words">
          {JSON.stringify(item, null, 2)}
        </pre>
      );
    }
    return <span key={index}>{String(item)}</span>;
  });
};

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ jsonData, startTimestamp }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const consoleEvents = useMemo(() => {
    return jsonData.rrwebEvents
      .filter((event: ConsoleEvent) => event.type === 6)
      .map((event: ConsoleEvent, index) => ({
        ...event,
        relativeTime: (event.timestamp - startTimestamp) / 1000,
        id: index,
      }));
  }, [jsonData, startTimestamp]);

  const filteredEvents = useMemo(() => 
    consoleEvents.filter(event => 
      JSON.stringify(event.data.payload).toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [consoleEvents, searchQuery]
  );

  return (
    <>
      <Input
        type="text"
        placeholder="Search console output..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="h-[calc(100vh-240px)] w-full rounded-md border">
        {filteredEvents.map((event) => (
          <div key={event.id} className={`p-2 border-b ${getLevelStyle(event.data.payload.level)}`}>
            <div className="flex items-center mb-1">
              <span className="text-xs font-semibold mr-2">
                {event.relativeTime.toFixed(2)}s
              </span>
              <span className="text-xs font-bold uppercase">
                {event.data.payload.level}
              </span>
            </div>
            <div className="font-mono text-sm">
              {formatConsoleMessage(event.data.payload.payload)}
            </div>
          </div>
        ))}
      </ScrollArea>
    </>
  );
};

export default ConsoleOutput;
