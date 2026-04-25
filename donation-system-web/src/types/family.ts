export interface FamilyResponse {
  id: string;
  responsibleName: string;
  responsibleDocument?: string;
  phoneNumber?: string;
  address?: string;
  monthlyIncome?: number;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface FamilyPriorityResponse {
  familyId: string;
  priorityScore: number;
  priorityLevel: string;
  requiresManualAnalysis: boolean;
  reasons: string[];
}

export interface FamilyPriorityListItemResponse {
  familyId: string;
  responsibleName: string;
  priorityScore: number;
  priorityLevel: string;
  requiresManualAnalysis: boolean;
  reasons: string[];
  lastDeliveryDate?: string;
}

export interface UpdateFamilyRequest {
  responsibleName: string;
  responsibleDocument?: string;
  phoneNumber?: string;
  address?: string;
  monthlyIncome?: number;
  notes?: string;
  active: boolean;
}

export interface CreateFamilyRequest {
  responsibleName: string;
  responsibleDocument?: string;
  phoneNumber?: string;
  address?: string;
  monthlyIncome?: number;
  notes?: string;
}
