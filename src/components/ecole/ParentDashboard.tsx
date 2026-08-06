import React, { useState, useEffect } from 'react';
import {
  LogOut, User, GraduationCap, CreditCard, Clock, School,
  Calendar, Award, Printer, ChevronRight, BookOpen, MessageSquare, ShieldAlert,
  Megaphone, Bell, Shield, ArrowLeft
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface Props {
  studentData: {
    student:  any;
    grades:   any[];
    payments: any[];
    absences: any[];
    school:   any;
  };
  onLogout: () => void;
}

export const ParentDashboard: React.FC<Props> = ({ studentData, onLogout }) => {
  const { student, grades, payments, absences, school } = studentData;
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'bulletin' | 'announcements' | 'badges'>('overview');
  const [schedules, setSchedules] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);

  // Load schedules, announcements, and badges on mounting
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSchedules = JSON.parse(localStorage.getItem('kharandi_demo_schedules') || '[]');
      setSchedules(storedSchedules);

      // Initialize sample announcements if empty
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

      // Initialize sample badges if empty
      if (!localStorage.getItem('kharandi_demo_badges')) {
        localStorage.setItem('kharandi_demo_badges', JSON.stringify([
          {
            id: 'b_1',
            student_id: student.id || 'demo_s1',
            student_name: student.name,
            title: "Étoile de Kharandi",
            category: "Gold",
            message: "Félicitations chaleureuses pour des résultats exceptionnels et une attitude de travail exemplaire tout au long du trimestre.",
            date: "2026-06-15",
            signatory: "La Direction de l'Établissement"
          },
          {
            id: 'b_2',
            student_id: student.id || 'demo_s1',
            student_name: student.name,
            title: "Camarade Modèle",
            category: "Violet",
            message: "Distinction accordée pour son esprit de camaraderie remarquable, son entraide précieuse et son soutien quotidien envers ses pairs.",
            date: "2026-06-12",
            signatory: "Mme. Condé (Français)"
          }
        ]));
      }

      const storedAnnouncements = JSON.parse(localStorage.getItem('kharandi_demo_announcements') || '[]');
      setAnnouncements(storedAnnouncements);

      const allBadges = JSON.parse(localStorage.getItem('kharandi_demo_badges') || '[]');
      const filteredBadges = allBadges.filter((b: any) => b.student_id === student.id);
      setBadges(filteredBadges);
    }
  }, [student.id, student.name]);

  // Filter schedules matching this child's class exactly
  const studentClass = student.classe || 'Terminal SSE';
  const childSchedules = schedules.filter(s => s.classe?.toLowerCase() === studentClass.toLowerCase());

  // Filter announcements for the child
  const childAnnouncements = announcements.filter(
    ann => ann.className === 'Toutes les classes' || ann.className?.toLowerCase() === studentClass?.toLowerCase()
  );

  const averageValue = grades.length > 0
    ? (grades.reduce((sum, g) => sum + parseFloat(g.value || 0), 0) / grades.length).toFixed(2)
    : null;

  // Coefficient mapper matching School Dashboard rules
  const getCoefficient = (subjectName: string) => {
    const sub = subjectName.toLowerCase();
    if (sub.includes('math')) return 4;
    if (sub.includes('phys') || sub.includes('chim')) return 3;
    if (sub.includes('philo') || sub.includes('franç') || sub.includes('liter')) return 3;
    if (sub.includes('hist') || sub.includes('géo') || sub.includes('angla')) return 2;
    return 1;
  };

  const getChildPhoto = (name: string) => {
    const isGirl = name.toLowerCase().includes('fatou') || name.toLowerCase().includes('mariam') || name.toLowerCase().includes('aminata') || name.toLowerCase().includes('binta') || name.toLowerCase().includes('barry');
    if (isGirl) {
      // High-quality modern African young school girl photo
      return "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200";
    }
    // High-quality modern young school boy photo
    return "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=200";
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-6 pb-24 relative overflow-hidden">
      
      {/* Background Ambient Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#18bfd6]/10 blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] rounded-full bg-[#fcb303]/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#18bfd6_0.5px,transparent_0.5px),radial-gradient(#fcb303_0.5px,transparent_0.5px)] bg-[size:32px_32px] [background-position:0_0,16px_16px] opacity-[0.03]" />
      </div>

      <div className="max-w-4xl mx-auto z-10 relative space-y-6">
        
        {/* Header Block / Child Profile Card */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-100/90 shadow-sm text-left">
          <div className="flex items-center gap-4 text-left">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#18bfd6]/30 shadow-md shrink-0 bg-slate-100 flex items-center justify-center">
              <img 
                src={getChildPhoto(student.name)} 
                alt={student.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#fcb303]">Espace Parent d'Élève</p>
              <h1 className="font-extrabold text-slate-900 text-lg md:text-xl mt-0.5 leading-tight truncate">{student.name}</h1>
              <p className="text-xs text-slate-400 font-bold mt-1.5 flex items-center gap-2">
                <span className="font-mono text-[9px] bg-slate-100 border border-slate-200/50 text-slate-700 px-2 py-0.5 rounded-md font-bold">{student.matricule}</span> 
                <span>·</span> 
                <span>Classe: <b className="text-slate-700">{studentClass}</b></span>
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button onClick={() => window.location.href = '/'} className="flex items-center justify-center gap-2 px-5 py-3 bg-[#18bfd6]/10 hover:bg-[#18bfd6]/20 text-[#18bfd6] rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer">
              <ArrowLeft size={16} /> <span>Plateforme Kharandi</span>
            </button>
            <button onClick={onLogout} className="flex items-center justify-center gap-2 px-5 py-3 bg-rose-50 hover:bg-rose-100/80 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer">
              <LogOut size={16} /> <span>Quitter l'Espace</span>
            </button>
          </div>
        </div>

        {/* Institution Reference Area */}
        <div className="bg-white rounded-3xl border border-slate-100/90 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-[#fcb303]/10 text-[#fcb303] rounded-xl flex items-center justify-center shrink-0">
              <School size={20} />
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Établissement académique de votre enfant</p>
              <p className="font-extrabold text-[#0F172A] text-sm mt-0.5">{school?.name || "Complexe Scolaire Kharandi"}</p>
            </div>
          </div>
          <span className="text-[9px] font-black uppercase bg-green-500/15 text-green-700 border border-green-500/10 px-3 py-1 rounded-full w-fit">
            Statut de scolarité : Régulier
          </span>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex flex-wrap bg-slate-200/40 p-1.5 rounded-2xl gap-2 w-fit">
          {[
            { id: 'overview', label: "Vue d'ensemble", icon: User, badge: null },
            { id: 'schedule', label: "Emploi du temps", icon: Calendar, badge: null },
            { id: 'announcements', label: "Annonces & Devoirs", icon: MessageSquare, badge: childAnnouncements.length },
            { id: 'badges', label: "Carte Scolaire PVC", icon: CreditCard, badge: badges.length },
            { id: 'bulletin', label: "Consulter le Bulletin", icon: Award, badge: null }
          ].map(tb => {
            const isSel = activeTab === tb.id;
            return (
              <button key={tb.id} onClick={() => setActiveTab(tb.id as any)}
                className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer relative
                  ${isSel ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                <tb.icon size={14} className={isSel ? "text-[#18bfd6]" : "text-slate-400"} />
                <span>{tb.label}</span>
                {tb.badge !== null && tb.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-[#18bfd6] text-white rounded-full text-[9px] font-bold leading-none">
                    {tb.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* VUE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* School Life Cheerful Banner */}
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#18bfd6] to-[#fcb303] p-6 text-white text-left shadow-lg">
              <div className="absolute inset-0 bg-black/15 mix-blend-multiply z-0" />
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl z-0" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-none">
                <div className="space-y-1.5 md:max-w-md">
                  <span className="text-[9px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full mb-2 inline-block">Saison Académique 2026</span>
                  <h3 className="text-xl md:text-2xl font-black tracking-tight leading-tight">Accompagnez la réussite de votre enfant</h3>
                  <p className="text-xs text-white/90 leading-relaxed font-semibold">Suivez ses appréciations au jour le jour, encouragez ses progrès et célébrez ses mérites scolaires.</p>
                </div>
                <div className="w-56 h-32 rounded-2xl overflow-hidden shadow-inner border border-white/25 shrink-0 bg-slate-100/10">
                  <img 
                    src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=350" 
                    alt="School banner" 
                    className="w-full h-full object-cover brightness-95" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                { label: 'Moyenne générale', value: averageValue ? `${averageValue}/20` : '—', color: 'bg-emerald-50 text-emerald-700 border border-emerald-100', icon: <GraduationCap size={20}/> },
                { label: 'Scolarités Réglées', value: `${payments.filter(p=>p.is_paid).length} / ${payments.length}`, color: 'bg-indigo-50 text-indigo-700 border border-indigo-100', icon: <CreditCard size={20}/> },
                { label: 'Absences Signalées', value: absences.length, color: 'bg-amber-50 text-amber-700 border border-amber-100', icon: <Clock size={20}/> },
              ].map((s, i) => (
                <div key={i} className={`${s.color} rounded-3xl p-5 text-center flex flex-col items-center justify-center relative overflow-hidden shadow-sm border`}>
                  <div className="mb-2.5 opacity-90">{s.icon}</div>
                  <p className="text-xl md:text-3xl font-black tracking-tight">{s.value}</p>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-wider opacity-80 mt-1.5 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Informational Box */}
            <div className="bg-[#18bfd6]/5 border border-[#18bfd6]/10 p-5 rounded-3xl text-left flex gap-3.5 items-start">
              <ShieldAlert className="text-[#18bfd6] shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-extrabold text-slate-950 text-sm">Note d'information aux parents</h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-1 font-semibold">
                  Cette interface est synchronisée en temps réel avec le bureau du Principal de l'établissement. Toute modification de note, toute absence consignée ou tout règlement financier est instantanément actualisé sur cet espace sécurisé.
                </p>
              </div>
            </div>

            {/* Twin Columns Detail Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Grades ledger */}
              <div className="bg-white rounded-[28px] border border-slate-100/90 shadow-sm p-6 space-y-4 text-left">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                  <GraduationCap size={20} className="text-[#18bfd6]" />
                  <h3 className="font-extrabold text-slate-900 text-sm md:text-base">Dernières Évaluations</h3>
                </div>
                {grades.length === 0 ? (
                  <p className="text-slate-400 text-xs font-semibold py-8 text-center bg-slate-50/20 rounded-2xl border border-dashed">Aucune évaluation récente.</p>
                ) : (
                  <div className="space-y-2.5">
                    {grades.map((g, i) => {
                      const val = parseFloat(g.value);
                      const valCls = val >= 10 ? 'text-green-600 bg-green-500/10 border-green-500/10' : 'text-rose-500 bg-rose-500/10 border-rose-500/10';
                      return (
                        <div key={i} className="flex justify-between items-center p-3.5 bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-xl border border-slate-100">
                          <div>
                            <p className="font-black text-slate-900 text-xs">{g.subject}</p>
                            <p className="text-[10px] text-slate-450 mt-1 flex items-center gap-1.5 font-bold">
                              <span className="uppercase">{g.trimester}</span>
                              {g.comment && <span>·</span>}
                              {g.comment && <span className="font-medium text-slate-500 italic">"{g.comment}"</span>}
                            </p>
                          </div>
                          <span className={`${valCls} font-black text-xs md:text-sm px-2.5 py-1 rounded-lg border font-mono`}>{g.value}/20</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Payments ledger & Absences list stacked */}
              <div className="space-y-6 text-left">
                {/* Tuition bills list */}
                <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                    <CreditCard size={20} className="text-indigo-600" />
                    <h3 className="font-extrabold text-slate-900 text-sm md:text-base">Facturation & Frais de Scolarité</h3>
                  </div>
                  {payments.length === 0 ? (
                    <p className="text-slate-400 text-xs font-semibold py-6 text-center bg-slate-50/20 rounded-2xl border border-dashed">Aucun frais scolaire en attente.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {payments.map((p, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-slate-50/40 rounded-xl border border-slate-100">
                          <div>
                            <p className="font-black text-xs text-slate-900">{p.label}</p>
                            <p className="text-[10px] text-slate-450 tracking-wide font-mono mt-0.5 font-bold">{parseInt(p.amount).toLocaleString()} GNF</p>
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${p.is_paid ? 'bg-green-500/10 text-green-600 border-green-500/10' : 'bg-rose-500/10 text-rose-500 border-rose-500/10'}`}>
                            {p.is_paid ? 'Payé' : 'En attente'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Absences tracked */}
                <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
                    <Clock size={20} className="text-amber-500" />
                    <h3 className="font-extrabold text-slate-900 text-sm md:text-base">Absences & Retards relevés</h3>
                  </div>
                  {absences.length === 0 ? (
                    <p className="text-slate-400 text-xs font-semibold py-6 text-center bg-slate-50/20 rounded-2xl border border-dashed">Aucune absence enregistrée.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {absences.map((ab, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-slate-50/40 rounded-xl border border-slate-100">
                          <div>
                            <p className="font-black text-xs text-slate-905">{ab.date}</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Matière: {ab.subject}</p>
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${ab.justified ? 'bg-green-500/10 text-green-600 border-green-500/10' : 'bg-rose-500/15 text-rose-500 border-rose-100'}`}>
                            {ab.justified ? 'Justifiée' : 'Non justifiée'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* EMPLOI DU TEMPS ACCESSIBLE */}
        {activeTab === 'schedule' && (
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6 text-left animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base md:text-lg">Emploi du Temps Hebdomadaire</h3>
                <p className="text-slate-400 text-xs font-semibold mt-0.5">Suivez heure par heure les cours officiels de votre enfant.</p>
              </div>
              <span className="text-[10px] font-black uppercase bg-[#18bfd6]/10 text-[#18bfd6] px-3 py-1 rounded-full">{studentClass}</span>
            </div>

            <div className="space-y-5">
              {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map(day => {
                const dayLessons = childSchedules.filter(s => s.day === day);
                return (
                  <div key={day} className="border-b border-slate-100 pb-4 last:border-none last:pb-0">
                    <h4 className="font-extrabold text-slate-800 text-xs tracking-wide uppercase text-[#fcb303] bg-[#fcb303]/10 px-2.5 py-1 rounded-md w-fit mb-2.5">{day}</h4>
                    {dayLessons.length === 0 ? (
                      <p className="text-[11px] text-slate-405 font-semibold italic pl-3">Aucun cours dispensé ce jour-là.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {dayLessons.map(l => (
                          <div key={l.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                            <span className="text-[9px] font-mono text-[#18bfd6] font-bold block mb-1">{l.time}</span>
                            <p className="font-black text-xs text-slate-900 leading-tight">{l.subject}</p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1">Enseignant : <span className="text-slate-600 font-semibold">{l.teacher || 'Responsable'}</span></p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ANNONCES & CAHIER DE DEVOIRS (NEW FEATURE) */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base md:text-lg">Cahier d'Annonces & Devoirs</h3>
                  <p className="text-slate-400 text-xs font-semibold mt-0.5">Retrouvez les circulaires importantes, messages de la direction et devoirs assignés à la classe de votre enfant.</p>
                </div>
                <div className="w-10 h-10 bg-[#18bfd6]/10 text-[#18bfd6] rounded-xl flex items-center justify-center shrink-0">
                  <Megaphone size={20} />
                </div>
              </div>

              {childAnnouncements.length === 0 ? (
                <div className="py-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <Bell size={40} className="mx-auto text-slate-300 mb-2.5" />
                  <p className="text-slate-500 font-bold text-sm">Aucune annonce ou devoir récent pour cette classe.</p>
                  <p className="text-slate-400 text-xs mt-1">Les messages de l'administration s'afficheront ici en temps réel.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {childAnnouncements.map((ann) => {
                    const isHomework = ann.category?.toLowerCase() === 'devoir';
                    const catBg = isHomework ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20';
                    return (
                      <div key={ann.id} className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 p-5 rounded-2xl transition-all relative">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${catBg}`}>
                                {ann.category || 'Information'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold font-mono">{ann.date}</span>
                              <span className="text-[10px] text-slate-400 font-mono italic">· Par {ann.author || 'Équipe administrative'}</span>
                            </div>
                            <h4 className="font-extrabold text-slate-900 text-sm md:text-base leading-snug">{ann.title}</h4>
                            <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-semibold mt-2 whitespace-pre-wrap">{ann.content}</p>
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200/50 px-2 py-1 rounded">
                            {ann.className}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CONSULTATION ET IMPRESSION DU BULLETIN COEFF */}
        {activeTab === 'bulletin' && (
          <div className="space-y-6 animate-fade-in text-left">
            {grades.length === 0 ? (
              <div className="bg-white p-12 rounded-[32px] border border-slate-100 text-center">
                <Award size={48} className="text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 font-bold text-sm">Le Conseil d'Établissement n'a pas encore clos ou validé de notes pour ce trimestre.</p>
              </div>
            ) : (() => {
              // Calculate grades coefficients globally
              const trimester = 'T1'; // Fallback to current
              const studentGrades = grades; // loaded parents grades is already correct

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
              const appreciation = generalAverage >= 16 ? "Félicitations chaleureuses de la direction." :
                                   generalAverage >= 14 ? "Excellent trimestre. Résultats prometteurs." :
                                   generalAverage >= 12 ? "Bon trimestre, poursuivez la même voie." :
                                   generalAverage >= 10 ? "Passable. Une attention accrue à la maison est recommandée." :
                                   "Travail insuffisant sur ce trimestre. Des révisions sérieuses s'imposent.";

              return (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 rounded-[32px] overflow-hidden relative shadow-lg">
                  {/* Guinea colors top row layout */}
                  <div className="absolute top-0 left-0 right-0 h-2.5 flex">
                    <div className="flex-1 bg-red-600" />
                    <div className="flex-1 bg-yellow-400" />
                    <div className="flex-1 bg-emerald-500" />
                  </div>

                  <div className="p-6 md:p-8 space-y-6" id="parent-bulletin-print-wrapper">
                    {/* Letterhead */}
                    <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
                      <div>
                        <h2 className="font-extrabold text-slate-905 text-base md:text-lg uppercase tracking-tight">{school?.name || "Complexe Scolaire Kharandi"}</h2>
                        <p className="text-slate-450 text-[10px] uppercase font-bold tracking-widest text-[#18bfd6]">Portail Parent Connecté</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded">Bulletin Officiel</span>
                        <p className="text-slate-400 text-[11px] font-bold mt-1">Trimestre Scolaire T1</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-150">
                      <div>
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Élève ID :</p>
                        <p className="font-black text-slate-900 mt-1 text-sm md:text-base">{student.name}</p>
                        <p className="text-xs text-slate-400 font-bold">Matricule : <span className="font-mono">{student.matricule}</span></p>
                        <p className="text-xs text-slate-400 font-bold">Classe de cours: <span className="font-semibold text-slate-600">{studentClass}</span></p>
                      </div>
                      <div className="sm:text-right sm:border-l border-slate-200 sm:pl-5">
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Moyenne Générale Pondérée :</p>
                        <p className="text-2xl font-black text-[#18bfd6] mt-0.5">{generalAverage.toFixed(2)} / 20</p>
                        <p className="text-slate-400 text-xs font-bold">Matières évaluées : {subjectsList.length}</p>
                        <span className="text-[9px] font-mono bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100 mt-1 inline-block">Admis(e)</span>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            <th className="p-3 text-left">Matière</th>
                            <th className="p-3 text-center">Note Trimestre</th>
                            <th className="p-3 text-center">Coeff.</th>
                            <th className="p-3 text-center">Weighted Total</th>
                            <th className="p-3 text-left">Niveau</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-bold text-slate-700 leading-normal">
                          {subjectsList.map((s, idx) => (
                            <tr key={idx}>
                              <td className="p-3 font-semibold text-slate-900">{s.name}</td>
                              <td className="p-3 text-center text-[#18bfd6]">{s.average.toFixed(2)}/20</td>
                              <td className="p-3 text-center font-mono opacity-80">{s.coeff}</td>
                              <td className="p-3 text-center font-mono text-slate-900">{s.total.toFixed(2)}</td>
                              <td className="p-3 text-slate-400 text-[11px] italic">{s.average >= 12 ? 'Félicitations' : s.average >= 10 ? 'Moyen' : 'Insuffisant'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Footer Row */}
                    <div className="border-t border-slate-100 pt-5 text-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Conclusion du Bureau d'Études :</span>
                        <p className="font-extrabold text-slate-800 italic">"{appreciation}"</p>
                      </div>
                      <div className="text-left sm:text-right flex flex-col justify-end items-start sm:items-end">
                        <span className="text-[10px] text-slate-400 font-bold">Sceau de validation authentique</span>
                        <div className="mt-2.5 px-3.5 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-[10px] font-black uppercase text-slate-500 flex items-center gap-1.5 w-fit">
                          <School size={12} className="text-[#18bfd6]" />
                          <span>Kharandi Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Print triggers */}
                  <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
                    <button onClick={() => window.print()} className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow hover:opacity-90">
                      <Printer size={14} /> <span>Télécharger le Bulletin en PDF</span>
                    </button>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}

        {/* VUE CARTE SCOLAIRE PVC */}
        {activeTab === 'badges' && (
          <div className="space-y-6 text-left animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base md:text-lg">Carte Scolaire PVC & Badge d'Accès Élève</h3>
                <p className="text-slate-400 text-xs font-semibold mt-0.5">Carte d'identité scolaire numérique et badge d'accès NFC pour {student.name}.</p>
              </div>
              <span className="text-xs font-black uppercase text-[#18bfd6] bg-[#18bfd6]/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                <CreditCard size={14} /> Carte Valide 2025-2026
              </span>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm max-w-2xl mx-auto space-y-6 text-center">
              <div className="text-left space-y-1">
                <h4 className="font-extrabold text-slate-800 text-base">Carte d'Identité Scolaire PVC Officielle</h4>
                <p className="text-xs font-semibold text-slate-400">Présentez cette carte numérique ou téléchargez la version PVC pour l'accès aux locaux et contrôles.</p>
              </div>

              {/* Digital Card Preview */}
              <div className="relative w-full max-w-[380px] h-[230px] mx-auto rounded-3xl bg-gradient-to-br from-[#18bfd6] via-[#129bb0] to-[#0d6f7e] p-5 text-white shadow-2xl overflow-hidden border-2 border-white/20 flex flex-col justify-between text-left">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:16px_16px] opacity-15" />
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#fcb303]/30 rounded-full blur-2xl" />

                <div className="relative z-10 flex items-center justify-between border-b border-white/20 pb-2">
                  <div className="flex items-center gap-2">
                    <img 
                      src="https://lh3.googleusercontent.com/d/1NnKKOKkq_li7F4_dNgGBVUXHR_K2xL55" 
                      alt="Logo Kharandi" 
                      className="w-7 h-7 object-contain bg-white/20 p-1 rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-extrabold text-xs uppercase tracking-tight">{school?.name || 'Complexe Scolaire Kharandi'}</p>
                      <p className="text-[8px] font-bold text-cyan-200 uppercase tracking-widest">CARTE D'IDENTITÉ SCOLAIRE</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full border border-white/30 text-[8px] font-black uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    NFC
                  </div>
                </div>

                <div className="relative z-10 flex items-center gap-4 py-2">
                  <img 
                    src={student.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                    alt={student.name}
                    className="w-20 h-24 object-cover rounded-2xl border-2 border-white shadow-md bg-slate-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="min-w-0 space-y-1 text-left flex-1">
                    <div>
                      <p className="text-[8px] uppercase font-black tracking-widest text-cyan-200">Élève</p>
                      <p className="font-black text-sm uppercase leading-tight truncate">{student.name}</p>
                    </div>
                    <p className="text-[10px] font-extrabold text-cyan-100">Classe : {student.classe || 'Régulier'}</p>
                    <p className="text-[10px] font-mono font-bold text-white/90">Matricule : {student.matricule || 'KHR-2026-001'}</p>
                  </div>
                </div>

                <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-2 text-[9px]">
                  <span className="font-mono text-cyan-200">NFC-2026-88A9</span>
                  <span className="font-extrabold uppercase text-[#fcb303]">Année 2025 - 2026</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Carte Scolaire PVC - ${student.name}</title>
                            <script src="https://cdn.tailwindcss.com"></script>
                          </head>
                          <body class="bg-slate-100 flex items-center justify-center min-h-screen p-6">
                            <div class="w-[85.6mm] h-[53.9mm] bg-gradient-to-br from-[#18bfd6] to-[#0d6f7e] text-white p-4 rounded-xl shadow-2xl flex flex-col justify-between border border-white/20 relative">
                              <div class="flex items-center justify-between border-b border-white/20 pb-1">
                                <span class="font-bold text-[10px] uppercase">${school?.name || 'Complexe Scolaire Kharandi'}</span>
                                <span class="text-[8px] font-mono bg-white/20 px-1 rounded">PVC ISO ID-1</span>
                              </div>
                              <div class="flex items-center gap-3 my-auto">
                                <img src="${student.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}" class="w-12 h-14 object-cover rounded-lg border border-white bg-slate-200" />
                                <div class="text-left text-[10px]">
                                  <p class="font-black uppercase">${student.name}</p>
                                  <p class="text-cyan-100">Classe : ${student.classe || 'Régulier'}</p>
                                  <p class="font-mono text-[8px] text-cyan-200">Matricule : ${student.matricule || 'KHR-2026-001'}</p>
                                </div>
                              </div>
                              <div class="flex justify-between items-center text-[8px] border-t border-white/20 pt-1">
                                <span>Carte d'Identité Scolaire</span>
                                <span class="font-bold">2025 - 2026</span>
                              </div>
                            </div>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }
                  }}
                  className="px-6 py-3 bg-[#18bfd6] hover:bg-[#15adc1] text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md shadow-[#18bfd6]/15 transition-all"
                >
                  <Printer size={16} /> Imprimer Carte PVC
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
