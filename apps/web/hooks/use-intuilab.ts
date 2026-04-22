"use client";

import { useState, useCallback, useEffect, useRef } from 'react';

export interface Message {
  id: string;
  role: 'student' | 'mentor';
  content: string;
  timestamp: Date;
}

export function useSocraticChat(lessonId: string = "demo-lesson") {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'mentor',
      content: 'Welcome, seeker of knowledge. What phenomenon shall we explore today?',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

    const connect = useCallback(() => {
      // Determine WebSocket protocol based on page protocol
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.hostname}:8000/ws/ai/chat/${lessonId}/`;
      
      console.log(`[Neural Link] Attempting connection to: ${wsUrl}`);
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("[Neural Link] Connection Established");
        setIsConnected(true);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'chunk') {
          setIsTyping(false);
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.role === 'mentor') {
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, content: lastMessage.content + data.content }
              ];
            } else {
              return [...prev, {
                id: Math.random().toString(36).substring(7),
                role: 'mentor',
                content: data.content,
                timestamp: new Date(),
              }];
            }
          });
        } else if (data.type === 'complete') {
          setIsTyping(false);
        } else if (data.type === 'error') {
          console.error("AI Error:", data.message);
          setIsTyping(false);
        }
      };

      socket.onclose = () => {
        console.log("[Neural Link] Disconnected");
        setIsConnected(false);
        // Automatic reconnection attempt after delay
        setTimeout(() => {
          console.log("[Neural Link] Retrying connection...");
          connect();
        }, 3000);
      };

      socket.onerror = (err) => {
        console.error("[Neural Link] Socket Error:", err);
      };
    }, [lessonId]);

    useEffect(() => {
      connect();
      return () => {
        if (socketRef.current) socketRef.current.close();
      };
    }, [connect]);


  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'student',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    socketRef.current.send(JSON.stringify({
      'message': content
    }));
  }, []);

  return { messages, sendMessage, isTyping, isConnected };
}

export function useLessonProgress() {
  const [progress, setProgress] = useState(35);
  return { progress, setProgress };
}
