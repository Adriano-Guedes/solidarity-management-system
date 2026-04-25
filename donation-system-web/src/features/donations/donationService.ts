import api from '../../services/api';
import type { DonationResponse, CreateDonationRequest } from '../../types/donation';

export async function getAllDonations(): Promise<DonationResponse[]> {
  const response = await api.get<DonationResponse[]>('/api/Donations');
  return response.data;
}

export async function getDonationById(id: string): Promise<DonationResponse> {
  const response = await api.get<DonationResponse>(`/api/Donations/${id}`);
  return response.data;
}

export async function createDonation(data: CreateDonationRequest): Promise<DonationResponse> {
  const response = await api.post<DonationResponse>('/api/Donations', data);
  return response.data;
}
