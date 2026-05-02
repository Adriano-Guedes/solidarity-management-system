export interface ItemResponse {
  id: string;
  categoryId: string;
  categoryName: string;
  itemTemplateId: string;
  itemTemplateName: string;
  name: string;
  brand?: string;
  packageQuantity: number;
  templateWeight: number;
  unitOfMeasure?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ActiveItemResponse {
  id: string;
  name: string;
  brand?: string;
  packageQuantity: number;
  templateWeight: number;
  unitOfMeasure?: string;
  categoryId: string;
  categoryName: string;
  itemTemplateId: string;
  itemTemplateName: string;
  needGroup: string;
  referenceQuantity: number;
  totalQuantity: number;
}

export interface UpdateItemRequest {
  categoryId: string;
  itemTemplateId: string;
  name: string;
  brand?: string;
  packageQuantity: number;
  templateWeight: number;
  unitOfMeasure?: string;
  notes?: string;
  active: boolean;
}

export interface CreateItemRequest {
  categoryId: string;
  itemTemplateId: string;
  name: string;
  brand?: string;
  packageQuantity: number;
  templateWeight: number;
  unitOfMeasure?: string;
  notes?: string;
  active: boolean;
}
