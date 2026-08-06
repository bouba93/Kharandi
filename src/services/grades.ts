import { api } from "../config/api.ts";
export const getGrades   = async () => { const { data } = await api.get("/grades/"); return data?.data || []; };
export const createGrade = async (payload: any) => { const { data } = await api.post("/grades/", payload); return data?.data; };
export const getStudents = async () => { const { data } = await api.get("/grades/students/"); return data?.data || []; };
