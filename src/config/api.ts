import axios from "axios";
export const BASE_URL = import.meta.env.VITE_API_URL || "http://212.95.33.158/api/v1";
export const api = axios.create({ baseURL: BASE_URL, headers: { "Content-Type": "application/json" }, timeout: 60000 });
let isRefreshing = false;
let failedQueue: any[] = [];
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token))); failedQueue = [];
};
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
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
  if (error.response?.status === 401 && !original._retry) {
    const refresh = localStorage.getItem("refresh_token");
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
