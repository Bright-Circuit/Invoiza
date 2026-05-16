'use client';

import { useState, useEffect, useCallback } from 'react';
import websocketManager from '../lib/websocket';
import { getAuthTokens } from '../lib/cookies';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    try {
      const { accessToken } = getAuthTokens();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }

      await websocketManager.connect(accessToken);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('WebSocket connection error:', err);
      setError(err.message);
      setIsConnected(false);
    }
  }, []);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    websocketManager.disconnect();
    setIsConnected(false);
  }, []);

  // Subscribe to a topic
  const subscribe = useCallback(
    (topic, callback) => {
      if (!isConnected) {
        console.warn('WebSocket not connected. Cannot subscribe.');
        return null;
      }
      return websocketManager.subscribe(topic, callback);
    },
    [isConnected]
  );

  // Unsubscribe from a topic
  const unsubscribe = useCallback((topic) => {
    websocketManager.unsubscribe(topic);
  }, []);

  // Publish a message
  const publish = useCallback(
    (destination, message) => {
      if (!isConnected) {
        console.warn('WebSocket not connected. Cannot publish.');
        return;
      }
      websocketManager.publish(destination, message);
    },
    [isConnected]
  );

  // Auto-connect on mount if token is available
  useEffect(() => {
    const { accessToken } = getAuthTokens();
    if (accessToken && !isConnected) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    error,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
  };
}
