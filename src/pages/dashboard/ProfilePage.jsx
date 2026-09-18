import { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/common/InputField';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

export function ProfilePage() {
  const { user, setUser } = useAuth();
  const { pushToast } = useNotifications();

  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
    department: user.department,
    designation: user.designation,
    office: 'Room C-214',
    officeHours: 'Tue/Thu 2:00 PM - 4:00 PM',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    assignmentAlerts: true,
    attendanceReminders: true,
    weeklyDigest: true,
    desktopNotifications: false,
    profileVisibility: 'Department',
    messageReadReceipts: true,
  });

  const saveProfile = (event) => {
    event.preventDefault();
    setUser((current) => ({
      ...current,
      name: profileForm.name,
      email: profileForm.email,
      department: profileForm.department,
      designation: profileForm.designation,
    }));

    pushToast({ type: 'success', title: 'Profile updated', message: 'Faculty profile changes have been saved.' });
  };

  const changePassword = (event) => {
    event.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      pushToast({ type: 'warning', title: 'Change password', message: 'Please complete all password fields.' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      pushToast({ type: 'warning', title: 'Mismatch', message: 'New password and confirmation must match.' });
      return;
    }

    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    pushToast({ type: 'success', title: 'Password changed', message: 'Your account password has been updated securely.' });
  };

  const savePreferences = (event) => {
    event.preventDefault();
    pushToast({
      type: 'success',
      title: 'Preferences updated',
      message: 'Notification and privacy preferences have been saved.',
    });
  };

  return (
    <section className="page-grid">
      <PageHeader
        title="Profile & Settings"
        description="Manage profile details, security settings, and communication preferences."
      />

      <Card title="Faculty Profile" subtitle="Update institutional details visible to students and colleagues.">
        <form className="form-grid" onSubmit={saveProfile}>
          <InputField
            id="profile-name"
            label="Full Name"
            value={profileForm.name}
            onChange={(value) => setProfileForm((current) => ({ ...current, name: value }))}
          />
          <InputField
            id="profile-email"
            label="Institutional Email"
            type="email"
            value={profileForm.email}
            onChange={(value) => setProfileForm((current) => ({ ...current, email: value }))}
          />
          <InputField
            id="profile-department"
            label="Department"
            value={profileForm.department}
            onChange={(value) => setProfileForm((current) => ({ ...current, department: value }))}
          />
          <InputField
            id="profile-designation"
            label="Designation"
            value={profileForm.designation}
            onChange={(value) => setProfileForm((current) => ({ ...current, designation: value }))}
          />
          <InputField
            id="profile-office"
            label="Office Location"
            value={profileForm.office}
            onChange={(value) => setProfileForm((current) => ({ ...current, office: value }))}
          />
          <InputField
            id="profile-hours"
            label="Office Hours"
            value={profileForm.officeHours}
            onChange={(value) => setProfileForm((current) => ({ ...current, officeHours: value }))}
          />

          <div className="full-width">
            <Button type="submit">Save Profile</Button>
          </div>
        </form>
      </Card>

      <div className="dashboard-columns">
        <Card title="Account Security" subtitle="Change password and monitor identity protections.">
          <form className="form-grid" onSubmit={changePassword}>
            <InputField
              id="current-password"
              type="password"
              label="Current Password"
              value={passwordForm.currentPassword}
              onChange={(value) => setPasswordForm((current) => ({ ...current, currentPassword: value }))}
            />
            <InputField
              id="new-password"
              type="password"
              label="New Password"
              value={passwordForm.newPassword}
              onChange={(value) => setPasswordForm((current) => ({ ...current, newPassword: value }))}
            />
            <InputField
              id="confirm-password"
              type="password"
              label="Confirm Password"
              value={passwordForm.confirmPassword}
              onChange={(value) => setPasswordForm((current) => ({ ...current, confirmPassword: value }))}
            />
            <div className="full-width">
              <Button type="submit">Update Password</Button>
            </div>
          </form>

          <div className="security-info">
            <h4>Security Status</h4>
            <ul>
              <li>✅ Two-factor authentication enabled</li>
              <li>✅ Institutional email verified</li>
              <li>🔐 Last password update: 25 days ago</li>
              <li>📱 Trusted devices: 2 active sessions</li>
            </ul>
          </div>
        </Card>

        <Card title="Notifications & Privacy" subtitle="Control alerts and profile visibility.">
          <form className="form-grid" onSubmit={savePreferences}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.assignmentAlerts}
                onChange={(event) =>
                  setPreferences((current) => ({ ...current, assignmentAlerts: event.target.checked }))
                }
              />
              Assignment due and grading reminders
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.attendanceReminders}
                onChange={(event) =>
                  setPreferences((current) => ({ ...current, attendanceReminders: event.target.checked }))
                }
              />
              Attendance tracking reminders
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.weeklyDigest}
                onChange={(event) =>
                  setPreferences((current) => ({ ...current, weeklyDigest: event.target.checked }))
                }
              />
              Weekly performance digest summary
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.desktopNotifications}
                onChange={(event) =>
                  setPreferences((current) => ({ ...current, desktopNotifications: event.target.checked }))
                }
              />
              Browser desktop notifications
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.messageReadReceipts}
                onChange={(event) =>
                  setPreferences((current) => ({ ...current, messageReadReceipts: event.target.checked }))
                }
              />
              Message read receipts
            </label>

            <div className="form-control full-width">
              <label htmlFor="profile-visibility">Profile Visibility</label>
              <select
                id="profile-visibility"
                value={preferences.profileVisibility}
                onChange={(event) =>
                  setPreferences((current) => ({ ...current, profileVisibility: event.target.value }))
                }
              >
                <option value="Public">Public within institution</option>
                <option value="Department">Department-only visibility</option>
                <option value="Private">Private profile</option>
              </select>
            </div>

            <div className="full-width">
              <Button type="submit">Save Preferences</Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}
