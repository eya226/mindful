import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { CalendarDays, Smile, Meh, Frown, TrendingUp, BookOpen, Save, Plus, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { progressTracker } from "@/services/progressTracker";
import { toast } from "sonner";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'happy' | 'neutral' | 'sad' | 'anxious' | 'excited';
  date: Date;
  aiInsight?: string;
  tags: string[];
}

const JournalPage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState({
    title: '',
    content: '',
    mood: 'neutral' as const,
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('all');

  const moodIcons = {
    happy: { icon: <Smile className="h-4 w-4" />, color: 'text-green-600', bg: 'bg-green-100' },
    neutral: { icon: <Meh className="h-4 w-4" />, color: 'text-gray-600', bg: 'bg-gray-100' },
    sad: { icon: <Frown className="h-4 w-4" />, color: 'text-blue-600', bg: 'bg-blue-100' },
    anxious: { icon: <Frown className="h-4 w-4" />, color: 'text-red-600', bg: 'bg-red-100' },
    excited: { icon: <TrendingUp className="h-4 w-4" />, color: 'text-yellow-600', bg: 'bg-bg-yellow-100' }
  };

  const moodToRating = {
    happy: 8,
    excited: 9,
    neutral: 5,
    sad: 3,
    anxious: 2
  };

  const generateAIInsight = (content: string, mood: string): string => {
    const insights = {
      happy: [
        "Your positive energy is evident in this entry. Consider what specifically contributed to this feeling so you can recreate it in the future.",
        "It's beautiful to see your joy shine through. Gratitude and positive experiences like these can be powerful mood boosters.",
        "This happiness seems genuine and grounded. Remember this feeling during more challenging times."
      ],
      sad: [
        "I notice you're experiencing some difficult emotions. It's okay to feel sad - these feelings are valid and temporary.",
        "Your willingness to express these feelings shows emotional awareness. Consider reaching out to supportive people in your life.",
        "Sadness can be a natural response to life's challenges. Be gentle with yourself during this time."
      ],
      anxious: [
        "I can sense the worry in your words. Try some deep breathing exercises and remember that anxiety often makes things seem worse than they are.",
        "Anxiety can feel overwhelming, but you're not alone. Consider breaking down your concerns into smaller, manageable pieces.",
        "Your feelings are valid. Sometimes writing about anxiety can help reduce its power over us."
      ],
      neutral: [
        "Stability in mood can be a sign of emotional balance. How are you feeling about this sense of equilibrium?",
        "Sometimes neutral feelings give us space to reflect clearly. What insights are emerging for you today?",
        "This steady emotional state might be an opportunity to focus on goals or relationships."
      ],
      excited: [
        "Your enthusiasm is contagious! This energy could be channeled into creative or productive activities.",
        "Excitement can be a powerful motivator. What are you most looking forward to?",
        "This positive energy is wonderful to see. Consider how you can maintain this momentum."
      ]
    };

    const moodInsights = insights[mood as keyof typeof insights] || insights.neutral;
    return moodInsights[Math.floor(Math.random() * moodInsights.length)];
  };

  const saveEntry = async () => {
    if (!currentEntry.title.trim() || !currentEntry.content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to save journal entries");
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      ...currentEntry,
      date: new Date(),
      aiInsight: generateAIInsight(currentEntry.content, currentEntry.mood)
    };

    setEntries(prev => [newEntry, ...prev]);
    
    // Track this journal entry as an activity
    try {
      await progressTracker.trackJournalEntry(
        user.id, 
        moodToRating[currentEntry.mood],
        `${currentEntry.title}: ${currentEntry.tags.join(', ')}`
      );
      toast.success("Journal entry saved and progress tracked!");
    } catch (error) {
      console.error('Error tracking journal entry:', error);
      toast.success("Journal entry saved!");
    }

    setCurrentEntry({ title: '', content: '', mood: 'neutral', tags: [] });
  };

  // Track login when component mounts
  useEffect(() => {
    if (user) {
      progressTracker.trackLogin(user.id).catch(error => {
        console.error('Error tracking login:', error);
      });
    }
  }, [user]);

  const addTag = () => {
    if (newTag.trim() && !currentEntry.tags.includes(newTag.trim())) {
      setCurrentEntry(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMood = selectedMoodFilter === 'all' || entry.mood === selectedMoodFilter;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar isLoggedIn={!!user} setIsLoggedIn={() => {}} />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Smart Journal</h1>
            <p className="text-gray-600">
              Express your thoughts and receive AI-powered insights to support your mental health journey
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* New Entry */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  New Journal Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Input
                  placeholder="Entry title..."
                  value={currentEntry.title}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                  className="font-medium"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling?</label>
                  <Select 
                    value={currentEntry.mood} 
                    onValueChange={(value: any) => setCurrentEntry(prev => ({ ...prev, mood: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(moodIcons).map(([mood, { icon, color }]) => (
                        <SelectItem key={mood} value={mood}>
                          <div className={`flex items-center gap-2 ${color}`}>
                            {icon}
                            <span className="capitalize">{mood}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Textarea
                  placeholder="What's on your mind today? Write about your thoughts, feelings, experiences..."
                  value={currentEntry.content}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-32 resize-none"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      size={20}
                    />
                    <Button onClick={addTag} variant="outline" size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentEntry.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-gray-300"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={saveEntry}
                  disabled={!currentEntry.title.trim() || !currentEntry.content.trim()}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Entry
                </Button>
              </CardContent>
            </Card>

            {/* Previous Entries */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Journal History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Filters */}
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search entries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedMoodFilter} onValueChange={setSelectedMoodFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Moods</SelectItem>
                      {Object.keys(moodIcons).map((mood) => (
                        <SelectItem key={mood} value={mood}>
                          <span className="capitalize">{mood}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Entries List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredEntries.map((entry) => {
                    const moodConfig = moodIcons[entry.mood];
                    return (
                      <div key={entry.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{entry.title}</h3>
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded-full ${moodConfig.bg}`}>
                              <span className={moodConfig.color}>{moodConfig.icon}</span>
                            </div>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              {entry.date.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{entry.content}</p>
                        
                        {entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {entry.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {entry.aiInsight && (
                          <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
                            <strong>AI Insight:</strong> {entry.aiInsight}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {filteredEntries.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      {searchTerm || selectedMoodFilter !== 'all' 
                        ? 'No entries match your filters.' 
                        : 'No journal entries yet. Start writing your first entry!'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
