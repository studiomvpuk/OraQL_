'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, type Socket } from 'socket.io-client';
import { api } from '@/lib/api';
import type { Pick, EventStatus } from '@/types';

interface EventUpdate {
  eventId: string;
  picks: Pick[];
  timestamp: string;
}

interface StatusUpdate {
  eventId: string;
  status: EventStatus;
  timestamp: string;
}

interface UseEventSocketOptions {
  onPicksUpdated?: (update: EventUpdate) => void;
  onStatusChanged?: (update: StatusUpdate) => void;
  autoReconnect?: boolean;
  reconnectDelay?: number;
}

export function useEventSocket(options: UseEventSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const joinedRoomsRef = useRef<Set<string>>(new Set());

  const {
    onPicksUpdated,
    onStatusChanged,
    autoReconnect = true,
    reconnectDelay = 3000,
  } = options;

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const token = api.getToken();
    if (!token) return;

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    socketRef.current = io(`${apiBase}`, {
      namespace: '/events',
      auth: {
        token,
      },
      reconnection: autoReconnect,
      reconnectionDelay,
      reconnectionDelayMax: 10000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      console.log('Event socket connected');
      // Rejoin rooms after reconnection
      joinedRoomsRef.current.forEach((room) => {
        socketRef.current?.emit('join_room', { eventId: room });
      });
    });

    socketRef.current.on('disconnect', () => {
      console.log('Event socket disconnected');
    });

    socketRef.current.on('picks_updated', (data: EventUpdate) => {
      onPicksUpdated?.(data);
    });

    socketRef.current.on('event_status', (data: StatusUpdate) => {
      onStatusChanged?.(data);
    });

    socketRef.current.on('error', (error: unknown) => {
      console.error('Event socket error:', error);
    });
  }, [autoReconnect, reconnectDelay, onPicksUpdated, onStatusChanged]);

  const joinRoom = useCallback((eventId: string) => {
    if (!socketRef.current?.connected) {
      connect();
      if (!socketRef.current?.connected) return;
    }
    socketRef.current?.emit('join_room', { eventId });
    joinedRoomsRef.current.add(eventId);
  }, [connect]);

  const leaveRoom = useCallback((eventId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current?.emit('leave_room', { eventId });
    }
    joinedRoomsRef.current.delete(eventId);
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected ?? false,
    joinRoom,
    leaveRoom,
  };
}
