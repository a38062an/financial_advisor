import { useState, useEffect, useRef } from 'react';
import { WebSocketMessage } from '../types';

interface UseWebSocketProps {
  url: string;
  onMessage: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export const useWebSocket = ({
  url,
  onMessage,
  onError,
  reconnectAttempts = 5,
  reconnectInterval = 3000
}: UseWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  const reconnectTimeoutId = useRef<number | null>(null);

  const connect = () => {
    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectCount.current = 0;
        console.log('WebSocket connected');
      };

      ws.current.onmessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data);
          onMessage(message);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
        
        // Attempt to reconnect
        if (reconnectCount.current < reconnectAttempts) {
          reconnectCount.current++;
          console.log(`Attempting to reconnect... (${reconnectCount.current}/${reconnectAttempts})`);
          
          reconnectTimeoutId.current = window.setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else {
          setError('Failed to connect after multiple attempts');
        }
      };

      ws.current.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
        onError?.(error);
      };

    } catch (err) {
      console.error('Error creating WebSocket connection:', err);
      setError('Failed to create WebSocket connection');
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutId.current) {
      clearTimeout(reconnectTimeoutId.current);
    }
    
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    
    setIsConnected(false);
  };

  const sendMessage = (message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return {
    isConnected,
    error,
    sendMessage,
    disconnect
  };
};