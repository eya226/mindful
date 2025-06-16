
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Play, Pause, RotateCcw, Heart, Wind, Sparkles, Timer, Volume2 } from "lucide-react";

interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: 'breathing' | 'mindfulness' | 'relaxation' | 'sleep';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const WellnessPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeSession, setActiveSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);

  const sessions: MeditationSession[] = [
    {
      id: '1',
      title: '4-7-8 Breathing Technique',
      description: 'A powerful breathing exercise to reduce anxiety and promote relaxation',
      duration: 5,
      category: 'breathing',
      difficulty: 'beginner'
    },
    {
      id: '2',
      title: 'Body Scan Meditation',
      description: 'Progressive relaxation technique to release tension throughout your body',
      duration: 15,
      category: 'mindfulness',
      difficulty: 'intermediate'
    },
    {
      id: '3',
      title: 'Loving-Kindness Meditation',
      description: 'Cultivate compassion and positive emotions towards yourself and others',
      duration: 10,
      category: 'mindfulness',
      difficulty: 'beginner'
    },
    {
      id: '4',
      title: 'Deep Sleep Relaxation',
      description: 'Gentle meditation to help you unwind and prepare for restful sleep',
      duration: 20,
      category: 'sleep',
      difficulty: 'beginner'
    },
    {
      id: '5',
      title: 'Stress Relief Meditation',
      description: 'Quick and effective meditation to reduce stress and anxiety',
      duration: 8,
      category: 'relaxation',
      difficulty: 'intermediate'
    },
    {
      id: '6',
      title: 'Mountain Meditation',
      description: 'Advanced mindfulness practice using mountain imagery for stability',
      duration: 25,
      category: 'mindfulness',
      difficulty: 'advanced'
    }
  ];

  const categoryIcons = {
    breathing: <Wind className="h-4 w-4" />,
    mindfulness: <Sparkles className="h-4 w-4" />,
    relaxation: <Heart className="h-4 w-4" />,
    sleep: <Timer className="h-4 w-4" />
  };

  const categoryColors = {
    breathing: 'bg-blue-100 text-blue-800',
    mindfulness: 'bg-purple-100 text-purple-800',
    relaxation: 'bg-green-100 text-green-800',
    sleep: 'bg-indigo-100 text-indigo-800'
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && activeSession) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= activeSession.duration * 60) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeSession]);

  // Breathing animation logic
  useEffect(() => {
    if (activeSession?.category === 'breathing' && isPlaying) {
      const breathingInterval = setInterval(() => {
        setBreathingCount(prev => {
          const newCount = prev + 1;
          if (newCount <= 4) {
            setBreathingPhase('inhale');
          } else if (newCount <= 11) {
            setBreathingPhase('hold');
          } else if (newCount <= 19) {
            setBreathingPhase('exhale');
          } else {
            setBreathingPhase('inhale');
            return 0;
          }
          return newCount;
        });
      }, 1000);

      return () => clearInterval(breathingInterval);
    }
  }, [activeSession, isPlaying]);

  const startSession = (session: MeditationSession) => {
    setActiveSession(session);
    setCurrentTime(0);
    setBreathingCount(0);
    setBreathingPhase('inhale');
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetSession = () => {
    setCurrentTime(0);
    setBreathingCount(0);
    setBreathingPhase('inhale');
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!activeSession) return 0;
    return (currentTime / (activeSession.duration * 60)) * 100;
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Breathe in slowly...';
      case 'hold':
        return 'Hold your breath...';
      case 'exhale':
        return 'Exhale completely...';
      default:
        return 'Breathe naturally...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Wellness & Meditation</h1>
            <p className="text-gray-600">
              Find your inner peace with guided meditations, breathing exercises, and relaxation techniques
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Session Player */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0 sticky top-24">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    {activeSession ? 'Active Session' : 'Select a Session'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {activeSession ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="font-semibold text-lg mb-2">{activeSession.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{activeSession.description}</p>
                        
                        {/* Breathing Animation */}
                        {activeSession.category === 'breathing' && (
                          <div className="flex flex-col items-center mb-6">
                            <div 
                              className={`w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center transition-all duration-1000 ${
                                breathingPhase === 'inhale' ? 'scale-125' : 
                                breathingPhase === 'hold' ? 'scale-125' : 'scale-75'
                              }`}
                            >
                              <Heart className="h-8 w-8 text-white" />
                            </div>
                            <p className="text-lg font-medium mt-4 text-blue-600">
                              {getBreathingInstruction()}
                            </p>
                          </div>
                        )}
                        
                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(activeSession.duration * 60)}</span>
                          </div>
                          <Progress value={getProgress()} className="h-2" />
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex justify-center gap-4">
                        <Button
                          onClick={togglePlayPause}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          onClick={resetSession}
                          variant="outline"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Choose a meditation session to begin your wellness journey</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sessions Grid */}
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-6">
                {sessions.map((session) => (
                  <Card 
                    key={session.id} 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                      activeSession?.id === session.id ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-md'
                    }`}
                    onClick={() => startSession(session)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 mb-2">
                          {categoryIcons[session.category]}
                          <CardTitle className="text-lg">{session.title}</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {session.duration} min
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={`text-xs ${categoryColors[session.category]}`}>
                          {session.category}
                        </Badge>
                        <Badge className={`text-xs ${difficultyColors[session.difficulty]}`}>
                          {session.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-4">{session.description}</p>
                      <Button 
                        className="w-full"
                        variant={activeSession?.id === session.id ? "default" : "outline"}
                      >
                        {activeSession?.id === session.id ? 'Currently Active' : 'Start Session'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Tips */}
              <Card className="mt-8 shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    Wellness Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">For Best Results:</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Find a quiet, comfortable space</li>
                        <li>• Use headphones for better experience</li>
                        <li>• Practice regularly, even if just 5 minutes</li>
                        <li>• Don't judge your thoughts, just observe</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">When to Practice:</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Morning: Start your day with intention</li>
                        <li>• Midday: Reset during stressful moments</li>
                        <li>• Evening: Unwind and prepare for sleep</li>
                        <li>• Anytime: When you need a moment of peace</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessPage;
