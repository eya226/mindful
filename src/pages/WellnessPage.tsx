
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Play, Pause, RotateCcw, Heart, Wind, Sparkles, Timer, Volume2, VolumeX, Mic } from "lucide-react";

interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: 'breathing' | 'mindfulness' | 'relaxation' | 'sleep';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  breathingPattern?: {
    inhale: number;
    hold: number;
    exhale: number;
    pause?: number;
  };
}

const WellnessPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeSession, setActiveSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [showGuidance, setShowGuidance] = useState(true);

  const sessions: MeditationSession[] = [
    {
      id: '1',
      title: '4-7-8 Breathing Technique',
      description: 'A powerful breathing exercise to reduce anxiety and promote relaxation',
      duration: 5,
      category: 'breathing',
      difficulty: 'beginner',
      breathingPattern: { inhale: 4, hold: 7, exhale: 8 },
      instructions: [
        "Find a comfortable seated position with your back straight",
        "Place one hand on your chest and one on your belly",
        "Close your eyes or soften your gaze",
        "We'll breathe in for 4 counts, hold for 7, and exhale for 8",
        "Let's begin with a few natural breaths to center yourself",
        "Inhale slowly through your nose for 4 counts",
        "Hold your breath gently for 7 counts",
        "Exhale completely through your mouth for 8 counts",
        "Continue this pattern, letting each breath bring you deeper peace",
        "Notice how your body relaxes with each exhale"
      ]
    },
    {
      id: '2',
      title: 'Body Scan Meditation',
      description: 'Progressive relaxation technique to release tension throughout your body',
      duration: 15,
      category: 'mindfulness',
      difficulty: 'intermediate',
      instructions: [
        "Lie down comfortably or sit with your back supported",
        "Close your eyes and take three deep breaths",
        "Start by noticing the contact points of your body",
        "Bring attention to the top of your head",
        "Notice any sensations in your forehead and temples",
        "Relax your eyes, cheeks, and jaw completely",
        "Feel the weight of your shoulders melting down",
        "Scan through your arms, hands, and fingers",
        "Notice your chest rising and falling naturally",
        "Relax your back, feeling supported",
        "Soften your belly and lower back",
        "Release tension in your hips and pelvis",
        "Scan through your thighs, knees, and calves",
        "Feel your feet completely relaxed",
        "Take a moment to feel your whole body at peace"
      ]
    },
    {
      id: '3',
      title: 'Loving-Kindness Meditation',
      description: 'Cultivate compassion and positive emotions towards yourself and others',
      duration: 10,
      category: 'mindfulness',
      difficulty: 'beginner',
      instructions: [
        "Sit comfortably with your hands resting gently",
        "Close your eyes and breathe naturally",
        "Bring yourself to mind with kindness",
        "Repeat silently: 'May I be happy and peaceful'",
        "Feel these words in your heart: 'May I be healthy and strong'",
        "Continue with: 'May I live with ease and joy'",
        "Now bring a loved one to mind",
        "Offer them the same wishes: 'May you be happy and peaceful'",
        "Extend these feelings: 'May you be healthy and strong'",
        "Continue: 'May you live with ease and joy'",
        "Now think of someone neutral - perhaps a neighbor",
        "Offer them these same kind wishes",
        "Finally, extend these feelings to all beings everywhere",
        "Rest in this feeling of universal love and compassion"
      ]
    },
    {
      id: '4',
      title: 'Deep Sleep Relaxation',
      description: 'Gentle meditation to help you unwind and prepare for restful sleep',
      duration: 20,
      category: 'sleep',
      difficulty: 'beginner',
      instructions: [
        "Lie down in your most comfortable position",
        "Pull the covers up and adjust your pillow",
        "Let your eyes close naturally",
        "Take a long, slow breath in... and let it all go",
        "Feel your body sinking into the bed",
        "Release any thoughts about tomorrow",
        "Let go of anything from today",
        "Feel your forehead becoming smooth and relaxed",
        "Let your jaw drop open slightly",
        "Feel your shoulders melting into the mattress",
        "Your arms are becoming heavy and warm",
        "Your chest rises and falls peacefully",
        "Your belly is soft and relaxed",
        "Your legs are becoming heavy and still",
        "You are safe, peaceful, and ready for deep rest"
      ]
    },
    {
      id: '5',
      title: 'Stress Relief Meditation',
      description: 'Quick and effective meditation to reduce stress and anxiety',
      duration: 8,
      category: 'relaxation',
      difficulty: 'intermediate',
      instructions: [
        "Sit comfortably and close your eyes",
        "Take three deep cleansing breaths",
        "Notice where you feel stress in your body",
        "Don't try to change it, just observe with kindness",
        "Breathe into that area of tension",
        "Imagine your breath as warm, healing light",
        "With each exhale, release a little more tension",
        "Say to yourself: 'This feeling will pass'",
        "Remember: 'I am stronger than my stress'",
        "Feel your natural resilience and calm",
        "Take a moment to appreciate your courage",
        "When you're ready, gently open your eyes"
      ]
    },
    {
      id: '6',
      title: 'Mountain Meditation',
      description: 'Advanced mindfulness practice using mountain imagery for stability',
      duration: 25,
      category: 'mindfulness',
      difficulty: 'advanced',
      instructions: [
        "Sit with your spine tall like a mountain",
        "Close your eyes and breathe naturally",
        "Imagine yourself as a majestic mountain",
        "Your base is broad and stable, rooted deep in the earth",
        "Your peak reaches toward the sky with dignity",
        "Weather passes over and around you - clouds, storms, sunshine",
        "But you remain unchanged, steady, and strong",
        "When thoughts arise, see them as weather passing by",
        "You observe but remain unmoved",
        "Some seasons bring snow, others bring flowers",
        "Through it all, you remain the mountain",
        "Feel this deep stability within yourself",
        "This is your true nature - unshakeable and peaceful",
        "Rest in this mountain-like awareness",
        "You are both the observer and the observed"
      ]
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

  // Instruction progression logic
  useEffect(() => {
    if (activeSession && isPlaying && showGuidance) {
      const instructionDuration = (activeSession.duration * 60) / activeSession.instructions.length;
      const currentInstructionIndex = Math.floor(currentTime / instructionDuration);
      if (currentInstructionIndex < activeSession.instructions.length) {
        setCurrentInstruction(currentInstructionIndex);
      }
    }
  }, [currentTime, activeSession, isPlaying, showGuidance]);

  // Breathing animation logic
  useEffect(() => {
    if (activeSession?.category === 'breathing' && isPlaying && activeSession.breathingPattern) {
      const pattern = activeSession.breathingPattern;
      const totalCycle = pattern.inhale + pattern.hold + pattern.exhale + (pattern.pause || 0);
      
      const breathingInterval = setInterval(() => {
        setBreathingCount(prev => {
          const newCount = (prev + 1) % totalCycle;
          
          if (newCount < pattern.inhale) {
            setBreathingPhase('inhale');
          } else if (newCount < pattern.inhale + pattern.hold) {
            setBreathingPhase('hold');
          } else if (newCount < pattern.inhale + pattern.hold + pattern.exhale) {
            setBreathingPhase('exhale');
          } else {
            setBreathingPhase('pause');
          }
          
          return newCount;
        });
      }, 1000);

      return () => clearInterval(breathingInterval);
    }
  }, [activeSession, isPlaying]);

  // Text-to-speech functionality
  const speakInstruction = (text: string) => {
    if (isSoundEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
      utterance.volume = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  // Speak current instruction when it changes
  useEffect(() => {
    if (activeSession && isPlaying && showGuidance && isSoundEnabled) {
      const instruction = activeSession.instructions[currentInstruction];
      if (instruction) {
        speakInstruction(instruction);
      }
    }
  }, [currentInstruction, activeSession, isPlaying, showGuidance, isSoundEnabled]);

  const startSession = (session: MeditationSession) => {
    setActiveSession(session);
    setCurrentTime(0);
    setBreathingCount(0);
    setBreathingPhase('inhale');
    setCurrentInstruction(0);
    setIsPlaying(true);
    setShowGuidance(true);
    
    // Welcome message
    if (isSoundEnabled) {
      speakInstruction(`Welcome to ${session.title}. Let's begin your journey to inner peace.`);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && isSoundEnabled && activeSession) {
      speakInstruction("Resuming your meditation session.");
    }
  };

  const resetSession = () => {
    setCurrentTime(0);
    setBreathingCount(0);
    setBreathingPhase('inhale');
    setCurrentInstruction(0);
    setIsPlaying(false);
    if (isSoundEnabled) {
      speechSynthesis.cancel();
    }
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
    if (!activeSession?.breathingPattern) return 'Breathe naturally...';
    
    const pattern = activeSession.breathingPattern;
    switch (breathingPhase) {
      case 'inhale':
        return `Breathe in slowly... (${pattern.inhale} counts)`;
      case 'hold':
        return `Hold your breath gently... (${pattern.hold} counts)`;
      case 'exhale':
        return `Exhale completely... (${pattern.exhale} counts)`;
      case 'pause':
        return 'Natural pause...';
      default:
        return 'Breathe naturally...';
    }
  };

  const getBreathingScale = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'scale-150';
      case 'hold':
        return 'scale-150';
      case 'exhale':
        return 'scale-75';
      default:
        return 'scale-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Guided Wellness & Meditation</h1>
            <p className="text-gray-600">
              Experience fully guided meditation sessions designed to help you find inner peace and tranquility
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Session Player */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0 sticky top-24">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-5 w-5" />
                      {activeSession ? 'Active Session' : 'Select a Session'}
                    </div>
                    {activeSession && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                        >
                          {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                          onClick={() => setShowGuidance(!showGuidance)}
                        >
                          <Mic className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
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
                              className={`w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center transition-all duration-1000 ${getBreathingScale()}`}
                            >
                              <Heart className="h-12 w-12 text-white" />
                            </div>
                            <p className="text-lg font-medium mt-4 text-blue-600">
                              {getBreathingInstruction()}
                            </p>
                          </div>
                        )}
                        
                        {/* General Meditation Visual */}
                        {activeSession.category !== 'breathing' && (
                          <div className="flex flex-col items-center mb-6">
                            <div className={`w-32 h-32 rounded-full bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center transition-all duration-2000 ${isPlaying ? 'animate-pulse' : ''}`}>
                              {categoryIcons[activeSession.category] && 
                                React.cloneElement(categoryIcons[activeSession.category], { className: "h-12 w-12 text-white" })
                              }
                            </div>
                          </div>
                        )}

                        {/* Guided Instructions */}
                        {showGuidance && activeSession.instructions[currentInstruction] && (
                          <div className="bg-blue-50 p-4 rounded-lg mb-4">
                            <p className="text-sm text-blue-800 leading-relaxed">
                              {activeSession.instructions[currentInstruction]}
                            </p>
                            <div className="mt-2 text-xs text-blue-600">
                              Step {currentInstruction + 1} of {activeSession.instructions.length}
                            </div>
                          </div>
                        )}
                        
                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(activeSession.duration * 60)}</span>
                          </div>
                          <Progress value={getProgress()} className="h-2" />
                          {getProgress() === 100 && (
                            <p className="text-green-600 text-sm font-medium">Session complete! 🎉</p>
                          )}
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex justify-center gap-4">
                        <Button
                          onClick={togglePlayPause}
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={getProgress() === 100}
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

                      {/* Session Features */}
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>💡 Toggle sound guidance with the volume button</p>
                        <p>📝 Toggle text instructions with the mic button</p>
                        <p>🎯 Follow the visual cues for breathing exercises</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="mb-2">Choose a guided meditation session</p>
                      <p className="text-sm">Each session includes step-by-step guidance to help you find inner peace</p>
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
                      <p className="text-sm text-gray-600 mb-3">{session.description}</p>
                      <div className="text-xs text-gray-500 mb-4">
                        ✨ {session.instructions.length} guided steps
                        {session.breathingPattern && " • Breathing pattern included"}
                      </div>
                      <Button 
                        className="w-full"
                        variant={activeSession?.id === session.id ? "default" : "outline"}
                      >
                        {activeSession?.id === session.id ? 'Currently Active' : 'Start Guided Session'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Enhanced Tips */}
              <Card className="mt-8 shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    Your Guide to Inner Peace
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Timer className="h-4 w-4 text-blue-600" />
                        Getting Started
                      </h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Find a quiet, comfortable space</li>
                        <li>• Sit or lie down as instructed</li>
                        <li>• Turn on guided audio for full experience</li>
                        <li>• Follow the step-by-step instructions</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-green-600" />
                        During Practice
                      </h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Let thoughts come and go naturally</li>
                        <li>• Follow the visual breathing cues</li>
                        <li>• Listen to the gentle voice guidance</li>
                        <li>• Be patient and kind with yourself</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        Building Peace
                      </h4>
                      <ul className="space-y-2 text-gray-600">
                        <li>• Practice daily, even if just 5 minutes</li>
                        <li>• Try different session types</li>
                        <li>• Notice how you feel after each session</li>
                        <li>• Carry this peace into your day</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium mb-2">
                      🌟 Remember: Every moment of practice is a step toward inner peace
                    </p>
                    <p className="text-xs text-gray-600">
                      These guided sessions are designed to help you develop lasting mindfulness and find tranquility in your daily life.
                    </p>
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
