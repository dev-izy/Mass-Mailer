import { useState } from 'react';
import { Card } from '../../components/ui/Card'; // Named import
import { Button } from '../../components/ui/Button'; // Named import
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { User, Bell, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    company: '',
    timezone: 'America/New_York',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    campaignUpdates: true,
    weeklyReports: false,
    marketingEmails: true,
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings</p>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Your full name" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
            <Input label="Email" type="email" placeholder="your@email.com" value={profile.email} disabled />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Company" placeholder="Your company name" value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} />
            <Input label="Timezone" placeholder="America/New_York" value={profile.timezone} onChange={(e) => setProfile({ ...profile, timezone: e.target.value })} />
          </div>
          <Button icon={<Save className="w-4 h-4" />} loading={saving} onClick={handleSaveProfile}>Save Changes</Button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-700">Email Alerts</p>
              <p className="text-xs text-gray-400">Receive email notifications for important events</p>
            </div>
            <input type="checkbox" checked={notifications.emailAlerts} onChange={() => setNotifications({ ...notifications, emailAlerts: !notifications.emailAlerts })} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-700">Campaign Updates</p>
              <p className="text-xs text-gray-400">Get notified when campaigns are sent or completed</p>
            </div>
            <input type="checkbox" checked={notifications.campaignUpdates} onChange={() => setNotifications({ ...notifications, campaignUpdates: !notifications.campaignUpdates })} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-700">Weekly Reports</p>
              <p className="text-xs text-gray-400">Receive weekly performance reports</p>
            </div>
            <input type="checkbox" checked={notifications.weeklyReports} onChange={() => setNotifications({ ...notifications, weeklyReports: !notifications.weeklyReports })} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-700">Marketing Emails</p>
              <p className="text-xs text-gray-400">Receive tips, updates, and promotional content</p>
            </div>
            <input type="checkbox" checked={notifications.marketingEmails} onChange={() => setNotifications({ ...notifications, marketingEmails: !notifications.marketingEmails })} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
          </label>
        </div>
      </Card>

      <Card className="border-red-200">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-red-700">Delete Account</p>
              <p className="text-xs text-red-500">Permanently delete your account and all data</p>
            </div>
            <Button variant="danger" size="sm">Delete Account</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}