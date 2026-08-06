/**
 * services/ecole.ts — Kharandi École (Django API + Robust Demo router)
 */
import { api } from "../config/api";

const BASE = "/ecole";

// ─── Initialisation de la base de démonstration locale ───────────────────
export const initDemoStorage = () => {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem('kharandi_demo_initialized')) {
    localStorage.setItem('kharandi_demo_students', JSON.stringify([
      { id: 'demo_s1', name: 'Mamadou Diallo', matricule: 'KHA-DEMO-MAMA', classe: 'Terminal SSE', parent_phone: '+224626187117' },
      { id: 'demo_s2', name: 'Fatoumata Barry', matricule: 'KHA-DEMO-FATO', classe: '9ème Année', parent_phone: '+224625514112' },
      { id: 'demo_s3', name: 'Abdoulaye Soumah', matricule: 'KHA-DEMO-ABDO', classe: 'Terminal SM', parent_phone: '+224622998877' }
    ]));
    localStorage.setItem('kharandi_demo_teachers', JSON.stringify([
      { id: 'demo_t1', name: 'M. Camara (Maths)', email: 'camara@demo.gn', classes: ['Terminal SSE', 'Terminal SM'] },
      { id: 'demo_t2', name: 'Mme. Condé (Français)', email: 'conde@demo.gn', classes: ['9ème Année'] }
    ]));
    localStorage.setItem('kharandi_demo_grades', JSON.stringify([
      { id: 'demo_g1', student_id: 'demo_s1', subject: 'Mathématiques', value: 16.5, trimester: 'T1', comment: 'Excellent travail' },
      { id: 'demo_g2', student_id: 'demo_s1', subject: 'Histoire-Géo', value: 12.0, trimester: 'T1', comment: 'Assez bien' },
      { id: 'demo_g3', student_id: 'demo_s2', subject: 'Mathématiques', value: 14.0, trimester: 'T1', comment: 'Bonne participation' }
    ]));
    localStorage.setItem('kharandi_demo_payments', JSON.stringify([
      { id: 'demo_p1', student_id: 'demo_s1', label: 'Inscription', amount: 150000, is_paid: true },
      { id: 'demo_p2', student_id: 'demo_s1', label: 'Scolarité Trimestre 1', amount: 300000, is_paid: true },
      { id: 'demo_p3', student_id: 'demo_s1', label: 'Scolarité Trimestre 2', amount: 300000, is_paid: false }
    ]));
    localStorage.setItem('kharandi_demo_absences', JSON.stringify([
      { id: 'demo_a1', student_id: 'demo_s1', date: '2026-05-12', subject: 'Physique', justified: true },
      { id: 'demo_a2', student_id: 'demo_s1', date: '2026-06-02', subject: 'Philosophie', justified: false }
    ]));
    localStorage.setItem('kharandi_demo_classes', JSON.stringify([
      { id: 'demo_c1', name: '7ème Année' },
      { id: 'demo_c2', name: '8ème Année' },
      { id: 'demo_c3', name: '9ème Année' },
      { id: 'demo_c4', name: 'Terminal SSE' },
      { id: 'demo_c5', name: 'Terminal SM' }
    ]));
    localStorage.setItem('kharandi_demo_initialized', 'true');
  }
};

// ─── Activation école ─────────────────────────────────────────────────────
export const verifyActivationCode = async (code: string, email: string) => {
  if (code.toUpperCase().includes('DEMO')) {
    return { school_name: "Complexe Scolaire Kharandi (Démo)", email };
  }
  const { data } = await api.post(`${BASE}/activate/`, { code, email });
  return data?.data;
};
export const finalizeActivation = async (code: string, email: string, password: string) => {
  if (code.toUpperCase().includes('DEMO')) {
    initDemoStorage();
    return { success: true };
  }
  const { data } = await api.post(`${BASE}/activate/`, { code, email, password });
  return data?.data;
};

// ─── Connexions ───────────────────────────────────────────────────────────
export const schoolLogin = async (email: string, password: string) => {
  if (email.toLowerCase() === 'demo@kharandi.com' || email.toLowerCase() === 'demo@ecole.gn') {
    initDemoStorage();
    return {
      profile: {
        id: 'demo_school',
        name: 'Complexe Scolaire Kharandi (Démo)',
        type: 'school'
      }
    };
  }
  const { data } = await api.post(`${BASE}/login/`, { email, password });
  return data?.data;
};
export const teacherLogin = async (email: string, password: string) => {
  if (email.toLowerCase() === 'camara@demo.gn') {
    initDemoStorage();
    return {
      profile: {
        id: 'demo_teacher',
        school_id: 'demo_school',
        name: 'M. Camara (Maths)',
        email: 'camara@demo.gn',
        type: 'teacher'
      }
    };
  }
  const { data } = await api.post(`${BASE}/teacher/login/`, { email, password });
  return data?.data;
};
export const parentLookup = async (matricule: string) => {
  const normMatricule = matricule.trim().toUpperCase();
  if (normMatricule === 'KHA-DEMO-MAMA' || normMatricule.includes('DEMO')) {
    initDemoStorage();
    const studentsList = JSON.parse(localStorage.getItem('kharandi_demo_students') || '[]');
    const student = studentsList.find((s: any) => s.matricule === normMatricule) || studentsList[0];
    const grades = JSON.parse(localStorage.getItem('kharandi_demo_grades') || '[]').filter((g: any) => g.student_id === student.id);
    const payments = JSON.parse(localStorage.getItem('kharandi_demo_payments') || '[]').filter((p: any) => p.student_id === student.id);
    const absences = JSON.parse(localStorage.getItem('kharandi_demo_absences') || '[]').filter((a: any) => a.student_id === student.id);
    return {
      student,
      grades,
      payments,
      absences,
      school: { name: 'Complexe Scolaire Kharandi (Démo)' }
    };
  }
  const { data } = await api.get(`${BASE}/parent/${matricule}/`);
  return data?.data;
};

// ─── Élèves ───────────────────────────────────────────────────────────────
export const getStudents = async (schoolId: string) => {
  if (schoolId === 'demo_school') {
    initDemoStorage();
    return JSON.parse(localStorage.getItem('kharandi_demo_students') || '[]');
  }
  const { data } = await api.get(`${BASE}/schools/${schoolId}/students/`);
  return data?.data || [];
};
export const addStudent = async (schoolId: string, payload: any) => {
  if (schoolId === 'demo_school') {
    initDemoStorage();
    const list = JSON.parse(localStorage.getItem('kharandi_demo_students') || '[]');
    const newStudentObj = {
      id: `demo_s_${Date.now()}`,
      name: payload.name,
      matricule: `KHA-DEMO-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      classe: payload.classe,
      parent_phone: payload.parent_phone
    };
    list.unshift(newStudentObj);
    localStorage.setItem('kharandi_demo_students', JSON.stringify(list));
    return newStudentObj;
  }
  const { data } = await api.post(`${BASE}/schools/${schoolId}/students/`, payload);
  return data?.data;
};
export const updateStudent = async (id: string, payload: any) => {
  if (id.startsWith('demo_')) {
    initDemoStorage();
    const list = JSON.parse(localStorage.getItem('kharandi_demo_students') || '[]');
    const idx = list.findIndex((s: any) => s.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...payload };
      localStorage.setItem('kharandi_demo_students', JSON.stringify(list));
      return list[idx];
    }
  }
  const { data } = await api.patch(`${BASE}/students/${id}/`, payload);
  return data?.data;
};
export const deleteStudent = async (id: string) => {
  if (id.startsWith('demo_')) {
    initDemoStorage();
    // 1. Delete student
    const list = JSON.parse(localStorage.getItem('kharandi_demo_students') || '[]');
    const filtered = list.filter((s: any) => s.id !== id);
    localStorage.setItem('kharandi_demo_students', JSON.stringify(filtered));

    // 2. Cascade delete student's grades
    const grades = JSON.parse(localStorage.getItem('kharandi_demo_grades') || '[]');
    const filteredGrades = grades.filter((g: any) => g.student_id !== id);
    localStorage.setItem('kharandi_demo_grades', JSON.stringify(filteredGrades));

    // 3. Cascade delete student's payments
    const payments = JSON.parse(localStorage.getItem('kharandi_demo_payments') || '[]');
    const filteredPayments = payments.filter((p: any) => p.student_id !== id);
    localStorage.setItem('kharandi_demo_payments', JSON.stringify(filteredPayments));

    // 4. Cascade delete student's absences
    const absences = JSON.parse(localStorage.getItem('kharandi_demo_absences') || '[]');
    const filteredAbsences = absences.filter((a: any) => a.student_id !== id);
    localStorage.setItem('kharandi_demo_absences', JSON.stringify(filteredAbsences));

    // 5. Cascade delete student's badges
    const badges = JSON.parse(localStorage.getItem('kharandi_demo_badges') || '[]');
    const filteredBadges = badges.filter((b: any) => b.student_id !== id);
    localStorage.setItem('kharandi_demo_badges', JSON.stringify(filteredBadges));

    return { success: true };
  }
  return api.delete(`${BASE}/students/${id}/`);
};

// ─── Notes ────────────────────────────────────────────────────────────────
export const getGrades = async (params: { school_id?: string; student_id?: string } = {}) => {
  if (params.school_id === 'demo_school' || params.student_id?.startsWith('demo_')) {
    initDemoStorage();
    let grades = JSON.parse(localStorage.getItem('kharandi_demo_grades') || '[]');
    if (params.student_id) {
      grades = grades.filter((g: any) => g.student_id === params.student_id);
    }
    return grades;
  }
  const { data } = await api.get(`${BASE}/grades/`, { params });
  return data?.data || [];
};
export const addGrade = async (payload: any) => {
  if (payload.student_id?.startsWith('demo_')) {
    initDemoStorage();
    const list = JSON.parse(localStorage.getItem('kharandi_demo_grades') || '[]');
    const newGradeObj = {
      id: `demo_g_${Date.now()}`,
      student_id: payload.student_id,
      subject: payload.subject,
      value: parseFloat(payload.value),
      trimester: payload.trimester,
      comment: payload.comment
    };
    list.unshift(newGradeObj);
    localStorage.setItem('kharandi_demo_grades', JSON.stringify(list));
    return newGradeObj;
  }
  const { data } = await api.post(`${BASE}/grades/`, payload);
  return data?.data;
};

// ─── Paiements ────────────────────────────────────────────────────────────
export const getPayments = async (schoolId: string) => {
  if (schoolId === 'demo_school') {
    initDemoStorage();
    return JSON.parse(localStorage.getItem('kharandi_demo_payments') || '[]');
  }
  const { data } = await api.get(`${BASE}/payments/`, { params: { school_id: schoolId } });
  return data?.data || [];
};
export const addPayment = async (payload: any) => {
  if (payload.student_id?.startsWith('demo_')) {
    initDemoStorage();
    const list = JSON.parse(localStorage.getItem('kharandi_demo_payments') || '[]');
    const newPay = {
      id: `demo_p_${Date.now()}`,
      student_id: payload.student_id,
      label: payload.label,
      amount: parseInt(payload.amount),
      is_paid: false
    };
    list.unshift(newPay);
    localStorage.setItem('kharandi_demo_payments', JSON.stringify(list));
    return newPay;
  }
  const { data } = await api.post(`${BASE}/payments/`, payload);
  return data?.data;
};
export const markPaymentPaid = async (id: string) => {
  if (id.startsWith('demo_')) {
    initDemoStorage();
    const list = JSON.parse(localStorage.getItem('kharandi_demo_payments') || '[]');
    const idx = list.findIndex((p: any) => p.id === id);
    if (idx !== -1) {
      list[idx].is_paid = true;
      localStorage.setItem('kharandi_demo_payments', JSON.stringify(list));
      return list[idx];
    }
  }
  const { data } = await api.patch(`${BASE}/payments/${id}/`);
  return data?.data;
};

// ─── Absences ─────────────────────────────────────────────────────────────
export const getAbsences = async (schoolId: string) => {
  if (schoolId === 'demo_school') {
    initDemoStorage();
    return JSON.parse(localStorage.getItem('kharandi_demo_absences') || '[]');
  }
  const { data } = await api.get(`${BASE}/absences/`, { params: { school_id: schoolId } });
  return data?.data || [];
};
export const addAbsence = async (payload: any) => {
  if (payload.student_id?.startsWith('demo_')) {
    initDemoStorage();
    const list = JSON.parse(localStorage.getItem('kharandi_demo_absences') || '[]');
    const newAbsObj = {
      id: `demo_a_${Date.now()}`,
      student_id: payload.student_id,
      date: payload.date,
      subject: payload.subject,
      justified: payload.is_justified
    };
    list.unshift(newAbsObj);
    localStorage.setItem('kharandi_demo_absences', JSON.stringify(list));
    return newAbsObj;
  }
  const { data } = await api.post(`${BASE}/absences/`, payload);
  return data?.data;
};

// ─── Enseignants ──────────────────────────────────────────────────────────
export const getTeachers = async (schoolId: string) => {
  if (schoolId === 'demo_school') {
    initDemoStorage();
    return JSON.parse(localStorage.getItem('kharandi_demo_teachers') || '[]');
  }
  const { data } = await api.get(`${BASE}/teachers/`, { params: { school_id: schoolId } });
  return data?.data || [];
};
export const addTeacher = async (payload: any) => {
  if (payload.school_id === 'demo_school' || !payload.school_id) {
    initDemoStorage();
    const list = JSON.parse(localStorage.getItem('kharandi_demo_teachers') || '[]');
    const newTeacherObj = {
      id: `demo_t_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      classes: payload.classes ? payload.classes.split(',').map((c: string) => c.trim()) : []
    };
    list.unshift(newTeacherObj);
    localStorage.setItem('kharandi_demo_teachers', JSON.stringify(list));
    return newTeacherObj;
  }
  const { data } = await api.post(`${BASE}/teachers/`, payload);
  return data?.data;
};
export const deleteTeacher = async (id: string) => {
  if (id.startsWith('demo_')) {
    initDemoStorage();
    const list = JSON.parse(localStorage.getItem('kharandi_demo_teachers') || '[]');
    const filtered = list.filter((t: any) => t.id !== id);
    localStorage.setItem('kharandi_demo_teachers', JSON.stringify(filtered));
    return { success: true };
  }
  return api.delete(`${BASE}/teachers/${id}/`);
};

// ─── Classes ──────────────────────────────────────────────────────────────
export const getClasses = async (schoolId: string) => {
  if (schoolId === 'demo_school') {
    initDemoStorage();
    return JSON.parse(localStorage.getItem('kharandi_demo_classes') || '[]');
  }
  const { data } = await api.get(`${BASE}/classes/`, { params: { school_id: schoolId } });
  return data?.data || [];
};
export const addClass = async (schoolId: string, name: string) => {
  if (schoolId === 'demo_school') {
    initDemoStorage();
    const list = JSON.parse(localStorage.getItem('kharandi_demo_classes') || '[]');
    const newClassObj = {
      id: `demo_c_${Date.now()}`,
      name
    };
    list.push(newClassObj);
    localStorage.setItem('kharandi_demo_classes', JSON.stringify(list));
    return newClassObj;
  }
  const { data } = await api.post(`${BASE}/classes/`, { school_id: schoolId, name });
  return data?.data;
};
