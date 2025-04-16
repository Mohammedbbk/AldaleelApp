// src/services/tripService.js

import { API, ENDPOINTS } from '../config/constants';
import { AI_RESPONSE } from '../config/AiResponse';

const fetchWithTimeout = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API.TIMEOUT);
  
  try {
    const response = await fetch(`${API.BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
};

export const createTrip = async (tripData, callbacks = {}) => {
  const {
    onLoadingChange,
    onLoadingMessageChange,
    onError,
    onSuccess,
  } = callbacks;

  try {
    onLoadingChange?.(true);
    onError?.('');

    const finalTripData = {
      ...tripData,
      specialRequirements: tripData.specialRequirements || [],
      additionalRequirement: (tripData.additionalRequirement || '').trim() || null,
      transportationPreference: tripData.transportationPreference || [],
    };

    // Fetch visa requirements and cultural insights concurrently
    onLoadingMessageChange?.('Fetching visa & cultural info...');
    try {
      const [visaResult, cultureResult] = await Promise.allSettled([
        fetchWithTimeout(ENDPOINTS.VISA_REQUIREMENTS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nationality: finalTripData.nationality || 'Unknown',
            destination: finalTripData.destination || 'Unknown',
          }),
        }),
        fetchWithTimeout(ENDPOINTS.CULTURE_INSIGHTS, { // Assuming ENDPOINTS.CULTURE_INSIGHTS is defined
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nationality: finalTripData.nationality || 'Unknown',
            destination: finalTripData.destination || 'Unknown',
          }),
        })
      ]);

      if (visaResult.status === 'fulfilled') {
        // Assuming the API returns { status: 'success', data: { visaRequirements: {...} } }
        // Or just the visa data directly if the proxy simplifies it.
        // Let's assume the proxy returns the nested structure for now.
        finalTripData.visaRequirements = visaResult.value?.data?.visaRequirements || visaResult.value; 
        console.log('Visa requirements fetched successfully.');
      } else {
        console.warn('Visa requirements fetch failed:', visaResult.reason?.message || visaResult.reason);
      }

      if (cultureResult.status === 'fulfilled') {
        // Assuming the API returns { status: 'success', data: { cultureInsights: {...} } }
        finalTripData.cultureInsights = cultureResult.value?.data?.cultureInsights || cultureResult.value;
        console.log('Cultural insights fetched successfully.');
      } else {
        console.warn('Cultural insights fetch failed:', cultureResult.reason?.message || cultureResult.reason);
      }
    } catch (err) {
      // This catch block might not be strictly necessary with Promise.allSettled
      // unless there's an error outside the individual fetches.
      console.error('Error fetching visa/culture data concurrently:', err.message);
    }

    // Get travel recommendations
    onLoadingMessageChange?.('Generating travel recommendations...\nThis may take a minute if the server is starting up.');
    try {
      const aiData = await fetchWithTimeout(ENDPOINTS.GENERATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: finalTripData.destination,
          days: finalTripData.duration,
          budget: finalTripData.budget,
          interests: finalTripData.interests,
          userCountry: finalTripData.nationality,
          travelDates: `${finalTripData.startDate} to ${finalTripData.endDate}`,
          travelStyle: finalTripData.travelStyle,
        }),
      });
      
      AI_RESPONSE.updatePlan(aiData);
    } catch (err) {
      console.warn('AI recommendations fetch failed:', err.message);
      finalTripData.aiGenerationFailed = true;
    }
    
    // Get events near destination
    onLoadingMessageChange?.('Finding events near your destination...');
    try {
      const eventsData = await fetchWithTimeout(ENDPOINTS.EVENTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: finalTripData.destination,
          startDate: finalTripData.startDate,
          endDate: finalTripData.endDate,
        }),
      });
      finalTripData.nearbyEvents = eventsData;
    } catch (err) {
      console.warn('Events fetch failed:', err.message);
    }

    // Update AI_RESPONSE with the final combined data (including visa/culture)
    AI_RESPONSE.updatePlan(finalTripData);

    onSuccess?.(finalTripData);
    return finalTripData;
  } catch (err) {
    onError?.(err.message);
    throw err;
  } finally {
    onLoadingChange?.(false);
  }
};