import api from "../../services/api";
import type { 
  DashboardSummaryResponse, 
  DashboardEvolutionResponse, 
  DashboardCategoryDistributionResponse, 
  DashboardFamilyWaitListResponse, 
  DashboardExpiringBatchResponse 
} from '../../types/dashboard';

export const dashboardService = {
    getSummary: async (): Promise<DashboardSummaryResponse> => {
        const response = await api.get<DashboardSummaryResponse>("/api/Dashboard/summary");
        return response.data;
    },

    getEvolution: async (): Promise<DashboardEvolutionResponse[]> => {
        const response = await api.get<DashboardEvolutionResponse[]>("/api/Dashboard/evolution");
        return response.data;
    },

    getDistribution: async (): Promise<DashboardCategoryDistributionResponse[]> => {
        const response = await api.get<DashboardCategoryDistributionResponse[]>("/api/Dashboard/distribution");
        return response.data;
    },

    getWaitList: async (): Promise<DashboardFamilyWaitListResponse[]> => {
        const response = await api.get<DashboardFamilyWaitListResponse[]>("/api/Dashboard/wait-list");
        return response.data;
    },

    getExpiringBatches: async (): Promise<DashboardExpiringBatchResponse[]> => {
        const response = await api.get<DashboardExpiringBatchResponse[]>("/api/Dashboard/expiring-batches");
        return response.data;
    }
};
