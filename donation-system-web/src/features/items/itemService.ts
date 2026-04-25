import api from '../../services/api';
import type { ItemResponse, CreateItemRequest, UpdateItemRequest } from '../../types/item';

export async function getAllItems(): Promise<ItemResponse[]> {
  const response = await api.get<ItemResponse[]>('/api/Items');
  return response.data;
}

export async function getItemsByCategory(categoryId: string): Promise<ItemResponse[]> {
  const response = await api.get<ItemResponse[]>(`/api/Items/category/${categoryId}`);
  return response.data;
}

export async function getItemById(id: string): Promise<ItemResponse> {
  const response = await api.get<ItemResponse>(`/api/Items/${id}`);
  return response.data;
}

export async function createItem(data: CreateItemRequest): Promise<ItemResponse> {
  const response = await api.post<ItemResponse>('/api/Items', data);
  return response.data;
}

export async function updateItem(id: string, data: UpdateItemRequest): Promise<ItemResponse> {
  const response = await api.put<ItemResponse>(`/api/Items/${id}`, data);
  return response.data;
}

export async function deleteItem(id: string): Promise<void> {
  await api.delete(`/api/Items/${id}`);
}
