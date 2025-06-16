
import { useEffect, useState } from "react";

interface AutoRefreshProps {
  onRefresh: () => Promise<void>;
  interval: number; // milliseconds
  children: (props: { lastRefreshTime: number }) => React.ReactNode;
}

export const AutoRefresh = ({ onRefresh, interval, children }: AutoRefreshProps) => {
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

  // Auto-refresh at specified interval
  useEffect(() => {
    console.log("Setting up refresh interval at:", new Date().toISOString());
    
    // Initial load when the component mounts
    onRefresh().then(() => {
      console.log("Initial load completed at:", new Date().toISOString());
      setLastRefreshTime(Date.now());
    });
    
    // Set up interval for refreshes
    const refreshInterval = setInterval(() => {
      console.log("Interval triggered at:", new Date().toISOString());
      onRefresh().then(() => {
        console.log("Refresh completed at:", new Date().toISOString());
        setLastRefreshTime(Date.now());
      });
    }, interval);
    
    // Clean up the interval on component unmount
    return () => {
      console.log("Clearing interval");
      clearInterval(refreshInterval);
    };
  }, [onRefresh, interval]);

  return <>{children({ lastRefreshTime })}</>;
};
