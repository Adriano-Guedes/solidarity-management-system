export interface NeedGroupResponse {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateNeedGroupRequest {
  name: string;
  active: boolean;
}

export interface UpdateNeedGroupRequest {
  name: string;
  active: boolean;
}
