import api from '../../services/api';
import type { DeliveryResponse, CreateDeliveryRequest } from '../../types/delivery';

export async function getAllDeliveries(): Promise<DeliveryResponse[]> {
  const response = await api.get<DeliveryResponse[]>('/api/Deliveries');
  return response.data;
}

export async function getAllDeliveriesByFamilyId(familyId: string): Promise<DeliveryResponse[]> {
  const response = await api.get<DeliveryResponse[]>(`/api/Deliveries/family/${familyId}`);
  return response.data;
}

export async function getDeliveryById(id: string): Promise<DeliveryResponse> {
  const response = await api.get<DeliveryResponse>(`/api/Deliveries/${id}`);
  return response.data;
}

export async function createDelivery(data: CreateDeliveryRequest): Promise<DeliveryResponse> {
  const response = await api.post<DeliveryResponse>('/api/Deliveries', data);
  return response.data;
}
