import api from '../../services/api';
import type { AgeRangeResponse, CreateAgeRangeRequest, UpdateAgeRangeRequest } from '../../types/ageRange';

export async function getAllAgeRanges(): Promise<AgeRangeResponse[]> {
  const response = await api.get<AgeRangeResponse[]>('/api/AgeRanges');
  return response.data;
}

export async function getActiveAgeRanges(): Promise<AgeRangeResponse[]> {
  const response = await api.get<AgeRangeResponse[]>('/api/AgeRanges/active');
  return response.data;
}

export async function getAgeRangeById(id: string): Promise<AgeRangeResponse> {
  const response = await api.get<AgeRangeResponse>(`/api/AgeRanges/${id}`);
  return response.data;
}

export async function createAgeRange(data: CreateAgeRangeRequest): Promise<AgeRangeResponse> {
  const response = await api.post<AgeRangeResponse>('/api/AgeRanges', data);
  return response.data;
}

export async function updateAgeRange(id: string, data: UpdateAgeRangeRequest): Promise<AgeRangeResponse> {
  const response = await api.put<AgeRangeResponse>(`/api/AgeRanges/${id}`, data);
  return response.data;
}

export async function deleteAgeRange(id: string): Promise<void> {
  await api.delete(`/api/AgeRanges/${id}`);
}
