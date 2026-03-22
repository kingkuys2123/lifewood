import httpClient from '../api/httpClient';
import { unwrapApiResponse } from '../api/apiResponse';

export async function sendContactMessage(payload) {
  const response = await httpClient.post('/contact/send', payload);
  return unwrapApiResponse(response);
}
