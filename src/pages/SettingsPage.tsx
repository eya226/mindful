
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Bell, Lock, User, Moon, Globe, Shield, Mail, Download, Trash2, Key } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { UserProfile } from "@/components/UserProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserSettings {
  notifications: boolean;
  darkMode: boolean;
  emailUpdates: boolean;
  dataSharing: boolean;
  twoFactor: boolean;
}

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    notifications: true,
    darkMode: false,
    emailUpdates: true,
    dataSharing: false,
    twoFactor: false,
  });
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // Load user settings on component mount
  useEffect(() => {
    if (user) {
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        return;
      }

      // Load settings from user metadata or use defaults
      const userMetadata = user?.user_metadata || {};
      setSettings({
        notifications: userMetadata.notifications ?? true,
        darkMode: userMetadata.darkMode ?? false,
        emailUpdates: userMetadata.emailUpdates ?? true,
        dataSharing: userMetadata.dataSharing ?? false,
        twoFactor: userMetadata.twoFactor ?? false,
      });
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const updateSetting = async (key: keyof UserSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    try {
      // Update user metadata with new settings
      const { error } = await supabase.auth.updateUser({
        data: { ...user?.user_metadata, [key]: value }
      });

      if (error) {
        throw error;
      }

      toast.success(`${key} updated successfully!`);
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
      toast.error(`Failed to update ${key}`);
      // Revert the setting if update failed
      setSettings(settings);
    }
  };

  const handleSaveAllSettings = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { ...user?.user_metadata, ...settings }
      });

      if (error) {
        throw error;
      }

      toast.success("All settings saved successfully!");
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      toast.success("Password updated successfully!");
      setNewPassword('');
      setShowPasswordChange(false);
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      // Fetch user's data from various tables
      const [profileData, journalData, chatData, activityData] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user?.id),
        supabase.from('journal_entries').select('*').eq('user_id', user?.id),
        supabase.from('chat_sessions').select('*').eq('user_id', user?.id),
        supabase.from('user_activities').select('*').eq('user_id', user?.id)
      ]);

      const exportData = {
        profile: profileData.data,
        journal_entries: journalData.data,
        chat_sessions: chatData.data,
        user_activities: activityData.data,
        exported_at: new Date().toISOString()
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user_data_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully!");
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error("Failed to export data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Delete user data from all tables
      await Promise.all([
        supabase.from('journal_entries').delete().eq('user_id', user?.id),
        supabase.from('chat_sessions').delete().eq('user_id', user?.id),
        supabase.from('chat_messages').delete().eq('user_id', user?.id),
        supabase.from('user_activities').delete().eq('user_id', user?.id),
        supabase.from('profiles').delete().eq('id', user?.id)
      ]);

      // Sign out the user
      await signOut();
      
      toast.success("Account deleted successfully");
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error("Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar isLoggedIn={!!user} setIsLoggedIn={() => {}} />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account preferences and privacy settings</p>
          </div>

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <CardTitle>Profile Settings</CardTitle>
                </div>
                <CardDescription>
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserProfile />
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-green-600" />
                  <CardTitle>Notifications</CardTitle>
                </div>
                <CardDescription>
                  Control how you receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive notifications about your therapy sessions and reminders
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => updateSetting('notifications', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-updates">Email Updates</Label>
                    <p className="text-sm text-gray-500">
                      Get weekly progress reports and wellness tips via email
                    </p>
                  </div>
                  <Switch
                    id="email-updates"
                    checked={settings.emailUpdates}
                    onCheckedChange={(checked) => updateSetting('emailUpdates', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  <CardTitle>Privacy & Security</CardTitle>
                </div>
                <CardDescription>
                  Manage your privacy settings and account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {settings.twoFactor && <Badge variant="secondary">Enabled</Badge>}
                    <Switch
                      id="two-factor"
                      checked={settings.twoFactor}
                      onCheckedChange={(checked) => updateSetting('twoFactor', checked)}
                    />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-sharing">Data Sharing</Label>
                    <p className="text-sm text-gray-500">
                      Allow anonymous data sharing for research purposes
                    </p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={settings.dataSharing}
                    onCheckedChange={(checked) => updateSetting('dataSharing', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Moon className="h-5 w-5 text-purple-600" />
                  <CardTitle>Appearance</CardTitle>
                </div>
                <CardDescription>
                  Customize how the app looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-gray-500">
                      Switch to a darker theme for better viewing in low light
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => updateSetting('darkMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-orange-600" />
                  <CardTitle>Account Actions</CardTitle>
                </div>
                <CardDescription>
                  Manage your account settings and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => setShowPasswordChange(true)}
                  >
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={handleExportData}
                    disabled={loading}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
                
                {showPasswordChange && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handlePasswordChange}
                        disabled={loading || !newPassword}
                        size="sm"
                      >
                        Update Password
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowPasswordChange(false);
                          setNewPassword('');
                        }}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                <Separator />
                <div className="pt-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full md:w-auto">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove all your data from our servers including journal entries,
                          chat sessions, and activity records.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <p className="text-sm text-gray-500 mt-2">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Save Settings */}
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveAllSettings} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save All Settings"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
