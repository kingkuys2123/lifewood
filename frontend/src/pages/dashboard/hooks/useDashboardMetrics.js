import { useMemo } from 'react';
import { getDashboardData } from '../services/dashboardService';

export function useDashboardMetrics() {
  return useMemo(() => getDashboardData(), []);
}

