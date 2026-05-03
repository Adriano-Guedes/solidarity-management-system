import api from '../../services/api';
import type { ItemTemplateResponse, CreateItemTemplateRequest, UpdateItemTemplateRequest } from '../../types/itemTemplate';

export async function getAllItemTemplates(): Promise<ItemTemplateResponse[]> {
  const response = await api.get<ItemTemplateResponse[]>('/api/ItemTemplates');
  return response.data;
}

export async function getActiveItemTemplates(): Promise<ItemTemplateResponse[]> {
  const response = await api.get<ItemTemplateResponse[]>('/api/ItemTemplates/active');
  return response.data;
}

export async function getItemTemplateById(id: string): Promise<ItemTemplateResponse> {
  const response = await api.get<ItemTemplateResponse>(`/api/ItemTemplates/${id}`);
  return response.data;
}

export async function createItemTemplate(data: CreateItemTemplateRequest): Promise<ItemTemplateResponse> {
  const response = await api.post<ItemTemplateResponse>('/api/ItemTemplates', data);
  return response.data;
}

export async function updateItemTemplate(id: string, data: UpdateItemTemplateRequest): Promise<ItemTemplateResponse> {
  const response = await api.put<ItemTemplateResponse>(`/api/ItemTemplates/${id}`, data);
  return response.data;
}

export async function deleteItemTemplate(id: string): Promise<ItemTemplateResponse> {
  const response = await api.delete<ItemTemplateResponse>(`/api/ItemTemplates/${id}`);
  return response.data;
}
