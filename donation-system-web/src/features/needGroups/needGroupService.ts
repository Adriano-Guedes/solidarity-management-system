import api from '../../services/api';
import type { NeedGroupResponse, CreateNeedGroupRequest, UpdateNeedGroupRequest } from '../../types/needGroup';

export async function getAllNeedGroups(): Promise<NeedGroupResponse[]> {
  const response = await api.get<NeedGroupResponse[]>('/api/NeedGroups');
  return response.data;
}

export async function getActiveNeedGroups(): Promise<NeedGroupResponse[]> {
  const response = await api.get<NeedGroupResponse[]>('/api/NeedGroups/active');
  return response.data;
}

export async function getNeedGroupById(id: string): Promise<NeedGroupResponse> {
  const response = await api.get<NeedGroupResponse>(`/api/NeedGroups/${id}`);
  return response.data;
}

export async function createNeedGroup(data: CreateNeedGroupRequest): Promise<NeedGroupResponse> {
  const response = await api.post<NeedGroupResponse>('/api/NeedGroups', data);
  return response.data;
}

export async function updateNeedGroup(id: string, data: UpdateNeedGroupRequest): Promise<NeedGroupResponse> {
  const response = await api.put<NeedGroupResponse>(`/api/NeedGroups/${id}`, data);
  return response.data;
}

export async function deleteNeedGroup(id: string): Promise<void> {
  await api.delete(`/api/NeedGroups/${id}`);
}
