export interface DashboardSummaryResponse {
    totalActiveFamilies: number;
    activeFamiliesServedThisMonth: number;
    totalPeopleImpactedThisMonth: number;
    deliveriesThisMonth: number;
    donationsThisMonth: number;
}

export interface DashboardEvolutionResponse {
    date: string;
    deliveries: number;
    donations: number;
}

export interface DashboardCategoryDistributionResponse {
    category: string;
    count: number;
}

export interface DashboardFamilyWaitListResponse {
    familyId: string;
    familyName: string;
    lastDeliveryDate?: string;
    daysSinceLastDelivery: number;
}

export interface DashboardExpiringBatchResponse {
    batchId: string;
    itemId: string;
    itemName: string;
    categoryName: string;
    quantity: number;
    expirationDate: string;
    daysUntilExpiration: number;
}
