export interface AgeRangeResponse {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAgeRangeRequest {
  name: string;
  minAge: number;
  maxAge: number;
  active: boolean;
}

export interface UpdateAgeRangeRequest {
  name: string;
  minAge: number;
  maxAge: number;
  active: boolean;
}
