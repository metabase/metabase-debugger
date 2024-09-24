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
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: width * 0.5625 }); // 16:9 aspect ratio
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (containerRef.current && jsonData && jsonData.rrwebEvents.length > 0) {
      // Clean up previous player instance
      if (playerRef.current) {
        playerRef.current.pause();
        containerRef.current.innerHTML = '';
      }

      // Set the start timestamp from the first event
      const firstEventTimestamp = jsonData.rrwebEvents[0].timestamp;

      // Create new player instance
      playerRef.current = new rrwebPlayer({
        target: containerRef.current,
        props: {
          events: jsonData.rrwebEvents,
          width: dimensions.width,
          height: dimensions.height
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
  }, [jsonData, dimensions]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: 'auto' }} />
  );
};

export default RRWebPlayer;