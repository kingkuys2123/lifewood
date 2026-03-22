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
