export interface InventoryBatchResponse {
  id: string;
  itemId: string;
  expirationDate?: string;
  quantityAvailable: number;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateInventoryBatchRequest {
  itemId: string;
  expirationDate?: string;
  quantityAvailable: number;
}

export interface CreateInventoryBatchRequest {
  itemId: string;
  expirationDate?: string;
}
