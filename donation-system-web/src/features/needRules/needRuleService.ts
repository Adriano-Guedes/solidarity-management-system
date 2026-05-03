import api from '../../services/api';
import type { NeedRuleResponse, CreateNeedRuleRequest, UpdateNeedRuleRequest } from '../../types/needRule';

export async function getAllNeedRules(): Promise<NeedRuleResponse[]> {
  const response = await api.get<NeedRuleResponse[]>('/api/NeedRules');
  return response.data;
}

export async function getActiveNeedRule(): Promise<NeedRuleResponse> {
  const response = await api.get<NeedRuleResponse>(`/api/NeedRules/Active`);
  return response.data;
}

export async function getNeedRuleById(id: string): Promise<NeedRuleResponse> {
  const response = await api.get<NeedRuleResponse>(`/api/NeedRules/${id}`);
  return response.data;
}

export async function createNeedRule(data: CreateNeedRuleRequest): Promise<NeedRuleResponse> {
  const response = await api.post<NeedRuleResponse>('/api/NeedRules', data);
  return response.data;
}

export async function updateNeedRule(id: string, data: UpdateNeedRuleRequest): Promise<NeedRuleResponse> {
  const response = await api.put<NeedRuleResponse>(`/api/NeedRules/${id}`, data);
  return response.data;
}

export async function deleteNeedRule(id: string): Promise<void> {
  await api.delete(`/api/NeedRules/${id}`);
}
