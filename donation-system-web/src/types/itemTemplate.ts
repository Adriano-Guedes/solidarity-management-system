export interface ItemTemplateResponse {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  needGroup: string;
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
