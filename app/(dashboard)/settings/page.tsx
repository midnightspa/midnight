import React from 'react';

export default function SettingsPage() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>
      
      <div className="space-y-6">
        {/* Profile Section */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Settings</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Profile settings will be implemented in the next phase</p>
          </div>
        </section>

        {/* Notifications Section */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Notification settings will be implemented in the next phase</p>
          </div>
        </section>

        {/* Business Hours Section */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Hours</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Business hours settings will be implemented in the next phase</p>
          </div>
        </section>
      </div>
    </div>
  );
} 