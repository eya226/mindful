
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Plus, MessageCircle } from 'lucide-react';
import { useChatSessions, ChatSession, ChatMessage } from '@/hooks/useChatSessions';

interface ChatInterfaceProps {
  therapyType?: string;
}

export const ChatInterface = ({ therapyType = 'general' }: ChatInterfaceProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    sessions,
    currentSession,
    messages,
    loading,
    fetchMessages,
    createSession,
    sendMessage,
    setCurrentSession,
  } = useChatSessions();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageToSend = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      await sendMessage(messageToSend);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewSession = async () => {
    try {
      await createSession(therapyType);
    } catch (error) {
      console.error('Error creating new session:', error);
    }
  };

  const handleSessionSelect = async (session: ChatSession) => {
    setCurrentSession(session);
    await fetchMessages(session.id);
  };

  if (loading && !currentSession) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full max-h-[600px] bg-white rounded-lg border">
      {/* Sessions Sidebar */}
      <div className="w-64 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b">
          <Button onClick={handleNewSession} className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Session
          </Button>
        </div>
        <ScrollArea className="flex-1 p-2">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className={`mb-2 cursor-pointer transition-colors hover:bg-white ${
                currentSession?.id === session.id ? 'ring-2 ring-blue-500 bg-white' : ''
              }`}
              onClick={() => handleSessionSelect(session)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MessageCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium truncate">{session.title}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {session.therapy_type}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentSession ? (
          <>
            {/* Chat Header */}
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" />
                {currentSession.title}
              </CardTitle>
            </CardHeader>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Start a conversation with your AI therapist</p>
                    <p className="text-sm mt-2">I'm here to listen and support you.</p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.message_type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.message_type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.message_type === 'ai' && (
                          <Bot className="h-4 w-4 mt-0.5 text-blue-600" />
                        )}
                        {message.message_type === 'user' && (
                          <User className="h-4 w-4 mt-0.5 text-white" />
                        )}
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-blue-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputMessage.trim() || isTyping}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Select a session or create a new one to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
