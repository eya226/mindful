import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { aiTherapyService } from '@/services/aiTherapyService';

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

  // Initialize AI service when component mounts
  useEffect(() => {
    aiTherapyService.initialize();
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
  const createSession = async (therapyType: string = 'general') => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        title: `${therapyType.charAt(0).toUpperCase() + therapyType.slice(1)} Session`,
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
    return data;
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

    // Type the response properly
    const typedUserMessage = {
      ...userMessageData,
      message_type: userMessageData.message_type as 'user' | 'ai'
    };

    setMessages(prev => [...prev, typedUserMessage]);

    // Generate AI response using the local AI service
    setAiLoading(true);
    try {
      // Get conversation history for context
      const conversationHistory = messages.map(msg => 
        `${msg.message_type === 'user' ? 'User' : 'Therapist'}: ${msg.content}`
      );
      
      const aiResponse = await aiTherapyService.generateTherapyResponse(
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

      // Type the AI response properly
      const typedAiMessage = {
        ...aiMessageData,
        message_type: aiMessageData.message_type as 'user' | 'ai'
      };

      setMessages(prev => [...prev, typedAiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
    } finally {
      setAiLoading(false);
    }
  };

  // Simple AI response generation (replace with real AI integration)
  const generateAIResponse = (userMessage: string, therapyType: string) => {
    const responses = {
      cbt: [
        "I hear what you're saying. Can you help me understand what thoughts were going through your mind when this happened?",
        "That sounds challenging. Let's explore the connection between your thoughts and feelings about this situation.",
        "It's important that you're sharing this with me. What evidence do you have for and against this thought?",
      ],
      dbt: [
        "Thank you for sharing that with me. Let's practice some mindfulness - what are you noticing in your body right now?",
        "I can hear the emotion in what you're telling me. What skills might help you navigate this feeling?",
        "That sounds really difficult. How can we use distress tolerance skills to help you through this?",
      ],
      general: [
        "I'm here to listen and support you. Can you tell me more about how you're feeling?",
        "That sounds important to you. How has this been affecting your daily life?",
        "Thank you for trusting me with this. What would feel most helpful to explore right now?",
      ],
    };

    const typeResponses = responses[therapyType as keyof typeof responses] || responses.general;
    return typeResponses[Math.floor(Math.random() * typeResponses.length)];
  };

  useEffect(() => {
    if (user) {
      fetchSessions();
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
    sendMessage,
    setCurrentSession,
    isAiReady: aiTherapyService.isModelReady(),
    isAiInitializing: aiTherapyService.isInitializing(),
  };
};
