// src/services/tripService.js
import { API, ENDPOINTS } from '../config/constants';
import { AI_RESPONSE } from '../config/AiResponse';

// --- Utility: fetchWithTimeout ---
const fetchWithTimeout = async (endpoint, options = {}) => {
    const { timeout = API.TIMEOUT || 30000, maxRetries = 3, ...fetchOpts } = options;
    let lastError = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        try {
            const url = API.BASE_URL ? `${API.BASE_URL}${endpoint}` : endpoint;
            console.log(`[fetchWithTimeout] Requesting: ${fetchOpts.method || 'GET'} ${url} (Attempt ${attempt + 1}/${maxRetries})`);
            console.log(`[fetchWithTimeout] Options:`, JSON.stringify(fetchOpts, null, 2));

            const response = await fetch(url, {
                ...fetchOpts,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...fetchOpts.headers,
                },
            });
            
            clearTimeout(timeoutId);
            
            // Handle network errors that result in valid responses but non-2xx status codes
            if (!response.ok) {
                let errorBody = null;
                try { 
                    errorBody = await response.json(); 
                } catch (e) { 
                    /* ignore parse errors */ 
                }
                const errorMessage = errorBody?.message || errorBody?.error || `HTTP error! Status: ${response.status}`;
                const error = new Error(errorMessage);
                error.status = response.status;
                error.body = errorBody;
                throw error;
            }
            
            // Check for content type and return appropriate data
            const contentType = response.headers.get('content-type');
            if (response.status === 204 || !contentType) {
                return null;
            }
            
            // For JSON responses, parse and return
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            // For other types, return the raw text
            return await response.text();
            
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('[fetchWithTimeout] Fetch Error Details:', { name: error.name, message: error.message, stack: error.stack });
            lastError = error;
            
            // If abort/timeout, don't retry since it's unlikely to succeed with same timeout
            if (error.name === 'AbortError') {
                throw new Error(`Request timed out after ${timeout / 1000}s (${endpoint})`);
            }
            
            // If more retries remaining, wait a bit and try again
            if (attempt < maxRetries - 1) {
                const backoff = 500 * (attempt + 1);
                console.log(`[fetchWithTimeout] Retrying in ${backoff}ms...`);
                await new Promise(resolve => setTimeout(resolve, backoff));
                continue;
            }
            
            // No more retries, throw the last error
            throw error;
        }
    }
    
    // This should never be reached due to the throw in the catch block,
    // but just in case something weird happens:
    throw lastError || new Error('Unknown error in fetchWithTimeout');
};

// --- Service Function: Fetch Visa Info ---
export const WorkspaceVisaInfo = async (nationality, destination) => {
  // ... (keep existing implementation) ...
   if (!nationality || !destination) throw new Error('Missing nationality or destination for Visa Info');
  try {
      const res = await fetchWithTimeout(ENDPOINTS.VISA_REQUIREMENTS, {
        method: 'POST',
        body: JSON.stringify({ nationality, destination }),
      });
      
      // Handle nested data structure
      const responseData = res.data && res.data.status === 'success' ? res.data : res;
      
      if (!responseData || responseData.status !== 'success' || !responseData.visaRequirements) {
          console.warn('Invalid response structure from Visa endpoint:', res);
          throw new Error('Received invalid data structure for visa requirements');
      }
      return responseData.visaRequirements.content || responseData.visaRequirements.notes || JSON.stringify(responseData.visaRequirements);
  } catch (error) {
      console.error(`Error in WorkspaceVisaInfo (${nationality} -> ${destination}):`, error);
      throw new Error(`Failed to fetch visa requirements: ${error.message}`);
  }
};

// --- Service Function: Fetch Culture Insights ---
export const WorkspaceCultureInsights = async (nationality, destination) => {
  // ... (keep existing implementation) ...
  if (!nationality || !destination) throw new Error('Missing nationality or destination for Culture Insights');
   try {
      const res = await fetchWithTimeout(ENDPOINTS.CULTURE_INSIGHTS, {
        method: 'POST',
        body: JSON.stringify({ nationality, destination }),
      });
      
      // Handle nested data structure
      const responseData = res.data && res.data.status === 'success' ? res.data : res;
      
      if (!responseData || responseData.status !== 'success' || !responseData.cultureInsights) {
        console.warn('Invalid response structure from Culture endpoint:', res);
        throw new Error('Received invalid data structure for culture insights');
      }
      return responseData.cultureInsights.content || responseData.cultureInsights.notes || JSON.stringify(responseData.cultureInsights);
   } catch (error) {
        console.error(`Error in WorkspaceCultureInsights (${nationality} -> ${destination}):`, error);
        throw new Error(`Failed to fetch culture insights: ${error.message}`);
   }
};

// --- Service Function: Create Trip Orchestration ---
export const createTrip = async (tripData, callbacks = {}) => {
    // ... (keep existing implementation) ...
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
        const finalTripData = { /* ... construct finalTripData ... */
            destination: tripData.destination || 'Unknown',
            destinationCity: tripData.destinationCity,
            duration: tripData.duration || 0,
            budget: tripData.budget || 'Unknown',
            budgetLevel: tripData.budgetLevel,
            interests: Array.isArray(tripData.interests) ? tripData.interests : [],
            nationality: tripData.nationality || 'Unknown',
            startDate: tripData.startDate || null,
            endDate: tripData.endDate || null,
            month: tripData.month,
            year: tripData.year,
            travelStyle: tripData.travelStyle || 'Unknown',
            travelerStyle: tripData.travelerStyle,
            specialRequirements: Array.isArray(tripData.specialRequirements) ? tripData.specialRequirements : [],
            additionalRequirement: (tripData.additionalRequirement || '').trim() || null,
            transportationPreference: Array.isArray(tripData.transportationPreference) ? tripData.transportationPreference : [],
            visaRequirements: null,
            cultureInsights: null,
            aiRecommendations: null,
            nearbyEvents: null,
            aiGenerationFailed: false,
            ...tripData,
        };
        // --- Fetch Visa/Culture ---
        safeOnLoadingMessageChange('Fetching visa & cultural info...');
        try {
            const locationForQueries = finalTripData.destinationCity || finalTripData.destination;
            const nationalityForQueries = finalTripData.nationality;
            if (nationalityForQueries && nationalityForQueries !== 'Unknown' && locationForQueries && locationForQueries !== 'Unknown') {
                 console.log(`Workspaceing Visa/Culture for: ${nationalityForQueries} -> ${locationForQueries}`);
                 const [visaResult, cultureResult] = await Promise.allSettled([
                    WorkspaceVisaInfo(nationalityForQueries, locationForQueries),
                    WorkspaceCultureInsights(nationalityForQueries, locationForQueries)
                 ]);
                 if (visaResult.status === 'fulfilled' && visaResult.value) {
                    finalTripData.visaRequirements = { content: visaResult.value, source: "LLM Information Service" };
                 } else {
                    console.warn('Visa requirements fetch failed:', visaResult.reason?.message || visaResult.reason);
                    finalTripData.visaRequirements = { content: `Failed to load: ${visaResult.reason?.message || 'Unknown error'}`, source: "Error" };
                 }
                 if (cultureResult.status === 'fulfilled' && cultureResult.value) {
                    finalTripData.cultureInsights = { content: cultureResult.value, source: "LLM Information Service" };
                 } else {
                    console.warn('Cultural insights fetch failed:', cultureResult.reason?.message || cultureResult.reason);
                    finalTripData.cultureInsights = { content: `Failed to load: ${cultureResult.reason?.message || 'Unknown error'}`, source: "Error" };
                 }
            } else { /* ... handle missing params ... */
                 console.warn('Skipping Visa/Culture fetch: Nationality or Destination missing/unknown.');
                 finalTripData.visaRequirements = { content: "Requires Nationality and Destination.", source: "System" };
                 finalTripData.cultureInsights = { content: "Requires Nationality and Destination.", source: "System" };
            }
        } catch (err) { /* ... handle concurrent fetch error ... */
             console.error('Unexpected error during concurrent visa/culture fetch:', err.message);
             finalTripData.visaRequirements = { content: `Failed to load: ${err.message}`, source: "Error" };
             finalTripData.cultureInsights = { content: `Failed to load: ${err.message}`, source: "Error" };
        }
        // --- Generate AI Recs ---
        safeOnLoadingMessageChange('Generating travel recommendations...');
        try {
             const generationPayload = { /* ... construct payload ... */
                destination: finalTripData.destinationCity || finalTripData.destination,
                days: finalTripData.duration > 0 ? finalTripData.duration : null,
                budget: typeof finalTripData.budget === 'string' && !isNaN(parseFloat(finalTripData.budget)) 
                     ? parseFloat(finalTripData.budget) 
                     : finalTripData.budgetLevel || finalTripData.budget,
                interests: finalTripData.interests,
                userCountry: finalTripData.nationality,
                travelDates: (finalTripData.startDate && finalTripData.endDate) ? `${finalTripData.startDate} to ${finalTripData.endDate}` : (finalTripData.month && finalTripData.year) ? `${finalTripData.month} ${finalTripData.year}` : null,
                travelStyle: finalTripData.travelerStyle || finalTripData.travelStyle,
            };
             Object.keys(generationPayload).forEach(key => { const value = generationPayload[key]; if (value == null || (Array.isArray(value) && value.length === 0)) { delete generationPayload[key]; }});
             console.log("Sending to AI Generate:", JSON.stringify(generationPayload, null, 2));
             const aiData = await fetchWithTimeout(ENDPOINTS.GENERATE, { /* ... options ... */
                method: 'POST',
                timeout: API.AI_TIMEOUT || 120000,
                body: JSON.stringify(generationPayload),
             });
             console.log("Received from AI Generate:", aiData);
             if (aiData?.status === 'success' && aiData?.data?.itinerary) {
                 finalTripData.aiRecommendations = aiData.data.itinerary;
                 AI_RESPONSE.updatePlan(aiData.data.itinerary);
             } else {
                  console.warn("AI Generation response structure not as expected or indicates failure:", aiData);
                  throw new Error(aiData?.message || "AI generation failed or returned unexpected data.");
             }
        } catch (err) { /* ... handle AI error ... */
            console.warn('AI recommendations fetch failed:', err.message);
            finalTripData.aiGenerationFailed = true;
            finalTripData.aiRecommendations = null;
        }
        // --- Fetch Events ---
        safeOnLoadingMessageChange('Finding events near your destination...');
        const hasSpecificDateRange = typeof finalTripData.startDate === 'string' && finalTripData.startDate.includes('-') && typeof finalTripData.endDate === 'string' && finalTripData.endDate.includes('-');
        if (hasSpecificDateRange) {
             try { /* ... fetch events ... */
                 const eventsData = await fetchWithTimeout(ENDPOINTS.EVENTS, {
                     method: 'POST',
                     body: JSON.stringify({
                         location: finalTripData.destinationCity || finalTripData.destination,
                         startDate: `${finalTripData.startDate}T00:00:00Z`,
                         endDate: `${finalTripData.endDate}T23:59:59Z`,
                     }),
                 });
                 finalTripData.nearbyEvents = eventsData?._embedded?.events || eventsData?.events || [];
                 console.log('Nearby events fetched:', finalTripData.nearbyEvents.length);
             } catch (err) { /* ... handle event error ... */
                  console.warn('Events fetch failed:', err.message);
                  finalTripData.nearbyEvents = [];
             }
        } else { /* ... skip events ... */
              console.log('Skipping event fetch due to missing specific date range.');
              finalTripData.nearbyEvents = [];
        }
        // --- Finalize ---
        console.log('Final trip data prepared:', JSON.stringify(finalTripData, null, 2));
        safeOnSuccess(finalTripData);
        return finalTripData;
    } catch (err) { /* ... handle overall error ... */
        console.error('Error in createTrip orchestration:', err);
        safeOnError(err.message || 'An unknown error occurred during trip creation.');
        return null;
    } finally {
        safeOnLoadingChange(false);
    }
};

// ---> ADD THIS FUNCTION BACK <---
export const getTrips = async ({ page = 1, limit = 10, filter = 'all', sort = 'date', search = '' }) => {
    try {
        // Build query params robustly
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (filter && filter !== 'all') {
            params.append('status', filter); // Assuming backend uses 'status' for filtering
        }
        if (sort) {
            // Adjust key based on backend expectation (e.g., 'createdAt', 'destinationName')
            const sortKey = sort === 'date' ? 'created_at' : 'destination'; // Example backend keys
            params.append('sortBy', sortKey);
            params.append('sortOrder', sort === 'date' ? 'desc' : 'asc'); // Example sort order
        }
        if (search && search.trim() !== '') {
            params.append('search', search.trim());
        }

        const endpointWithParams = `${ENDPOINTS.TRIPS}?${params.toString()}`;

        // Call fetchWithTimeout (defined above in this file)
        const response = await fetchWithTimeout(endpointWithParams, { method: 'GET' });

        // Assuming backend returns { status: 'success', data: [...], pagination: {...} }
        if (response && response.status === 'success' && Array.isArray(response.data)) {
            return {
                data: response.data,
                pagination: response.pagination // Pass pagination info if backend provides it
            };
        } else {
            console.warn("Invalid response structure from getTrips:", response);
            // Return empty state rather than throwing error unless API failure is confirmed
            return { data: [], pagination: null };
        }
    } catch (error) {
        console.error('Error fetching trips from service:', error);
        // Re-throw or return an error structure
        throw new Error(`Failed to fetch trips: ${error.message}`);
    }
};

// ---> UPDATE EXPORTS <---
// Make sure to export all functions needed by other parts of the app
// export {
//   createTrip,
//   WorkspaceVisaInfo,
//   WorkspaceCultureInsights,
//   getTrips // Add getTrips here
//   // Add getTripById, updateTrip etc. if they exist and are needed
// };
// OR export individually if preferred (shown above with export keyword)