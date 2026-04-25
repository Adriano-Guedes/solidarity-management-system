export interface LogResponse {
  id: string;
  userId?: string;
  entityName: string;
  entityId?: string;
  action: string;
  oldValues?: string;
  newValues?: string;
  description?: string;
  createdAt: string;
}
