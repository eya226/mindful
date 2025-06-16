
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface ChatSession {
  id: string;
  title: string;
  therapy_type: string;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to fetch chat sessions');
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (therapyType: string = 'general') => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          therapy_type: therapyType,
          title: `${therapyType.toUpperCase()} Session - ${new Date().toLocaleDateString()}`
        })
        .select()
        .single();

      if (error) throw error;
      
      setSessions(prev => [data, ...prev]);
      setCurrentSession(data);
      setMessages([]);
      
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create chat session');
    }
  };

  const loadSession = async (sessionId: string) => {
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      setCurrentSession(sessionData);
      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Failed to load chat session');
    }
  };

  const addMessage = async (content: string, messageType: 'user' | 'ai') => {
    if (!currentSession || !user) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: currentSession.id,
          user_id: user.id,
          message_type: messageType,
          content
        })
        .select()
        .single();

      if (error) throw error;
      
      setMessages(prev => [...prev, data]);
      
      // Update session timestamp
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentSession.id);

      return data;
    } catch (error) {
      console.error('Error adding message:', error);
      toast.error('Failed to save message');
    }
  };

  return {
    sessions,
    currentSession,
    messages,
    loading,
    createSession,
    loadSession,
    addMessage,
    fetchSessions
  };
};
