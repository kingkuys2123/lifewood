import { useCallback, useEffect, useState } from 'react';
import { getDashboardData } from '../services/dashboardService';

function defaultFilters() {
  const today = new Date();
  const to = today.toISOString().slice(0, 10);
  const fromDate = new Date(today);
  fromDate.setDate(fromDate.getDate() - 29);
  const from = fromDate.toISOString().slice(0, 10);

  return {
    from,
    to,
    month: '',
    granularity: 'day',
  };
}

const EMPTY = {
  metrics: [],
  submissionRateSeries: [],
  monthlySubmissionsSeries: [],
  monthlySubmissionsMeta: {
    from: '',
    to: '',
    totalSubmissions: 0,
  },
  adminPerformance: {
    adminUsername: '',
    approvedCount: 0,
    deniedCount: 0,
    totalReviewed: 0,
  },
};

export function useDashboardMetrics() {
  const [state, setState] = useState(EMPTY);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await getDashboardData(filters);
      setState(payload);
    } catch (err) {
      setError(err?.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback((partial) => {
    setFilters((current) => ({ ...current, ...partial }));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    ...state,
    filters,
    loading,
    error,
    reload,
    updateFilters,
  };
}
