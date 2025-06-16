
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Brain, Heart, Lightbulb, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChatSessions } from '@/hooks/useChatSessions';

const therapyTypes = [
  { value: 'cbt', label: 'Cognitive Behavioral Therapy (CBT)', icon: <Brain className="h-4 w-4" /> },
  { value: 'dbt', label: 'Dialectical Behavior Therapy (DBT)', icon: <Heart className="h-4 w-4" /> },
  { value: 'mindfulness', label: 'Mindfulness-Based Therapy', icon: <Lightbulb className="h-4 w-4" /> },
  { value: 'general', label: 'General Support', icon: <User className="h-4 w-4" /> }
];

export const ChatInterface = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTherapyType, setSelectedTherapyType] = useState('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    sessions, 
    currentSession, 
    messages, 
    loading, 
    createSession, 
    loadSession, 
    addMessage 
  } = useChatSessions();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string, therapyType: string): string => {
    const responses = {
      cbt: [
        "I hear what you're saying. Let's explore the thoughts behind these feelings. What specific thoughts come to mind when you think about this situation?",
        "That sounds challenging. In CBT, we often look at the connection between thoughts, feelings, and behaviors. Can you identify what you were thinking right before you felt this way?",
        "Thank you for sharing that with me. Let's examine if there might be any thinking patterns here that we can work with together."
      ],
      dbt: [
        "I can sense the intensity of what you're experiencing. Let's focus on the present moment. Can you tell me what you're noticing in your body right now?",
        "That sounds really difficult. In DBT, we work on accepting difficult emotions while also finding ways to cope. What would self-compassion look like for you right now?",
        "I hear your pain. Let's practice some emotional regulation together. Would you like to try a brief grounding exercise?"
      ],
      mindfulness: [
        "Thank you for being present with these feelings. Let's take a moment to breathe together. What do you notice when you focus on your breath?",
        "I appreciate your openness. Mindfulness teaches us to observe our thoughts and feelings without judgment. Can you simply notice what's arising for you without trying to change it?",
        "That awareness is so valuable. In mindfulness, we learn that all experiences are temporary. How does it feel to simply be with this experience?"
      ],
      general: [
        "Thank you for trusting me with this. I'm here to listen and support you. How are you feeling about sharing this?",
        "I can hear how important this is to you. Would you like to explore this further or is there something else on your mind?",
        "It sounds like you're going through a lot right now. Remember that it's okay to feel whatever you're feeling."
      ]
    };

    const typeResponses = responses[therapyType as keyof typeof responses] || responses.general;
    return typeResponses[Math.floor(Math.random() * typeResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // If no current session, create one
    if (!currentSession) {
      await createSession(selectedTherapyType);
    }

    // Add user message
    await addMessage(inputMessage, 'user');
    const userMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing time and add AI response
    setTimeout(async () => {
      const aiResponse = generateAIResponse(userMessage, selectedTherapyType);
      await addMessage(aiResponse, 'ai');
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = async () => {
    await createSession(selectedTherapyType);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sessions Sidebar */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Chat Sessions</span>
              <Button onClick={handleNewChat} size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sessions.map((session) => (
                <Button
                  key={session.id}
                  variant={currentSession?.id === session.id ? "default" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => loadSession(session.id)}
                >
                  <div className="truncate">
                    <p className="font-medium truncate">{session.title}</p>
                    <p className="text-xs text-gray-500">{session.therapy_type.toUpperCase()}</p>
                  </div>
                </Button>
              ))}
              {sessions.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">
                  No chat sessions yet. Click + to start your first session.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-3">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Therapy Session</h2>
          
          {/* Therapy Type Selector */}
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700">Therapy Approach:</label>
            <Select value={selectedTherapyType} onValueChange={setSelectedTherapyType}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {therapyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {type.icon}
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Badge variant="default" className="px-3 py-1">
            {currentSession ? `Session Active: ${currentSession.therapy_type.toUpperCase()}` : 'No Active Session'}
          </Badge>
        </div>

        {/* Chat Interface */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              {currentSession ? currentSession.title : 'Start a New Session'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>{currentSession ? 'Start your conversation...' : 'Create a new session to begin'}</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.message_type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      message.message_type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    {message.message_type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.message_type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-green-600 text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind..."
                  className="flex-1 min-h-12 resize-none"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                This AI therapy is for support and guidance. In case of emergency, please contact 988 or your local emergency services.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
