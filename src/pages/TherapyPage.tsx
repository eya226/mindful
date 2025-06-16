
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Send, Bot, User, Brain, Heart, Lightbulb, Pause, Play } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  therapyType?: string;
}

const TherapyPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI therapist. I'm here to provide a safe, supportive space for you to explore your thoughts and feelings. How are you doing today?",
      timestamp: new Date(),
      therapyType: 'general'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTherapyType, setSelectedTherapyType] = useState('cbt');
  const [sessionActive, setSessionActive] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const therapyTypes = [
    { value: 'cbt', label: 'Cognitive Behavioral Therapy (CBT)', icon: <Brain className="h-4 w-4" /> },
    { value: 'dbt', label: 'Dialectical Behavior Therapy (DBT)', icon: <Heart className="h-4 w-4" /> },
    { value: 'mindfulness', label: 'Mindfulness-Based Therapy', icon: <Lightbulb className="h-4 w-4" /> },
    { value: 'general', label: 'General Support', icon: <User className="h-4 w-4" /> }
  ];

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
    if (!inputMessage.trim() || !sessionActive) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage, selectedTherapyType),
        timestamp: new Date(),
        therapyType: selectedTherapyType
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Therapy Session</h1>
            <p className="text-gray-600 mb-6">
              A safe, private space to explore your thoughts and feelings with AI-powered support
            </p>
            
            {/* Therapy Type Selector */}
            <div className="flex items-center justify-center gap-4 mb-4">
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

            {/* Session Controls */}
            <div className="flex items-center justify-center gap-4">
              <Badge variant={sessionActive ? "default" : "secondary"} className="px-3 py-1">
                Session {sessionActive ? "Active" : "Paused"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSessionActive(!sessionActive)}
                className="flex items-center gap-2"
              >
                {sessionActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {sessionActive ? "Pause" : "Resume"}
              </Button>
            </div>
          </div>

          {/* Chat Interface */}
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Therapy Session
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-green-600 text-white'
                      }`}
                    >
                      {message.type === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
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
                    placeholder={sessionActive ? "Share what's on your mind..." : "Session is paused"}
                    className="flex-1 min-h-12 resize-none"
                    disabled={!sessionActive}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping || !sessionActive}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Disclaimer */}
                <p className="text-xs text-gray-500 mt-2 text-center">
                  This AI therapy is for support and guidance. In case of emergency, please contact 988 or your local emergency services.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TherapyPage;
