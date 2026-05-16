import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketManager {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  /**
   * Connect to WebSocket server
   */
  connect(token) {
    const wsUrl =
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8080/ws';

    return new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: (str) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('[WebSocket]', str);
          }
        },
        reconnectDelay: this.reconnectDelay,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('[WebSocket] Connected');
          this.connected = true;
          this.reconnectAttempts = 0;
          resolve();
        },
        onDisconnect: () => {
          console.log('[WebSocket] Disconnected');
          this.connected = false;
        },
        onStompError: (frame) => {
          console.error('[WebSocket] Error:', frame.headers.message);
          console.error('[WebSocket] Details:', frame.body);
          reject(new Error(frame.headers.message));
        },
        onWebSocketClose: () => {
          console.log('[WebSocket] Connection closed');
          this.connected = false;
          this.handleReconnect(token);
        },
      });

      this.client.activate();
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.client) {
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();
      this.client.deactivate();
      this.connected = false;
      console.log('[WebSocket] Manually disconnected');
    }
  }

  /**
   * Subscribe to a topic
   */
  subscribe(topic, callback) {
    if (!this.connected) {
      console.warn('[WebSocket] Not connected. Cannot subscribe to:', topic);
      return null;
    }

    if (this.subscriptions.has(topic)) {
      console.warn('[WebSocket] Already subscribed to:', topic);
      return this.subscriptions.get(topic);
    }

    const subscription = this.client.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('[WebSocket] Error parsing message:', error);
        callback(message.body);
      }
    });

    this.subscriptions.set(topic, subscription);
    console.log('[WebSocket] Subscribed to:', topic);
    return subscription;
  }

  /**
   * Unsubscribe from a topic
   */
  unsubscribe(topic) {
    const subscription = this.subscriptions.get(topic);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
      console.log('[WebSocket] Unsubscribed from:', topic);
    }
  }

  /**
   * Publish a message to a topic
   */
  publish(destination, message) {
    if (!this.connected) {
      console.warn('[WebSocket] Not connected. Cannot publish to:', destination);
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(message),
    });
    console.log('[WebSocket] Published to:', destination);
  }

  /**
   * Handle reconnection
   */
  handleReconnect(token) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `[WebSocket] Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
    );

    setTimeout(() => {
      this.connect(token).catch((error) => {
        console.error('[WebSocket] Reconnection failed:', error);
      });
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.connected;
  }
}

// Singleton instance
const websocketManager = new WebSocketManager();

export default websocketManager;
