import { useAuth } from '@/hooks/useAuth';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Mail, User, Calendar } from 'lucide-react';

export default function ProfileView() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-secondary-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gradient-default text-white rounded-lg p-8 mb-8">
            <div className="flex items-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold">
                  {user.name} {user.surname}
                </h1>
                <p className="text-white/80 mt-1">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Account Information</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center">
                  <User className="text-secondary-500 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-secondary-600">Full Name</p>
                    <p className="font-semibold">
                      {user.name} {user.surname}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="text-secondary-500 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-secondary-600">Email Address</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-secondary-500 mr-3" size={20} />
                  <div>
                    <p className="text-sm text-secondary-600">Member Since</p>
                    <p className="font-semibold">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Account Settings</h2>
              </CardHeader>
              <CardBody>
                <p className="text-secondary-600 mb-4">
                  Manage your account settings and preferences.
                </p>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition">
                    Edit Profile
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition">
                    Change Password
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition">
                    Privacy Settings
                  </button>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Activity Section */}
          <Card className="mt-6">
            <CardHeader>
              <h2 className="text-xl font-bold">Recent Activity</h2>
            </CardHeader>
            <CardBody>
              <div className="text-center py-8 text-secondary-600">
                <p>No recent activity to display</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}