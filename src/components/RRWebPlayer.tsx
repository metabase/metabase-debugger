import { useEffect, useRef, useState } from 'react'
import rrwebPlayer from 'rrweb-player'
import 'rrweb-player/dist/style.css'

interface RRWebPlayerProps {
  jsonData: {
    rrwebEvents: any[];
    xhrEvents: any[];
  };
  onTimeUpdate: (currentTime: number) => void;
}

const RRWebPlayer: React.FC<RRWebPlayerProps> = ({ jsonData, onTimeUpdate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<rrwebPlayer | null>(null);
  const [startTimestamp, setStartTimestamp] = useState<number>(0);

  useEffect(() => {
    if (containerRef.current && jsonData && jsonData.rrwebEvents.length > 0) {
      // Clean up previous player instance
      if (playerRef.current) {
        playerRef.current.pause();
        containerRef.current.innerHTML = '';
      }

      // Set the start timestamp from the first event
      const firstEventTimestamp = jsonData.rrwebEvents[0].timestamp;
      setStartTimestamp(firstEventTimestamp);

      // Create new player instance
      playerRef.current = new rrwebPlayer({
        target: containerRef.current,
        props: {
          events: jsonData.rrwebEvents,
          width: 800,
          height: 600,
        },
      });

      // Add time update listener
      playerRef.current.addEventListener('ui-update-current-time', (event: any) => {
        const relativeTime = event.payload;
        const absoluteTime = firstEventTimestamp + relativeTime;
        onTimeUpdate(absoluteTime);
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.pause();
      }
    };
  }, [jsonData, onTimeUpdate]);

  return (
    <div>
      <div ref={containerRef} />
    </div>
  );
};

export default RRWebPlayer;