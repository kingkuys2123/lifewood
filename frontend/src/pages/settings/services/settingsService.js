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
    groups: [
      {
        id: 'security',
        title: 'Security',
        description: 'Protect admin access with stronger verification and session controls.',
      },
      {
        id: 'automation',
        title: 'Workflow automation',
        description: 'Configure assignment and notification behavior across applicant pipelines.',
      },
    ],
  };
}
