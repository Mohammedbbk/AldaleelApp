import { apiClient, getErrorMessage } from "./apiClient";
import { AI_RESPONSE } from "../config/AiResponse";

// --- Service Function: Get Trips ---
export const getTrips = async ({
  page = 1,
  limit = 10,
  filter = "all",
  sort = "date",
  search = "",
} = {}) => {
  try {
    console.log("[getTrips] Fetching trips:", {
      page,
      limit,
      filter,
      sort,
      search,
    });

    const response = await apiClient.getTrips({
      page,
      limit,
      filter,
      sort,
      search,
    });

    // Ensure we have the expected data structure
    if (!response || !response.data) {
      throw new Error("Invalid response format from server");
    }

    return {
      data: Array.isArray(response.data) ? response.data : [],
      pagination: response.pagination || {
        currentPage: page,
        totalPages: 1,
        totalItems: 0,
      },
    };
  } catch (error) {
    console.error("[getTrips] Error:", error);
    throw new Error(`Failed to fetch trips: ${getErrorMessage(error)}`);
  }
};

// --- Service Function: Fetch Visa Info ---
export const getVisaInfo = async (nationality, destination) => {
  // ...existing code...
};

// --- Service Function: Fetch Culture Insights ---
export const getCultureInsights = async (destination) => {
  // ...existing code...
};

// --- Service Function: Fetch Currency Info ---
export const getCurrencyInfo = async (destination) => {
  // ...existing code...
};

// --- Service Function: Fetch Health Info ---
export const getHealthInfo = async (destination) => {
  // ...existing code...
};

// --- Service Function: Fetch Transportation Info ---
export const getTransportationInfo = async (destination) => {
  // ...existing code...
};

// --- Service Function: Fetch Language Info ---
export const getLanguageInfo = async (destination) => {
  // ...existing code...
};

// --- Service Function: Create Trip ---
export const createTrip = async (tripData, callbacks = {}) => {
  const { onLoadingChange, onLoadingMessageChange, onError } = callbacks;

  try {
    console.log("[tripService] Creating trip with data:", tripData);
    onLoadingChange?.(true);

    // First call MCP to generate AI content
    onLoadingMessageChange?.("Generating your personalized itinerary...");
    const mcpResponse = await apiClient.post("/mcp/api/trips/generate", {
      body: tripData,
    });

    if (!mcpResponse?.data) {
      throw new Error("Failed to generate trip content");
    }

    // Then save trip with generated content to backend
    onLoadingMessageChange?.("Saving your trip...");
    const response = await apiClient.post("/api/trips", {
      body: {
        ...tripData,
        status: "planning",
        itinerary: mcpResponse.data,
      },
    });

    console.log("[tripService] Trip created:", response);
    return response.data;
  } catch (error) {
    console.error("[tripService] Create trip error:", error);
    onError?.(error);
    throw error;
  } finally {
    onLoadingChange?.(false);
    onLoadingMessageChange?.("");
  }
};

// Export legacy names for backward compatibility
export const WorkspaceVisaInfo = getVisaInfo;
export const WorkspaceCultureInsights = getCultureInsights;
export const WorkspaceCurrencyInfo = getCurrencyInfo;
export const WorkspaceHealthInfo = getHealthInfo;
export const WorkspaceTransportationInfo = getTransportationInfo;
export const WorkspaceLanguageInfo = getLanguageInfo;
