import React, { useState, useEffect } from 'react';
import { GraduationCap, FileText, TrendingUp, Plus, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { EduLoading } from './EduLoading';
import { getGrades, createGrade, getStudents } from '../../services/grades';
import { toast } from 'sonner';

export const Grades: React.FC = () => {
  const { userProfile } = useAuth();
  const isTeacher = userProfile?.role === 'TUTOR';
  const [grades,       setGrades]       = useState<any[]>([]);
  const [students,     setStudents]     = useState<any[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [showForm,     setShowForm]     = useState(false);
  const [studentId,    setStudentId]    = useState('');
  const [subject,      setSubject]      = useState('');
  const [gradeType,    setGradeType]    = useState('Devoir');
  const [score,        setScore]        = useState('');
  const [maxScore,     setMaxScore]     = useState('20');
  const [date,         setDate]         = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [g, s] = await Promise.all([getGrades(), isTeacher ? getStudents() : Promise.resolve([])]);
        setGrades(g); setStudents(s);
      } catch { setGrades([]); }
      finally { setLoading(false); }
    };
    load();
  }, [isTeacher]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId && isTeacher) { toast.error("Sélectionnez un élève."); return; }
    setIsSubmitting(true);
    try {
      await createGrade({ student_id: studentId, subject, grade_type: gradeType, score: Number(score), max_score: Number(maxScore), date });
      toast.success("Note ajoutée !");
      setShowForm(false); setStudentId(''); setSubject(''); setScore('');
      setGrades(await getGrades());
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erreur lors de l'ajout.");
    } finally { setIsSubmitting(false); }
  };

  const avg = grades.length > 0 ? (grades.reduce((s, g) => s + (Number(g.score) / Number(g.max_score)) * 20, 0) / grades.length).toFixed(1) : '—';

  if (loading) return <EduLoading message="Chargement des notes..." />;

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><GraduationCap size={24} /></div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Notes & Résultats</h1>
            <p className="text-slate-500 text-sm">Moyenne générale : <span className="font-black text-primary">{avg}/20</span></p>
          </div>
        </div>
        {isTeacher && (
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
            {showForm ? <><X size={16} /> Annuler</> : <><Plus size={16} /> Ajouter</>}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && isTeacher && (
          <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit} className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Élève</label>
                <select required value={studentId} onChange={e => setStudentId(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white">
                  <option value="">— Choisir —</option>
                  {students.map((s: any) => <option key={s.id} value={s.id}>{s.name || s.phone}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Matière</label>
                <input required value={subject} onChange={e => setSubject(e.target.value)} placeholder="Mathématiques"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Type</label>
                <select value={gradeType} onChange={e => setGradeType(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white">
                  {['Devoir','Interro','Examen','TP','Oral'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Date</label>
                <input type="date" required value={date} onChange={e => setDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Note</label>
                <input type="number" required min="0" step="0.5" value={score} onChange={e => setScore(e.target.value)}
                  placeholder="14" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Note max</label>
                <input type="number" required min="1" step="1" value={maxScore} onChange={e => setMaxScore(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full py-3 bg-primary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : 'Ajouter la note'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Dynamic Link Banner for Kharandi École */}
      <div className="bg-gradient-to-r from-[#18bfd6]/10 to-[#fcb303]/10 border-2 border-[#18bfd6]/20 rounded-[28px] p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#18bfd6] bg-[#18bfd6]/10 px-2.5 py-1 rounded-md">Portail Scolaire Intégral</span>
          <h3 className="font-extrabold text-[#0F172A] text-base mt-2">Vous êtes Parent, Enseignant ou Directeur ?</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">
            Gérez votre établissement scolaire, enregistrez les notes d'élèves, suivez le règlement de scolarité ou téléchargez des bulletins sur la plateforme complète dédiée.
          </p>
        </div>
        <button 
          onClick={() => window.location.href = '/ecole'}
          className="shrink-0 w-full md:w-auto px-5 py-3.5 bg-gradient-to-r from-[#18bfd6] to-[#15adc1] hover:from-[#15adc1] hover:to-[#18bfd6] text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#18bfd6]/10 transition-all hover:scale-[1.02] transform active:scale-95 duration-200"
        >
          <span>Ouvrir l'École v2 🎒</span>
        </button>
      </div>

      {grades.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[24px] border border-slate-100">
          <GraduationCap size={48} className="mx-auto mb-3 text-slate-200" />
          <p className="font-bold text-slate-400">Aucune note disponible</p>
        </div>
      ) : (
        <div className="space-y-3">
          {grades.map((g: any) => {
            const pct = Math.round((Number(g.score) / Number(g.max_score)) * 100);
            const color = pct >= 80 ? 'text-green-600 bg-green-50' : pct >= 50 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';
            return (
              <div key={g.id} className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shrink-0 ${color}`}>
                  {g.score}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{g.subject}</p>
                  <p className="text-xs text-slate-400">{g.grade_type} · {isTeacher ? g.student_name : g.teacher_name} · {new Date(g.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <span className="text-sm font-black text-slate-600">{g.score}/{g.max_score}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
