
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/Navbar";
import { TrendingUp, Calendar, Target, Award, Brain, BookOpen, Heart, CheckCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const ProgressPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Mock data for charts
  const moodData = [
    { date: '2024-01-01', mood: 7, sessions: 2 },
    { date: '2024-01-02', mood: 6, sessions: 1 },
    { date: '2024-01-03', mood: 8, sessions: 3 },
    { date: '2024-01-04', mood: 5, sessions: 1 },
    { date: '2024-01-05', mood: 7, sessions: 2 },
    { date: '2024-01-06', mood: 9, sessions: 2 },
    { date: '2024-01-07', mood: 8, sessions: 3 },
  ];

  const activityData = [
    { activity: 'Therapy Sessions', count: 15, color: '#3B82F6' },
    { activity: 'Journal Entries', count: 23, color: '#10B981' },
    { activity: 'Meditation', count: 12, color: '#8B5CF6' },
    { activity: 'Wellness Activities', count: 8, color: '#F59E0B' },
  ];

  const goalData = [
    { name: 'Completed', value: 75, color: '#10B981' },
    { name: 'In Progress', value: 15, color: '#F59E0B' },
    { name: 'Not Started', value: 10, color: '#EF4444' },
  ];

  const achievements = [
    { id: 1, title: '7-Day Streak', description: 'Completed therapy sessions for 7 consecutive days', icon: <Target className="h-6 w-6" />, earned: true },
    { id: 2, title: 'Mindful Writer', description: 'Written 20+ journal entries', icon: <BookOpen className="h-6 w-6" />, earned: true },
    { id: 3, title: 'Zen Master', description: 'Completed 10 meditation sessions', icon: <Heart className="h-6 w-6" />, earned: true },
    { id: 4, title: 'Progress Pioneer', description: 'Used the platform for 30 days', icon: <Calendar className="h-6 w-6" />, earned: false },
    { id: 5, title: 'Wellness Warrior', description: 'Completed 50 wellness activities', icon: <Award className="h-6 w-6" />, earned: false },
  ];

  const weeklyGoals = [
    { goal: 'Complete 5 therapy sessions', progress: 80, current: 4, target: 5 },
    { goal: 'Write 3 journal entries', progress: 100, current: 3, target: 3 },
    { goal: 'Meditate for 60 minutes', progress: 60, current: 36, target: 60 },
    { goal: 'Practice gratitude daily', progress: 85, current: 6, target: 7 },
  ];

  const stats = [
    { label: 'Total Sessions', value: '47', icon: <Brain className="h-8 w-8 text-blue-600" />, change: '+12%' },
    { label: 'Journal Entries', value: '23', icon: <BookOpen className="h-8 w-8 text-green-600" />, change: '+8%' },
    { label: 'Meditation Minutes', value: '340', icon: <Heart className="h-8 w-8 text-purple-600" />, change: '+25%' },
    { label: 'Streak Days', value: '7', icon: <Target className="h-8 w-8 text-orange-600" />, change: '+2%' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Progress Dashboard</h1>
            <p className="text-gray-600">
              Track your mental health journey and celebrate your achievements
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-green-600 font-medium">{stat.change} this week</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-green-50 rounded-full">
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Mood Tracking Chart */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Mood Trend (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis domain={[1, 10]} />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      formatter={(value, name) => [value, name === 'mood' ? 'Mood Rating' : 'Sessions']}
                    />
                    <Line type="monotone" dataKey="mood" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Activity Breakdown */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Activity Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="activity" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Weekly Goals */}
            <Card className="lg:col-span-2 shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Weekly Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {weeklyGoals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{goal.goal}</span>
                      <span className="text-sm text-gray-600">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Goal Completion Pie Chart */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  Goal Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={goalData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {goalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {goalData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                      <span className="text-xs text-gray-600">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <Card className="mt-8 shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.earned
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-full ${
                        achievement.earned ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {achievement.earned ? <CheckCircle className="h-6 w-6" /> : achievement.icon}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${
                          achievement.earned ? 'text-green-800' : 'text-gray-600'
                        }`}>
                          {achievement.title}
                        </h3>
                        <Badge variant={achievement.earned ? "default" : "secondary"} className="text-xs">
                          {achievement.earned ? 'Earned' : 'Locked'}
                        </Badge>
                      </div>
                    </div>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
