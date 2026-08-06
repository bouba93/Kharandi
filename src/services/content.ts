import { api } from "../config/api";
import { MOCK_SCHOLARSHIPS, MOCK_STUDY_ABROAD } from "../data/mockData";

export const getNews = async () => {
  try { const { data } = await api.get("/content/news/"); return data?.data || []; }
  catch { return []; }
};
export const getSchoolRankings = async () => {
  try { const { data } = await api.get("/content/school-rankings/"); return data?.data || []; }
  catch { return []; }
};
export const getStudyAbroad = async () => {
  try { 
    const { data } = await api.get("/content/study-abroad/"); 
    const list = data?.data || [];
    return list.length ? list : MOCK_STUDY_ABROAD;
  }
  catch { 
    return MOCK_STUDY_ABROAD; 
  }
};
export const getScholarships = async () => {
  try { 
    const { data } = await api.get("/content/scholarships/"); 
    const list = data?.data || [];
    return list.length ? list : MOCK_SCHOLARSHIPS; 
  }
  catch { 
    return MOCK_SCHOLARSHIPS; 
  }
};
export const getResults = async () => {
  try {
    const { data } = await api.get("/content/news/");
    const all = data?.data || [];
    return all.filter((n: any) => ['exam','résultat','BAC','BEPC'].includes(n.category));
  } catch { return []; }
};
export const getTutorAds       = async (f?: any) => { const p = new URLSearchParams(f||{}); const { data } = await api.get(`/content/tutor-ads/?${p}`); return data?.data || []; };
export const createTutorAd     = async (payload: any) => { const { data } = await api.post("/content/tutor-ads/", payload); return data?.data; };
export const deleteTutorAd     = (id: string) => api.delete(`/content/tutor-ads/${id}/`);
export const getNotifications  = async () => { const { data } = await api.get("/content/notifications/"); return data?.data || []; };
export const markAllRead       = () => api.post("/content/notifications/read/");
export const markOneRead       = (id: string) => api.post(`/content/notifications/${id}/read/`);
export const getReadingProgress  = async (docId: string) => { const { data } = await api.get(`/content/reading-progress/${docId}/`); return data?.data || { progress: 0, is_read: false }; };
export const saveReadingProgress = async (docId: string, progress: number, isRead = false) => { const { data } = await api.post(`/content/reading-progress/${docId}/`, { progress, is_read: isRead }); return data?.data; };
