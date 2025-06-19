
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { mentalHealthAI } from '@/services/mentalHealthAI';
import { progressTracker } from '@/services/progressTracker';

export interface ChatSession {
  id: string;
  title: string;
  therapy_type: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  message_type: 'user' | 'ai';
  content: string;
  created_at: string;
}

export const useChatSessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Initialize AI service when component mounts
  useEffect(() => {
    mentalHealthAI.initialize();
  }, []);

  // Fetch user's chat sessions
  const fetchSessions = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
    } else {
      setSessions(data || []);
    }
    setLoading(false);
  };

  // Fetch messages for a specific session
  const fetchMessages = async (sessionId: string) => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      // Type assertion to ensure proper typing
      const typedMessages = data?.map(msg => ({
        ...msg,
        message_type: msg.message_type as 'user' | 'ai'
      })) || [];
      setMessages(typedMessages);
    }
    setLoading(false);
  };

  // Create a new chat session
  const createSession = async (title: string, therapyType: string = 'general') => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        title: title,
        therapy_type: therapyType,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      return null;
    }

    setCurrentSession(data);
    setSessions(prev => [data, ...prev]);
    setMessages([]);
    setSessionStartTime(new Date());
    return data;
  };

  // Switch to an existing session
  const switchSession = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
      await fetchMessages(sessionId);
    }
  };

  // Send a message in the current session
  const sendMessage = async (content: string) => {
    if (!user || !currentSession) return;

    // Add user message
    const userMessage = {
      session_id: currentSession.id,
      user_id: user.id,
      message_type: 'user' as const,
      content,
    };

    const { data: userMessageData, error: userError } = await supabase
      .from('chat_messages')
      .insert(userMessage)
      .select()
      .single();

    if (userError) {
      console.error('Error sending message:', userError);
      return;
    }

    const typedUserMessage = {
      ...userMessageData,
      message_type: userMessageData.message_type as 'user' | 'ai'
    };

    setMessages(prev => [...prev, typedUserMessage]);

    // Generate AI response using the specialized mental health AI
    setAiLoading(true);
    try {
      const conversationHistory = messages.map(msg => 
        `${msg.message_type === 'user' ? 'Client' : 'Therapist'}: ${msg.content}`
      );
      
      const aiResponse = await mentalHealthAI.generateTherapyResponse(
        content, 
        currentSession.therapy_type,
        conversationHistory
      );
      
      const aiMessage = {
        session_id: currentSession.id,
        user_id: user.id,
        message_type: 'ai' as const,
        content: aiResponse,
      };

      const { data: aiMessageData, error: aiError } = await supabase
        .from('chat_messages')
        .insert(aiMessage)
        .select()
        .single();

      if (aiError) {
        console.error('Error sending AI response:', aiError);
        return;
      }

      const typedAiMessage = {
        ...aiMessageData,
        message_type: aiMessageData.message_type as 'user' | 'ai'
      };

      setMessages(prev => [...prev, typedAiMessage]);

      // Track therapy session activity
      if (sessionStartTime) {
        const sessionDuration = Math.round((new Date().getTime() - sessionStartTime.getTime()) / (1000 * 60));
        await progressTracker.trackTherapySession(user.id, sessionDuration);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSessions();
      // Track login activity
      progressTracker.trackLogin(user.id);
    }
  }, [user]);

  return {
    sessions,
    currentSession,
    messages,
    loading,
    aiLoading,
    fetchSessions,
    fetchMessages,
    createSession,
    switchSession,
    sendMessage,
    setCurrentSession,
    isAiReady: mentalHealthAI.isModelReady(),
    isAiInitializing: mentalHealthAI.isInitializing(),
  };
};
