import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Search, CheckCircle2, Clock, Globe, Award, ChevronRight, BookMarked, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FALLBACK_BAC_SUBJECTS } from '../../data/fallbackSubjects';
import { SubjectViewer } from './SubjectViewer';
import { useAuth } from '../../contexts/AuthContext';
import { KharandiIcon } from '../icons/KharandiIcon';

export const CoursesFeature: React.FC<{
  onOpenKaramo?: (context: string) => void;
  setActiveTab?: (tab: string) => void;
}> = ({ onOpenKaramo, setActiveTab }) => {
  const { userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [coursesList, setCoursesList] = useState<any[]>([]);

  useEffect(() => {
    // Filter courses from fallback subjects or API
    const courses = FALLBACK_BAC_SUBJECTS.filter((item: any) => 
      item.doc_type === 'COURS' || (item.title && item.title.toLowerCase().includes('cours'))
    );
    setCoursesList(courses);
  }, []);

  const filteredCourses = coursesList.filter((course: any) => {
    const q = searchQuery.toLowerCase();
    return (
      (course.title && course.title.toLowerCase().includes(q)) ||
      (course.description && course.description.toLowerCase().includes(q)) ||
      (course.institution && course.institution.toLowerCase().includes(q))
    );
  });

  if (selectedCourse) {
    return (
      <SubjectViewer 
        doc={selectedCourse} 
        username={userProfile?.name || 'Élève'} 
        onClose={() => setSelectedCourse(null)} 
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-32">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0D1B2A] via-[#1b2a4a] to-[#0D1B2A] p-8 md:p-12 text-white shadow-xl border border-white/10"
      >
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-10 opacity-10 pointer-events-none">
          <KharandiIcon name="cours" size={180} />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent font-bold text-xs uppercase tracking-wider">
            <Sparkles size={14} /> Hub Pédagogique Kharandi
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Cours Officiels & Traités d'Excellence
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Accédez aux programmes complets rédigés par les meilleurs professeurs et inspecteurs guinéens (Mr. MAO et bien d'autres). Révisez, maîtrisez et réussissez tous vos examens d'État.
          </p>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un cours, un chapitre..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm">
            {filteredCourses.length} cours disponible{filteredCourses.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course: any, idx: number) => (
          <motion.div
            key={course.id || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setSelectedCourse(course)}
            className="group bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner">
                  <BookMarked size={24} />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] border border-slate-200">
                    {course.level || 'Terminale'}
                  </span>
                  {course.year && (
                    <span className="text-[10px] font-semibold text-slate-400">
                      Édition {course.year}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-slate-500 text-xs mt-2 line-clamp-3 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {course.institution && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                  <User size={13} className="text-primary" />
                  <span className="truncate">{course.institution}</span>
                </div>
              )}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Commencer la lecture <ChevronRight size={14} />
              </span>
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <BookOpen size={14} />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16 bg-white rounded-[24px] border border-slate-200 p-8">
          <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="font-bold text-lg text-slate-700">Aucun cours trouvé</h3>
          <p className="text-slate-500 text-sm mt-1">Essayez de modifier vos termes de recherche.</p>
        </div>
      )}
    </div>
  );
};
