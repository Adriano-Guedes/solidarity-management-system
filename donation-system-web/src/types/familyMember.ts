export interface FamilyMemberResponse {
  id: string;
  familyId: string;
  name: string;
  documentNumber?: string;
  birthDate?: string;
  gender?: string;
  relationship?: string;
  hasDisability: boolean;
  hasChronicDisease: boolean;
  isResponsible: boolean;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateFamilyMemberRequest {
  familyId: string;
  name: string;
  documentNumber?: string;
  birthDate?: string;
  gender?: string;
  relationship?: string;
  hasDisability: boolean;
  hasChronicDisease: boolean;
  isResponsible: boolean;
  active: boolean;
}

export interface CreateFamilyMemberRequest {
  familyId: string;
  name: string;
  documentNumber?: string;
  birthDate?: string;
  gender?: string;
  relationship?: string;
  hasDisability?: boolean;
  hasChronicDisease?: boolean;
  isResponsible?: boolean;
}
