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

// Visa Requirements types
export interface VisaRequirementsData {
  required: boolean;
  type?: string;
  duration?: string;
  processingTime?: string;
  cost?: string;
  documents?: string[];
  notes?: string;
  embassyUrl?: string;
  content?: string;
}

export type VisaRequirementsResponse = SuccessResponse<VisaRequirementsData>;

// Culture Insights types
export interface CultureInsightsData {
  customs?: string[];
  etiquette?: string[];
  religion?: string;
  dressCodes?: string;
  taboos?: string[];
  greetings?: string[];
  tipping?: string;
  businessCulture?: string;
  content?: string;
}

export type CultureInsightsResponse = SuccessResponse<CultureInsightsData>;

export interface CurrencyInfoData {
  currency?: string;
  exchangeRate?: string;
  paymentMethods?: string;
  tipping?: string;
  costOfLiving?: string;
  bankingHours?: string;
  atmAvailability?: string;
  content?: string;
}

export type CurrencyInfoResponse = SuccessResponse<CurrencyInfoData>;

export interface HealthInfoData {
  vaccinations?: string;
  precautions?: string;
  safetyTips?: string[];
  emergencyContacts?: Record<string, string>;
  hospitals?: string[];
  insurance?: string;
  content?: string;
}

export type HealthInfoResponse = SuccessResponse<HealthInfoData>;

export interface TransportationInfoData {
  gettingAround?: string;
  options?: string[];
  publicTransport?: string;
  taxis?: string;
  rentalOptions?: string;
  airports?: string[];
  content?: string;
}

export type TransportationInfoResponse = SuccessResponse<TransportationInfoData>;

export interface LanguageInfoData {
  officialLanguage?: string;
  phrases?: string[];
  communicationTips?: string;
  content?: string;
}

export type LanguageInfoResponse = SuccessResponse<LanguageInfoData>;

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
  retryDelay?: number;
}

export interface ApiError extends Error {
  code: string;
  status?: number;
  details?: string;
  recoverySteps?: string[];
  retryAfter?: number;
} 