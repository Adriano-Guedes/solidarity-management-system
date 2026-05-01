import api from '../../services/api';
import type { FamilyMemberResponse, CreateFamilyMemberRequest, UpdateFamilyMemberRequest } from '../../types/familyMember';

export async function getFamilyMembers(familyId: string): Promise<FamilyMemberResponse[]> {
  const response = await api.get<FamilyMemberResponse[]>(`/api/families/${familyId}/members`);
  return response.data;
}

export async function getFamilyMemberById(familyId: string, memberId: string): Promise<FamilyMemberResponse> {
  const response = await api.get<FamilyMemberResponse>(`/api/families/${familyId}/members/${memberId}`);
  return response.data;
}

export async function createFamilyMember(familyId: string, data: CreateFamilyMemberRequest): Promise<FamilyMemberResponse> {
  const response = await api.post<FamilyMemberResponse>(`/api/families/${familyId}/members`, data);
  return response.data;
}

export async function updateFamilyMember(familyId: string, memberId: string, data: UpdateFamilyMemberRequest): Promise<FamilyMemberResponse> {
  const response = await api.put<FamilyMemberResponse>(`/api/families/${familyId}/members/${memberId}`, data);
  return response.data;
}

export async function updateFamilyMemberStatus(familyId: string, memberId: string): Promise<FamilyMemberResponse> {
  const response = await api.put<FamilyMemberResponse>(`/api/families/${familyId}/members/${memberId}/status`);
  return response.data;
}

export async function deleteFamilyMember(familyId: string, memberId: string): Promise<void> {
  await api.delete(`/api/families/${familyId}/members/${memberId}`);
}
