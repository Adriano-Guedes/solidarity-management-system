export interface DeliverySuggestionNeedGroupResponse {
  needGroup: string;
  requiredQuantity: number;
  suggestedQuantity: number;
  missingQuantity: number;
  fullyMet: boolean;
}

export interface DeliverySuggestionItemResponse {
  itemId: string;
  itemName: string;
  needGroup: string;
  packageQuantity: number;
  unitOfMeasure?: string;
  suggestedUnits: number;
  totalSuggestedQuantity: number;
  justification: string;
}

export interface DeliverySuggestionResponse {
  familyId: string;
  responsibleName: string;
  priorityScore: number;
  priorityLevel: string;
  requiresManualAnalysis: boolean;
  reasons: string[];
  suggestedItems: DeliverySuggestionItemResponse[];
  needGroupsSummary: DeliverySuggestionNeedGroupResponse[];
}

export interface DeliveryItemResponse {
  inventoryBatchId: string;
  itemId: string;
  itemName: string;
  itemCategoryId: string;
  itemCategoryName: string;
  quantity: number;
}

export interface DeliveryResponse {
  id: string;
  familyId: string;
  familyResponsibleName: string;
  deliveryDate: string;
  createdBy: string;
  createdByName: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  items: DeliveryItemResponse[];
}

export interface DeliveryItemRequest {
  itemId: string;
  quantity: number;
}

export interface CreateDeliveryRequest {
  familyId: string;
  deliveryDate: string;
  notes?: string;
  items: DeliveryItemRequest[];
}