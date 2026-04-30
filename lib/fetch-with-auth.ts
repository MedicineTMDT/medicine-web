import { API_BASE_URL, API_ENDPOINTS } from "./api.cofig";
import { tokenStorage } from "@/features/auth/data-access/auth.api";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: Response | PromiseLike<Response>) => void;
  reject: (reason?: any) => void;
  url: RequestInfo | URL;
  init?: RequestInit;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      const newInit = { ...prom.init };
      newInit.headers = {
        ...(newInit.headers as Record<string, string>),
        Authorization: `Bearer ${token}`,
      };
      prom.resolve(fetch(prom.url, newInit));
    }
  });
  failedQueue = [];
};

export async function fetchWithAuth(
  url: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  let response = await fetch(url, init);

  // Check for 401 Unauthorized
  if (response.status === 401) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, url, init });
      });
    }

    isRefreshing = true;
    const oldToken = tokenStorage.getToken();

    if (!oldToken) {
        isRefreshing = false;
        return response; // No token to refresh
    }

    try {
      const refreshResponse = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.INTROSPECT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: oldToken }),
        }
      );

      const refreshData = await refreshResponse.json();

      if (
        refreshResponse.ok &&
        refreshData.result?.valid &&
        refreshData.result?.token
      ) {
        const newToken = refreshData.result.token;
        tokenStorage.setToken(newToken);

        // Process existing queue
        processQueue(null, newToken);

        // Retry original request
        const newInit = { ...init };
        newInit.headers = {
          ...(newInit.headers as Record<string, string>),
          Authorization: `Bearer ${newToken}`,
        };
        return fetch(url, newInit);
      } else {
        // Refresh failed, clear token and reject
        tokenStorage.clearToken();
        processQueue(new Error("Refresh failed"));
        
        // Re-return the 401 so the UI can handle logout if necessary
        return response;
      }
    } catch (error) {
      processQueue(error);
      throw error;
    } finally {
      isRefreshing = false;
    }
  }

  return response;
}
