import {
  ApiClientConfig,
  ApiRequestOptions,
  ApiError,
  ErrorResponse,
  SuccessResponse,
  ChatResponse,
  TripPlanResponse,
  TripListResponse
} from '../types/api';

const DEFAULT_CONFIG: ApiClientConfig = {
  baseUrl: 'https://aldaleelapp-mcp.onrender.com',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
};

export class ApiClient {
  private config: ApiClientConfig;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (data.status === 'error') {
      const error = new Error(data.message) as ApiError;
      error.code = data.code;
      error.status = response.status;
      error.details = data.details;
      error.recoverySteps = data.recoverySteps;
      error.retryAfter = data.retryAfter;
      throw error;
    }

    return data as T;
  }

  private async retryRequest<T>(
    url: string,
    options: ApiRequestOptions,
    attempt: number = 1
  ): Promise<T> {
    try {
      const response = await this.makeRequest(url, options);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (
        attempt < (options.retryAttempts || this.config.retryAttempts!) &&
        this.shouldRetry(error)
      ) {
        await this.delay(
          error.retryAfter
            ? error.retryAfter * 1000
            : (options.retryAttempts || this.config.retryDelay!)
        );
        return this.retryRequest<T>(url, options, attempt + 1);
      }
      throw error;
    }
  }

  private shouldRetry(error: ApiError): boolean {
    // Retry on network errors or specific API error codes
    return (
      !error.status || // Network error
      error.status >= 500 || // Server error
      error.code === 'RATE_LIMIT_EXCEEDED' ||
      error.code === 'TEMPORARY_ERROR'
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequest(
    url: string,
    options: ApiRequestOptions
  ): Promise<Response> {
    const controller = new AbortController();
    const timeout = options.timeout || this.config.timeout;

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal
      });

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Chat endpoints
  async sendChatMessage(
    message: string,
    context?: string,
    tripData?: any
  ): Promise<ChatResponse> {
    return this.retryRequest<ChatResponse>('/api/trips/chat', {
      method: 'POST',
      body: {
        message,
        context,
        tripData
      }
    });
  }

  // Trip endpoints
  async generateTripPlan(planData: {
    destination: string;
    days: number;
    budget: string;
    interests: string[];
    userCountry?: string;
    travelDates?: string;
    travelStyle?: string;
    dietaryRestrictions?: string[];
  }): Promise<TripPlanResponse> {
    return this.retryRequest<TripPlanResponse>('/api/trips/generate', {
      method: 'POST',
      body: planData
    });
  }

  async getTripById(tripId: string): Promise<TripPlanResponse> {
    return this.retryRequest<TripPlanResponse>(`/api/trips/${tripId}`, {
      method: 'GET'
    });
  }

  async getTrips(page: number = 1, limit: number = 10): Promise<TripListResponse> {
    return this.retryRequest<TripListResponse>(
      `/api/trips?page=${page}&limit=${limit}`,
      {
        method: 'GET'
      }
    );
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Export error handling utilities
export function isApiError(error: any): error is ApiError {
  return error && error.code !== undefined;
}

export function getErrorMessage(error: any): string {
  if (isApiError(error)) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

export function getRecoverySteps(error: any): string[] {
  if (isApiError(error) && error.recoverySteps) {
    return error.recoverySteps;
  }
  return ['Please check your internet connection', 'Try again in a few moments'];
} 