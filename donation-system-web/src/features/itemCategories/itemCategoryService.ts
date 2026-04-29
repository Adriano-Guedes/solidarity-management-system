import api from '../../services/api';
import type { ItemCategoryResponse, CreateItemCategoryRequest, UpdateItemCategoryRequest } from '../../types/itemCategory';

export async function getAllItemCategories(): Promise<ItemCategoryResponse[]> {
  const response = await api.get<ItemCategoryResponse[]>('/api/ItemCategories');
  return response.data;
}

export async function getItemCategoryById(id: string): Promise<ItemCategoryResponse> {
  const response = await api.get<ItemCategoryResponse>(`/api/ItemCategories/${id}`);
  return response.data;
}

export async function createItemCategory(data: CreateItemCategoryRequest): Promise<ItemCategoryResponse> {
  const response = await api.post<ItemCategoryResponse>('/api/ItemCategories', data);
  return response.data;
}

export async function updateItemCategory(id: string, data: UpdateItemCategoryRequest): Promise<ItemCategoryResponse> {
  const response = await api.put<ItemCategoryResponse>(`/api/ItemCategories/${id}`, data);
  return response.data;
}

export async function deleteItemCategory(id: string): Promise<ItemCategoryResponse> {
  const response = await api.delete<ItemCategoryResponse>(`/api/ItemCategories/${id}`);
  return response.data;
}
