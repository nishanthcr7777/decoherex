import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Key, Settings, Bell, Shield, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import Button from '../components/UI/Button';

const Profile = () => {
  const { user, updateApiKey, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [apiKey, setApiKey] = useState(user?.apiKey || '');
  const [newApiKey, setNewApiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState({
    jobComplete: true,
    jobFailed: true,
    queueUpdates: false,
    maintenanceAlerts: true,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleApiKeyUpdate = () => {
    if (newApiKey.trim()) {
      updateApiKey(newApiKey.trim());
      setApiKey(newApiKey.trim());
      setNewApiKey('');
    }
  };

  const copyApiKey = async () => {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-cyan-500/10 text-cyan-400 border-l-4 border-cyan-400'
                      : 'text-gray-300 hover:bg-slate-700/50 hover:text-cyan-400'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
                
                {/* User Avatar & Basic Info */}
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{user?.name}</h3>
                    <p className="text-gray-400">{user?.email}</p>
                    <div className="flex items-center mt-2">
                      <Shield className="w-4 h-4 text-cyan-400 mr-2" />
                      <span className="text-sm text-cyan-400 capitalize">{user?.role} Account</span>
                    </div>
                  </div>
                </div>

                {/* Profile Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Total Jobs</div>
                    <div className="text-2xl font-bold text-white">127</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Success Rate</div>
                    <div className="text-2xl font-bold text-green-400">94.2%</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Member Since</div>
                    <div className="text-2xl font-bold text-white">Jan 2024</div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button>Save Changes</Button>
                  <Button variant="secondary">Cancel</Button>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6">API Key Management</h2>

                {/* Current API Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Current IBM Quantum API Key
                  </label>
                  {apiKey ? (
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <code className="font-mono text-sm text-gray-300">
                          {apiKey.substring(0, 20)}...{apiKey.substring(apiKey.length - 10)}
                        </code>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={copyApiKey}
                            className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                          >
                            {copied ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-green-400 mt-2 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected and validated
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <div className="text-yellow-400 text-sm">
                        No API key configured. Add your IBM Quantum API key to submit jobs.
                      </div>
                    </div>
                  )}
                </div>

                {/* Add/Update API Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {apiKey ? 'Update' : 'Add'} IBM Quantum API Key
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="password"
                      value={newApiKey}
                      onChange={(e) => setNewApiKey(e.target.value)}
                      placeholder="Enter your IBM Quantum API key..."
                      className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <Button onClick={handleApiKeyUpdate}>
                      {apiKey ? 'Update' : 'Add'} Key
                    </Button>
                  </div>
                </div>

                {/* API Key Instructions */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-2">How to get your API key:</h4>
                  <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                    <li>Visit the IBM Quantum dashboard</li>
                    <li>Navigate to your account settings</li>
                    <li>Copy your API token</li>
                    <li>Paste it in the field above</li>
                  </ol>
                  <a
                    href="https://quantum-computing.ibm.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm mt-3 transition-colors duration-200"
                  >
                    Open IBM Quantum Dashboard
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-6">Settings & Preferences</h2>

                {/* Notifications */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notification Preferences
                  </h3>
                  <div className="space-y-4">
                    {Object.entries({
                      jobComplete: 'Job completion notifications',
                      jobFailed: 'Job failure alerts',
                      queueUpdates: 'Queue status updates',
                      maintenanceAlerts: 'Maintenance notifications',
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between py-2">
                        <span className="text-gray-300">{label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[key as keyof typeof notifications]}
                            onChange={(e) => handleNotificationChange(key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-6 border-t border-slate-700">
                  <h3 className="text-lg font-medium text-red-400 mb-4">Danger Zone</h3>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-red-400 font-medium">Sign Out</div>
                        <div className="text-sm text-gray-400">Sign out of your account</div>
                      </div>
                      <Button variant="danger" onClick={logout}>
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;