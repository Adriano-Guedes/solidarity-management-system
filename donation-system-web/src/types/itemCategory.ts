export interface ItemCategoryResponse {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateItemCategoryRequest {
  name: string;
  description?: string;
  active: boolean;
}

export interface CreateItemCategoryRequest {
  name: string;
  description?: string;
}
