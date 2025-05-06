import { apiClient, getErrorMessage } from "./apiClient";
import { AI_RESPONSE } from "../config/AiResponse";
import { Platform } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../../AuthProvider";
import { v4 as uuid } from "uuid"; 

export const getTrips = async ({
  page = 1,
  limit = 10,
  filter = "all",
  sort = "date",
  search = "",
  user_id,
} = {}) => {
  try {
    console.log("[getTrips] Fetching trips:", {
      page,
      limit,
      filter,
      sort,
      search,
      user_id,
    });

    const response = await apiClient.getTrips({
      page,
      limit,
      filter,
      sort,
      search,
      user_id,
    });

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

export const getVisaInfo = async (nationality, destination) => {
};

export const getCultureInsights = async (destination) => {
};

export const getCurrencyInfo = async (destination) => {
};

export const getHealthInfo = async (destination) => {
};

export const getTransportationInfo = async (destination) => {
};

export const getLanguageInfo = async (destination) => {
};

export const createTrip = async (tripData, callbacks = {}) => {
  const { onLoadingChange, onLoadingMessageChange, onError } = callbacks;
  
  const TIMEOUT = 130000; 
  const enrichedTripData = {
    ...tripData,
    user_id: tripData.user_id?.startsWith("guest-")
      ? tripData.user_id 
      : tripData.user_id, 
  };

  try {
    console.log("[tripService] Starting request...");
    const startTime = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    const response = await fetch(
      `${apiClient.config.mcpUrl}/api/trips/generate`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Connection: "keep-alive",
          "Keep-Alive": "timeout=130",
        },
        body: JSON.stringify(tripData),
        signal: controller.signal,
        keepalive: true,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      "[tripService] Response received after",
      Date.now() - startTime,
      "ms"
    );

    return data;
  } catch (error) {
    console.error("[tripService] Create trip error:", error);

    const errorMessage =
      error.name === "AbortError"
        ? "Request timed out after 130 seconds"
        : error.message;

    onError?.({ ...error, message: errorMessage });
    throw error;
  } finally {
    onLoadingChange?.(false);
    onLoadingMessageChange?.("");
  }
};

export const WorkspaceVisaInfo = getVisaInfo;
export const WorkspaceCultureInsights = getCultureInsights;
export const WorkspaceCurrencyInfo = getCurrencyInfo;
export const WorkspaceHealthInfo = getHealthInfo;
export const WorkspaceTransportationInfo = getTransportationInfo;
export const WorkspaceLanguageInfo = getLanguageInfo;
