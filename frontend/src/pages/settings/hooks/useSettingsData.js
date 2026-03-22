import { useMemo, useState } from 'react';
import { getSettingsData } from '../services/settingsService';

export function useSettingsData() {
  const seed = useMemo(() => getSettingsData(), []);
  const [controls, setControls] = useState(seed.controls);

  const toggleControl = (id) => {
    setControls((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  };

  return {
    controls,
    notifications: seed.notifications,
    groups: seed.groups,
    toggleControl,
  };
}
