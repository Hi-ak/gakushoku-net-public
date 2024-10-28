export interface ApiResponse {
  success: boolean;
  message?: string;
  // まだ正式に使用していない
  code?: number;
  additionalData?: any;
}
