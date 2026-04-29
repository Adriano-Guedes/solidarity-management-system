import api from '../../services/api';
import type { ItemTemplateResponse } from '../../types/itemTemplate';

export async function getAllItemTemplates(): Promise<ItemTemplateResponse[]> {
  const response = await api.get<ItemTemplateResponse[]>('/api/ItemTemplates');
  return response.data;
}

export async function getItemTemplateById(id: string): Promise<ItemTemplateResponse> {
  const response = await api.get<ItemTemplateResponse>(`/api/ItemTemplates/${id}`);
  return response.data;
}