export interface NeedRuleResponse {
  id: string;
  ageRangeId: string;
  ageRangeName: string;
  needGroupId: string;
  needGroupName: string;
  value: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateNeedRuleRequest {
  ageRangeId: string;
  needGroupId: string;
  value: number;
}

export interface UpdateNeedRuleRequest {
  ageRangeId: string;
  needGroupId: string;
  value: number;
}
