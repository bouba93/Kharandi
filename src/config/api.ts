import axios from "axios";
export const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://api.kharandi.gn/api/v1";

export function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("refresh_token");
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const deviceToken = localStorage.getItem('kharandi_device_token');
  if (deviceToken) {
    headers.set('X-Device-Token', deviceToken);
  }

  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If 401 Unauthorized, try refreshing token once if refresh token exists
  if (response.status === 401 && getRefreshToken() && localStorage.getItem("isGuest") !== "true") {
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: getRefreshToken() }),
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        if (data.access) {
          localStorage.setItem("access_token", data.access);
          if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
          headers.set("Authorization", `Bearer ${data.access}`);
          response = await fetch(url, {
            ...options,
            headers,
          });
        }
      } else {
        _logout();
      }
    } catch (e) {
      console.error("Token refresh error in fetchWithAuth:", e);
    }
  }

  return response;
}

export const api = axios.create({ baseURL: BASE_URL, headers: { "Content-Type": "application/json" }, timeout: 60000 });
let isRefreshing = false;
let failedQueue: any[] = [];
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token))); failedQueue = [];
};
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const deviceToken = localStorage.getItem('kharandi_device_token');
  if (deviceToken) {
    config.headers['X-Device-Token'] = deviceToken;
  }

  if (config.data instanceof FormData) delete config.headers["Content-Type"];
  return config;
});
api.interceptors.response.use(r => r, async (error) => {
  const original = error.config;
  if (error.response?.status === 401 && !original._retry && localStorage.getItem("isGuest") !== "true") {
    const refresh = getRefreshToken();
    if (!refresh) { _logout(); return Promise.reject(error); }
    if (isRefreshing) return new Promise((resolve, reject) => { failedQueue.push({ resolve, reject }); }).then(token => { original.headers.Authorization = `Bearer ${token}`; return api(original); });
    original._retry = true; isRefreshing = true;
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh });
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh || refresh);
      api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
      original.headers.Authorization = `Bearer ${data.access}`;
      processQueue(null, data.access); return api(original);
    } catch (e) { processQueue(e, null); _logout(); return Promise.reject(e); }
    finally { isRefreshing = false; }
  }
  return Promise.reject(error);
});
function _logout() {
  if (localStorage.getItem("isGuest") === "true") {
    return;
  }
  localStorage.removeItem("access_token"); 
  localStorage.removeItem("refresh_token");
  if (window.location.pathname !== "/login") window.location.href = "/login";
}
