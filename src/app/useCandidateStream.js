import { useEffect, useRef } from "react";

export function useCandidateStream(isGenerating, onNewCandidate) {
  const wsRef = useRef(null);

  useEffect(() => {
    if (!isGenerating) {
      // Close connection if open
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    // Avoid reopening if already connected
    if (wsRef.current) return;

    // Use dynamic host for deployment flexibility
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${wsProtocol}://${window.location.hostname}:3001`;

    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log("🔌 WebSocket opened");
    };

    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "newCandidate") {
          onNewCandidate(message.data);
        }
      } catch (err) {
        console.error("❗ Invalid WebSocket message:", err);
      }
    };

    wsRef.current.onerror = (err) => {
      console.error("🚨 WebSocket error:", err);
    };

    wsRef.current.onclose = (event) => {
      console.log("❌ WebSocket closed:", event.code, event.reason);
      wsRef.current = null;
    };

    // Cleanup on component unmount or when isGenerating becomes false
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isGenerating, onNewCandidate]);
}
