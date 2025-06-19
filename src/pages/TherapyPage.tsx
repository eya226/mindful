
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { ChatInterface } from "@/components/ChatInterface";
import { Brain, Heart, MessageCircle, Zap, Clock, TrendingUp } from "lucide-react";
import { useChatSessions } from "@/hooks/useChatSessions";
import { useAuth } from "@/hooks/useAuth";
import { progressTracker } from "@/services/progressTracker";
import { toast } from "sonner";

const TherapyPage = () => {
  const { user } = useAuth();
  const { 
    sessions, 
    currentSession, 
    createSession, 
    switchSession, 
    loading 
  } = useChatSessions();
  
  const [selectedTherapyType, setSelectedTherapyType] = useState<string>('general');
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  const therapyTypes = [
    {
      id: 'cbt',
      name: 'Cognitive Behavioral Therapy',
      description: 'Focus on identifying and changing negative thought patterns',
      icon: <Brain className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'mindfulness',
      name: 'Mindfulness-Based Therapy',
      description: 'Practice present-moment awareness and acceptance',
      icon: <Heart className="h-6 w-6" />,
      color: 'bg-green-100 text-green-700',
    },
    {
      id: 'solution_focused',
      name: 'Solution-Focused Therapy',
      description: 'Concentrate on solutions rather than problems',
      icon: <Zap className="h-6 w-6" />,
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      id: 'general',
      name: 'General Support',
      description: 'Open conversation and emotional support',
      icon: <MessageCircle className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-700',
    }
  ];

  const handleStartNewSession = async () => {
    if (!user) {
      toast.error("Please log in to start a therapy session");
      return;
    }

    const therapyType = therapyTypes.find(t => t.id === selectedTherapyType);
    const sessionTitle = `${therapyType?.name || 'General'} Session`;
    
    try {
      await createSession(sessionTitle, selectedTherapyType);
      setSessionStartTime(new Date());
      toast.success("New therapy session started!");
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error("Failed to start session");
    }
  };

  const handleEndSession = async () => {
    if (!user || !sessionStartTime) return;

    const sessionDuration = Math.round((new Date().getTime() - sessionStartTime.getTime()) / (1000 * 60));
    
    try {
      await progressTracker.trackTherapySession(user.id, sessionDuration);
      setSessionStartTime(null);
      toast.success(`Session completed! Duration: ${sessionDuration} minutes`);
    } catch (error) {
      console.error('Error tracking therapy session:', error);
    }
  };

  // Track login when component mounts
  useEffect(() => {
    if (user) {
      progressTracker.trackLogin(user.id).catch(error => {
        console.error('Error tracking login:', error);
      });
    }
  }, [user]);

  // Auto-end session tracking when component unmounts
  useEffect(() => {
    return () => {
      if (sessionStartTime && user) {
        handleEndSession();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Navbar isLoggedIn={!!user} setIsLoggedIn={() => {}} />
        <div className="pt-20 pb-8 px-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar isLoggedIn={!!user} setIsLoggedIn={() => {}} />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Therapy Sessions</h1>
            <p className="text-gray-600">
              Connect with our specialized mental health AI for personalized therapy support
            </p>
          </div>

          {!currentSession ? (
            <div className="space-y-8">
              {/* Therapy Type Selection */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
                  <CardTitle>Choose Your Therapy Approach</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {therapyTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedTherapyType === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTherapyType(type.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${type.color}`}>
                            {type.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {type.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <Button 
                      onClick={handleStartNewSession}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Start New Session
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Previous Sessions */}
              {sessions && sessions.length > 0 && (
                <Card className="shadow-xl border-0">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                    <CardTitle>Previous Sessions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {sessions.slice(0, 5).map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => switchSession(session.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <MessageCircle className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{session.title}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(session.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {session.therapy_type.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Session Header */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">{currentSession.title}</h2>
                        <p className="text-sm text-gray-500">
                          {sessionStartTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Session started: {sessionStartTime.toLocaleTimeString()}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="capitalize">
                        {currentSession.therapy_type.replace('_', ' ')}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleEndSession}
                        className="text-red-600 hover:text-red-700"
                      >
                        End Session
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chat Interface */}
              <ChatInterface 
                sessionId={currentSession.id}
                therapyType={currentSession.therapy_type}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapyPage;
