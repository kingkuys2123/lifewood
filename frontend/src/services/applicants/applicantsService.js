import httpClient from '../api/httpClient';
import { unwrapApiResponse } from '../api/apiResponse';

export async function fetchApplicants({ keyword = '', approved, reviewed, pageIndex = 0, pageSize = 10 } = {}) {
  const response = await httpClient.get('/applicant/get/all', {
    params: {
      keyword: keyword || undefined,
      approved,
      reviewed,
      page: pageIndex,
      size: pageSize,
    },
  });

  return unwrapApiResponse(response);
}

export async function createApplicant(formData) {
  const response = await httpClient.post('/applicant/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return unwrapApiResponse(response);
}

export async function fetchApplicantById(id) {
  const response = await httpClient.get('/applicant/get', { params: { id } });
  return unwrapApiResponse(response);
}

export async function checkApplicantEmailAvailability(email, excludeId) {
  const response = await httpClient.get('/applicant/check-email', {
    params: {
      email,
      excludeId,
    },
    suppressGlobalErrorToast: true,
  });
  return Boolean(unwrapApiResponse(response)?.available);
}

export function getApplicantResumeUrl(id, { download = false } = {}) {
  const query = new URLSearchParams({ id: String(id), download: String(download) });
  return `${httpClient.defaults.baseURL}/applicant/resume?${query.toString()}`;
}

export async function approveApplicant(payload) {
  const response = await httpClient.post('/applicant/approve', payload);
  return unwrapApiResponse(response);
}

export async function denyApplicant(payload) {
  const response = await httpClient.post('/applicant/deny', payload);
  return unwrapApiResponse(response);
}

export async function deleteApplicant(id) {
  const response = await httpClient.delete('/applicant/delete', { params: { id } });
  return unwrapApiResponse(response);
}
