
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { sessions } = useChatSessions();
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgressData = async () => {
      if (!user) return;
      
      try {
        const data = await progressTracker.getUserProgress(user.id);
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
      await logout();
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
    { goal: 'Practice mindfulness daily', current: progressData?.weeklyMindfulness || 0, target: 7, icon: <Heart className="h-5 w-5" /> },
    { goal: 'Write 2 journal entries', current: progressData?.weeklyJournals || 0, target: 2, icon: <BookOpen className="h-5 w-5" /> },
    { goal: 'Use wellness tools', current: progressData?.weeklyWellness || 0, target: 5, icon: <Activity className="h-5 w-5" /> }
  ];

  const recentAchievements = [
    { title: 'First Therapy Session', description: 'Completed your first AI therapy session', earned: true, icon: <Award className="h-5 w-5" /> },
    { title: 'Consistent User', description: 'Used the app for 3 consecutive days', earned: progressData?.consecutiveDays >= 3, icon: <Calendar className="h-5 w-5" /> },
    { title: 'Mindfulness Master', description: 'Completed 10 mindfulness sessions', earned: progressData?.totalMindfulness >= 10, icon: <Smile className="h-5 w-5" /> },
    { title: 'Progress Tracker', description: 'Logged activities for a full week', earned: progressData?.weeklyStreak >= 7, icon: <TrendingUp className="h-5 w-5" /> }
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
                    <p className="text-2xl font-bold text-gray-900">{progressData?.totalMindfulness || 0}</p>
                    <p className="text-sm text-gray-600">Mindfulness Sessions</p>
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
                    <p className="text-2xl font-bold text-gray-900">{progressData?.totalJournals || 0}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{progressData?.consecutiveDays || 0}</p>
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
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} text-white p-6 h-auto flex flex-col items-center gap-3 text-center`}
                  >
                    {action.icon}
                    <div>
                      <p className="font-semibold">{action.title}</p>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                  </Button>
                ))}
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
                  {weeklyGoals.map((goal, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {goal.icon}
                          <span className="font-medium text-gray-900">{goal.goal}</span>
                        </div>
                        <span className="text-sm text-gray-600">{goal.current}/{goal.target}</span>
                      </div>
                      <Progress 
                        value={(goal.current / goal.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
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
                  {recentAchievements.map((achievement, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        achievement.earned 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          achievement.earned 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${
                            achievement.earned ? 'text-green-800' : 'text-gray-600'
                          }`}>
                            {achievement.title}
                          </h3>
                          <p className={`text-sm ${
                            achievement.earned ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.earned && (
                          <div className="text-green-600">
                            <Award className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
