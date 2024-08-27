import { useState, useEffect } from "react";
import * as Network from "expo-network";
import { notifySuccess, notifyError } from "./toast";

export default function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        const isOnline =
          navigator.onLine && (networkState.isConnected ?? false);
        if (!isConnected && isOnline) {
          // If the connection was previously offline and is now online, reload the page
          window.location.reload();
        }
        setIsConnected(isOnline);
      } catch (error) {
        setIsConnected(false);
      }
    };

    // Check network status initially and set up listeners
    checkNetworkStatus();

    const handleOnline = () => checkNetworkStatus();
    const handleOffline = () => setIsConnected(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Poll for network status every 10 seconds
    const intervalId = setInterval(checkNetworkStatus, 10000);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(intervalId);
    };
  }, [isConnected]);

  return { isConnected };
}
