// WebSocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('wss://yazan-4.onrender.com');
    setWs(socket);

    socket.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      // Handle messages
    };

    socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    socket.onclose = (event) => {
      console.log('WebSocket closed:', event);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
