import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import { useChatSessions } from "@/hooks/useChatSessions";
import { progressTracker } from "@/services/progressTracker";
import { 
  Brain, 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target,
  Award,
  Activity,
  BookOpen,
  Users,
  Smile
} from "lucide-react";
import { toast } from "sonner";

const DashboardPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { sessions } = useChatSessions();
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgressData = async () => {
      if (!user) return;
      
      try {
        const data = await progressTracker.getProgressStats(user.id);
        setProgressData(data);
      } catch (error) {
        console.error('Error loading progress data:', error);
        toast.error("Failed to load progress data");
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success("Logged out successfully");
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error("Failed to log out");
    }
  };

  const quickActions = [
    {
      title: 'Start Therapy Session',
      description: 'Begin a new AI therapy session',
      icon: <Brain className="h-6 w-6" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => navigate('/therapy')
    },
    {
      title: 'Wellness Activities',
      description: 'Meditation and mindfulness exercises',
      icon: <Heart className="h-6 w-6" />,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => navigate('/wellness')
    },
    {
      title: 'Journal Entry',
      description: 'Write about your thoughts and feelings',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => navigate('/journal')
    },
    {
      title: 'View Progress',
      description: 'Track your mental health journey',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => navigate('/progress')
    }
  ];

  const weeklyGoals = [
    { goal: 'Complete 3 therapy sessions', current: sessions?.length || 0, target: 3, icon: <MessageCircle className="h-5 w-5" /> },
    { goal: 'Practice mindfulness daily', current: progressData?.weeklyGoals?.dailyPractice?.current || 0, target: 7, icon: <Heart className="h-5 w-5" /> },
    { goal: 'Write 2 journal entries', current: progressData?.weeklyGoals?.journalEntries?.current || 0, target: 2, icon: <BookOpen className="h-5 w-5" /> },
    { goal: 'Meditate 60 minutes', current: progressData?.weeklyGoals?.meditationMinutes?.current || 0, target: 60, icon: <Clock className="h-5 w-5" /> }
  ];

  const recentAchievements = [
    { title: 'Seven Day Streak', description: 'Used the app for 7 consecutive days', earned: progressData?.achievements?.sevenDayStreak, icon: <Calendar className="h-5 w-5" /> },
    { title: 'Mindful Writer', description: 'Completed 20 journal entries', earned: progressData?.achievements?.mindfulWriter, icon: <BookOpen className="h-5 w-5" /> },
    { title: 'Zen Master', description: 'Completed 10 meditation sessions', earned: progressData?.achievements?.zenMaster, icon: <Heart className="h-5 w-5" /> },
    { title: 'Wellness Warrior', description: 'Completed 50 wellness activities', earned: progressData?.achievements?.wellnessWarrior, icon: <Activity className="h-5 w-5" /> }
  ];

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
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.user_metadata?.full_name || user?.email}
            </h1>
            <p className="text-gray-600">Here's how you're doing on your mental health journey</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{sessions?.length || 0}</p>
                    <p className="text-sm text-gray-600">Therapy Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{progressData?.meditationMinutes || 0}</p>
                    <p className="text-sm text-gray-600">Meditation Minutes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{progressData?.journalEntries || 0}</p>
                    <p className="text-sm text-gray-600">Journal Entries</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{progressData?.streakDays || 0}</p>
                    <p className="text-sm text-gray-600">Day Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="shadow-xl border-0 mb-8">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  onClick={() => navigate('/therapy')}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-6 h-auto flex flex-col items-center gap-3 text-center"
                >
                  <Brain className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Start Therapy Session</p>
                    <p className="text-sm opacity-90">Begin a new AI therapy session</p>
                  </div>
                </Button>
                <Button
                  onClick={() => navigate('/wellness')}
                  className="bg-green-500 hover:bg-green-600 text-white p-6 h-auto flex flex-col items-center gap-3 text-center"
                >
                  <Heart className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Wellness Activities</p>
                    <p className="text-sm opacity-90">Meditation and mindfulness exercises</p>
                  </div>
                </Button>
                <Button
                  onClick={() => navigate('/journal')}
                  className="bg-purple-500 hover:bg-purple-600 text-white p-6 h-auto flex flex-col items-center gap-3 text-center"
                >
                  <BookOpen className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Journal Entry</p>
                    <p className="text-sm opacity-90">Write about your thoughts and feelings</p>
                  </div>
                </Button>
                <Button
                  onClick={() => navigate('/progress')}
                  className="bg-orange-500 hover:bg-orange-600 text-white p-6 h-auto flex flex-col items-center gap-3 text-center"
                >
                  <TrendingUp className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">View Progress</p>
                    <p className="text-sm opacity-90">Track your mental health journey</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Weekly Goals */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Weekly Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        <span className="font-medium text-gray-900">Complete 3 therapy sessions</span>
                      </div>
                      <span className="text-sm text-gray-600">{progressData?.weeklyGoals?.therapySessions?.current || 0}/3</span>
                    </div>
                    <Progress 
                      value={((progressData?.weeklyGoals?.therapySessions?.current || 0) / 3) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        <span className="font-medium text-gray-900">Practice mindfulness daily</span>
                      </div>
                      <span className="text-sm text-gray-600">{progressData?.weeklyGoals?.dailyPractice?.current || 0}/7</span>
                    </div>
                    <Progress 
                      value={((progressData?.weeklyGoals?.dailyPractice?.current || 0) / 7) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        <span className="font-medium text-gray-900">Write 2 journal entries</span>
                      </div>
                      <span className="text-sm text-gray-600">{progressData?.weeklyGoals?.journalEntries?.current || 0}/2</span>
                    </div>
                    <Progress 
                      value={((progressData?.weeklyGoals?.journalEntries?.current || 0) / 2) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <span className="font-medium text-gray-900">Meditate 60 minutes</span>
                      </div>
                      <span className="text-sm text-gray-600">{progressData?.weeklyGoals?.meditationMinutes?.current || 0}/60</span>
                    </div>
                    <Progress 
                      value={((progressData?.weeklyGoals?.meditationMinutes?.current || 0) / 60) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border-2 ${
                    progressData?.achievements?.sevenDayStreak 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        progressData?.achievements?.sevenDayStreak 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          progressData?.achievements?.sevenDayStreak ? 'text-green-800' : 'text-gray-600'
                        }`}>
                          Seven Day Streak
                        </h3>
                        <p className={`text-sm ${
                          progressData?.achievements?.sevenDayStreak ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          Used the app for 7 consecutive days
                        </p>
                      </div>
                      {progressData?.achievements?.sevenDayStreak && (
                        <div className="text-green-600">
                          <Award className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border-2 ${
                    progressData?.achievements?.mindfulWriter 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        progressData?.achievements?.mindfulWriter 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          progressData?.achievements?.mindfulWriter ? 'text-green-800' : 'text-gray-600'
                        }`}>
                          Mindful Writer
                        </h3>
                        <p className={`text-sm ${
                          progressData?.achievements?.mindfulWriter ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          Completed 20 journal entries
                        </p>
                      </div>
                      {progressData?.achievements?.mindfulWriter && (
                        <div className="text-green-600">
                          <Award className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border-2 ${
                    progressData?.achievements?.zenMaster 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        progressData?.achievements?.zenMaster 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Heart className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          progressData?.achievements?.zenMaster ? 'text-green-800' : 'text-gray-600'
                        }`}>
                          Zen Master
                        </h3>
                        <p className={`text-sm ${
                          progressData?.achievements?.zenMaster ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          Completed 10 meditation sessions
                        </p>
                      </div>
                      {progressData?.achievements?.zenMaster && (
                        <div className="text-green-600">
                          <Award className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border-2 ${
                    progressData?.achievements?.wellnessWarrior 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        progressData?.achievements?.wellnessWarrior 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Activity className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          progressData?.achievements?.wellnessWarrior ? 'text-green-800' : 'text-gray-600'
                        }`}>
                          Wellness Warrior
                        </h3>
                        <p className={`text-sm ${
                          progressData?.achievements?.wellnessWarrior ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          Completed 50 wellness activities
                        </p>
                      </div>
                      {progressData?.achievements?.wellnessWarrior && (
                        <div className="text-green-600">
                          <Award className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="shadow-xl border-0 mt-8">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {sessions && sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MessageCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{session.title}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(session.created_at).toLocaleDateString()} at{' '}
                          {new Date(session.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/therapy')}
                      >
                        Continue
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 mb-4">No recent activity yet</p>
                  <Button onClick={() => navigate('/therapy')}>
                    Start Your First Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
