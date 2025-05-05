import { ENDPOINTS } from "../config/constants";
import { Platform } from "react-native";

const DEFAULT_CONFIG = {
  baseUrl: Platform.select({
    android: "http://10.0.2.2:5000",
    ios: "http://localhost:5000",
  }),
  mcpUrl: Platform.select({
    android: "http://10.0.2.2:8000",
    ios: "http://localhost:8000",
  }),
  timeout: 130000, // 130 seconds
  retryAttempts: 3,
  retryDelay: 2000,
  androidEmulatorConfig: {
    keepAlive: true,
    headers: {
      Connection: "keep-alive",
    },
  },
};

export class ApiClient {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  shouldRetry(error) {
    // Don't retry on validation errors
    if (error.status >= 400 && error.status < 500) {
      return false;
    }

    return (
      // Retry on server errors
      error.status >= 500 ||
      // Retry on network errors
      !error.status ||
      // Retry on timeout
      error.message.includes("timeout") ||
      // Retry on JSON parsing errors
      error.message.includes("JSON") ||
      // Retry on non-JSON responses
      error.message.includes("non-JSON")
    );
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async handleResponse(response) {
    // Check content type first
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("[ApiClient] Received non-JSON response:", {
        status: response.status,
        contentType,
        url: response.url,
      });
      throw new Error("Server responded with non-JSON content");
    }

    const data = await response.json();

    if (!response.ok || data.status === "error") {
      console.error("[ApiClient] Error response:", {
        status: response.status,
        data: data,
      });

      const error = new Error(data.message || "Server error");
      error.code = data.code;
      error.status = response.status;
      error.details = data.details;
      throw error;
    }

    return data;
  }

  async retryRequest(url, options, attempt = 1) {
    try {
      const response = await this.makeRequest(url, options);
      return await this.handleResponse(response);
    } catch (error) {
      console.log(`[Retry Check - Attempt ${attempt}] Error details:`, {
        message: error.message,
        status: error.status,
        code: error.code,
      });

      const maxAttempts = options.retryAttempts || this.config.retryAttempts;

      if (attempt < maxAttempts && this.shouldRetry(error)) {
        const delay = Math.min(
          Math.pow(2, attempt) * this.config.retryDelay,
          30000
        );
        console.log(`[ApiClient] Retrying request in ${delay}ms...`);
        await this.delay(delay);
        return this.retryRequest(url, options, attempt + 1);
      }

      throw error;
    }
  }

  async makeRequest(url, options) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseUrl}${url}`, {
        ...options,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async post(url, { body, headers = {} } = {}) {
    const isMCP = url.startsWith("/mcp/");
    const baseUrl = isMCP ? this.config.mcpUrl : this.config.baseUrl;
    const finalUrl = isMCP ? url.replace("/mcp/", "/") : url;

    console.log("[ApiClient] Making POST request:", { url, body });

    try {
      const response = await fetch(`${baseUrl}${finalUrl}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Server error");
      }

      return data;
    } catch (error) {
      console.error("[ApiClient] POST request failed:", error);
      throw error;
    }
  }

  async getTrips({
    page = 1,
    limit = 10,
    filter = "all",
    sort = "date",
    search = "",
    user_id,
  } = {}) {
    console.log("[ApiClient] Fetching trips with params:", {
      page,
      limit,
      filter,
      sort,
      search,
      user_id,
    });

    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      filter,
      sort,
      search,
      user_id: user_id || "",
    }).toString();

    try {
      const response = await this.retryRequest(`/api/trips?${queryParams}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      // Additional response validation
      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format");
      }

      // Fixed: Backend returns trips directly in response.data, not in response.data.trips
      const trips = response.data || [];
      console.log("[ApiClient] Received trips:", trips);

      return {
        data: trips,
        pagination: response.pagination || {
          currentPage: page,
          totalPages: Math.ceil(trips.length / limit),
          totalItems: trips.length,
        },
      };
    } catch (error) {
      console.error("[ApiClient] Error fetching trips:", {
        message: error.message,
        status: error.status,
        response: error.response,
        stack: error.stack,
      });
      throw error;
    }
  }
}

export const apiClient = new ApiClient();

export function isApiError(error) {
  return error && error.code !== undefined;
}

export function getErrorMessage(error) {
  if (isApiError(error)) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
}

export function getRecoverySteps(error) {
  if (isApiError(error) && error.recoverySteps) {
    return error.recoverySteps;
  }
  return [
    "Please check your internet connection",
    "Try again in a few moments",
  ];
}
