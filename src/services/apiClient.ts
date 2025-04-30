import {
  ApiClientConfig,
  ApiRequestOptions,
  ApiError,
  ErrorResponse,
  SuccessResponse,
  ChatResponse,
  TripPlanResponse,
  TripListResponse,
  VisaRequirementsResponse,
  CultureInsightsResponse,
  CurrencyInfoResponse,
  HealthInfoResponse,
  TransportationInfoResponse,
  LanguageInfoResponse
} from '../types/api';
import { ENDPOINTS } from '../config/constants';

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
      console.error('API Error response:', JSON.stringify(data, null, 2));
      
      const error = new Error(data.message) as ApiError;
      error.code = data.code;
      error.status = response.status;
      error.details = data.details;
      error.recoverySteps = data.recoverySteps;
      error.retryAfter = data.retryAfter;
      
      // Enhanced error logging for field related issues
      if (data.message && (data.message.includes('days') || data.message.includes('duration'))) {
        console.error('Days/Duration field error:', data.message);
      }
      
      if (data.details && data.details.validationErrors) {
        console.error('Validation errors:', JSON.stringify(data.details.validationErrors, null, 2));
      }
      
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
      // Add detailed logging to analyze error properties
      console.log(`[Retry Check - Attempt ${attempt}] Error details:`, JSON.stringify({
        message: error.message,
        status: error.status,
        code: error.code,
        name: error.name,
        stack: error.stack ? 'exists' : 'undefined'
      }, null, 2));
      
      const maxAttempts = options.retryAttempts || this.config.retryAttempts!;
      
      if (attempt < maxAttempts && this.shouldRetry(error)) {
        // Calculate delay with exponential backoff and jitter
        const baseDelay = options.retryDelay || this.config.retryDelay!;
        const exponentialDelay = Math.min(
          (Math.pow(2, attempt) * baseDelay),
          30000 // Cap at 30 seconds
        );
        const jitter = Math.random() * 100; // Add up to 100ms of random jitter
        const delay = exponentialDelay + jitter;
        
        // If server specifies a retry-after time, use that instead
        const retryAfterMs = error.retryAfter ? error.retryAfter * 1000 : delay;
        
        console.log(`API retry attempt ${attempt}/${maxAttempts} after ${retryAfterMs}ms for ${url}`);
        await this.delay(retryAfterMs);
        return this.retryRequest<T>(url, options, attempt + 1);
      }
      
      console.error(`API request failed after ${attempt} attempt(s):`, error);
      throw error;
    }
  }

  private shouldRetry(error: ApiError): boolean {
    // Retry on:
    // 1. Network errors (no status code)
    // 2. Server errors (5xx)
    // 3. Rate limiting (429)
    // 4. Specific API error codes that indicate transient issues
    // NOTE: We should NOT retry on validation errors (4xx except 429)
    
    const isValidationError = error.status && error.status >= 400 && error.status < 500 && error.status !== 429;
    
    return (
      !error.status || // Network error
      error.status >= 500 || // Server error
      error.status === 429 || // Rate limit exceeded
      error.code === 'RATE_LIMIT_EXCEEDED' ||
      error.code === 'TEMPORARY_ERROR' ||
      error.code === 'SERVICE_UNAVAILABLE' ||
      error.code === 'SERVER_STARTING' || // For when backend cold starts
      (error.message && error.message.includes('timeout'))
    ) && !isValidationError; // Ensure we don't retry validation errors
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
    days?: number;
    duration?: number;
    budget?: string;
    budgetLevel?: string;
    interests: string[];
    userCountry?: string;
    nationality?: string;
    travelDates?: string;
    travelStyle?: string;
    travelerStyle?: string;
    tripPace?: string;
    dietaryRestrictions?: string[];
    specialRequirements?: string[];
    additionalRequirement?: string;
    transportationPreference?: string[];
    // Additional fields to remove
    destinationCountry?: string;
    latitude?: number;
    longitude?: number;
    displayDestination?: string;
    year?: string;
    month?: string;
    [key: string]: any; // Allow any other fields for flexibility
  }): Promise<TripPlanResponse> {
    // Create a copy of the data to modify
    const requestData = { ...planData };
    
    console.log('Original API request data:', JSON.stringify(planData, null, 2));
    
    // CRITICAL: Map duration to days if days is not provided but duration is
    if (planData.duration) {
      requestData.days = planData.duration;
      console.log(`Mapped duration (${planData.duration}) to days field`);
      // Delete duration since the API expects days
      delete requestData.duration;
    }
    
    // Map budgetLevel to budget and remove budgetLevel field
    if (requestData.budgetLevel) {
      requestData.budget = requestData.budgetLevel;
      console.log(`Mapped budgetLevel (${requestData.budgetLevel}) to budget field`);
      // Delete budgetLevel since the API expects budget only
      delete requestData.budgetLevel;
    }
    
    // Map nationality to userCountry if userCountry is not provided but nationality is
    if (!requestData.userCountry && requestData.nationality) {
      requestData.userCountry = requestData.nationality;
      console.log(`Mapped nationality (${requestData.nationality}) to userCountry field`);
      // Delete nationality since it's been mapped
      delete requestData.nationality;
    }
    
    // Map travelerStyle to travelStyle if travelStyle is not provided but travelerStyle is
    if (!requestData.travelStyle && requestData.travelerStyle) {
      requestData.travelStyle = requestData.travelerStyle;
      console.log(`Mapped travelerStyle (${requestData.travelerStyle}) to travelStyle field`);
      // Delete travelerStyle since the API expects travelStyle
      delete requestData.travelerStyle;
    }
    
    // Remove fields that are not accepted by the API
    const fieldsToRemove = [
      'destinationCountry',
      'latitude',
      'longitude',
      'displayDestination',
      'year',
      'month',
      'tripPace',
      'specialRequirements',
      'additionalRequirement',
      'transportationPreference'
    ];
    
    fieldsToRemove.forEach(field => {
      if (field in requestData) {
        delete requestData[field];
      }
    });
    
    // Create travel dates string if year and month are provided but travelDates is not
    if (!requestData.travelDates && planData.month && planData.year) {
      requestData.travelDates = `${planData.month} ${planData.year}`;
    }
    
    // Perform validation before sending
    if (!requestData.days) {
      console.error('ERROR: days field is missing in the final request!');
      throw new Error('Trip duration (days) is required. The application failed to map duration to days.');
    }
    
    console.log('Final API request data:', JSON.stringify(requestData, null, 2));
    
    return this.retryRequest<TripPlanResponse>(`/api${ENDPOINTS.GENERATE}`, {
      method: 'POST',
      body: requestData
    });
  }

  async getTripById(tripId: string): Promise<TripPlanResponse> {
    return this.retryRequest<TripPlanResponse>(`/api${ENDPOINTS.TRIPS}/${tripId}`, {
      method: 'GET'
    });
  }

  async getTrips(page: number = 1, limit: number = 10): Promise<TripListResponse> {
    return this.retryRequest<TripListResponse>(
      `/api${ENDPOINTS.TRIPS}?page=${page}&limit=${limit}`,
      {
        method: 'GET'
      }
    );
  }
  
  // Additional specialized endpoints to replace WorkspaceWithTimeout calls
  
  async getVisaRequirements(params: { 
    nationality: string; 
    destination: string;
  }): Promise<VisaRequirementsResponse> {
    return this.retryRequest<VisaRequirementsResponse>(
      `/api${ENDPOINTS.VISA_REQUIREMENTS}`,
      {
        method: 'GET',
        headers: {
          'x-nationality': params.nationality,
          'x-destination': params.destination
        }
      }
    );
  }
  
  async getCultureInsights(params: { 
    destination: string; 
  }): Promise<CultureInsightsResponse> {
    return this.retryRequest<CultureInsightsResponse>(
      `/api${ENDPOINTS.CULTURE_INSIGHTS}`,
      {
        method: 'GET',
        headers: {
          'x-destination': params.destination
        }
      }
    );
  }
  
  async getCurrencyInfo(params: { 
    destination: string; 
  }): Promise<CurrencyInfoResponse> {
    return this.retryRequest<CurrencyInfoResponse>(
      `/api${ENDPOINTS.CURRENCY_INFO}`,
      {
        method: 'GET',
        headers: {
          'x-destination': params.destination
        }
      }
    );
  }
  
  async getHealthInfo(params: {
    destination: string;
  }): Promise<HealthInfoResponse> {
    return this.retryRequest<HealthInfoResponse>(
      `/api${ENDPOINTS.HEALTH_INFO}`,
      {
        method: 'GET',
        headers: {
          'x-destination': params.destination
        }
      }
    );
  }
  
  async getTransportationInfo(params: {
    destination: string;
  }): Promise<TransportationInfoResponse> {
    return this.retryRequest<TransportationInfoResponse>(
      `/api${ENDPOINTS.TRANSPORTATION_INFO}`,
      {
        method: 'GET',
        headers: {
          'x-destination': params.destination
        }
      }
    );
  }
  
  async getLanguageInfo(params: {
    destination: string;
  }): Promise<LanguageInfoResponse> {
    return this.retryRequest<LanguageInfoResponse>(
      `/api${ENDPOINTS.LANGUAGE_INFO}`,
      {
        method: 'GET',
        headers: {
          'x-destination': params.destination
        }
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