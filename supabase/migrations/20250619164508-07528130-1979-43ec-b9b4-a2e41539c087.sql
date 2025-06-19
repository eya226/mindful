
-- Create user_activities table for tracking user engagement
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('therapy_session', 'journal_entry', 'meditation', 'wellness_activity', 'login')),
  duration_minutes INTEGER,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_activity_type ON public.user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON public.user_activities(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only see their own activities" ON public.user_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own activities" ON public.user_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own activities" ON public.user_activities
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own activities" ON public.user_activities
    FOR DELETE USING (auth.uid() = user_id);
