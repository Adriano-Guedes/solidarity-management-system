import api from '../../services/api';
import type {
  FamilyResponse,
  FamilyPriorityResponse,
  FamilyPriorityListItemResponse,
  CreateFamilyRequest,
  UpdateFamilyRequest
} from '../../types/family';
import type { DeliverySuggestionResponse } from '../../types/delivery';

export async function getAllFamilies(): Promise<FamilyResponse[]> {
  const response = await api.get<FamilyResponse[]>('/api/Families');
  return response.data;
}

export async function getFamilyById(id: string): Promise<FamilyResponse> {
  const response = await api.get<FamilyResponse>(`/api/Families/${id}`);
  return response.data;
}

export async function getFamilyPriority(id: string): Promise<FamilyPriorityResponse> {
  const response = await api.get<FamilyPriorityResponse>(`/api/Families/${id}/priority`);
  return response.data;
}

export async function getFamiliesPriorityRanking(): Promise<FamilyPriorityListItemResponse[]> {
  const response = await api.get<FamilyPriorityListItemResponse[]>('/api/Families/priority-ranking');
  return response.data;
}

export async function getFamilyDeliverySuggestion(id: string): Promise<DeliverySuggestionResponse> {
  const response = await api.get<DeliverySuggestionResponse>(`/api/Families/${id}/delivery-suggestion`);
  return response.data;
}

export async function createFamily(data: CreateFamilyRequest): Promise<FamilyResponse> {
  const response = await api.post<FamilyResponse>('/api/Families', data);
  return response.data;
}

export async function updateFamily(id: string, data: UpdateFamilyRequest): Promise<FamilyResponse> {
  const response = await api.put<FamilyResponse>(`/api/Families/${id}`, data);
  return response.data;
}

export async function deleteFamily(id: string): Promise<void> {
  await api.delete(`/api/Families/${id}`);
}
