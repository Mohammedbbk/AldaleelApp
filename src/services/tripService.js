// src/services/tripService.js
import { apiClient, getErrorMessage } from './apiClient';
import { AI_RESPONSE } from '../config/AiResponse';

// --- Service Function: Fetch Visa Info ---
export const getVisaInfo = async (nationality, destination) => {
  if (!nationality || !destination) {
    throw new Error('Missing nationality or destination for Visa Info');
  }
  
  try {
    const response = await apiClient.getVisaRequirements({
      nationality, 
      destination
    });
    
    const visaData = response.data;
    
    // Return the content, notes, or string representation of visa data
    return visaData.content || visaData.notes || JSON.stringify(visaData);
  } catch (error) {
    console.error(`Error getting visa requirements (${nationality} -> ${destination}):`, error);
    throw new Error(`Failed to fetch visa requirements: ${getErrorMessage(error)}`);
  }
};

// --- Service Function: Fetch Culture Insights ---
export const getCultureInsights = async (destination) => {
  if (!destination) {
    throw new Error('Missing destination for Culture Insights');
  }
  
  try {
    const response = await apiClient.getCultureInsights({ destination });
    
    const cultureData = response.data;
    
    // Return the content, notes, or string representation of culture data
    return cultureData.content || JSON.stringify(cultureData);
  } catch (error) {
    console.error(`Error getting culture insights for ${destination}:`, error);
    throw new Error(`Failed to fetch culture insights: ${getErrorMessage(error)}`);
  }
};

// --- Service Function: Fetch Currency Info ---
export const getCurrencyInfo = async (destination) => {
  if (!destination) {
    throw new Error('Missing destination for Currency Info');
  }
  
  try {
    const response = await apiClient.getCurrencyInfo({ destination });
    
    return response.data;
  } catch (error) {
    console.error(`Error getting currency info for ${destination}:`, error);
    throw new Error(`Failed to fetch currency information: ${getErrorMessage(error)}`);
  }
};

// --- Service Function: Fetch Health Info ---
export const getHealthInfo = async (destination) => {
  if (!destination) {
    throw new Error('Missing destination for Health Info');
  }
  
  try {
    const response = await apiClient.getHealthInfo({ destination });
    
    return response.data;
  } catch (error) {
    console.error(`Error getting health info for ${destination}:`, error);
    throw new Error(`Failed to fetch health information: ${getErrorMessage(error)}`);
  }
};

// --- Service Function: Fetch Transportation Info ---
export const getTransportationInfo = async (destination) => {
  if (!destination) {
    throw new Error('Missing destination for Transportation Info');
  }
  
  try {
    const response = await apiClient.getTransportationInfo({ destination });
    
    return response.data;
  } catch (error) {
    console.error(`Error getting transportation info for ${destination}:`, error);
    throw new Error(`Failed to fetch transportation information: ${getErrorMessage(error)}`);
  }
};

// --- Service Function: Fetch Language Info ---
export const getLanguageInfo = async (destination) => {
  if (!destination) {
    throw new Error('Missing destination for Language Info');
  }
  
  try {
    const response = await apiClient.getLanguageInfo({ destination });
    
    return response.data;
  } catch (error) {
    console.error(`Error getting language info for ${destination}:`, error);
    throw new Error(`Failed to fetch language information: ${getErrorMessage(error)}`);
  }
};

// --- Service Function: Create Trip ---
export const createTrip = async (tripData, callbacks = {}) => {
  const { onLoadingChange, onLoadingMessageChange, onError, onSuccess } = callbacks;
  
  if (onLoadingChange) onLoadingChange(true);
  if (onLoadingMessageChange) onLoadingMessageChange('Creating your trip...');
  
  try {
    // Validation
    if (!tripData || !tripData.destination) {
      throw new Error('Trip destination is required');
    }
    
    console.log('[createTrip] Original trip data:',  JSON.stringify(tripData, null, 2));
    
    // Field mapping logic has been consolidated into apiClient.generateTripPlan
    // and removed from here to avoid redundancy
    
    if (!tripData.days && !tripData.duration) {
      console.error('[createTrip] No duration or days provided!');
      throw new Error('Trip duration is required');
    }
    
    if (!tripData.budget && !tripData.budgetLevel) {
      console.error('[createTrip] No budget or budgetLevel provided!');
      throw new Error('Trip budget/budget level is required');
    }
    
    // Ensure interests is an array
    if (!tripData.interests || !Array.isArray(tripData.interests) || tripData.interests.length === 0) {
      tripData.interests = ['culture']; // Default fallback
      console.warn('[createTrip] No interests provided, using default: culture');
    }

    console.log('[createTrip] Sending trip data to API:', JSON.stringify(tripData, null, 2));
    
    if (onLoadingMessageChange) onLoadingMessageChange('Generating AI recommendations...');
    
    // Use the ApiClient to generate the trip plan
    const response = await apiClient.generateTripPlan(tripData);
    
    console.log('[createTrip] Received response:', JSON.stringify(response, null, 2));
    
    if (onLoadingMessageChange) onLoadingMessageChange('Trip created successfully!');
    
    if (onSuccess) onSuccess(response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error creating trip:', error);
    
    // Specific handling for days/duration error
    if (error.message && error.message.includes('days') && error.message.includes('required')) {
      const updatedErrorMsg = 'Trip duration is required. Please go back and select a duration for your trip.';
      if (onError) onError(updatedErrorMsg);
      throw new Error(updatedErrorMsg);
    }
    
    // Specific handling for budget error
    if (error.message && error.message.includes('budget') && error.message.includes('required')) {
      const updatedErrorMsg = 'Trip budget is required. Please go back and select a budget for your trip.';
      if (onError) onError(updatedErrorMsg);
      throw new Error(updatedErrorMsg);
    }
    
    // Handling field not allowed errors
    if (error.message && error.message.includes('is not allowed')) {
      console.warn('API field compatibility issue:', error.message);
      // We've already updated the ApiClient to handle this, but we'll catch it here as well
      const fieldMatch = error.message.match(/"([^"]+)" is not allowed/);
      const field = fieldMatch ? fieldMatch[1] : 'field';
      const updatedErrorMsg = `Invalid trip data: ${field} is not allowed. This is a compatibility issue. Please try again.`;
      if (onError) onError(updatedErrorMsg);
      throw new Error(updatedErrorMsg);
    }
    
    // Check if this might be a partial success where the trip was created
    // but AI generation failed
    const errorMessage = getErrorMessage(error);
    const isPotentialPartialSuccess = errorMessage.includes('AI generation') || 
                                      errorMessage.includes('recommendation') ||
                                      errorMessage.includes('itinerary');
    
    if (isPotentialPartialSuccess) {
      // Return a special object that indicates AI generation failed
      // but the trip may have been created
      if (onError) onError(errorMessage);
      return { 
        tripId: tripData.id || 'unknown',
        aiGenerationFailed: true,
        errorMessage
      };
    }
    
    if (onError) onError(errorMessage);
    throw error;
  } finally {
    if (onLoadingChange) onLoadingChange(false);
  }
};

// --- Service Function: Get Trips ---
export const getTrips = async ({ page = 1, limit = 10, filter = 'all', sort = 'date', search = '' }) => {
  try {
    console.log(`[getTrips] Fetching trips: page=${page}, limit=${limit}, filter=${filter}, sort=${sort}, search=${search}`);
    
    // Use apiClient to get trips
    const response = await apiClient.getTrips(page, limit);
    
    if (search) {
      // Client-side search filtering
      const searchLower = search.toLowerCase();
      response.data.trips = response.data.trips.filter(trip => 
        trip.destination.toLowerCase().includes(searchLower) ||
        (trip.userCountry && trip.userCountry.toLowerCase().includes(searchLower))
      );
    }
    
    // Client-side sorting
    if (sort === 'date-asc') {
      response.data.trips.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'date-desc' || sort === 'date') {
      response.data.trips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    // Client-side filtering (if needed beyond what the API provides)
    if (filter !== 'all') {
      // Apply additional filtering logic here if needed
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching trips:', error);
    throw new Error(`Failed to fetch trips: ${getErrorMessage(error)}`);
  }
};

// Export legacy names for backward compatibility
export const WorkspaceVisaInfo = getVisaInfo;
export const WorkspaceCultureInsights = getCultureInsights;
export const WorkspaceCurrencyInfo = getCurrencyInfo;
export const WorkspaceHealthInfo = getHealthInfo;
export const WorkspaceTransportationInfo = getTransportationInfo;
export const WorkspaceLanguageInfo = getLanguageInfo;