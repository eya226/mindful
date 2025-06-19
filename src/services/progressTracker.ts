import { supabase } from '@/integrations/supabase/client';

export interface UserActivity {
  id?: string;
  user_id: string;
  activity_type: 'therapy_session' | 'journal_entry' | 'meditation' | 'wellness_activity' | 'login';
  duration_minutes?: number;
  mood_rating?: number;
  notes?: string;
  created_at?: string;
}

export interface ProgressStats {
  totalSessions: number;
  journalEntries: number;
  meditationMinutes: number;
  streakDays: number;
  weeklyGoals: {
    therapySessions: { current: number; target: number };
    journalEntries: { current: number; target: number };
    meditationMinutes: { current: number; target: number };
    dailyPractice: { current: number; target: number };
  };
  moodTrend: { date: string; mood: number; sessions: number }[];
  achievements: {
    sevenDayStreak: boolean;
    mindfulWriter: boolean;
    zenMaster: boolean;
    progressPioneer: boolean;
    wellnessWarrior: boolean;
  };
}

class ProgressTracker {
  async trackActivity(activity: Omit<UserActivity, 'id' | 'created_at'>): Promise<void> {
    try {
      console.log('Tracking activity:', activity);
      const { error } = await supabase
        .from('user_activities')
        .insert({
          ...activity,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error tracking activity:', error);
        throw error;
      }
      
      console.log('Activity tracked successfully');
    } catch (error) {
      console.error('Error tracking activity:', error);
      throw error;
    }
  }

  async getProgressStats(userId: string): Promise<ProgressStats> {
    try {
      console.log('Fetching progress stats for user:', userId);
      const { data: activities, error } = await (supabase as any)
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching activities:', error);
        return this.getEmptyStats();
      }

      console.log('Retrieved activities:', activities?.length || 0);
      return this.calculateStats(activities || []);
    } catch (error) {
      console.error('Error getting progress stats:', error);
      return this.getEmptyStats();
    }
  }

  private calculateStats(activities: UserActivity[]): ProgressStats {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filter activities by type
    const therapySessions = activities.filter(a => a.activity_type === 'therapy_session');
    const journalEntries = activities.filter(a => a.activity_type === 'journal_entry');
    const meditations = activities.filter(a => a.activity_type === 'meditation');
    const wellnessActivities = activities.filter(a => a.activity_type === 'wellness_activity');

    // Weekly activities
    const weeklyTherapy = therapySessions.filter(a => new Date(a.created_at!) >= weekAgo);
    const weeklyJournal = journalEntries.filter(a => new Date(a.created_at!) >= weekAgo);
    const weeklyMeditation = meditations.filter(a => new Date(a.created_at!) >= weekAgo);
    const weeklyWellness = wellnessActivities.filter(a => new Date(a.created_at!) >= weekAgo);

    // Calculate streak
    const streakDays = this.calculateStreak(activities);

    // Calculate total meditation minutes
    const meditationMinutes = meditations.reduce((total, activity) => {
      return total + (activity.duration_minutes || 0);
    }, 0);

    const weeklyMeditationMinutes = weeklyMeditation.reduce((total, activity) => {
      return total + (activity.duration_minutes || 0);
    }, 0);

    // Generate mood trend data
    const moodTrend = this.generateMoodTrend(activities);

    // Calculate achievements
    const achievements = {
      sevenDayStreak: streakDays >= 7,
      mindfulWriter: journalEntries.length >= 20,
      zenMaster: meditations.length >= 10,
      progressPioneer: activities.some(a => new Date(a.created_at!) <= monthAgo),
      wellnessWarrior: wellnessActivities.length >= 50
    };

    return {
      totalSessions: therapySessions.length,
      journalEntries: journalEntries.length,
      meditationMinutes,
      streakDays,
      weeklyGoals: {
        therapySessions: { current: weeklyTherapy.length, target: 5 },
        journalEntries: { current: weeklyJournal.length, target: 3 },
        meditationMinutes: { current: weeklyMeditationMinutes, target: 60 },
        dailyPractice: { current: this.calculateDailyPracticeStreak(activities), target: 7 }
      },
      moodTrend,
      achievements
    };
  }

  private calculateStreak(activities: UserActivity[]): number {
    if (activities.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.created_at!);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() === currentDate.getTime();
      });

      if (dayActivities.length > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  private calculateDailyPracticeStreak(activities: UserActivity[]): number {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.created_at!);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() === date.getTime();
      });
      
      if (dayActivities.length > 0) {
        last7Days.push(true);
      } else {
        last7Days.push(false);
      }
    }

    return last7Days.filter(Boolean).length;
  }

  private generateMoodTrend(activities: UserActivity[]): { date: string; mood: number; sessions: number }[] {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.created_at!);
        return activityDate.toDateString() === date.toDateString();
      });

      const moodRatings = dayActivities
        .filter(a => a.mood_rating !== undefined)
        .map(a => a.mood_rating!);
      
      const averageMood = moodRatings.length > 0 
        ? moodRatings.reduce((sum, mood) => sum + mood, 0) / moodRatings.length
        : 0;

      last7Days.push({
        date: date.toISOString(),
        mood: Math.round(averageMood * 10) / 10,
        sessions: dayActivities.filter(a => a.activity_type === 'therapy_session').length
      });
    }

    return last7Days;
  }

  private getEmptyStats(): ProgressStats {
    return {
      totalSessions: 0,
      journalEntries: 0,
      meditationMinutes: 0,
      streakDays: 0,
      weeklyGoals: {
        therapySessions: { current: 0, target: 5 },
        journalEntries: { current: 0, target: 3 },
        meditationMinutes: { current: 0, target: 60 },
        dailyPractice: { current: 0, target: 7 }
      },
      moodTrend: [],
      achievements: {
        sevenDayStreak: false,
        mindfulWriter: false,
        zenMaster: false,
        progressPioneer: false,
        wellnessWarrior: false
      }
    };
  }

  async trackLogin(userId: string): Promise<void> {
    await this.trackActivity({
      user_id: userId,
      activity_type: 'login'
    });
  }

  async trackTherapySession(userId: string, durationMinutes: number, moodRating?: number): Promise<void> {
    await this.trackActivity({
      user_id: userId,
      activity_type: 'therapy_session',
      duration_minutes: durationMinutes,
      mood_rating: moodRating
    });
  }

  async trackJournalEntry(userId: string, moodRating?: number, notes?: string): Promise<void> {
    await this.trackActivity({
      user_id: userId,
      activity_type: 'journal_entry',
      mood_rating: moodRating,
      notes: notes
    });
  }

  async trackMeditation(userId: string, durationMinutes: number): Promise<void> {
    await this.trackActivity({
      user_id: userId,
      activity_type: 'meditation',
      duration_minutes: durationMinutes
    });
  }

  async trackWellnessActivity(userId: string, activityType: string, durationMinutes?: number): Promise<void> {
    await this.trackActivity({
      user_id: userId,
      activity_type: 'wellness_activity',
      duration_minutes: durationMinutes,
      notes: activityType
    });
  }
}

export const progressTracker = new ProgressTracker();
