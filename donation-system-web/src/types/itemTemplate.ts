export interface ItemTemplateResponse {
  id: string;
  categoryId: string;
  categoryName: string;
  needGroupId: string;
  needGroupName: string;
  name: string;
  isPerishable: boolean;
  requiresRefrigeration: boolean;
  suitableForAutoSuggestion: boolean;
  requiresManualAnalysis: boolean;
  defaultUnitOfMeasure?: string;
  referenceQuantity?: number;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateItemTemplateRequest {
  categoryId: string;
  needGroupId: string;
  name: string;
  isPerishable: boolean;
  requiresRefrigeration: boolean;
  suitableForAutoSuggestion: boolean;
  requiresManualAnalysis: boolean;
  defaultUnitOfMeasure?: string;
  notes?: string;
  active: boolean;
}

export interface UpdateItemTemplateRequest {
  categoryId: string;
  needGroupId: string;
  name: string;
  isPerishable: boolean;
  requiresRefrigeration: boolean;
  suitableForAutoSuggestion: boolean;
  requiresManualAnalysis: boolean;
  defaultUnitOfMeasure?: string;
  notes?: string;
  active: boolean;
}
