import api from '../../services/api';
import type { InventoryBatchResponse, UpdateInventoryBatchRequest } from '../../types/inventoryBatch';

export async function getAllInventoryBatches(): Promise<InventoryBatchResponse[]> {
  const response = await api.get<InventoryBatchResponse[]>('/api/InventoryBatches');
  return response.data;
}

export async function getInventoryBatchById(id: string): Promise<InventoryBatchResponse> {
  const response = await api.get<InventoryBatchResponse>(`/api/InventoryBatches/${id}`);
  return response.data;
}

export async function getInventoryBatchesByItem(itemId: string): Promise<InventoryBatchResponse[]> {
  const response = await api.get<InventoryBatchResponse[]>(`/api/InventoryBatches/item/${itemId}`);
  return response.data;
}

export async function updateInventoryBatch(id: string, data: UpdateInventoryBatchRequest): Promise<InventoryBatchResponse> {
  const response = await api.put<InventoryBatchResponse>(`/api/InventoryBatches/${id}`, data);
  return response.data;
}
