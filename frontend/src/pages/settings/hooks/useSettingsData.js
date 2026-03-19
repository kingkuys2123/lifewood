import { useMemo } from 'react';
import { getSettingsData } from '../services/settingsService';

export function useSettingsData() {
  return useMemo(() => getSettingsData(), []);
}
