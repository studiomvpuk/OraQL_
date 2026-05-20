'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

interface UseEventSocketOptions {
  eventId: string;
  onPicksUpdated?: (data: { eventId: string; picks: unknown; updatedAt: string }) => void;
  onEventStatus?: (data: { eventId: string; status: string; scores?: unknown }) => void;
}

/**
 * Hook for real-time event updates via WebSocket.
 * Subscribes to a specific event room and receives:
 * - picks_updated: when probabilities are recomputed
 * - event_status: when event status changes (LIVE, LINEUP_CONFIRMED, etc.)
 */
export function useEventSocket({
  eventId,
  onPicksUpdated,
  onEventStatus,
}: UseEventSocketOptions) {
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socket = io(`${WS_URL}/events`, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socket.on('connect', () => {
      socket.emit('join_event', eventId);
    });

    socket.on('picks_updated', (data) => {
      onPicksUpdated?.(data);
    });

    socket.on('event_status', (data) => {
      onEventStatus?.(data);
    });

    socket.on('disconnect', () => {
      // Will auto-reconnect
    });

    socketRef.current = socket;
  }, [eventId, onPicksUpdated, onEventStatus]);

  useEffect(() => {
    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_event', eventId);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [eventId, connect]);

  return {
    isConnected: socketRef.current?.connected ?? false,
  };
}
