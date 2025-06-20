
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const UserProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error('Full name is required');
      return;
    }

    setLoading(true);
    try {
      // Update user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (authError) {
        throw authError;
      }

      // Update or insert profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          email: user?.email,
          full_name: fullName,
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        throw profileError;
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFullName(user?.user_metadata?.full_name || '');
    setEmail(user?.email || '');
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">
              {user.user_metadata?.full_name || 'Welcome!'}
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="pl-10 bg-gray-50"
              />
            </div>
            <p className="text-xs text-gray-500">
              Email cannot be changed from this interface
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!isEditing}
                className={`pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                placeholder="Enter your full name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="joinDate">Member Since</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="joinDate"
                value={new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                disabled
                className="pl-10 bg-gray-50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="userId"
                value={user.id.substring(0, 8) + '...'}
                disabled
                className="pl-10 bg-gray-50"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={loading || !fullName.trim()}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
