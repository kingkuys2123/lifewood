import { useCallback, useEffect, useState } from 'react';
import { getDashboardData } from '../services/dashboardService';

const EMPTY = {
  metrics: [],
  applicantTrends: [],
  notifications: [],
  reports: [],
  settings: [],
};

export function useDashboardMetrics() {
  const [state, setState] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await getDashboardData();
      setState(payload);
    } catch (err) {
      setError(err?.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    ...state,
    loading,
    error,
    reload,
  };
}
