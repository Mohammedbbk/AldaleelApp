// src/services/tripService.js

import { API, ENDPOINTS } from '../config/constants'; // Ensure paths are correct
import { AI_RESPONSE } from '../config/AiResponse'; // Ensure paths are correct

// fetchWithTimeout function remains the same as before...
const fetchWithTimeout = async (endpoint, options = {}) => {
    const controller = new AbortController();
    const timeoutDuration = options.timeout || API.TIMEOUT || 30000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    try {
        const response = await fetch(`${API.BASE_URL}${endpoint}`, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            let errorBody = null;
            try { errorBody = await response.json(); } catch (e) { /* ignore */ }
            const errorMessage = errorBody?.message || errorBody?.error || `HTTP error! Status: ${response.status}`;
            throw new Error(errorMessage);
        }
        const contentType = response.headers.get('content-type');
        if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
            return null;
        }
        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error(`Request timed out (${endpoint})`);
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

    const safeOnLoadingChange = typeof onLoadingChange === 'function' ? onLoadingChange : () => {};
    const safeOnLoadingMessageChange = typeof onLoadingMessageChange === 'function' ? onLoadingMessageChange : () => {};
    const safeOnError = typeof onError === 'function' ? onError : console.error;
    const safeOnSuccess = typeof onSuccess === 'function' ? onSuccess : () => {};

    try {
        safeOnLoadingChange(true);
        safeOnError('');

        // --- Prepare Initial Data ---
        // Initialize with defaults, then spread tripData over it
        const finalTripData = {
            destination: tripData.destination || 'Unknown',
            duration: tripData.duration || 0, // Check if duration is captured earlier
            budget: tripData.budget || 'Unknown',
            interests: Array.isArray(tripData.interests) ? tripData.interests : [],
            nationality: tripData.nationality || 'Unknown', // Check if nationality is captured earlier
            startDate: tripData.startDate || null, // Check if dates are captured earlier
            endDate: tripData.endDate || null,   // Check if dates are captured earlier
            travelStyle: tripData.travelStyle || 'Unknown',
            specialRequirements: Array.isArray(tripData.specialRequirements) ? tripData.specialRequirements : [],
            additionalRequirement: (tripData.additionalRequirement || '').trim() || null,
            transportationPreference: Array.isArray(tripData.transportationPreference) ? tripData.transportationPreference : [],
            visaRequirements: null,
            cultureInsights: null,
            aiRecommendations: null,
            nearbyEvents: null,
            aiGenerationFailed: false,
            // Spread the actual input data - this adds/overwrites fields like
            // destinationCity, budgetLevel, travelerStyle, month, year etc.
            ...tripData,
        };

        // --- Fetch Visa and Cultural Info Concurrently ---
        safeOnLoadingMessageChange('Fetching visa & cultural info...');
        try {
            // Use the most specific destination available for these calls
            const locationForQueries = finalTripData.destinationCity || finalTripData.destination;
            const nationalityForQueries = finalTripData.nationality; // Make sure this is set somewhere!

            const [visaResult, cultureResult] = await Promise.allSettled([
                fetchWithTimeout(ENDPOINTS.VISA_REQUIREMENTS, {
                    method: 'POST',
                    body: JSON.stringify({
                        nationality: nationalityForQueries, // Use potentially updated value
                        destination: locationForQueries,    // Use potentially updated value
                    }),
                }),
                fetchWithTimeout(ENDPOINTS.CULTURE_INSIGHTS, {
                    method: 'POST',
                    body: JSON.stringify({
                        nationality: nationalityForQueries,
                        destination: locationForQueries,
                    }),
                })
            ]);

            if (visaResult.status === 'fulfilled' && visaResult.value) {
                finalTripData.visaRequirements = visaResult.value?.data?.visaRequirements || visaResult.value;
                console.log('Visa requirements fetched:', finalTripData.visaRequirements);
            } else {
                console.warn('Visa requirements fetch failed:', visaResult.reason?.message || visaResult.reason);
            }

            if (cultureResult.status === 'fulfilled' && cultureResult.value) {
                finalTripData.cultureInsights = cultureResult.value?.data?.cultureInsights || cultureResult.value;
                console.log('Cultural insights fetched:', finalTripData.cultureInsights);
            } else {
                console.warn('Cultural insights fetch failed:', cultureResult.reason?.message || cultureResult.reason);
            }
        } catch (err) {
            console.error('Unexpected error during concurrent visa/culture fetch:', err.message);
        }

        // --- Generate AI Recommendations ---
        safeOnLoadingMessageChange('Generating travel recommendations...\nThis may take a minute if the server is starting up.');
        try {
            // *** MODIFIED SECTION ***
            // Construct payload using the correct fields from finalTripData
            let travelDatesValue = null;
            if (finalTripData.startDate && finalTripData.endDate) {
                travelDatesValue = `${finalTripData.startDate} to ${finalTripData.endDate}`;
            } else if (finalTripData.month && finalTripData.year) {
                // Fallback if specific dates aren't available
                travelDatesValue = `${finalTripData.month} ${finalTripData.year}`;
            }

            // **Important:** Where should `days` (duration) come from?
            // Assuming it should have been passed in tripData. If not, AI might get 0.
            // Ensure the screen asking for trip duration correctly sets `tripData.duration`.
            const durationValue = finalTripData.duration > 0 ? finalTripData.duration : null; // Send null if duration is 0/invalid

            const generationPayload = {
                destination: finalTripData.destinationCity || finalTripData.destination, // Prefer destinationCity
                days: durationValue, // Use calculated/passed duration
                budget: finalTripData.budgetLevel || finalTripData.budget, // Prefer budgetLevel
                interests: finalTripData.interests,
                userCountry: finalTripData.nationality, // Ensure nationality is captured
                travelDates: travelDatesValue, // Use combined/fallback dates
                travelStyle: finalTripData.travelerStyle || finalTripData.travelStyle, // Prefer travelerStyle
                // Add other fields if your AI prompt uses them (e.g., dietaryRestrictions)
                // dietaryRestrictions: finalTripData.specialRequirements, // Example mapping
            };

            // Remove null/undefined fields from payload before sending
            Object.keys(generationPayload).forEach(key => {
                if (generationPayload[key] == null || (Array.isArray(generationPayload[key]) && generationPayload[key].length === 0) ) {
                   // Remove null, undefined, or empty arrays if the API doesn't want them
                   // Keep empty strings if the API expects them
                   if (generationPayload[key] !== '') {
                     delete generationPayload[key];
                   }
                }
            });
            // *** END OF MODIFIED SECTION ***

            console.log("Sending to AI Generate:", JSON.stringify(generationPayload, null, 2));

            const aiData = await fetchWithTimeout(ENDPOINTS.GENERATE, {
                method: 'POST',
                timeout: API.AI_TIMEOUT || 90000,
                body: JSON.stringify(generationPayload),
            });

            console.log("Received from AI Generate:", aiData);

            AI_RESPONSE.updatePlan(aiData);
            finalTripData.aiRecommendations = aiData;

        } catch (err) {
            console.warn('AI recommendations fetch failed:', err.message);
            finalTripData.aiGenerationFailed = true;
        }

        // --- Fetch Events ---
        safeOnLoadingMessageChange('Finding events near your destination...');
        if (finalTripData.startDate && finalTripData.endDate) {
            try {
                const eventsData = await fetchWithTimeout(ENDPOINTS.EVENTS, {
                    method: 'POST',
                    body: JSON.stringify({
                        location: finalTripData.destinationCity || finalTripData.destination, // Use specific location
                        startDate: finalTripData.startDate,
                        endDate: finalTripData.endDate,
                    }),
                });
                finalTripData.nearbyEvents = Array.isArray(eventsData) ? eventsData : (eventsData?.events || []);
                console.log('Nearby events fetched:', finalTripData.nearbyEvents);
            } catch (err) {
                console.warn('Events fetch failed:', err.message);
                finalTripData.nearbyEvents = [];
            }
        } else {
             console.log('Skipping event fetch due to missing dates.');
             finalTripData.nearbyEvents = [];
        }

        // --- Finalize and Callback ---
        console.log('Final trip data prepared:', finalTripData);
        safeOnSuccess(finalTripData);
        return finalTripData;

    } catch (err) {
        console.error('Error in createTrip orchestration:', err);
        safeOnError(err.message || 'An unknown error occurred during trip creation.');
        return null; // Indicate failure
    } finally {
        safeOnLoadingChange(false);
    }
};