// Base response types
export type ResponseStatus = 'success' | 'error';

export interface BaseResponse {
  status: ResponseStatus;
  timestamp: string;
  requestId: string;
}

export interface ErrorResponse extends BaseResponse {
  status: 'error';
  code: string;
  message: string;
  details?: string;
  recoverySteps?: string[];
  retryAfter?: number;
}

export interface SuccessMetadata {
  processingTime?: number;
  source?: string;
  cached?: boolean;
}

export interface SuccessResponse<T> extends BaseResponse {
  status: 'success';
  data: T;
  metadata?: SuccessMetadata;
}

// Chat types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    confidence?: number;
    sources?: string[];
    context?: string;
    type?: string;
  };
}

export interface ChatConversation {
  id: string;
  context?: string;
  summary?: string;
}

export interface ChatResponseData {
  message: ChatMessage;
  conversation: ChatConversation;
}

export type ChatResponse = SuccessResponse<ChatResponseData>;

// Trip types
export interface TripActivity {
  id: string;
  name: string;
  type: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  cost?: string;
  description?: string;
  recommendations?: string[];
}

export interface TripMeal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  venue?: string;
  cuisine?: string;
  cost?: string;
  dietaryOptions?: string[];
}

export interface TripAccommodation {
  name: string;
  type: string;
  location: string;
  checkIn?: string;
  checkOut?: string;
  cost?: string;
  amenities?: string[];
}

export interface TripItineraryDay {
  day: number;
  date?: string;
  activities: TripActivity[];
  meals?: TripMeal[];
  accommodation?: TripAccommodation;
  notes?: string[];
}

export interface TripPlan {
  id: string;
  destination: string;
  days: number;
  budget: string;
  interests: string[];
  userCountry?: string;
  travelDates?: string;
  travelStyle?: string;
  dietaryRestrictions?: string[];
  itinerary: TripItineraryDay[];
  createdAt: string;
  updatedAt?: string;
}

export interface TripPlanResponseData {
  tripId: string;
  itinerary: TripItineraryDay[];
}

export type TripPlanResponse = SuccessResponse<TripPlanResponseData>;

export interface TripListPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface TripListResponseData {
  trips: TripPlan[];
  pagination: TripListPagination;
}

export type TripListResponse = SuccessResponse<TripListResponseData>;

// API client types
export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retryAttempts?: number;
}

export interface ApiError extends Error {
  code: string;
  status?: number;
  details?: string;
  recoverySteps?: string[];
  retryAfter?: number;
} 