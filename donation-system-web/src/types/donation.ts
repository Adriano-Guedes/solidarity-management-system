export interface DonationItemResponse {
  inventoryBatchId: string;
  itemId: string;
  expirationDate?: string;
  quantity: number;
}

export interface DonationResponse {
  id: string;
  receivedDate: string;
  createdBy: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  items: DonationItemResponse[];
}

export interface DonationItemRequest {
  itemId: string;
  expirationDate?: string;
  quantity: number;
}

export interface CreateDonationRequest {
  receivedDate: string;
  notes?: string;
  items: DonationItemRequest[];
}
