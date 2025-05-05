export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details: string[];
  };
  timestamp: Date;
}
