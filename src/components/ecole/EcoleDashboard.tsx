import React, { useState, useEffect } from 'react';
import {
  LogOut, Users, FileText, CreditCard, Plus, LayoutDashboard,
  GraduationCap, TrendingUp, Search, Download, Clock,
  ChevronRight, Loader2, Settings, Trash2, Edit3, School, BookOpen,
  Award, Calendar, DollarSign, BarChart3, PieChart as PieIcon, Activity, Printer, Info, Copy, CheckCircle2, AlertTriangle, Send,
  Megaphone, Bell, Shield, ArrowLeft, Receipt, QrCode, Wifi, Smartphone, Check, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  getStudents, addStudent, deleteStudent,
  getGrades, addGrade,
  getPayments, addPayment, markPaymentPaid,
  getAbsences, addAbsence,
  getTeachers, addTeacher, deleteTeacher,
  getClasses, addClass,
} from '../../services/ecole';

type Tab = 'home' | 'overview' | 'students' | 'grades' | 'bulletins' | 'schedule' | 'finance' | 'payments' | 'facturation' | 'absences' | 'teachers' | 'announcements' | 'badges';

export const EcoleDashboard: React.FC<{
  profile:   any;
  onLogout?: () => void;
}> = ({ profile, onLogout }) => {
  const isTeacher   = profile?.type === 'teacher' || profile?.role === 'teacher';
  const schoolId    = profile?.id || profile?.school_id;
  const schoolName  = profile?.name || 'Mon école';

  const [tab,        setTab]        = useState<Tab>('home');
  const [students,   setStudents]   = useState<any[]>([]);
  const [grades,     setGrades]     = useState<any[]>([]);
  const [payments,   setPayments]   = useState<any[]>([]);
  const [absences,   setAbsences]   = useState<any[]>([]);
  const [teachers,   setTeachers]   = useState<any[]>([]);
  const [classes,    setClasses]    = useState<any[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [search,     setSearch]     = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Local static accounting and scheduling elements
  const [expenses,   setExpenses]   = useState<any[]>([]);
  const [schedules,  setSchedules]  = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  
  // Custom finance and schedule additions
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);

  const [newExpense, setNewExpense] = useState({ label: '', amount: '', category: 'Salaires', date: new Date().toISOString().split('T')[0] });
  const [newScheduleObj, setNewScheduleObj] = useState({ classe: '', day: 'Lundi', time: '08h - 10h', subject: '', teacher: '' });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', category: 'Information', className: 'Toutes les classes' });

  // Formulaires
  const [showAddStudent,  setShowAddStudent]  = useState(false);
  const [showAddGrade,    setShowAddGrade]    = useState(false);
  const [showAddPayment,  setShowAddPayment]  = useState(false);
  const [showAddAbsence,  setShowAddAbsence]  = useState(false);
  const [showAddTeacher,  setShowAddTeacher]  = useState(false);

  const [newStudent,  setNewStudent]  = useState({ name: '', classe: '', parent_phone: '' });
  const [newGrade,    setNewGrade]    = useState({ student_id: '', subject: '', value: '', trimester: 'T1', comment: '' });
  const [newPayment,  setNewPayment]  = useState({ student_id: '', label: 'Scolarité T1', amount: '' });
  const [newAbsence,  setNewAbsence]  = useState({ student_id: '', date: new Date().toISOString().split('T')[0], subject: '', is_justified: false });
  const [newTeacher,  setNewTeacher]  = useState({ name: '', email: '', password: 'kharandi2026', classes: '' });

  // Bulletin selection states
  const [bulletinStudent, setBulletinStudent] = useState<string>('');
  const [bulletinTrimester, setBulletinTrimester] = useState<string>('T1');
  const [activeBulletinRef, setActiveBulletinRef] = useState<any | null>(null);

  // Facturation & Reçus State
  const [invoices, setInvoices] = useState<any[]>([]);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<any | null>(null);
  const [newInvoice, setNewInvoice] = useState({
    student_id: '',
    type: 'Frais de Scolarité - Tranche 1',
    amount: '1500000',
    discount: '0',
    date: new Date().toISOString().split('T')[0],
    due_date: new Date().toISOString().split('T')[0],
    payment_method: 'Orange Money',
    status: 'Payé',
    notes: 'Règlement effectué au guichet de la comptabilité Kharandi.'
  });

  // Badge Builder states (Carte Scolaire, Insigne de Mérite)
  const [hasBadgesOption, setHasBadgesOption] = useState<boolean>(() => localStorage.getItem('kharandi_demo_school_badges_option_unlocked') === 'true');
  const [schoolBadges, setSchoolBadges] = useState<any[]>([]);
  const [showAddBadgeSetting, setShowAddBadgeSetting] = useState(false);
  const [selectedBadgeForPrint, setSelectedBadgeForPrint] = useState<any | null>(null);
  const [newBadge, setNewBadge] = useState({
    badge_type: 'carte_scolaire', // 'carte_scolaire' | 'merite'
    student_id: '',
    nom: '',
    prenom: '',
    classe: '',
    phone: '',
    matricule: '',
    photo_url: '',
    role_or_section: 'Élève Régulier',
    blood_group: 'O+',
    title: 'Carte d\'Identité Scolaire 2025-2026',
    category: 'Cyan',
    message: 'Carte officielle d\'étudiant et badge NFC sans contact.',
    signatory: isTeacher ? profile.name : 'Le Principal',
    nfc_code: 'NFC-2026-88A9-42B1',
    nfc_active: true
  });

  // Load accounting or timetable if exists
  const loadAll = async () => {
    if (!schoolId) return;
    setLoading(true);

    const fetchSafe = async <T,>(promise: Promise<T>, fallback: T, resourceName: string): Promise<T> => {
      try {
        return await promise;
      } catch (err) {
        console.error(`[Resilience] Failed to fetch ${resourceName}, using fallback default:`, err);
        return fallback;
      }
    };

    try {
      const [s, g, p, a, t, c] = await Promise.all([
        fetchSafe(getStudents(schoolId), [], 'students'),
        fetchSafe(getGrades({ school_id: schoolId }), [], 'grades'),
        fetchSafe(getPayments(schoolId), [], 'payments'),
        fetchSafe(getAbsences(schoolId), [], 'absences'),
        fetchSafe(getTeachers(schoolId), [], 'teachers'),
        fetchSafe(getClasses(schoolId), [], 'classes'),
      ]);
      setStudents(s); setGrades(g); setPayments(p);
      setAbsences(a); setTeachers(t); setClasses(c);

      // Load badges
      const storedBadgesStr = localStorage.getItem('kharandi_demo_badges');
      if (storedBadgesStr) {
        setSchoolBadges(JSON.parse(storedBadgesStr));
      } else {
        const initialBadges = [
          {
            id: 'b_1',
            badge_type: 'carte_scolaire',
            student_id: s[0]?.id || 'demo_s1',
            student_name: s[0]?.name || 'Diallo Ousmane',
            nom: 'DIALLO',
            prenom: 'Ousmane',
            classe: s[0]?.classe || 'Terminal SSE',
            phone: s[0]?.parent_phone || '+224 622 11 22 33',
            matricule: s[0]?.matricule || 'KHR-2026-001',
            photo_url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=200',
            role_or_section: 'Élève Régulier',
            blood_group: 'O+',
            title: 'Carte d\'Identité Scolaire Officielle',
            category: 'Cyan',
            message: 'Badge d\'accès NFC sans contact & Carte scolaire officielle 2025-2026.',
            date: new Date().toISOString().split('T')[0],
            signatory: "La Direction Académique",
            nfc_code: 'NFC-2026-88A9-42B1',
            nfc_active: true
          },
          {
            id: 'b_2',
            badge_type: 'carte_scolaire',
            student_id: s[1]?.id || 'demo_s2',
            student_name: s[1]?.name || 'Sow Aminata',
            nom: 'SOW',
            prenom: 'Aminata',
            classe: s[1]?.classe || 'Terminal SM',
            phone: s[1]?.parent_phone || '+224 620 44 55 66',
            matricule: s[1]?.matricule || 'KHR-2026-002',
            photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
            role_or_section: 'Élève Régulière',
            blood_group: 'A+',
            title: 'Carte d\'Identité Scolaire Officielle',
            category: 'Emerald',
            message: 'Badge d\'accès NFC sans contact & Carte scolaire officielle 2025-2026.',
            date: new Date().toISOString().split('T')[0],
            signatory: "La Direction Académique",
            nfc_code: 'NFC-2026-99C4-12F8',
            nfc_active: true
          },
          {
            id: 'b_3',
            badge_type: 'merite',
            student_id: s[0]?.id || 'demo_s1',
            student_name: s[0]?.name || 'Diallo Ousmane',
            nom: 'DIALLO',
            prenom: 'Ousmane',
            classe: s[0]?.classe || 'Terminal SSE',
            phone: s[0]?.parent_phone || '+224 622 11 22 33',
            matricule: s[0]?.matricule || 'KHR-2026-001',
            photo_url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=200',
            role_or_section: 'Élève Récipiendaire',
            blood_group: 'O+',
            title: 'Étoile de Kharandi - Grand Mérite',
            category: 'Gold',
            message: 'Félicitations chaleureuses pour des résultats exceptionnels et une attitude de travail exemplaire tout au long du trimestre.',
            date: new Date().toISOString().split('T')[0],
            signatory: "La Direction de l'Établissement",
            nfc_code: 'NFC-2026-88A9-42B1',
            nfc_active: true
          }
        ];
        localStorage.setItem('kharandi_demo_badges', JSON.stringify(initialBadges));
        setSchoolBadges(initialBadges);
      }

      // Initialize sample invoices for Facturation
      if (!localStorage.getItem('kharandi_demo_invoices')) {
        localStorage.setItem('kharandi_demo_invoices', JSON.stringify([
          {
            id: 'fac_1',
            invoice_number: 'FAC-2026-001',
            student_id: s[0]?.id || 'demo_s1',
            student_name: s[0]?.name || 'Diallo Ousmane',
            matricule: s[0]?.matricule || 'KHR-2026-001',
            classe: s[0]?.classe || 'Terminal SSE',
            type: 'Frais de Scolarité - Tranche 1',
            amount: 1500000,
            discount: 0,
            net_amount: 1500000,
            date: '2026-06-01',
            due_date: '2026-06-15',
            payment_method: 'Orange Money',
            status: 'Payé',
            notes: 'Paiement intégral de la 1ère tranche validé au guichet comptabilité Kharandi.'
          },
          {
            id: 'fac_2',
            invoice_number: 'FAC-2026-002',
            student_id: s[1]?.id || 'demo_s2',
            student_name: s[1]?.name || 'Sow Aminata',
            matricule: s[1]?.matricule || 'KHR-2026-002',
            classe: s[1]?.classe || 'Terminal SM',
            type: 'Frais de Scolarité - Tranche 1',
            amount: 1500000,
            discount: 100000,
            net_amount: 1400000,
            date: '2026-06-03',
            due_date: '2026-06-15',
            payment_method: 'Espèces',
            status: 'Payé',
            notes: 'Remise familiale accordée de 100 000 GNF par la direction.'
          },
          {
            id: 'fac_3',
            invoice_number: 'FAC-2026-003',
            student_id: s[2]?.id || 'demo_s3',
            student_name: s[2]?.name || 'Camara Ibrahima',
            matricule: s[2]?.matricule || 'KHR-2026-003',
            classe: s[2]?.classe || '9ème Année',
            type: 'Tenue & Uniforme Scolaire',
            amount: 250000,
            discount: 0,
            net_amount: 250000,
            date: '2026-06-10',
            due_date: '2026-06-20',
            payment_method: 'Mobile Money',
            status: 'En attente',
            notes: 'Lot de 2 tenues réglementaires Kharandi + badge d\'accès d\'élève.'
          }
        ]));
      }

      // Initialize sample expenses
      if (!localStorage.getItem('kharandi_demo_expenses')) {
        localStorage.setItem('kharandi_demo_expenses', JSON.stringify([
          { id: 'exp_1', label: 'Rémunération enseignants contractuels', amount: 3500000, date: '2026-06-05', category: 'Salaires' },
          { id: 'exp_2', label: 'Achat de fournitures, craies et registres', amount: 340000, date: '2026-06-08', category: 'Matériels' },
          { id: 'exp_3', label: 'Maintenance climatisation et électricité', amount: 750000, date: '2026-06-12', category: 'Maintenance' },
          { id: 'exp_4', label: 'Facture d\'eau et électricité (EDG)', amount: 480000, date: '2026-06-14', category: 'Charges fixes' }
        ]));
      }
      // Initialize sample schedules
      if (!localStorage.getItem('kharandi_demo_schedules')) {
        localStorage.setItem('kharandi_demo_schedules', JSON.stringify([
          { id: 'sch_1', classe: 'Terminal SSE', day: 'Lundi', time: '08h - 10h', subject: 'Mathématiques', teacher: 'M. Camara' },
          { id: 'sch_2', classe: 'Terminal SSE', day: 'Lundi', time: '10h - 12h', subject: 'Physique-Chimie', teacher: 'M. Barry' },
          { id: 'sch_3', classe: 'Terminal SSE', day: 'Mardi', time: '10h - 12h', subject: 'Français', teacher: 'Mme. Condé' },
          { id: 'sch_4', classe: 'Terminal SSE', day: 'Mercredi', time: '08h - 10h', subject: 'Anglais', teacher: 'M. Sow' },
          { id: 'sch_5', classe: 'Terminal SSE', day: 'Jeudi', time: '14h - 16h', subject: 'Histoire-Géo', teacher: 'Mme. Condé' },
          { id: 'sch_6', classe: 'Terminal SM', day: 'Lundi', time: '08h - 10h', subject: 'Physique-Chimie', teacher: 'M. Barry' },
          { id: 'sch_7', classe: 'Terminal SM', day: 'Mardi', time: '10h - 12h', subject: 'Mathématiques', teacher: 'M. Camara' },
          { id: 'sch_8', classe: '9ème Année', day: 'Lundi', time: '10h - 12h', subject: 'Français', teacher: 'Mme. Condé' },
          { id: 'sch_9', classe: '9ème Année', day: 'Mardi', time: '08h - 10h', subject: 'Mathématiques', teacher: 'M. Diallo' }
        ]));
      }
      // Initialize sample announcements
      if (!localStorage.getItem('kharandi_demo_announcements')) {
        localStorage.setItem('kharandi_demo_announcements', JSON.stringify([
          {
            id: 'ann_1',
            title: "Examen blanc du 1er Semestre",
            content: "Le premier examen blanc régional aura lieu le lundi 22 juin dès 8h00. Les élèves de toutes les classes d'examen doivent se présenter munis de leur carte scolaire.",
            category: "Information",
            date: "2026-06-15",
            className: "Toutes les classes",
            author: "La Direction"
          },
          {
            id: 'ann_2',
            title: "Devoir à rendre en Mathématiques",
            content: "Sujet d'algèbre générale : Résoudre la série d'exercices n°4 distribuée en cours. À remettre sur copie propre lors du prochain cours hebdomadaire.",
            category: "Devoir",
            date: "2026-06-14",
            className: "Terminal SSE",
            author: "M. Camara"
          },
          {
            id: 'ann_3',
            title: "Réunion générale parents-enseignants",
            content: "Chers parents d'élèves, vous êtes conviés le samedi 27 juin à 10h00 dans la grande salle d'études pour faire le point sur la progression trimestrielle.",
            category: "Information",
            date: "2026-06-12",
            className: "Toutes les classes",
            author: "Le Principal"
          }
        ]));
      }

      setExpenses(JSON.parse(localStorage.getItem('kharandi_demo_expenses') || '[]'));
      setSchedules(JSON.parse(localStorage.getItem('kharandi_demo_schedules') || '[]'));
      setAnnouncements(JSON.parse(localStorage.getItem('kharandi_demo_announcements') || '[]'));
      setInvoices(JSON.parse(localStorage.getItem('kharandi_demo_invoices') || '[]'));
    } catch (err) {
      toast.error("Erreur de chargement des données.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, [schoolId]);

  const tabs: { id: Tab; label: string; icon: any; teacherOnly?: boolean }[] = (
    [
      { id: 'home',          label: 'Accueil ERP',              icon: School },
      { id: 'overview',      label: 'Vue d\'ensemble',          icon: LayoutDashboard },
      { id: 'students',      label: 'Élèves',                   icon: Users },
      { id: 'grades',        label: 'Bulletins & Notes',        icon: GraduationCap },
      { id: 'bulletins',     label: 'Générateur de Bulletins',  icon: Award },
      { id: 'badges',        label: 'Badges & Cartes Scolaires', icon: Shield },
      { id: 'schedule',      label: 'Emploi du temps',          icon: Calendar },
      { id: 'announcements', label: 'Annonces & Devoirs',       icon: Megaphone },
      { id: 'finance',       label: 'Comptabilité',             icon: DollarSign },
      { id: 'payments',      label: 'Paiements Scolarité',      icon: CreditCard },
      { id: 'facturation',   label: 'Facturation & Reçus',      icon: Receipt },
      { id: 'absences',      label: 'Gérer les absences',        icon: Clock },
      { id: 'teachers',      label: 'Enseignants',               icon: BookOpen, teacherOnly: false },
    ] as { id: Tab; label: string; icon: any; teacherOnly?: boolean }[]
  ).filter(t => !isTeacher || (t.id !== 'teachers' && t.id !== 'finance' && t.id !== 'facturation'));

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.matricule.toLowerCase().includes(search.toLowerCase())
  );

  // Subject typical coefficients for rank calculation
  const getCoefficient = (subjectName: string) => {
    const sub = subjectName.toLowerCase();
    if (sub.includes('math')) return 4;
    if (sub.includes('phys') || sub.includes('chim')) return 3;
    if (sub.includes('philo') || sub.includes('franç') || sub.includes('liter')) return 3;
    if (sub.includes('hist') || sub.includes('géo') || sub.includes('angla')) return 2;
    return 1;
  };

  // Helper static calculations
  const totalTuitionInvoiced = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalTuitionCollected = payments.reduce((sum, p) => sum + (p.is_paid ? Number(p.amount) : 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const liveNetTreasury = totalTuitionCollected - totalExpenses;

  // Render grades coefficients for charts
  const getPerformanceChartData = () => {
    // Computes average grades per class for a visual bar chart
    const classAverages: { [classe: string]: { sum: number; count: number } } = {};
    grades.forEach(g => {
      const student = students.find(s => s.id === g.student_id);
      const cl = student?.classe || "Non affecté";
      if (!classAverages[cl]) classAverages[cl] = { sum: 0, count: 0 };
      classAverages[cl].sum += Number(g.value);
      classAverages[cl].count += 1;
    });
    return Object.keys(classAverages).map(k => ({
      class: k,
      Average: parseFloat((classAverages[k].sum / classAverages[k].count).toFixed(2))
    }));
  };

  const getGradesDistribution = () => {
    // Calculates total count of grades in categories
    // Insuffisant (<10), Passable (10-12), Bien (12-16), Excellent (>16)
    const counts = { 'Insuffisant (<10)': 0, 'Passable (10-12)': 0, 'Bien (12-16)': 0, 'Excellent (16-20)': 0 };
    grades.forEach(g => {
      const val = Number(g.value);
      if (val < 10) counts['Insuffisant (<10)'] += 1;
      else if (val < 12) counts['Passable (10-12)'] += 1;
      else if (val < 16) counts['Bien (12-16)'] += 1;
      else counts['Excellent (16-20)'] += 1;
    });
    return Object.keys(counts).map(k => ({
      name: k,
      Nombre: counts[k as keyof typeof counts]
    }));
  };

  // Class Schedule CRUD helpers
  const handleAddInvoiceLocal = () => {
    if (submitting) return;
    if (!newInvoice.student_id) {
      toast.error("Veuillez sélectionner un élève.");
      return;
    }
    const studentObj = students.find(s => s.id === newInvoice.student_id);
    const amountVal = parseFloat(newInvoice.amount);
    const discountVal = parseFloat(newInvoice.discount) || 0;
    if (isNaN(amountVal) || amountVal <= 0) {
      toast.error("Veuillez saisir un montant valide.");
      return;
    }
    const netAmount = Math.max(0, amountVal - discountVal);
    setSubmitting(true);
    try {
      const invNum = `FAC-2026-${String(invoices.length + 1).padStart(3, '0')}`;
      const newInvObj = {
        id: `fac_${Date.now()}`,
        invoice_number: invNum,
        student_id: newInvoice.student_id,
        student_name: studentObj?.name || 'Élève Kharandi',
        matricule: studentObj?.matricule || 'KHR-2026-000',
        classe: studentObj?.classe || 'Non affecté',
        type: newInvoice.type,
        amount: amountVal,
        discount: discountVal,
        net_amount: netAmount,
        date: newInvoice.date,
        due_date: newInvoice.due_date,
        payment_method: newInvoice.payment_method,
        status: newInvoice.status,
        notes: newInvoice.notes
      };
      const updatedInvoices = [newInvObj, ...invoices];
      setInvoices(updatedInvoices);
      localStorage.setItem('kharandi_demo_invoices', JSON.stringify(updatedInvoices));
      setShowAddInvoice(false);
      setNewInvoice({
        student_id: '',
        type: 'Frais de Scolarité - Tranche 1',
        amount: '1500000',
        discount: '0',
        date: new Date().toISOString().split('T')[0],
        due_date: new Date().toISOString().split('T')[0],
        payment_method: 'Orange Money',
        status: 'Payé',
        notes: 'Règlement effectué au guichet de la comptabilité Kharandi.'
      });
      toast.success(`Facture N° ${invNum} générée avec succès !`);
    } catch {
      toast.error("Erreur lors de la création de la facture.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectStudentForBadge = (studentId: string) => {
    const foundStudent = students.find(st => st.id === studentId);
    if (foundStudent) {
      const nameParts = foundStudent.name.trim().split(' ');
      const nom = nameParts.length > 1 ? nameParts[0].toUpperCase() : foundStudent.name.toUpperCase();
      const prenom = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Élève';
      
      const isGirl = foundStudent.name.toLowerCase().includes('fatou') || foundStudent.name.toLowerCase().includes('mariam') || foundStudent.name.toLowerCase().includes('aminata') || foundStudent.name.toLowerCase().includes('binta') || foundStudent.name.toLowerCase().includes('sow');
      const defaultPhoto = isGirl 
        ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200'
        : 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=200';

      setNewBadge(prev => ({
        ...prev,
        student_id: studentId,
        nom: nom,
        prenom: prenom,
        classe: foundStudent.classe || 'Terminal SSE',
        phone: foundStudent.parent_phone || '+224 622 00 11 22',
        matricule: foundStudent.matricule || 'KHR-2026-001',
        photo_url: defaultPhoto,
        nfc_code: `NFC-${Date.now().toString().slice(-6)}`
      }));
    } else {
      setNewBadge(prev => ({ ...prev, student_id: studentId }));
    }
  };

  const handleAddScheduleLocal = () => {
    if (submitting) return;
    const subjectTrimmed = newScheduleObj.subject.trim();
    if (!subjectTrimmed || !newScheduleObj.classe) {
      toast.error("Matière et classe requises !");
      return;
    }
    setSubmitting(true);
    try {
      const current = [...schedules, { id: `sch_${Date.now()}`, ...newScheduleObj, subject: subjectTrimmed }];
      setSchedules(current);
      localStorage.setItem('kharandi_demo_schedules', JSON.stringify(current));
      setNewScheduleObj({ classe: '', day: 'Lundi', time: '08h - 10h', subject: '', teacher: '' });
      setShowAddSchedule(false);
      toast.success("Cours programmé !");
    } catch {
      toast.error("Erreur de planification du cours.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteScheduleLocal = (id: string) => {
    const current = schedules.filter(s => s.id !== id);
    setSchedules(current);
    localStorage.setItem('kharandi_demo_schedules', JSON.stringify(current));
    toast.success("Cours retiré de l'emploi du temps.");
  };

  // Expenses accounting CRUD helpers
  const handleAddExpenseLocal = () => {
    if (submitting) return;
    const labelTrimmed = newExpense.label.trim();
    if (!labelTrimmed) {
      toast.error("Le libellé de la dépense est requis.");
      return;
    }
    const parsedAmount = parseFloat(newExpense.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Veuillez spécifier un montant valide supérieur à 0 GNF.");
      return;
    }
    setSubmitting(true);
    try {
      const current = [{ id: `exp_${Date.now()}`, label: labelTrimmed, amount: parsedAmount, date: newExpense.date, category: newExpense.category }, ...expenses];
      setExpenses(current);
      localStorage.setItem('kharandi_demo_expenses', JSON.stringify(current));
      setNewExpense({ label: '', amount: '', category: 'Salaires', date: new Date().toISOString().split('T')[0] });
      setShowAddExpense(false);
      toast.success("Dépense enregistrée avec succès !");
    } catch {
      toast.error("Erreur lors de la sauvegarde de la dépense.");
    } finally {
      setSubmitting(false);
    }
  };

  // SMS Generator helper
  const copySmsTemplate = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Message copié dans le presse-papiers !");
  };

  const btnClass = "px-5 py-2.5 bg-gradient-to-r from-[#18bfd6] to-[#15adc1] hover:from-[#15adc1] hover:to-[#18bfd6] text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#18bfd6]/10 hover:shadow-lg transition-all transform active:scale-95 duration-200";
  const inputCls = "w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#18bfd6] focus:ring-4 focus:ring-[#18bfd6]/10 transition-all duration-300";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative overflow-hidden">
      
      {/* Floating Ambient Brand Background Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#18bfd6]/5 blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] rounded-full bg-[#fcb303]/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#18bfd6_0.5px,transparent_0.5px),radial-gradient(#fcb303_0.5px,transparent_0.5px)] bg-[size:32px_32px] [background-position:0_0,16px_16px] opacity-[0.03]" />
      </div>

      {/* Top Header Bar (ERP Style, no lateral menu) */}
      <header className="sticky top-0 z-20 w-full bg-gradient-to-r from-[#18bfd6] via-[#15adc1] to-[#0f8c9d] border-b border-[#15adc1] text-white shadow-md px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setTab('home')}
            className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden shrink-0 cursor-pointer"
          >
            <img 
              src="https://lh3.googleusercontent.com/d/1NnKKOKkq_li7F4_dNgGBVUXHR_K2xL55" 
              alt="Kharandi Logo" 
              className="w-7 h-7 object-contain"
              referrerPolicy="no-referrer"
            />
          </button>
          <div className="min-w-0">
            <h2 className="font-extrabold text-sm text-white truncate leading-tight flex items-center gap-2">
              <span onClick={() => setTab('home')} className="cursor-pointer hover:text-[#fcb303] transition-colors">{schoolName}</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 bg-[#fcb303] px-2 py-0.5 rounded-md shadow-xs">
                {isTeacher ? 'Enseignant' : 'Direction'}
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {tab !== 'home' && (
            <button 
              onClick={() => setTab('home')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-[10px] font-black uppercase tracking-wider text-white transition-all cursor-pointer backdrop-blur border border-white/25"
            >
              Accueil ERP
            </button>
          )}
          <button onClick={() => window.location.href = '/'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[10px] font-black uppercase tracking-wider text-white transition-all cursor-pointer">
            <ArrowLeft size={12} /> <span className="hidden sm:inline">Portail</span>
          </button>
          <button onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white border border-rose-500/30 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs">
            <LogOut size={12} /> <span className="hidden sm:inline font-black">Quitter</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto z-10 relative">
        <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24">
          {loading && (
            <div className="flex justify-center py-24">
              <Loader2 size={36} className="animate-spin text-[#18bfd6]" />
            </div>
          )}

          {/* Universal Back Button to return to the ERP Dashboard Home */}
          {!loading && tab !== 'home' && (
            <div className="mb-6">
              <button 
                onClick={() => setTab('home')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-all cursor-pointer shadow-xs group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-[#18bfd6]" />
                Retour : Tableau de bord ERP
              </button>
            </div>
          )}

          {/* ACCUEIL ERP - CARD-BASED DASHBOARD */}
          {!loading && tab === 'home' && (
            <div className="space-y-8">
              {/* Header card with welcome message & school branding */}
              <div className="relative bg-gradient-to-r from-[#18bfd6] via-[#15adc1] to-[#0f8c9d] rounded-[32px] p-8 text-white border border-[#18bfd6]/30 shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:24px_24px] opacity-15" />
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#fcb303]/25 rounded-full blur-3xl" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-wider text-white border border-white/20">
                      <School size={12} />
                      Système ERP Kharandi École
                    </span>
                    <h1 className="text-3xl font-black tracking-tight text-white mt-4 font-sans">
                      {schoolName}
                    </h1>
                    <p className="text-cyan-50 font-medium text-xs mt-1.5 max-w-xl">
                      Espace de pilotage unifié de la direction administrative, du corps enseignant, et du suivi parent-élève.
                    </p>
                  </div>
                  
                  <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4 text-center md:text-right shadow-xs">
                    <p className="text-[10px] font-bold text-cyan-100 uppercase tracking-wider">Session Active</p>
                    <p className="text-sm font-black text-white mt-0.5">{isTeacher ? profile.name : 'Administrateur'}</p>
                    <span className="inline-block mt-2 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#fcb303] text-slate-900 font-extrabold shadow-xs">
                      {isTeacher ? 'Enseignant' : 'Direction Générale'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SCOLARITÉ SECTION */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#18bfd6] animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Scolarité</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: 'students', label: 'Élèves', desc: 'Gestion des effectifs, fiches élèves et inscriptions.', icon: Users, bgGradient: 'from-[#18bfd6] to-[#0d92a6]', metric: `${students.length} inscrits` },
                    { id: 'schedule', label: 'Emploi du temps', desc: 'Salles, horaires de cours et planning hebdomadaire.', icon: Calendar, bgGradient: 'from-[#fcb303] to-[#d99800]', metric: `${schedules.length} cours` },
                    { id: 'announcements', label: 'Annonces & Devoirs', desc: 'Publications de notes de direction et devoirs de maison.', icon: Megaphone, bgGradient: 'from-blue-500 to-indigo-600', metric: `${announcements.length} actus` },
                    { id: 'absences', label: 'Gérer les absences', desc: 'Signalement des absences et contrôle d\'assiduité.', icon: Clock, bgGradient: 'from-orange-500 to-red-500', metric: `${absences.length} relevés` },
                  ].map(c => (
                    <button key={c.id} onClick={() => setTab(c.id as Tab)}
                      className={`group bg-gradient-to-br ${c.bgGradient} p-5 rounded-2xl border border-white/10 hover:border-white/30 shadow-xs hover:shadow-lg transition-all text-left flex flex-col justify-between h-[170px] cursor-pointer hover:-translate-y-0.5 active:scale-98`}>
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center text-white">
                            <c.icon size={18} />
                          </div>
                          <ChevronRight size={14} className="text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <h4 className="font-extrabold text-white text-sm mt-3.5">{c.label}</h4>
                        <p className="text-[11px] text-white/85 font-medium mt-1 leading-relaxed line-clamp-2">{c.desc}</p>
                      </div>
                      <span className="text-[10px] font-black uppercase bg-white/15 text-white/90 px-2.5 py-1 rounded-lg self-start mt-2">
                        {c.metric}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PÉDAGOGIE SECTION */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Pédagogie</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: 'grades', label: 'Bulletins & Notes', desc: 'Saisie simplifiée des notes trimestrielles par élève.', icon: GraduationCap, bgGradient: 'from-emerald-500 to-teal-600', metric: `${grades.length} notes` },
                    { id: 'bulletins', label: 'Générateur de Bulletins', desc: 'Calcul de moyennes générales, rangs et impressions pdf.', icon: Award, bgGradient: 'from-rose-500 to-pink-600', metric: 'Prêt' },
                    { id: 'badges', label: 'Cartes Scolaires PVC', desc: 'Cartes d\'identité scolaires PVC officielles et badges d\'accès NFC pour les élèves.', icon: Shield, bgGradient: 'from-purple-500 to-indigo-600', metric: `${schoolBadges.length} cartes` },
                    ...(!isTeacher ? [{ id: 'teachers', label: 'Enseignants', desc: 'Gestion du personnel enseignant et habilitations de classes.', icon: BookOpen, bgGradient: 'from-cyan-600 to-teal-800', metric: `${teachers.length} profs` }] : []),
                  ].map(c => (
                    <button key={c.id} onClick={() => setTab(c.id as Tab)}
                      className={`group bg-gradient-to-br ${c.bgGradient} p-5 rounded-2xl border border-white/10 hover:border-white/30 shadow-xs hover:shadow-lg transition-all text-left flex flex-col justify-between h-[170px] cursor-pointer hover:-translate-y-0.5 active:scale-98`}>
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center text-white">
                            <c.icon size={18} />
                          </div>
                          <ChevronRight size={14} className="text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <h4 className="font-extrabold text-white text-sm mt-3.5">{c.label}</h4>
                        <p className="text-[11px] text-white/85 font-medium mt-1 leading-relaxed line-clamp-2">{c.desc}</p>
                      </div>
                      <span className="text-[10px] font-black uppercase bg-white/15 text-white/90 px-2.5 py-1 rounded-lg self-start mt-2">
                        {c.metric}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* TRÉSORERIE & PILOTAGE */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Trésorerie</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: 'overview', label: 'Vue d\'ensemble', desc: 'Analytique de performance, distribution des notes et graphiques.', icon: LayoutDashboard, bgGradient: 'from-violet-500 to-fuchsia-600', metric: 'Stats actives' },
                    ...(!isTeacher ? [
                      { id: 'finance', label: 'Comptabilité', desc: 'Bilan comptable de l\'école, encaissements et dépenses.', icon: DollarSign, bgGradient: 'from-teal-500 to-emerald-600', metric: `${liveNetTreasury.toLocaleString('fr-FR')} FG` },
                      { id: 'payments', label: 'Paiements Scolarité', desc: 'Suivi des tranches de scolarité et statuts de paiements.', icon: CreditCard, bgGradient: 'from-rose-500 to-orange-600', metric: `${payments.filter(p => !p.is_paid).length} impayés` },
                      { id: 'facturation', label: 'Facturation & Reçus', desc: 'Émission et impression de factures officielles et reçus de caisse.', icon: Receipt, bgGradient: 'from-amber-500 to-amber-700', metric: `${invoices.length} factures` }
                    ] : []),
                  ].map(c => (
                    <button key={c.id} onClick={() => setTab(c.id as Tab)}
                      className={`group bg-gradient-to-br ${c.bgGradient} p-5 rounded-2xl border border-white/10 hover:border-white/30 shadow-xs hover:shadow-lg transition-all text-left flex flex-col justify-between h-[170px] cursor-pointer hover:-translate-y-0.5 active:scale-98`}>
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center text-white">
                            <c.icon size={18} />
                          </div>
                          <ChevronRight size={14} className="text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <h4 className="font-extrabold text-white text-sm mt-3.5">{c.label}</h4>
                        <p className="text-[11px] text-white/85 font-medium mt-1 leading-relaxed line-clamp-2">{c.desc}</p>
                      </div>
                      <span className="text-[10px] font-black uppercase bg-white/15 text-white/90 px-2.5 py-1 rounded-lg self-start mt-2">
                        {c.metric}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AUTRES NAVIGATION CARDS */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Plateforme Kharandi</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => window.location.href = '/'}
                    className="group bg-white hover:bg-[#18bfd6]/5 p-5 rounded-2xl border border-slate-200/60 hover:border-[#18bfd6]/40 shadow-xs hover:shadow-md transition-all text-left flex items-start gap-4 cursor-pointer active:scale-98">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-[#18bfd6] group-hover:scale-105 transition-transform">
                      <School size={22} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-[#18bfd6] transition-colors">Plateforme Kharandi</h4>
                      <p className="text-[11px] text-slate-400 font-semibold mt-1 leading-relaxed">Retourner au portail d'accueil principal de Kharandi Technologie.</p>
                    </div>
                  </button>

                  <button onClick={onLogout}
                    className="group bg-white hover:bg-rose-500/5 p-5 rounded-2xl border border-slate-200/60 hover:border-rose-500/40 shadow-xs hover:shadow-md transition-all text-left flex items-start gap-4 cursor-pointer active:scale-98">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-rose-500 group-hover:scale-105 transition-transform">
                      <LogOut size={22} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-rose-500 transition-colors">Fermer la session</h4>
                      <p className="text-[11px] text-slate-400 font-semibold mt-1 leading-relaxed">Se déconnecter en toute sécurité de l'espace de gestion d'établissement.</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VUE D'ENSEMBLE */}
          {!loading && tab === 'overview' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#18bfd6] bg-[#18bfd6]/10 px-3.5 py-1.5 rounded-full">
                    Kharandi ÉCOLE V2
                  </span>
                  <h1 className="text-3xl font-black text-slate-900 mt-3 tracking-tight">
                    Bonjour, {isTeacher ? profile.name : schoolName}
                  </h1>
                  <p className="text-slate-400 font-semibold text-xs mt-1">Plateforme intelligente d'administration et d'évaluation du complexe scolaire.</p>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => setTab('bulletins')} className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider border border-slate-200/60 transition-all flex items-center justify-center gap-1.5">
                    <Award size={15} /> Bulletins
                  </button>
                  <button onClick={() => setTab('schedule')} className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider border border-slate-200/60 transition-all flex items-center justify-center gap-1.5">
                    <Calendar size={15} /> Horaires
                  </button>
                </div>
              </div>

              {/* Grid 4 Statistiques Clés */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Effectif Élèves', value: students.length, icon: <Users size={20}/>, color: 'bg-[#18bfd6]/10 text-[#18bfd6]', border: 'border-[#18bfd6]/10' },
                  { label: 'Notes Saisies', value: grades.length, icon: <GraduationCap size={20}/>, color: 'bg-green-500/10 text-green-600', border: 'border-green-500/10' },
                  { label: 'Scolarités Réglées', value: `${payments.filter(p=>p.is_paid).length} / ${payments.length}`, icon: <CreditCard size={20}/>, color: 'bg-indigo-500/10 text-indigo-600', border: 'border-indigo-500/10' },
                  { label: 'Absences Signalées', value: absences.length, icon: <Clock size={20}/>, color: 'bg-[#fcb303]/10 text-[#fcb303]', border: 'border-[#fcb303]/10' },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className={`bg-white rounded-3xl p-5 border ${s.border} shadow-sm relative overflow-hidden hover:translate-y-[-2px] transition-all`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-500/5 to-transparent rounded-full blur-xl pointer-events-none" />
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${s.color} shadow-inner`}>{s.icon}</div>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{s.value}</p>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-1.5">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* GRAPHIQUES VISUELS RECHARTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Graphique de distribution des notes */}
                <div className="bg-white rounded-[28px] border border-slate-100 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="text-[#18bfd6]" size={18} />
                      <h3 className="font-extrabold text-slate-900 text-sm md:text-base">Distribution des Notes</h3>
                    </div>
                    <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-1 rounded">Évaluation Générale</span>
                  </div>
                  <div className="h-64">
                    {grades.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">Aucune note pour générer le graphe</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getGradesDistribution()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                          <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                          <Tooltip cursor={{ fill: '#F8FAFC' }} />
                          <Bar dataKey="Nombre" fill="#18bfd6" radius={[8, 8, 0, 0]}>
                            {getGradesDistribution().map((entry, index) => {
                              const colors = ['#E11D48', '#F59E0B', '#10B981', '#4F46E5'];
                              return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Graphique de performance par classe */}
                <div className="bg-white rounded-[28px] border border-slate-100 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Activity className="text-emerald-500" size={18} />
                      <h3 className="font-extrabold text-slate-900 text-sm md:text-base">Moyennes par Classe (/20)</h3>
                    </div>
                    <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-1 rounded">Matières Confondues</span>
                  </div>
                  <div className="h-64">
                    {getPerformanceChartData().length === 0 ? (
                      <div className="h-full flex items-center justify-center text-slate-400 text-xs font-semibold">Aucune classe enregistrée</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={getPerformanceChartData()} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis dataKey="class" stroke="#94A3B8" fontSize={10} tickLine={false} />
                          <YAxis domain={[0, 20]} stroke="#94A3B8" fontSize={10} tickLine={false} />
                          <Tooltip />
                          <Area type="monotone" dataKey="Average" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorAvg)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

              </div>

              {/* Copier SMS Rapide Block */}
              <div className="bg-white rounded-[28px] border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
                  <Send className="text-amber-500 shrink-0" size={18} />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm md:text-base">Générateur & Modèles de Message (SMS aux Parents)</h3>
                    <p className="text-slate-400 text-[10px] font-bold">Copiez rapidement les messages types pour notifier les parents.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Notification d'Absence ⚠️",
                      desc: "Bonjour Monsieur/Madame, nous vous informons de l'absence de votre enfant ce jour à l'école. Merci de contacter la direction.",
                      btnText: "Copier le message d'absence"
                    },
                    {
                      title: "Encouragement Trimestriel 🏆",
                      desc: "Chers parents, Félicitations ! Votre enfant a obtenu de très bons résultats ce trimestre avec de solides appréciations des professeurs.",
                      btnText: "Copier le message félicitations"
                    },
                    {
                      title: "Rappel Scolarité / Paiement 💳",
                      desc: "Rappel scolarité : Chers parents, veuillez s'il vous plaît régulariser les frais de scolarité en attente de votre enfant pour ce trimestre.",
                      btnText: "Copier rappel paiement"
                    }
                  ].map((x, i) => (
                    <div key={i} className="bg-slate-50/50 hover:bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between transition-colors">
                      <div>
                        <p className="text-xs font-extrabold text-slate-900 mb-1.5">{x.title}</p>
                        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mb-4">"{x.desc}"</p>
                      </div>
                      <button onClick={() => copySmsTemplate(x.desc)} className="w-full py-2 bg-white hover:bg-[#18bfd6]/5 text-slate-700 hover:text-[#18bfd6] border border-slate-200 hover:border-[#18bfd6]/50 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                        <Copy size={12} /> {x.btnText}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Liste rapide élèves récents */}
              <div className="bg-white rounded-[28px] border border-slate-100 shadow-xl shadow-slate-100/30 p-6">
                <div className="flex items-center justify-between mb-5 border-b border-slate-50 pb-4">
                  <h3 className="font-extrabold text-slate-900 text-base md:text-lg">Élèves récemment enregistrés</h3>
                  <button onClick={() => setTab('students')} className="text-xs font-black text-[#18bfd6] hover:text-[#15adc1] uppercase tracking-wider flex items-center gap-1 cursor-pointer">
                    <span>Inscrire ou gérer les élèves</span> <ChevronRight size={14} />
                  </button>
                </div>
                {students.length === 0 ? (
                  <p className="text-slate-400 text-sm font-semibold py-6 text-center">Aucun élève enregistré pour le moment.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {students.slice(0, 6).map((s, i) => (
                      <div key={i} className="p-4 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100/50 transition-all flex flex-col justify-between hover:border-slate-200">
                        <div>
                          <p className="font-extrabold text-xs text-slate-900">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1.5 flex items-center gap-1">
                            <span className="font-mono bg-white text-slate-600 px-2 py-0.5 rounded-md text-[9px] border border-slate-100 font-bold">{s.matricule}</span>
                            <span>·</span>
                            <span>{s.classe || 'Non affecté'}</span>
                          </p>
                        </div>
                        {s.parent_phone && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                            <span className="text-[#18bfd6] font-extrabold">Parents:</span> {s.parent_phone}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ÉLÈVES */}
          {!loading && tab === 'students' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Gestion des Élèves</h1>
                  <p className="text-slate-400 text-xs font-semibold mt-0.5">Inscrivez vos étudiants, attribuez des matricules uniques et spécifiez les classes.</p>
                </div>
                {!isTeacher && (
                  <button onClick={() => setShowAddStudent(!showAddStudent)} className={btnClass}>
                    <Plus size={16} /> <span>Inscrire un élève</span>
                  </button>
                )}
              </div>

              {showAddStudent && (
                <div className="bg-white rounded-[28px] border-2 border-[#18bfd6]/20 shadow-xl shadow-[#18bfd6]/5 p-6 mb-2">
                  <h3 className="font-extrabold text-slate-900 mb-4 text-base">Inscrire un nouvel élève</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Nom Complet de l'élève *</label>
                      <input placeholder="Ex: Jean Paul Diallo" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block font-semibold">Classe d'affection</label>
                      <select value={newStudent.classe} onChange={e => setNewStudent({...newStudent, classe: e.target.value})} className={inputCls}>
                        <option value="">Sélectionner —</option>
                        {classes.length > 0 ? (
                          classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)
                        ) : (
                          ['7ème Année', '8ème Année', '9ème Année', '10ème Année', '11ème SM', 'Terminal SSE', 'Terminal SM', 'Terminal SE'].map(cl => (
                            <option key={cl} value={cl}>{cl}</option>
                          ))
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Téléphone des parents (SMS)</label>
                      <input placeholder="Ex: +224 626 18 71 17" value={newStudent.parent_phone} onChange={e => setNewStudent({...newStudent, parent_phone: e.target.value})} className={inputCls} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-5 justify-end">
                    <button onClick={() => setShowAddStudent(false)} className="px-5 py-2.5 bg-slate-100 text-slate-500 hover:bg-slate-200/80 rounded-2xl font-black text-xs uppercase tracking-wider cursor-pointer transition-colors">Annuler</button>
                    <button onClick={async () => {
                      if (submitting) return;
                      const nameTrimmed = newStudent.name.trim();
                      if (!nameTrimmed) { toast.error("Le nom de l'élève est requis."); return; }
                      if (nameTrimmed.length < 3) { toast.error("Le nom de l'élève doit contenir au moins 3 caractères."); return; }
                      
                      const phoneTrimmed = newStudent.parent_phone.trim();
                      if (phoneTrimmed && !/^[+0-9\s-]{8,20}$/.test(phoneTrimmed)) {
                        toast.error("Le numéro de téléphone des parents est invalide.");
                        return;
                      }

                      setSubmitting(true);
                      try {
                        await addStudent(schoolId, { ...newStudent, name: nameTrimmed, parent_phone: phoneTrimmed });
                        toast.success("Élève inscrit avec succès !");
                        setNewStudent({ name:'', classe:'', parent_phone:'' });
                        setShowAddStudent(false);
                        loadAll();
                      } catch { 
                        toast.error("Erreur lors de l'enregistrement de l'élève."); 
                      } finally {
                        setSubmitting(false);
                      }
                    }} disabled={submitting} className={`${btnClass} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {submitting ? "Enregistrement..." : "Enregistrer l'élève"}
                    </button>
                  </div>
                </div>
              )}

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input placeholder="Rechercher par matricule ou nom..." value={search} onChange={e => setSearch(e.target.value)} className={`${inputCls} pl-11`} />
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                {filteredStudents.length === 0 ? (
                  <p className="text-slate-400 text-sm font-semibold py-8 text-center bg-white">Aucun étudiant trouvé.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-6 py-3.5 text-[11px] font-black uppercase text-slate-500 tracking-wider">Matricule</th>
                          <th className="px-6 py-3.5 text-[11px] font-black uppercase text-slate-500 tracking-wider">Nom de l'Élève</th>
                          <th className="px-6 py-3.5 text-[11px] font-black uppercase text-slate-500 tracking-wider">Classe d'affection</th>
                          <th className="px-6 py-3.5 text-[11px] font-black uppercase text-slate-500 tracking-wider">Contact Parent</th>
                          <th className="px-6 py-3.5 text-[11px] font-black uppercase text-slate-500 tracking-wider">Moyenne Générale</th>
                          {!isTeacher && <th className="px-6 py-3.5 text-[11px] font-black uppercase text-slate-500 tracking-wider text-right">Actions</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map((s) => {
                          const studentGrades = grades.filter(g => g.student_id === s.id);
                          const avg = studentGrades.length > 0
                            ? (studentGrades.reduce((sum, g) => sum + parseFloat(g.value), 0) / studentGrades.length).toFixed(2)
                            : '—';
                          return (
                            <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-mono text-xs bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-black">{s.matricule}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-[10px] font-black uppercase bg-[#18bfd6]/5 border border-[#18bfd6]/10 text-[#18bfd6] px-2.5 py-1 rounded-full">{s.classe || 'Non affecté'}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-semibold">
                                {s.parent_phone || <span className="text-slate-300 italic">Aucun contact</span>}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {avg !== '—' ? (
                                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${parseFloat(avg) >= 12 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : parseFloat(avg) >= 10 ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>{avg}/20</span>
                                ) : (
                                  <span className="text-slate-300">—</span>
                                )}
                              </td>
                              {!isTeacher && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                                  <button onClick={async () => { if (confirm("Êtes-vous sûr de vouloir radier cet élève de l'établissement ?")) { await deleteStudent(s.id); loadAll(); toast.success("Élève supprimé."); } }}
                                    className="text-rose-500 hover:text-rose-700 font-black uppercase tracking-wider hover:underline transition-colors cursor-pointer">
                                    Radié
                                  </button>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NOTES ET ÉVALUATIONS */}
          {!loading && tab === 'grades' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Saisie des Notes & Devoirs</h1>
                  <p className="text-slate-400 text-xs font-semibold mt-0.5">Enregistrez les notes d'évaluation continue, examens ou interrogations par matière.</p>
                </div>
                <button onClick={() => setShowAddGrade(!showAddGrade)} className={btnClass}>
                  <Plus size={16} /> <span>Saisir une note</span>
                </button>
              </div>

              {showAddGrade && (
                <div className="bg-white rounded-[28px] border-2 border-[#18bfd6]/20 shadow-xl shadow-[#18bfd6]/5 p-6 mb-2">
                  <h3 className="font-extrabold text-slate-900 mb-4 text-base">Enregistrer une évaluation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Sélectionner l'Élève *</label>
                      <select value={newGrade.student_id} onChange={e => setNewGrade({...newGrade, student_id: e.target.value})} className={inputCls}>
                        <option value="">Choisir l'étudiant —</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.classe || 'Classe inconnue'})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Matière *</label>
                      <input placeholder="ex: Mathématiques, Physique..." value={newGrade.subject} onChange={e => setNewGrade({...newGrade, subject: e.target.value})} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Note obtenue (/20) *</label>
                      <input type="number" min="0" max="20" step="0.5" placeholder="ex: 15.5" value={newGrade.value} onChange={e => setNewGrade({...newGrade, value: e.target.value})} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block font-semibold font-sans">Période d'évaluation *</label>
                      <select value={newGrade.trimester} onChange={e => setNewGrade({...newGrade, trimester: e.target.value})} className={inputCls}>
                        <option value="T1">1er Trimestre</option>
                        <option value="T2">2ème Trimestre</option>
                        <option value="T3">3ème Trimestre</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Appréciation / Observation</label>
                      <input placeholder="ex: Très bon esprit d'analyse, élève attentif" value={newGrade.comment} onChange={e => setNewGrade({...newGrade, comment: e.target.value})} className={inputCls} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-5 justify-end">
                    <button onClick={() => setShowAddGrade(false)} className="px-5 py-2.5 bg-slate-100 text-slate-500 hover:bg-slate-200/80 rounded-2xl font-black text-xs uppercase tracking-wider cursor-pointer transition-colors">Annuler</button>
                    <button onClick={async () => {
                      if (submitting) return;
                      if (!newGrade.student_id) { toast.error("Veuillez sélectionner un élève."); return; }
                      
                      const subjectTrimmed = newGrade.subject.trim();
                      if (!subjectTrimmed) { toast.error("Veuillez spécifier la matière d'évaluation."); return; }
                      
                      if (!newGrade.value) { toast.error("Veuillez entrer une note."); return; }
                      const valNum = parseFloat(newGrade.value);
                      if (isNaN(valNum) || valNum < 0 || valNum > 20) {
                        toast.error("La note obtenue doit être un nombre compris entre 0 et 20.");
                        return;
                      }

                      setSubmitting(true);
                      try {
                        await addGrade({ ...newGrade, subject: subjectTrimmed, value: valNum.toString(), teacher_id: isTeacher ? profile.id : undefined });
                        toast.success("Note enregistrée avec succès !");
                        setNewGrade({ student_id:'', subject:'', value:'', trimester:'T1', comment:'' });
                        setShowAddGrade(false);
                        loadAll();
                      } catch { 
                        toast.error("Erreur lors de l'enregistrement de la note."); 
                      } finally {
                        setSubmitting(false);
                      }
                    }} disabled={submitting} className={`${btnClass} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {submitting ? "Enregistrement..." : "Enregistrer la note"}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {grades.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                    <GraduationCap size={40} className="mx-auto text-slate-200 mb-2" />
                    <p className="text-slate-400 text-sm font-semibold">Aucune note enregistrée</p>
                  </div>
                ) : (
                  grades.map(g => {
                    const val = parseFloat(g.value);
                    const valColor = val >= 12 ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/10' : val >= 10 ? 'text-[#fcb303] bg-[#fcb303]/10 border-[#fcb303]/10' : 'text-rose-500 bg-rose-500/10 border-rose-500/10';
                    return (
                      <div key={g.id} className="bg-white rounded-3xl border border-slate-100/95 p-5 flex items-center justify-between shadow-sm hover:translate-y-[-1px] transition-all">
                        <div>
                          <p className="font-extrabold text-[#0F172A] text-sm md:text-base">
                            {students.find(s => s.id === g.student_id)?.name || g.student_name || 'Élève Anonyme'}
                            <span className="text-slate-400 font-bold ml-1">· {g.subject}</span>
                          </p>
                          <div className="flex items-center gap-2.5 mt-1.5 animate-fade-in">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 border border-slate-200/50 px-2.5 py-0.5 rounded-lg text-slate-500">{g.trimester}</span>
                            {g.comment && <span className="text-xs text-slate-400 font-semibold italic">"{g.comment}"</span>}
                          </div>
                        </div>
                        <span className={`text-base md:text-lg font-black border px-3.5 py-1.5 rounded-2xl ${valColor}`}>{g.value}/20</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* GENERATEUR DE BULLETINS (NEW IN V2) */}
          {!loading && tab === 'bulletins' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Générateur de Bulletins Scolaires</h1>
                <p className="text-slate-400 text-xs font-semibold mt-0.5">Compilez toutes les notes d'un élève, calculez sa moyenne générale coefficientée et générez son bulletin trimestriel.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">Sélectionner l'Élève</label>
                  <select value={bulletinStudent} onChange={e => { setBulletinStudent(e.target.value); setActiveBulletinRef(null); }} className={inputCls}>
                    <option value="">Sélectionner un élève —</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.classe || "Non affecté"})</option>)}
                  </select>
                </div>
                <div className="w-full md:w-48">
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block">Période Trimestrielle</label>
                  <select value={bulletinTrimester} onChange={e => { setBulletinTrimester(e.target.value); setActiveBulletinRef(null); }} className={inputCls}>
                    <option value="T1">1er Trimestre</option>
                    <option value="T2">2ème Trimestre</option>
                    <option value="T3">3ème Trimestre</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    if (!bulletinStudent) { toast.error("Veuillez d'abord choisir un élève !"); return; }
                    const studentData = students.find(s => s.id === bulletinStudent);
                    const studentGrades = grades.filter(g => g.student_id === bulletinStudent && g.trimester === bulletinTrimester);
                    if (studentGrades.length === 0) {
                      toast.error("Cet élève n'a reçu aucune note pour ce trimestre !");
                      setActiveBulletinRef(null);
                      return;
                    }
                    setActiveBulletinRef({ student: studentData, grades: studentGrades });
                    toast.success("Moyenne et bulletin calculés !");
                  }}
                  className={`${btnClass} w-full md:w-auto shrink-0 h-[46px]`}
                >
                  <Award size={16} /> <span>Générer le Bulletin</span>
                </button>
              </div>

              {/* RENDER THE BULLETIN FRAME */}
              {activeBulletinRef ? (() => {
                const { student, grades: studentGrades } = activeBulletinRef;
                
                // Group grades by subject for calculation
                const subjectAverages: { [sub: string]: { sum: number; count: number } } = {};
                studentGrades.forEach((g: any) => {
                  if (!subjectAverages[g.subject]) subjectAverages[g.subject] = { sum: 0, count: 0 };
                  subjectAverages[g.subject].sum += Number(g.value);
                  subjectAverages[g.subject].count += 1;
                });

                let totalWeighted = 0;
                let totalCoeffSum = 0;

                const subjectsList = Object.keys(subjectAverages).map(subject => {
                  const avg = subjectAverages[subject].sum / subjectAverages[subject].count;
                  const coeff = getCoefficient(subject);
                  totalWeighted += avg * coeff;
                  totalCoeffSum += coeff;
                  return {
                    name: subject,
                    average: avg,
                    coeff,
                    total: avg * coeff
                  };
                });

                const generalAverage = totalCoeffSum > 0 ? (totalWeighted / totalCoeffSum) : 0;
                const appreciation = generalAverage >= 16 ? "Excellent trimestre. Félicitations du conseil d'établissement." :
                                     generalAverage >= 14 ? "Très bon travail. Résultats solides." :
                                     generalAverage >= 12 ? "Trimestre satisfaisant. Poursuivez les efforts." :
                                     generalAverage >= 10 ? "Performance passable. Peut et doit mieux faire." :
                                     "Insuffisant. Redoublez de rigueur et demandez du soutien.";

                const evaluationStatus = generalAverage >= 12 ? "Encouragements" : generalAverage >= 10 ? "Tableau d'Honneur" : "Avertissement de Travail";

                return (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-1 md:p-6 bg-white border border-slate-200 shadow-xl rounded-[32px] overflow-hidden relative">
                    {/* Guinea National Colors top stripe layout decoration */}
                    <div className="absolute top-0 left-0 right-0 h-2.5 flex">
                      <div className="flex-1 bg-red-600" />
                      <div className="flex-1 bg-yellow-400" />
                      <div className="flex-1 bg-emerald-500" />
                    </div>

                    {/* Print Preview Mode Container */}
                    <div className="p-6 md:p-8 space-y-8 font-sans" id="bulletin-school-print-block">
                      {/* Bulletin Letterhead */}
                      <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-900 pb-5 gap-4">
                        <div className="text-left space-y-1">
                          <h2 className="font-extrabold text-slate-905 text-lg uppercase tracking-tight">{schoolName}</h2>
                          <p className="text-slate-400 text-xs font-semibold">République de Guinée</p>
                          <p className="text-slate-400 text-[10px] uppercase tracking-wider font-extrabold text-[#18bfd6]">Portail d'Éducation Kharandi</p>
                        </div>
                        <div className="text-right space-y-1 md:max-w-xs">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#fcb303] bg-[#fcb303]/10 px-2.5 py-1 rounded">Bulletin Officiel</span>
                          <h4 className="font-extrabold text-[#0F172A] text-sm mt-1">Scolaire Trimestriel</h4>
                          <p className="text-slate-400 text-xs font-bold leading-relaxed">{bulletinTrimester === 'T1' ? '1er Trimestre' : bulletinTrimester === 'T2' ? '2ème Trimestre' : '3ème Trimestre'} · 2026</p>
                        </div>
                      </div>

                      {/* Header Infos */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 text-sm">
                        <div className="space-y-1.5 text-left">
                          <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">Élève ID & Profil :</p>
                          <p className="font-black text-slate-900 text-base">{student.name}</p>
                          <p className="text-slate-500 font-semibold text-xs mt-0.5">Matricule : <span className="font-mono bg-white border border-slate-100 px-2 py-0.5 rounded-lg text-slate-700 font-bold">{student.matricule}</span></p>
                          <p className="text-slate-500 font-semibold text-xs">Classe actuelle : <b className="text-[#0fafc1]">{student.classe || "Non affecté"}</b></p>
                        </div>
                        <div className="space-y-1.5 text-left md:text-right md:border-l border-slate-200/80 md:pl-6">
                          <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">Résultats Généraux :</p>
                          <p className="text-xl font-black text-[#18bfd6]">{generalAverage.toFixed(2)} / 20</p>
                          <p className="text-slate-500 font-bold text-xs">Matières évaluées : <span className="text-slate-900">{subjectsList.length}</span></p>
                          <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-current mt-1 ${generalAverage >= 12 ? 'text-green-600 bg-green-50/60' : 'text-rose-500 bg-rose-50/30'}`}>
                            Décision : {generalAverage >= 10 ? 'Admis(e)' : 'Refusé(e) / À surveiller'}
                          </span>
                        </div>
                      </div>

                      {/* Grades Table */}
                      <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                        <table className="w-full text-left border-collapse text-xs md:text-sm">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400">
                              <th className="p-4">Matières Enseignées</th>
                              <th className="p-4 text-center">Moyenne Trimestrielle</th>
                              <th className="p-4 text-center">Coefficient (Coeff)</th>
                              <th className="p-4 text-center">Total Multiplié</th>
                              <th className="p-4">Appréciation par Matière</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-705">
                            {subjectsList.map((sub, i) => (
                              <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                                <td className="p-4 font-black text-slate-900">{sub.name}</td>
                                <td className="p-4 text-center font-bold text-[#18bfd6]">{sub.average.toFixed(2)} / 20</td>
                                <td className="p-4 text-center text-slate-500 font-mono">{sub.coeff}</td>
                                <td className="p-4 text-center font-bold text-slate-900">{sub.total.toFixed(2)}</td>
                                <td className="p-4 text-slate-400 text-xs">{sub.average >= 16 ? 'Excellent travail' : sub.average >= 14 ? 'Très satisfaisant' : sub.average >= 12 ? 'Bon niveau, actif' : sub.average >= 10 ? 'Passable' : 'Doit redoubler d’efforts'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Footer Totals */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-4 text-left p-5 rounded-2xl bg-cyan-50/20 border border-cyan-100/50">
                          <div>
                            <span className="text-[10px] uppercase font-black tracking-widest text-[#18bfd6] block mb-1">Observation globale du conseil des classes</span>
                            <p className="font-bold text-slate-900 text-sm italic">"{appreciation}"</p>
                          </div>
                          <div className="flex gap-2.5">
                            <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-1 rounded">Mention: {evaluationStatus}</span>
                            <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-1 rounded">Année: 2026</span>
                          </div>
                        </div>

                        {/* Signatures Panel */}
                        <div className="flex justify-between items-center text-left pt-6 sm:pt-0">
                          <div className="space-y-1">
                            <h5 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">Le Principal de l'école :</h5>
                            <div className="h-10 w-24 border-b border-slate-300 relative flex items-center justify-center">
                              <span className="font-mono text-xs text-slate-400 italic">Signature / Sceau</span>
                            </div>
                            <p className="text-xs text-slate-700 font-black mt-2">Kharandi Administration</p>
                          </div>
                          
                          <div className="h-24 w-24 opacity-10 border-4 border-[#12adc1] text-[#12adc1] rounded-full flex flex-col items-center justify-center font-black flex-col text-[10px] uppercase tracking-wider">
                            <School size={20} />
                            <span>MINISTÈRE</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Print Utilities Area */}
                    <div className="p-5 bg-slate-100 border-t border-slate-100 flex justify-end gap-2.5">
                      <button
                        onClick={() => window.print()}
                        className="px-5 py-2.5 bg-[#4F46E5] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow hover:opacity-90"
                      >
                        <Printer size={15} /> <span>Imprimer / Exporter PDF</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })() : (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
                  <Award size={48} className="mx-auto text-slate-200 mb-3" />
                  <p className="text-slate-500 font-bold text-sm">Veuillez choisir un élève et cliquer sur "Générer le Bulletin"</p>
                </div>
              )}
            </div>
          )}

          {/* EMPLOI DU TEMPS (NEW IN V2) */}
          {!loading && tab === 'schedule' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Emploi du Temps / Classes</h1>
                  <p className="text-slate-400 text-xs font-semibold mt-0.5">Planifiez les heures de cours hebdomadaires et affectez les enseignants aux différentes matières.</p>
                </div>
                {!isTeacher && (
                  <button onClick={() => setShowAddSchedule(!showAddSchedule)} className={btnClass}>
                    <Plus size={16} /> <span>Programmer un cours</span>
                  </button>
                )}
              </div>

              {showAddSchedule && (
                <div className="bg-white rounded-[28px] border-2 border-[#18bfd6]/20 shadow-xl shadow-[#18bfd6]/5 p-6 mb-2 text-left">
                  <h3 className="font-extrabold text-slate-900 mb-4 text-base">Programmer une plage de cours</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Classe *</label>
                      <select value={newScheduleObj.classe} onChange={e => setNewScheduleObj({ ...newScheduleObj, classe: e.target.value })} className={inputCls}>
                        <option value="">Sélectionner —</option>
                        {['Terminal SSE', 'Terminal SM', '9ème Année', '8ème Année', '7ème Année'].map(cl => (
                          <option key={cl} value={cl}>{cl}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Jour de la semaine *</label>
                      <select value={newScheduleObj.day} onChange={e => setNewScheduleObj({ ...newScheduleObj, day: e.target.value })} className={inputCls}>
                        {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block font-semibold">Plage Horaire *</label>
                      <select value={newScheduleObj.time} onChange={e => setNewScheduleObj({ ...newScheduleObj, time: e.target.value })} className={inputCls}>
                        {['08h - 10h', '10h - 12h', '12h - 14h', '14h - 16h'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Matière *</label>
                      <input placeholder="ex: Mathématiques, Histoire, Anglais..." value={newScheduleObj.subject} onChange={e => setNewScheduleObj({ ...newScheduleObj, subject: e.target.value })} className={inputCls} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Nom du Professeur responsable</label>
                      <input placeholder="ex: M. Camara / Mme. Condé" value={newScheduleObj.teacher} onChange={e => setNewScheduleObj({ ...newScheduleObj, teacher: e.target.value })} className={inputCls} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-5 justify-end">
                    <button onClick={() => setShowAddSchedule(false)} className="px-5 py-2.5 bg-slate-100 text-slate-500 hover:bg-slate-200/80 rounded-2xl font-black text-xs uppercase tracking-wider cursor-pointer transition-colors">Annuler</button>
                    <button onClick={handleAddScheduleLocal} className={btnClass}>Enregistrer au calendrier</button>
                  </div>
                </div>
              )}

              {/* TIMETABLE WEEK VISUALIZER */}
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">Plan de route officiel de l'établissement</p>
                </div>

                <div className="space-y-4">
                  {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map(day => {
                    const lessons = schedules.filter(s => s.day === day);
                    return (
                      <div key={day} className="border-b border-slate-100 pb-4 last:border-none last:pb-0">
                        <h4 className="font-extrabold text-slate-900 text-sm tracking-tight mb-2 uppercase tracking-wide text-[#fcb303] bg-[#fcb303]/10 w-fit px-2.5 py-1 rounded-md">{day}</h4>
                        {lessons.length === 0 ? (
                          <p className="text-xs text-slate-400 font-bold italic pl-4">Aucun cours programmé ce jour-là.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {lessons.map(ls => (
                              <div key={ls.id} className="p-4 bg-slate-50 border border-slate-100/80 rounded-2xl relative flex flex-col justify-between group hover:border-[#18bfd6] transition-all">
                                <div>
                                  <span className="text-[10px] font-black uppercase text-[#18bfd6] tracking-wider mb-2 block">{ls.time}</span>
                                  <p className="font-black text-xs text-slate-900 leading-tight">{ls.subject}</p>
                                  <p className="text-[10px] font-bold text-slate-400 mt-1">Avec : <span className="font-semibold text-slate-600">{ls.teacher || "Non défini"}</span></p>
                                </div>
                                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100">
                                  <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100">{ls.classe}</span>
                                  {!isTeacher && (
                                    <button onClick={() => handleDeleteScheduleLocal(ls.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-rose-50 rounded-lg text-rose-500 hover:text-rose-600 cursor-pointer">
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* COMPTABILITÉ & CHARGES (NEW IN V2) */}
          {!loading && tab === 'finance' && !isTeacher && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Comptabilité & Trésorerie</h1>
                  <p className="text-slate-400 text-xs font-semibold mt-0.5">Suivez la balance financière globale du complexe (Inflows des scolarités versus dépenses d'établissement).</p>
                </div>
                <button onClick={() => setShowAddExpense(!showAddExpense)} className={btnClass}>
                  <Plus size={16} /> <span>Ajouter une Dépense</span>
                </button>
              </div>

              {showAddExpense && (
                <div className="bg-white rounded-[28px] border-2 border-[#18bfd6]/20 shadow-xl shadow-[#18bfd6]/5 p-6 mb-2 text-left">
                  <h3 className="font-extrabold text-slate-905 mb-4 text-base">Régister une Dépense financière</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Libellé / Description de la charge *</label>
                      <input placeholder="ex: Facture EDG, Salaire des enseignants..." value={newExpense.label} onChange={e => setNewExpense({ ...newExpense, label: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Montant de la dépense (GNF) *</label>
                      <input type="number" placeholder="ex: 1200000" value={newExpense.amount} onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Catégorie de charge</label>
                      <select value={newExpense.category} onChange={e => setNewExpense({ ...newExpense, category: e.target.value })} className={inputCls}>
                        {['Salaires', 'Matériels', 'Maintenance', 'Charges fixes', 'Événements', 'Divers'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-5 justify-end">
                    <button onClick={() => setShowAddExpense(false)} className="px-5 py-2.5 bg-slate-100 text-slate-500 hover:bg-slate-200/80 rounded-2xl font-black text-xs uppercase tracking-wider cursor-pointer transition-colors">Annuler</button>
                    <button onClick={handleAddExpenseLocal} className={btnClass}>Enregistrer la charge</button>
                  </div>
                </div>
              )}

              {/* Dynamic Ledger Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Scolarités Collectées", amount: totalTuitionCollected, style: "bg-emerald-50 text-emerald-700 border border-emerald-100" },
                  { label: "Charges & Dépenses d'école", amount: totalExpenses, style: "bg-rose-50 text-rose-600 border border-rose-100" },
                  { label: "Solde de Trésorerie Net", amount: liveNetTreasury, style: liveNetTreasury >= 0 ? "bg-cyan-50/50 text-[#18bfd6] border border-cyan-100" : "bg-red-50 text-red-600 border border-red-100" }
                ].map((item, i) => (
                  <div key={i} className={`${item.style} p-5 rounded-3xl text-left shadow-sm relative overflow-hidden`}>
                    <span className="text-[10px] font-black uppercase tracking-wider block opacity-70 mb-2">{item.label}</span>
                    <p className="text-2xl md:text-3xl font-black tracking-tight font-mono">{item.amount.toLocaleString()} <span className="text-xs font-bold">GNF</span></p>
                    <span className="text-[9px] uppercase font-black tracking-widest bg-white/40 px-2 py-0.5 rounded border border-white/40 mt-3 inline-block">Mise à jour Live</span>
                  </div>
                ))}
              </div>

              {/* Expense Table List */}
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base">Journal des Sorties de Caisse</h3>
                  <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-500 px-2.5 py-1 rounded">{expenses.length} dépense(s) répertoriée(s)</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {expenses.length === 0 ? (
                    <p className="text-slate-400 text-sm font-semibold text-center py-6">Aucune dépense enregistrée.</p>
                  ) : (
                    expenses.map(e => (
                      <div key={e.id} className="flex items-center justify-between py-4.5">
                        <div className="text-left space-y-1">
                          <p className="font-extrabold text-[#0F172A] text-sm">{e.label}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black bg-slate-100 border border-slate-200/50 text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-wide">{e.category}</span>
                            <span className="text-xs text-slate-400 font-bold font-mono">{e.date}</span>
                          </div>
                        </div>
                        <span className="text-base font-black text-rose-500 font-mono">-{e.amount.toLocaleString()} GNF</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SCOLARITÉS & PAIEMENTS */}
          {!loading && tab === 'payments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Suivi des Scolarités d'élèves</h1>
                  <p className="text-slate-400 text-xs font-semibold mt-0.5">Vérifiez les versements effectués, facturez les trimestres en cours et suivez les impayés.</p>
                </div>
                {!isTeacher && (
                  <button onClick={() => setShowAddPayment(!showAddPayment)} className={btnClass}>
                    <Plus size={16} /> <span>Facturer un élève</span>
                  </button>
                )}
              </div>

              {showAddPayment && (
                <div className="bg-white rounded-[28px] border-2 border-[#18bfd6]/20 shadow-xl shadow-[#18bfd6]/5 p-6 mb-2">
                  <h3 className="font-extrabold text-slate-905 mb-4 text-base">Émettre une facture scolaire</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Sélectionner Élève *</label>
                      <select value={newPayment.student_id} onChange={e => setNewPayment({...newPayment, student_id: e.target.value})} className={inputCls}>
                        <option value="">Sélectionner —</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.classe || 'Aucune classe'})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block font-semibold">Désignation du paiement *</label>
                      <input placeholder="ex: Inscription, Scolarité Trimestre 2" value={newPayment.label} onChange={e => setNewPayment({...newPayment, label: e.target.value})} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block font-bold">Montant Brut (GNF) *</label>
                      <input type="number" placeholder="ex: 300000" value={newPayment.amount} onChange={e => setNewPayment({...newPayment, amount: e.target.value})} className={inputCls} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-5 justify-end">
                    <button onClick={() => setShowAddPayment(false)} className="px-5 py-2.5 bg-slate-100 text-slate-500 hover:bg-slate-200/80 rounded-2xl font-black text-xs uppercase tracking-wider cursor-pointer transition-colors">Annuler</button>
                    <button onClick={async () => {
                      if (submitting) return;
                      if (!newPayment.student_id) { toast.error("Veuillez sélectionner un élève."); return; }
                      
                      const labelTrimmed = newPayment.label.trim();
                      if (!labelTrimmed) { toast.error("Veuillez renseigner le libellé de facturation."); return; }
                      
                      if (!newPayment.amount) { toast.error("Veuillez renseigner le montant brut."); return; }
                      const parsedAmount = parseInt(newPayment.amount);
                      if (isNaN(parsedAmount) || parsedAmount <= 0) {
                        toast.error("Veuillez saisir un montant de facturation supérieur à 0 GNF.");
                        return;
                      }

                      setSubmitting(true);
                      try {
                        await addPayment({ ...newPayment, label: labelTrimmed, amount: parsedAmount.toString() });
                        toast.success("Facture émise avec succès !"); setShowAddPayment(false); loadAll();
                        setNewPayment({ student_id: '', label: 'Scolarité T1', amount: '' });
                      } catch { 
                        toast.error("Erreur d'enregistrement du paiement."); 
                      } finally {
                        setSubmitting(false);
                      }
                    }} disabled={submitting} className={`${btnClass} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {submitting ? "Création..." : "Créer la facture"}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {payments.length === 0 ? (
                  <p className="text-slate-400 text-sm font-semibold py-8 text-center bg-white rounded-3xl border border-slate-100">Aucun paiement répertorié.</p>
                ) : (
                  payments.map(p => (
                    <div key={p.id} className="bg-white rounded-3xl border border-slate-100/95 p-5 flex items-center justify-between shadow-sm hover:translate-y-[-1px] transition-all">
                      <div>
                        <p className="font-extrabold text-[#0F172A] text-sm md:text-base">
                          {students.find(s => s.id === p.student_id)?.name || p.student_name || 'Élève Anonyme'}
                          <span className="text-slate-400 font-bold ml-1">· {p.label}</span>
                        </p>
                        <p className="text-xs text-[#18bfd6] font-bold mt-1.5 uppercase tracking-wider font-mono bg-[#18bfd6]/5 border border-[#18bfd6]/10 px-2.5 py-1 rounded-lg w-fit">{parseInt(p.amount).toLocaleString()} GNF</p>
                      </div>
                      {p.is_paid ? (
                        <span className="text-[10px] font-black text-green-600 bg-green-500/10 border border-green-500/10 px-4 py-2 rounded-full uppercase tracking-wider font-semibold animate-fade-in">Payé</span>
                      ) : (
                        <button onClick={async () => { await markPaymentPaid(p.id); loadAll(); toast.success("Règlement validé avec succès !"); }}
                          className="text-[10px] font-black text-[#fcb303] bg-[#fcb303]/10 border border-[#fcb303]/20 hover:bg-[#fcb303]/20 px-4 py-2.5 rounded-2xl transition-all cursor-pointer uppercase tracking-wider">
                          Valider paiement
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* FACTURATION & REÇUS */}
          {!loading && tab === 'facturation' && !isTeacher && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Receipt className="text-amber-500" size={26} />
                    Facturation Scolaire & Reçus de Caisse
                  </h1>
                  <p className="text-slate-400 text-xs font-semibold mt-0.5">Émettez des factures de scolarité, tenues et frais annexes, et imprimez les reçus officiels avec timbre d'établissement.</p>
                </div>
                <button onClick={() => setShowAddInvoice(!showAddInvoice)} className={btnClass}>
                  <Plus size={16} /> <span>Émettre une Facture</span>
                </button>
              </div>

              {/* Metrics Summary Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5 rounded-3xl shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-90 mb-1">Total Facturé</span>
                  <p className="text-2xl font-black font-mono">
                    {invoices.reduce((acc, inv) => acc + (inv.net_amount || inv.amount || 0), 0).toLocaleString()} <span className="text-xs">GNF</span>
                  </p>
                  <span className="text-[9px] uppercase font-black bg-white/20 px-2 py-0.5 rounded mt-2 inline-block">{invoices.length} document(s)</span>
                </div>
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-5 rounded-3xl shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-wider block text-emerald-600 mb-1">Total Recouvré</span>
                  <p className="text-2xl font-black font-mono">
                    {invoices.filter(i => i.status === 'Payé').reduce((acc, inv) => acc + (inv.net_amount || inv.amount || 0), 0).toLocaleString()} <span className="text-xs">GNF</span>
                  </p>
                  <span className="text-[9px] uppercase font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded mt-2 inline-block">Caisse Encaissée</span>
                </div>
                <div className="bg-rose-50 text-rose-800 border border-rose-100 p-5 rounded-3xl shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-wider block text-rose-600 mb-1">Reste à Encaisser</span>
                  <p className="text-2xl font-black font-mono">
                    {invoices.filter(i => i.status !== 'Payé').reduce((acc, inv) => acc + (inv.net_amount || inv.amount || 0), 0).toLocaleString()} <span className="text-xs">GNF</span>
                  </p>
                  <span className="text-[9px] uppercase font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded mt-2 inline-block">Impayés / Attente</span>
                </div>
                <div className="bg-cyan-50 text-cyan-800 border border-cyan-100 p-5 rounded-3xl shadow-sm">
                  <span className="text-[10px] font-black uppercase tracking-wider block text-cyan-600 mb-1">Taux de Recouvrement</span>
                  <p className="text-2xl font-black font-mono">
                    {invoices.length > 0 
                      ? Math.round((invoices.filter(i => i.status === 'Payé').length / invoices.length) * 100) 
                      : 100}%
                  </p>
                  <span className="text-[9px] uppercase font-black bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded mt-2 inline-block">Règlements Validés</span>
                </div>
              </div>

              {/* Form Add Invoice */}
              {showAddInvoice && (
                <div className="bg-white rounded-[28px] border-2 border-amber-500/30 shadow-xl p-6 space-y-4">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <FileText size={18} className="text-amber-500" />
                    Créer une Nouvelle Facture / Reçu de Paiement
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Élève *</label>
                      <select 
                        value={newInvoice.student_id} 
                        onChange={e => setNewInvoice({ ...newInvoice, student_id: e.target.value })} 
                        className={inputCls}
                      >
                        <option value="">Sélectionner un élève —</option>
                        {students.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.classe || 'Non affecté'}) — {s.matricule}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Nature de la Facture *</label>
                      <select 
                        value={newInvoice.type} 
                        onChange={e => setNewInvoice({ ...newInvoice, type: e.target.value })} 
                        className={inputCls}
                      >
                        <option value="Frais de Scolarité - Tranche 1">Frais de Scolarité - Tranche 1</option>
                        <option value="Frais de Scolarité - Tranche 2">Frais de Scolarité - Tranche 2</option>
                        <option value="Frais de Scolarité - Tranche 3">Frais de Scolarité - Tranche 3</option>
                        <option value="Inscription & Frais de Dossier">Inscription & Frais de Dossier</option>
                        <option value="Tenue & Uniforme Scolaire">Tenue & Uniforme Scolaire</option>
                        <option value="Transport & Cantine">Transport & Cantine</option>
                        <option value="Frais d'Examen Blanc / Bac / BEPC">Frais d'Examen Blanc / Bac / BEPC</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Montant Brut (GNF) *</label>
                      <input 
                        type="number" 
                        value={newInvoice.amount} 
                        onChange={e => setNewInvoice({ ...newInvoice, amount: e.target.value })} 
                        className={inputCls} 
                        placeholder="1500000"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Remise / Réduction (GNF)</label>
                      <input 
                        type="number" 
                        value={newInvoice.discount} 
                        onChange={e => setNewInvoice({ ...newInvoice, discount: e.target.value })} 
                        className={inputCls} 
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Mode de Règlement</label>
                      <select 
                        value={newInvoice.payment_method} 
                        onChange={e => setNewInvoice({ ...newInvoice, payment_method: e.target.value })} 
                        className={inputCls}
                      >
                        <option value="Orange Money">Orange Money</option>
                        <option value="Mobile Money">Mobile Money (MTN)</option>
                        <option value="Espèces">Espèces au guichet</option>
                        <option value="Chèque Bancaire">Chèque Bancaire</option>
                        <option value="Virement Bancaire">Virement Bancaire</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Statut du Paiement</label>
                      <select 
                        value={newInvoice.status} 
                        onChange={e => setNewInvoice({ ...newInvoice, status: e.target.value })} 
                        className={inputCls}
                      >
                        <option value="Payé">Payé (Encaissé)</option>
                        <option value="En attente">En attente de paiement</option>
                        <option value="Partiel">Paiement Partiel</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Date d'Émission</label>
                      <input 
                        type="date" 
                        value={newInvoice.date} 
                        onChange={e => setNewInvoice({ ...newInvoice, date: e.target.value })} 
                        className={inputCls} 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Date d'Échéance</label>
                      <input 
                        type="date" 
                        value={newInvoice.due_date} 
                        onChange={e => setNewInvoice({ ...newInvoice, due_date: e.target.value })} 
                        className={inputCls} 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Notes / Référence de Transaction</label>
                      <input 
                        type="text" 
                        value={newInvoice.notes} 
                        onChange={e => setNewInvoice({ ...newInvoice, notes: e.target.value })} 
                        className={inputCls} 
                        placeholder="Réf Orange Money #883920..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <button onClick={() => setShowAddInvoice(false)} className="px-5 py-2.5 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase cursor-pointer hover:bg-slate-200">Annuler</button>
                    <button onClick={handleAddInvoiceLocal} className={btnClass}>Générer la Facture</button>
                  </div>
                </div>
              )}

              {/* Table Ledger Invoices */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-base">Registre Officiel des Factures & Reçus</h3>
                  <span className="text-[10px] font-black uppercase bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
                    {invoices.length} Reçu(s) disponible(s)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <th className="pb-3 font-bold">N° Facture / Date</th>
                        <th className="pb-3 font-bold">Élève & Classe</th>
                        <th className="pb-3 font-bold">Designation</th>
                        <th className="pb-3 font-bold">Montant Net</th>
                        <th className="pb-3 font-bold">Mode & Statut</th>
                        <th className="pb-3 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoices.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">Aucune facture enregistrée.</td>
                        </tr>
                      ) : (
                        invoices.map(inv => (
                          <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4">
                              <p className="font-mono font-black text-slate-900 text-xs">{inv.invoice_number}</p>
                              <p className="text-[10px] text-slate-400 font-bold">{inv.date}</p>
                            </td>
                            <td className="py-4">
                              <p className="font-extrabold text-slate-900 text-sm">{inv.student_name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{inv.classe}</span>
                                <span className="text-[9px] font-mono text-slate-400">{inv.matricule}</span>
                              </div>
                            </td>
                            <td className="py-4">
                              <p className="font-bold text-slate-700 text-xs">{inv.type}</p>
                              {inv.notes && <p className="text-[10px] text-slate-400 italic line-clamp-1">{inv.notes}</p>}
                            </td>
                            <td className="py-4 font-mono">
                              <p className="font-black text-slate-900 text-sm">{inv.net_amount?.toLocaleString() || inv.amount?.toLocaleString()} GNF</p>
                              {inv.discount > 0 && <p className="text-[9px] text-emerald-600 font-bold">Remise -{inv.discount?.toLocaleString()} GNF</p>}
                            </td>
                            <td className="py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                inv.status === 'Payé' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                <Check size={10} /> {inv.status} ({inv.payment_method})
                              </span>
                            </td>
                            <td className="py-4 text-right space-x-2">
                              <button 
                                onClick={() => setSelectedInvoiceForPrint(inv)} 
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all inline-flex items-center gap-1 cursor-pointer shadow-xs"
                              >
                                <Printer size={12} /> Reçu PDF
                              </button>
                              <button 
                                onClick={() => {
                                  const filtered = invoices.filter(i => i.id !== inv.id);
                                  setInvoices(filtered);
                                  localStorage.setItem('kharandi_demo_invoices', JSON.stringify(filtered));
                                  toast.success("Facture supprimée.");
                                }} 
                                className="p-1.5 hover:bg-rose-50 rounded-xl text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PRINTABLE INVOICE / RECEIPT MODAL */}
          {selectedInvoiceForPrint && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-[32px] max-w-2xl w-full p-8 shadow-2xl relative space-y-6 text-slate-900">
                <button 
                  onClick={() => setSelectedInvoiceForPrint(null)}
                  className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-500 transition-colors"
                >
                  ✕
                </button>

                {/* Printable Document Sheet Header */}
                <div className="border-b-2 border-amber-500 pb-4 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://lh3.googleusercontent.com/d/1NnKKOKkq_li7F4_dNgGBVUXHR_K2xL55" 
                      alt="Logo Kharandi" 
                      className="w-12 h-12 object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{schoolName}</h2>
                      <p className="text-[10px] text-slate-500 font-bold">Complexe Scolaire & Académique d'Excellence</p>
                      <p className="text-[10px] text-slate-400">Conakry, République de Guinée · Tél: +224 622 00 00 00</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-200">
                      REÇU DE CAISSE
                    </span>
                    <p className="font-mono font-black text-sm text-slate-900 mt-2">{selectedInvoiceForPrint.invoice_number}</p>
                    <p className="text-[10px] text-slate-400 font-bold">Date: {selectedInvoiceForPrint.date}</p>
                  </div>
                </div>

                {/* Student / Parent info card */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Délivré à l'Élève</span>
                    <p className="font-black text-slate-900 text-sm">{selectedInvoiceForPrint.student_name}</p>
                    <p className="text-slate-500 font-bold">Classe : <span className="text-slate-800">{selectedInvoiceForPrint.classe}</span></p>
                    <p className="text-slate-500 font-bold">Matricule : <span className="font-mono text-slate-800">{selectedInvoiceForPrint.matricule}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Détails Règlement</span>
                    <p className="font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md inline-block uppercase text-[10px]">
                      {selectedInvoiceForPrint.status}
                    </p>
                    <p className="text-slate-500 font-bold mt-1">Mode : {selectedInvoiceForPrint.payment_method}</p>
                    <p className="text-slate-500 font-bold">Échéance : {selectedInvoiceForPrint.due_date}</p>
                  </div>
                </div>

                {/* Invoice Items Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500">
                      <tr>
                        <th className="p-3">Désignation des Prestations / Frais</th>
                        <th className="p-3 text-right">Montant Brut</th>
                        <th className="p-3 text-right">Remise</th>
                        <th className="p-3 text-right">Total Net</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold">
                      <tr>
                        <td className="p-3 font-bold text-slate-900">{selectedInvoiceForPrint.type}</td>
                        <td className="p-3 text-right font-mono">{selectedInvoiceForPrint.amount?.toLocaleString()} GNF</td>
                        <td className="p-3 text-right font-mono text-emerald-600">-{selectedInvoiceForPrint.discount?.toLocaleString()} GNF</td>
                        <td className="p-3 text-right font-mono font-black text-slate-900">{selectedInvoiceForPrint.net_amount?.toLocaleString()} GNF</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="bg-amber-50/60 p-4 border-t border-amber-200/50 flex justify-between items-center font-mono">
                    <span className="font-black text-xs uppercase tracking-wider text-slate-700">Montant Total Encaissé</span>
                    <span className="text-xl font-black text-slate-900">{selectedInvoiceForPrint.net_amount?.toLocaleString()} GNF</span>
                  </div>
                </div>

                {/* Stamp & Signatures */}
                <div className="grid grid-cols-2 gap-6 pt-4 text-center text-xs">
                  <div className="border-t border-dashed border-slate-300 pt-3">
                    <p className="text-[10px] font-black uppercase text-slate-400">Signature du Parent / Tuteur</p>
                    <div className="h-12 flex items-center justify-center italic text-slate-400 font-serif">Lu et approuvé</div>
                  </div>
                  <div className="border-t border-dashed border-slate-300 pt-3 relative">
                    <p className="text-[10px] font-black uppercase text-slate-400">Pour la Caisse Kharandi</p>
                    <div className="my-1 inline-block border-2 border-emerald-600 text-emerald-700 font-black px-4 py-1 rounded-lg uppercase tracking-widest text-[10px] transform -rotate-3 bg-emerald-50 shadow-xs">
                      ✔ PAYÉ - TAMPON OFFICIEL
                    </div>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => window.print()} 
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Printer size={16} /> Imprimer le Reçu Officiel
                  </button>
                  <button 
                    onClick={() => setSelectedInvoiceForPrint(null)} 
                    className="px-6 py-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-2xl font-black text-xs uppercase cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ABSENCES */}
          {!loading && tab === 'absences' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Appel & Présences journalières</h1>
                  <p className="text-slate-400 text-xs font-semibold mt-0.5">Portez les absences d'élèves par date et matière pour un meilleur suivi de l'assiduité.</p>
                </div>
                <button onClick={() => setShowAddAbsence(!showAddAbsence)} className={btnClass}>
                  <Plus size={16} /> <span>Signaler absence</span>
                </button>
              </div>

              {showAddAbsence && (
                <div className="bg-white rounded-[28px] border-2 border-[#18bfd6]/20 shadow-xl shadow-[#18bfd6]/5 p-6 mb-2">
                  <h3 className="font-extrabold text-slate-905 mb-4 text-base">Signaler une absence</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center pl-1 text-left">
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Élève *</label>
                      <select value={newAbsence.student_id} onChange={e => setNewAbsence({...newAbsence, student_id: e.target.value})} className={inputCls}>
                        <option value="">Sélectionner —</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.classe || 'Aucune classe'})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block font-bold font-mono">Date de l'absence *</label>
                      <input type="date" value={newAbsence.date} onChange={e => setNewAbsence({...newAbsence, date: e.target.value})} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1.5 block">Matière / Cours concerné</label>
                      <input placeholder="ex: Physique, Français" value={newAbsence.subject} onChange={e => setNewAbsence({...newAbsence, subject: e.target.value})} className={inputCls} />
                    </div>
                    <div className="md:pt-6">
                      <label className="flex items-center gap-2.5 text-[11px] font-black uppercase text-slate-500 cursor-pointer select-none">
                        <input type="checkbox" checked={newAbsence.is_justified} onChange={e => setNewAbsence({...newAbsence, is_justified: e.target.checked})} className="w-5 h-5 accent-[#18bfd6]" />
                        <span>Justifiée par un billet</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-5 justify-end">
                    <button onClick={() => setShowAddAbsence(false)} className="px-5 py-2.5 bg-slate-100 text-slate-500 hover:bg-slate-200/80 rounded-2xl font-black text-xs uppercase tracking-wider cursor-pointer transition-colors">Annuler</button>
                    <button onClick={async () => {
                      if (submitting) return;
                      if (!newAbsence.student_id) { toast.error("Veuillez sélectionner un élève."); return; }
                      if (!newAbsence.date) { toast.error("Veuillez spécifier la date de l'absence."); return; }
                      
                      const subjectTrimmed = newAbsence.subject.trim();

                      setSubmitting(true);
                      try {
                        await addAbsence({ ...newAbsence, subject: subjectTrimmed }); 
                        toast.success("Absence enregistrée avec succès !");
                        setShowAddAbsence(false); 
                        setNewAbsence({ student_id: '', date: new Date().toISOString().split('T')[0], subject: '', is_justified: false });
                        loadAll();
                      } catch { 
                        toast.error("Erreur lors de l'enregistrement de l'absence."); 
                      } finally {
                        setSubmitting(false);
                      }
                    }} disabled={submitting} className={`${btnClass} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {submitting ? "Enregistrement..." : "Enregistrer l'absence"}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {absences.length === 0 ? (
                  <p className="text-slate-400 text-sm font-semibold py-8 text-center bg-white rounded-3xl border border-slate-100">Aucune absence signalée.</p>
                ) : (
                  absences.map(a => (
                    <div key={a.id} className="bg-white rounded-3xl border border-slate-100/95 p-5 flex items-center justify-between shadow-sm hover:translate-y-[-1px] transition-all">
                      <div>
                        <p className="font-extrabold text-[#0F172A] text-sm md:text-base">
                          {students.find(s => s.id === a.student_id)?.name || a.student_name || 'Élève Anonyme'}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-200/50 text-slate-500 px-2 py-0.5 rounded-md">{a.date}</span>
                          {a.subject && <span className="text-xs text-slate-400 font-bold">Matière: {a.subject}</span>}
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-4.5 py-1.5 rounded-full uppercase tracking-wider border ${a.justified ? 'bg-green-500/10 text-green-600 border-green-500/10' : 'bg-rose-500/10 text-rose-500 border-rose-500/10'}`}>
                        {a.justified ? 'Justifiée' : 'Non justifiée'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* CARTES SCOLAIRES PVC */}
          {!loading && tab === 'badges' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Cartes Scolaires PVC & Badges d'Accès</h1>
                  <p className="text-slate-400 text-xs font-semibold mt-0.5">Générez et imprimez les cartes d'identité scolaires PVC officielles avec photo, matricule et puce NFC pour vos élèves.</p>
                </div>
                <button
                  onClick={() => setShowAddBadgeSetting(!showAddBadgeSetting)}
                  className="px-5 py-3 bg-gradient-to-r from-[#18bfd6] to-[#15adc1] hover:to-[#129bb0] text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#18bfd6]/10"
                >
                  <Plus size={16} /> <span>Générer une Carte Scolaire</span>
                </button>
              </div>

              {/* Formulaire de création de carte */}
              {showAddBadgeSetting && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 border border-slate-200/50 p-6 rounded-[32px] shadow-sm animate-slide-in">
                  
                  {/* Champs du formulaire */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                    <h3 className="font-extrabold text-[#0D172A] text-base flex items-center gap-2">
                      <CreditCard size={18} className="text-[#18bfd6]" />
                      <span>Formulaire Carte d'Identité Scolaire</span>
                    </h3>

                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">Sélectionner un élève existant (Pré-remplissage)</label>
                        <select
                          value={newBadge.student_id}
                          onChange={e => handleSelectStudentForBadge(e.target.value)}
                          className={inputCls}
                        >
                          <option value="">-- Choisir dans la liste des élèves --</option>
                          {students.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.classe || "Scolarisé"}) — {s.matricule}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">Nom *</label>
                          <input
                            placeholder="ex: DIALLO"
                            value={newBadge.nom}
                            onChange={e => setNewBadge({ ...newBadge, nom: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">Prénom *</label>
                          <input
                            placeholder="ex: Mamadou"
                            value={newBadge.prenom}
                            onChange={e => setNewBadge({ ...newBadge, prenom: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">Classe *</label>
                          <input
                            placeholder="ex: Terminal SM"
                            value={newBadge.classe}
                            onChange={e => setNewBadge({ ...newBadge, classe: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">Téléphone Parent / Urgence *</label>
                          <input
                            placeholder="+224 622 00 00 00"
                            value={newBadge.phone}
                            onChange={e => setNewBadge({ ...newBadge, phone: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">Matricule Élève</label>
                          <input
                            placeholder="KHR-2026-001"
                            value={newBadge.matricule}
                            onChange={e => setNewBadge({ ...newBadge, matricule: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">Groupe Sanguin</label>
                          <input
                            placeholder="ex: O+ ou A+"
                            value={newBadge.blood_group}
                            onChange={e => setNewBadge({ ...newBadge, blood_group: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">URL Photo Identité Élève</label>
                          <input
                            placeholder="https://images.unsplash.com/..."
                            value={newBadge.photo_url}
                            onChange={e => setNewBadge({ ...newBadge, photo_url: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">Code Puce NFC / RFID d'accès</label>
                          <input
                            placeholder="NFC-2026-88A9-42B1"
                            value={newBadge.nfc_code}
                            onChange={e => setNewBadge({ ...newBadge, nfc_code: e.target.value })}
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">Intitulé Officiel de la Carte</label>
                        <input
                          placeholder="Carte d'Identité Scolaire Officielle 2025-2026"
                          value={newBadge.title}
                          onChange={e => setNewBadge({ ...newBadge, title: e.target.value })}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        onClick={() => setShowAddBadgeSetting(false)}
                        className="px-5 py-2.5 bg-slate-100 text-slate-500 hover:bg-slate-200/80 rounded-2xl font-black text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={async () => {
                          if (submitting) return;
                          if (!newBadge.nom || !newBadge.prenom) {
                            toast.error("Veuillez renseigner le nom et le prénom de l'élève.");
                            return;
                          }
                          setSubmitting(true);
                          try {
                            const badgeToAdd = {
                              id: 'bdg_' + Date.now(),
                              badge_type: 'carte_scolaire',
                              student_id: newBadge.student_id,
                              student_name: `${newBadge.nom.toUpperCase()} ${newBadge.prenom}`,
                              nom: newBadge.nom.toUpperCase(),
                              prenom: newBadge.prenom,
                              classe: newBadge.classe || 'Élève',
                              phone: newBadge.phone || '+224 600 00 00 00',
                              matricule: newBadge.matricule || 'KHR-2026-000',
                              photo_url: newBadge.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                              role_or_section: 'Élève Régulier',
                              blood_group: newBadge.blood_group || 'O+',
                              title: newBadge.title || 'Carte d\'Identité Scolaire',
                              category: 'Cyan',
                              message: 'Carte scolaire officielle Kharandi - Badge d\'accès NFC',
                              signatory: 'La Direction Académique',
                              nfc_code: newBadge.nfc_code || 'NFC-' + Math.floor(1000 + Math.random() * 9000),
                              nfc_active: true,
                              date: new Date().toISOString().split('T')[0]
                            };

                            const updatedBadges = [badgeToAdd, ...schoolBadges];
                            localStorage.setItem('kharandi_demo_badges', JSON.stringify(updatedBadges));
                            setSchoolBadges(updatedBadges);
                            toast.success("Carte Scolaire générée avec succès !");
                            setShowAddBadgeSetting(false);
                          } catch {
                            toast.error("Échec lors de la création de la carte.");
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                        disabled={submitting}
                        className={`px-5 py-2.5 bg-[#18bfd6] hover:bg-[#15adc1] text-white rounded-2xl font-black text-xs uppercase tracking-wider cursor-pointer shadow-md shadow-[#18bfd6]/10 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {submitting ? "Création..." : "Générer la Carte Scolaire PVC"}
                      </button>
                    </div>
                  </div>

                  {/* Visual Preview column */}
                  <div className="lg:col-span-5 flex flex-col justify-center bg-slate-100/10 border border-slate-200/60 p-6 rounded-2xl text-center space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Aperçu Réel Format PVC</p>
                      <p className="text-[11px] font-semibold text-slate-500">Rendu exact de la carte PVC ISO 7810 ID-1 pour l'élève.</p>
                    </div>

                    {/* Styled Card mockup */}
                    <div className="relative w-full max-w-[340px] h-[210px] mx-auto rounded-3xl bg-gradient-to-br from-[#18bfd6] via-[#129bb0] to-[#0d6f7e] p-4 text-white shadow-xl overflow-hidden border border-white/20 flex flex-col justify-between text-left">
                      <div className="relative z-10 flex items-center justify-between border-b border-white/20 pb-1.5">
                        <div className="flex items-center gap-1.5">
                          <img 
                            src="https://lh3.googleusercontent.com/d/1NnKKOKkq_li7F4_dNgGBVUXHR_K2xL55" 
                            alt="Logo Kharandi" 
                            className="w-6 h-6 object-contain bg-white/20 p-1 rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-extrabold text-[10px] uppercase tracking-tight">{schoolName}</p>
                            <p className="text-[7px] font-bold text-cyan-200 uppercase tracking-widest">CARTE D'IDENTITÉ SCOLAIRE</p>
                          </div>
                        </div>
                        <span className="text-[7px] font-black uppercase bg-white/20 px-1.5 py-0.5 rounded border border-white/30">NFC</span>
                      </div>

                      <div className="relative z-10 flex items-center gap-3 py-1">
                        <img 
                          src={newBadge.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                          alt="Photo élève"
                          className="w-16 h-20 object-cover rounded-xl border-2 border-white shadow-sm bg-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 space-y-1">
                          <p className="text-[7px] uppercase font-bold text-cyan-200">Élève</p>
                          <p className="font-black text-xs uppercase leading-tight truncate">
                            {newBadge.nom || 'NOM'} {newBadge.prenom || 'Prénom'}
                          </p>
                          <p className="text-[8px] font-extrabold text-cyan-100">Classe : {newBadge.classe || 'Classe'}</p>
                          <p className="text-[8px] font-mono font-bold text-white/90">Matricule : {newBadge.matricule || 'KHR-2026-000'}</p>
                        </div>
                      </div>

                      <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-1 text-[8px]">
                        <span className="font-mono text-cyan-200">{newBadge.nfc_code || 'NFC-2026-001'}</span>
                        <span className="font-extrabold uppercase text-[#fcb303]">2025 - 2026</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Cartes list */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-[#0F172A] text-base">Cartes Scolaires & Badges Émis ({schoolBadges.length})</h3>

                {schoolBadges.length === 0 ? (
                  <p className="text-slate-400 text-sm font-semibold py-12 text-center bg-white rounded-3xl border border-slate-100">Aucune carte scolaire n'a été émise pour le moment.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                    {schoolBadges.map((b) => (
                      <div
                        key={b.id}
                        className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <span className="text-[9px] font-black uppercase tracking-wider text-[#18bfd6] bg-[#18bfd6]/10 border border-[#18bfd6]/20 px-2.5 py-1 rounded-full">
                            Carte Scolaire PVC
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-slate-400 font-mono font-bold">{b.date}</span>
                            <button
                              onClick={() => {
                                const updated = schoolBadges.filter(bg => bg.id !== b.id);
                                localStorage.setItem('kharandi_demo_badges', JSON.stringify(updated));
                                setSchoolBadges(updated);
                                toast.success("Carte scolaire supprimée.");
                              }}
                              className="w-7 h-7 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                              title="Supprimer la carte"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <img 
                            src={b.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                            alt={b.student_name}
                            className="w-14 h-16 object-cover rounded-2xl border border-slate-200 shadow-xs shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 space-y-0.5">
                            <h4 className="font-extrabold text-[#0D172A] text-sm leading-tight truncate">{b.student_name}</h4>
                            <p className="text-[11px] font-bold text-slate-500">Classe : <span className="text-slate-800 font-extrabold">{b.classe || 'Scolarisé'}</span></p>
                            <p className="text-[10px] font-mono font-bold text-slate-400">Matricule : {b.matricule || 'KHR-2026'}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                          <div className="text-left">
                            <p className="text-[8px] uppercase font-black tracking-wider text-slate-400">Code Puce NFC</p>
                            <p className="font-mono text-[10px] font-bold text-slate-700">{b.nfc_code || 'NFC-2026-88A9'}</p>
                          </div>
                          <button
                            onClick={() => setSelectedBadgeForPrint(b)}
                            className="px-3 py-1.5 bg-[#18bfd6] hover:bg-[#15adc1] text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Printer size={12} /> Imprimer Carte PVC
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PRINTABLE PVC SCHOOL CARD / BADGE MODAL */}
          {selectedBadgeForPrint && (
            <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-[32px] max-w-lg w-full p-6 shadow-2xl relative space-y-6 text-slate-900 animate-fade-in">
                <button 
                  onClick={() => setSelectedBadgeForPrint(null)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-500 transition-colors cursor-pointer"
                >
                  ✕
                </button>

                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900">Impression Carte Scolaire / Badge PVC</h3>
                  <p className="text-xs text-slate-500 font-semibold">Format officiel ISO 7810 ID-1 (85.6mm x 53.9mm) prêt pour imprimante PVC & Scanner NFC</p>
                </div>

                {/* PVC Card Render Front */}
                <div className="relative w-full max-w-[380px] h-[230px] mx-auto rounded-3xl bg-gradient-to-br from-[#18bfd6] via-[#129bb0] to-[#0d6f7e] p-5 text-white shadow-2xl overflow-hidden border-2 border-white/20 flex flex-col justify-between">
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:16px_16px] opacity-15" />
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#fcb303]/30 rounded-full blur-2xl" />

                  {/* Header PVC */}
                  <div className="relative z-10 flex items-center justify-between border-b border-white/20 pb-2">
                    <div className="flex items-center gap-2">
                      <img 
                        src="https://lh3.googleusercontent.com/d/1NnKKOKkq_li7F4_dNgGBVUXHR_K2xL55" 
                        alt="Logo Kharandi" 
                        className="w-7 h-7 object-contain bg-white/20 p-1 rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-extrabold text-xs uppercase tracking-tight">{schoolName}</p>
                        <p className="text-[8px] font-bold text-cyan-200 uppercase tracking-widest">
                          {selectedBadgeForPrint.badge_type === 'merite' ? 'INSIGNE & CERTIFICAT DE MÉRITE' : 'CARTE D\'IDENTITÉ SCOLAIRE'}
                        </p>
                      </div>
                    </div>
                    {/* NFC Puce icon */}
                    <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full border border-white/30 text-[8px] font-black uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      NFC
                    </div>
                  </div>

                  {/* PVC Body: Photo + Details */}
                  <div className="relative z-10 flex items-center gap-4 py-2">
                    <div className="relative">
                      <img 
                        src={selectedBadgeForPrint.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                        alt={selectedBadgeForPrint.student_name}
                        className="w-20 h-24 object-cover rounded-2xl border-2 border-white shadow-md bg-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-[#fcb303] text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded-md border border-white">
                        {selectedBadgeForPrint.blood_group || 'O+'}
                      </span>
                    </div>

                    <div className="min-w-0 space-y-1 text-left flex-1">
                      <div>
                        <p className="text-[8px] uppercase font-black tracking-widest text-cyan-200">Nom & Prénom</p>
                        <p className="font-black text-sm uppercase leading-tight truncate">{selectedBadgeForPrint.nom || selectedBadgeForPrint.student_name} {selectedBadgeForPrint.prenom || ''}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[9px]">
                        <div>
                          <p className="text-[7px] uppercase font-bold text-cyan-200">Classe</p>
                          <p className="font-extrabold truncate">{selectedBadgeForPrint.classe || 'Élève'}</p>
                        </div>
                        <div>
                          <p className="text-[7px] uppercase font-bold text-cyan-200">Matricule</p>
                          <p className="font-mono font-extrabold truncate">{selectedBadgeForPrint.matricule || 'KHR-2026'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[7px] uppercase font-bold text-cyan-200">Urgence / Tuteur</p>
                        <p className="font-mono font-bold text-[9px] truncate">{selectedBadgeForPrint.phone || '+224 622 00 00 00'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer PVC */}
                  <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-1.5 text-[8px]">
                    <span className="font-mono opacity-80">{selectedBadgeForPrint.nfc_code || 'NFC-2026-88A9'}</span>
                    <span className="font-black uppercase tracking-widest text-[#fcb303]">ANNÉE 2025-2026</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => window.print()} 
                    className="flex-1 py-3.5 bg-gradient-to-r from-[#18bfd6] to-[#129bb0] text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Printer size={16} /> Imprimer la Carte PVC
                  </button>
                  <button 
                    onClick={() => setSelectedBadgeForPrint(null)} 
                    className="px-6 py-3.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-2xl font-black text-xs uppercase cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
          {!loading && tab === 'teachers' && !isTeacher && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Corps Enseignant</h1>
                  <p className="text-slate-400 text-xs font-semibold mt-0.5">Gérez l'affectation de vos professeurs officiels et leurs classes associées.</p>
                </div>
                <button onClick={() => setShowAddTeacher(!showAddTeacher)} className={btnClass}>
                  <Plus size={16} /> <span>Nouveau professeur</span>
                </button>
              </div>

              {showAddTeacher && (
                <div className="bg-white rounded-[28px] border-2 border-[#18bfd6]/20 shadow-xl shadow-[#18bfd6]/5 p-6 mb-2">
                  <h3 className="font-extrabold text-slate-900 mb-4 text-base">Créer un profil enseignant</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Nom & Prénom *</label>
                      <input placeholder="ex: M. Soumah, Mme Camara" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Adresse Email officielle *</label>
                      <input type="email" placeholder="ex: conde@ecole.gn" value={newTeacher.email} onChange={e => setNewTeacher({...newTeacher, email: e.target.value})} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Mot de passe temporaire</label>
                      <input placeholder="Par défaut: kharandi2026" value={newTeacher.password} onChange={e => setNewTeacher({...newTeacher, password: e.target.value})} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block font-semibold">Classes Assignées (Séparées par virgule)</label>
                      <input placeholder="ex: Terminal SSE, Terminal SM" value={newTeacher.classes} onChange={e => setNewTeacher({...newTeacher, classes: e.target.value})} className={inputCls} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-5 justify-end">
                    <button onClick={() => setShowAddTeacher(false)} className="px-5 py-2.5 bg-slate-100 text-slate-500 hover:bg-slate-200/80 rounded-2xl font-black text-xs uppercase tracking-wider cursor-pointer transition-colors">Annuler</button>
                    <button onClick={async () => {
                      if (submitting) return;
                      const nameTrimmed = newTeacher.name.trim();
                      if (!nameTrimmed) { toast.error("Le nom de l'enseignant est obligatoire."); return; }
                      
                      const emailTrimmed = newTeacher.email.trim();
                      if (!emailTrimmed) { toast.error("L'adresse email est obligatoire."); return; }
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(emailTrimmed)) {
                        toast.error("Format d'adresse email invalide.");
                        return;
                      }

                      setSubmitting(true);
                      try {
                        await addTeacher({
                          school_id: schoolId, 
                          name: nameTrimmed, 
                          email: emailTrimmed,
                          password: newTeacher.password || 'kharandi2026',
                          classes: newTeacher.classes.split(',').map(c => c.trim()).filter(Boolean),
                        });
                        toast.success("Enseignant ajouté avec succès !"); setShowAddTeacher(false); loadAll();
                        setNewTeacher({ name: '', email: '', password: 'kharandi2026', classes: '' });
                      } catch (err: any) { 
                        toast.error(err.response?.data?.message || "Erreur lors de la création."); 
                      } finally {
                        setSubmitting(false);
                      }
                    }} disabled={submitting} className={`${btnClass} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {submitting ? "Enregistrement..." : "Enregistrer l'enseignant"}
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm text-left">
                {teachers.length === 0 ? (
                  <p className="text-slate-400 text-sm font-semibold py-8 text-center bg-white">Aucun professeur répertorié.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-6 py-3.5 text-[11px] font-black uppercase text-slate-500 tracking-wider">Nom de l'Enseignant</th>
                          <th className="px-6 py-3.5 text-[11px] font-black uppercase text-slate-500 tracking-wider">Adresse Email Officielle</th>
                          <th className="px-6 py-3.5 text-[11px] font-black uppercase text-slate-500 tracking-wider">Classes d'intervention</th>
                          <th className="px-6 py-3.5 text-[11px] font-black uppercase text-slate-500 tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {teachers.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-600">
                              {t.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-wrap gap-1">
                                {(t.classes || []).length > 0 ? (
                                  (t.classes || []).map((cl: string, idx: number) => (
                                    <span key={idx} className="text-[10px] font-black uppercase bg-[#fcb303]/5 border border-[#fcb303]/10 text-[#fcb303] px-2 py-0.5 rounded-md">{cl}</span>
                                  ))
                                ) : (
                                  <span className="text-xs text-slate-400 italic">Aucune classe</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                              <button onClick={async () => { if (confirm("Êtes-vous sûr de vouloir supprimer ce professeur du corps enseignant ?")) { await deleteTeacher(t.id); loadAll(); toast.success("Enseignant supprimé."); } }}
                                className="text-rose-500 hover:text-rose-700 font-black uppercase tracking-wider hover:underline transition-colors cursor-pointer">
                                Retirer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ANNONCES & CAHIER DE DEVOIRS (NEW MANAGEMENT MODULE) */}
          {!loading && tab === 'announcements' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Annonces & Cahier de devoirs</h1>
                  <p className="text-slate-400 text-xs font-semibold mt-0.5">Publiez les circulaires scolaires et devoirs assignés consultables instantanément par les parents d'élèves.</p>
                </div>
                <button onClick={() => setShowAddAnnouncement(!showAddAnnouncement)} className={btnClass}>
                  <Plus size={16} /> <span>Publier une annonce / devoir</span>
                </button>
              </div>

              {showAddAnnouncement && (
                <div className="bg-white rounded-[28px] border-2 border-[#18bfd6]/20 shadow-xl shadow-[#18bfd6]/5 p-6 mb-2">
                  <h3 className="font-extrabold text-slate-900 mb-4 text-base">Créer une communication</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Titre de l'annonce ou devoir *</label>
                      <input placeholder="ex: Devoir de Mathématiques à rendre, Examen de physique..." value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Catégorie communication *</label>
                      <select value={newAnnouncement.category} onChange={e => setNewAnnouncement({...newAnnouncement, category: e.target.value})} className={inputCls}>
                        <option value="Information">Information administrative</option>
                        <option value="Devoir">Devoir à la maison / Exercices</option>
                        <option value="Message">Message général / Notification</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Classe ciblée *</label>
                      <select value={newAnnouncement.className} onChange={e => setNewAnnouncement({...newAnnouncement, className: e.target.value})} className={inputCls}>
                        <option value="Toutes les classes">Toutes les classes</option>
                        {classes.map(cl => (
                          <option key={cl.id} value={cl.name}>{cl.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 mb-1 block">Contenu détaillé de la publication *</label>
                      <textarea rows={4} placeholder="Rédigez ici les consignes, devoirs ou notes de service destinées aux familles..." value={newAnnouncement.content} onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})} className={`${inputCls} resize-none py-3 h-28`} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-5 justify-end">
                    <button onClick={() => setShowAddAnnouncement(false)} className="px-5 py-2.5 bg-slate-100 text-slate-500 hover:bg-slate-200/80 rounded-2xl font-black text-xs uppercase tracking-wider cursor-pointer transition-colors">Annuler</button>
                    <button onClick={() => {
                      if (submitting) return;
                      const titleTrimmed = newAnnouncement.title.trim();
                      if (!titleTrimmed) { toast.error("Le titre de la communication est obligatoire."); return; }
                      const contentTrimmed = newAnnouncement.content.trim();
                      if (!contentTrimmed) { toast.error("Le contenu détaillé est obligatoire."); return; }
                      
                      setSubmitting(true);
                      try {
                        const updatedAnn = [
                          {
                            id: `ann_${Date.now()}`,
                            title: titleTrimmed,
                            content: contentTrimmed,
                            category: newAnnouncement.category,
                            className: newAnnouncement.className,
                            date: new Date().toISOString().split('T')[0],
                            author: isTeacher ? profile.name : "La Direction"
                          },
                          ...announcements
                        ];
                        localStorage.setItem('kharandi_demo_announcements', JSON.stringify(updatedAnn));
                        setAnnouncements(updatedAnn);
                        toast.success("Publication diffusée avec succès !");
                        setShowAddAnnouncement(false);
                        setNewAnnouncement({ title: '', content: '', category: 'Information', className: 'Toutes les classes' });
                      } catch {
                        toast.error("Erreur de publication.");
                      } finally {
                        setSubmitting(false);
                      }
                    }} disabled={submitting} className={`${btnClass} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {submitting ? "Diffusion..." : "Diffuser la communication"}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <p className="text-slate-400 text-sm font-semibold py-8 text-center bg-white rounded-3xl border border-slate-100">Aucune annonce diffusée actuellement.</p>
                ) : (
                  announcements.map((ann) => {
                    const isHomework = ann.category?.toLowerCase() === 'devoir';
                    const catBg = isHomework ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20';
                    return (
                      <div key={ann.id} className="bg-white rounded-3xl border border-slate-100/95 p-6 shadow-sm flex items-start justify-between gap-4 text-left">
                        <div className="space-y-1.5 flex-1 select-text">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${catBg}`}>
                              {ann.category || 'Information'}
                            </span>
                            <span className="text-xs text-slate-400 font-bold font-mono">{ann.date}</span>
                            <span className="text-xs text-slate-400 font-mono italic">· Auteur : {ann.author || 'Direction'}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200/50 px-2 py-0.5 rounded ml-auto">
                              Cible : {ann.className}
                            </span>
                          </div>
                          <h3 className="font-extrabold text-[#0F172A] text-base md:text-lg leading-snug">{ann.title}</h3>
                          <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold mt-3 whitespace-pre-wrap">{ann.content}</p>
                        </div>
                        <button onClick={() => {
                          if (confirm("Supprimer cette communication définitivement ?")) {
                            const filtered = announcements.filter(a => a.id !== ann.id);
                            localStorage.setItem('kharandi_demo_announcements', JSON.stringify(filtered));
                            setAnnouncements(filtered);
                            toast.success("Publication supprimée de l'espace parent.");
                          }
                        }}
                          className="p-3 hover:bg-rose-50 rounded-2xl text-rose-400 hover:text-rose-600 transition-colors border border-transparent hover:border-rose-100 cursor-pointer shrink-0 mt-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
