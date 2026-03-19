export function getSettingsData() {
  return {
    controls: [
      { id: 'email-digest', label: 'Weekly digest email', enabled: true },
      { id: 'two-factor', label: 'Require two-factor authentication', enabled: true },
      { id: 'auto-assign', label: 'Auto-assign applicants to reviewers', enabled: false },
    ],
    notifications: [
      'System update window is scheduled for Saturday 11:30 PM.',
      'Audit reminder: review role permissions before month-end.',
    ],
  };
}
