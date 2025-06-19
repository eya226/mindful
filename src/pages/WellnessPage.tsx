import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { meditationInstructions } from "@/data/meditationInstructions";
import { Play, Pause, RotateCcw, Heart, Wind, Sparkles, Timer, Volume2, VolumeX, Mic } from "lucide-react";

interface MeditationSession {
  id: string;
  titleKey: string;
  descKey: string;
  duration: number;
  category: 'breathing' | 'mindfulness' | 'relaxation' | 'sleep';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructionsKey: keyof typeof meditationInstructions.en;
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

  const { language, t } = useLanguage();

  const sessions: MeditationSession[] = [
    {
      id: '1',
      titleKey: 'session.breathing.title',
      descKey: 'session.breathing.desc',
      duration: 5,
      category: 'breathing',
      difficulty: 'beginner',
      breathingPattern: { inhale: 4, hold: 7, exhale: 8 },
      instructionsKey: 'breathing'
    },
    {
      id: '2',
      titleKey: 'session.bodyscan.title',
      descKey: 'session.bodyscan.desc',
      duration: 15,
      category: 'mindfulness',
      difficulty: 'intermediate',
      instructionsKey: 'bodyScan'
    },
    {
      id: '3',
      titleKey: 'session.lovingkindness.title',
      descKey: 'session.lovingkindness.desc',
      duration: 10,
      category: 'mindfulness',
      difficulty: 'beginner',
      instructionsKey: 'lovingKindness'
    },
    {
      id: '4',
      titleKey: 'session.sleep.title',
      descKey: 'session.sleep.desc',
      duration: 20,
      category: 'sleep',
      difficulty: 'beginner',
      instructionsKey: 'sleep'
    },
    {
      id: '5',
      titleKey: 'session.stress.title',
      descKey: 'session.stress.desc',
      duration: 8,
      category: 'relaxation',
      difficulty: 'intermediate',
      instructionsKey: 'stress'
    },
    {
      id: '6',
      titleKey: 'session.mountain.title',
      descKey: 'session.mountain.desc',
      duration: 25,
      category: 'mindfulness',
      difficulty: 'advanced',
      instructionsKey: 'mountain'
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

  // Get current instructions based on language
  const getCurrentInstructions = () => {
    if (!activeSession) return [];
    return meditationInstructions[language][activeSession.instructionsKey] || [];
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
      const instructions = getCurrentInstructions();
      const instructionDuration = (activeSession.duration * 60) / instructions.length;
      const currentInstructionIndex = Math.floor(currentTime / instructionDuration);
      if (currentInstructionIndex < instructions.length) {
        setCurrentInstruction(currentInstructionIndex);
      }
    }
  }, [currentTime, activeSession, isPlaying, showGuidance, language]);

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
      utterance.lang = language === 'tn' ? 'ar-TN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  // Speak current instruction when it changes
  useEffect(() => {
    if (activeSession && isPlaying && showGuidance && isSoundEnabled) {
      const instructions = getCurrentInstructions();
      const instruction = instructions[currentInstruction];
      if (instruction) {
        speakInstruction(instruction);
      }
    }
  }, [currentInstruction, activeSession, isPlaying, showGuidance, isSoundEnabled, language]);

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
      const welcomeMsg = t('welcome.message').replace('{title}', t(session.titleKey));
      speakInstruction(welcomeMsg);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && isSoundEnabled) {
      speakInstruction(t('resume.message'));
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
    if (!activeSession?.breathingPattern) return t('breathing.naturally');
    
    const pattern = activeSession.breathingPattern;
    switch (breathingPhase) {
      case 'inhale':
        return t('breathing.inhale').replace('{count}', pattern.inhale.toString());
      case 'hold':
        return t('breathing.hold').replace('{count}', pattern.hold.toString());
      case 'exhale':
        return t('breathing.exhale').replace('{count}', pattern.exhale.toString());
      case 'pause':
        return t('breathing.pause');
      default:
        return t('breathing.naturally');
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
            <div className="flex justify-center items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{t('wellness.title')}</h1>
              <LanguageSelector />
            </div>
            <p className="text-gray-600">
              {t('wellness.subtitle')}
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
                      {activeSession ? t('player.activeSession') : t('player.selectSession')}
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
                        <h3 className="font-semibold text-lg mb-2">{t(activeSession.titleKey)}</h3>
                        <p className="text-sm text-gray-600 mb-4">{t(activeSession.descKey)}</p>
                        
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
                        {showGuidance && (
                          <div className="bg-blue-50 p-4 rounded-lg mb-4">
                            <p className="text-sm text-blue-800 leading-relaxed" style={{ direction: language === 'tn' ? 'rtl' : 'ltr' }}>
                              {getCurrentInstructions()[currentInstruction] || ''}
                            </p>
                            <div className="mt-2 text-xs text-blue-600">
                              {t('action.step').replace('{current}', (currentInstruction + 1).toString()).replace('{total}', getCurrentInstructions().length.toString())}
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
                            <p className="text-green-600 text-sm font-medium">{t('player.sessionComplete')}</p>
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
                      <div className="text-xs text-gray-500 space-y-1" style={{ direction: language === 'tn' ? 'rtl' : 'ltr' }}>
                        <p>{t('feature.soundGuidance')}</p>
                        <p>{t('feature.textInstructions')}</p>
                        <p>{t('feature.visualCues')}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="mb-2">{t('player.chooseSession')}</p>
                      <p className="text-sm">{t('player.description')}</p>
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
                          <CardTitle className="text-lg">{t(session.titleKey)}</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {session.duration} min
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={`text-xs ${categoryColors[session.category]}`}>
                          {t(`category.${session.category}`)}
                        </Badge>
                        <Badge className={`text-xs ${difficultyColors[session.difficulty]}`}>
                          {t(`difficulty.${session.difficulty}`)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-3" style={{ direction: language === 'tn' ? 'rtl' : 'ltr' }}>
                        {t(session.descKey)}
                      </p>
                      <div className="text-xs text-gray-500 mb-4" style={{ direction: language === 'tn' ? 'rtl' : 'ltr' }}>
                        {t('feature.guidedSteps').replace('{count}', getCurrentInstructions().length.toString())}
                        {session.breathingPattern && t('feature.breathingPattern')}
                      </div>
                      <Button 
                        className="w-full"
                        variant={activeSession?.id === session.id ? "default" : "outline"}
                      >
                        {activeSession?.id === session.id ? t('action.currentlyActive') : t('action.start')}
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
                    {t('tips.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Timer className="h-4 w-4 text-blue-600" />
                        {t('tips.gettingStarted')}
                      </h4>
                      <ul className="space-y-2 text-gray-600" style={{ direction: language === 'tn' ? 'rtl' : 'ltr' }}>
                        <li>• {language === 'tn' ? 'لقّي مكان هادي ومريح' : 'Find a quiet, comfortable space'}</li>
                        <li>• {language === 'tn' ? 'اقعد ولا استلقي كما هو موضّح' : 'Sit or lie down as instructed'}</li>
                        <li>• {language === 'tn' ? 'فعّل الصوت للتجربة الكاملة' : 'Turn on guided audio for full experience'}</li>
                        <li>• {language === 'tn' ? 'اتبع التعليمات خطوة خطوة' : 'Follow the step-by-step instructions'}</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-green-600" />
                        {t('tips.duringPractice')}
                      </h4>
                      <ul className="space-y-2 text-gray-600" style={{ direction: language === 'tn' ? 'rtl' : 'ltr' }}>
                        <li>• {language === 'tn' ? 'خلّي الأفكار تيجي وتروح طبيعياً' : 'Let thoughts come and go naturally'}</li>
                        <li>• {language === 'tn' ? 'اتبع الإشارات البصرية للتنفس' : 'Follow the visual breathing cues'}</li>
                        <li>• {language === 'tn' ? 'اسمع للصوت الموجّه بلطف' : 'Listen to the gentle voice guidance'}</li>
                        <li>• {language === 'tn' ? 'اصبر على روحك وكن لطيف' : 'Be patient and kind with yourself'}</li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        {t('tips.buildingPeace')}
                      </h4>
                      <ul className="space-y-2 text-gray-600" style={{ direction: language === 'tn' ? 'rtl' : 'ltr' }}>
                        <li>• {language === 'tn' ? 'مارس يومياً، حتى لو 5 دقايق بس' : 'Practice daily, even if just 5 minutes'}</li>
                        <li>• {language === 'tn' ? 'جرّب أنواع جلسات مختلفة' : 'Try different session types'}</li>
                        <li>• {language === 'tn' ? 'لاحظ كيف تحسّ بعد كل جلسة' : 'Notice how you feel after each session'}</li>
                        <li>• {language === 'tn' ? 'احمل هذه السكينة معاك في يومك' : 'Carry this peace into your day'}</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium mb-2" style={{ direction: language === 'tn' ? 'rtl' : 'ltr' }}>
                      {t('tips.remember')}
                    </p>
                    <p className="text-xs text-gray-600" style={{ direction: language === 'tn' ? 'rtl' : 'ltr' }}>
                      {t('tips.designed')}
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
