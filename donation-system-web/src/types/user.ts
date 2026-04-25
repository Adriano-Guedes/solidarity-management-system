export interface UserResponse {
  id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  active: boolean;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}
