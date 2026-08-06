import React, { useState } from 'react';
import { EcoleLogin } from './EcoleLogin';
import { EcoleDashboard } from './EcoleDashboard';
import { ParentDashboard } from './ParentDashboard';
import { FloatingSchoolSupplies } from './FloatingSchoolSupplies';

export const EcoleApp: React.FC = () => {
  const [session, setSession] = useState<{
    type: 'school' | 'teacher' | 'parent' | null;
    profile: any;
  }>({ type: null, profile: null });

  const handleLogout = () => setSession({ type: null, profile: null });

  return (
    <div className="relative min-h-screen bg-slate-50/20 overflow-x-hidden flex flex-col selection:bg-[#18bfd6]/30">
      {/* Background layer with school bags, pens, and color blobs (login page only) */}
      {!session.type && <FloatingSchoolSupplies />}

      {/* Main interactive content layer */}
      <div className="relative z-10 flex-1 flex flex-col">
        {!session.type ? (
          <EcoleLogin
            onSchoolLogin={profile  => setSession({ type: 'school',  profile })}
            onTeacherLogin={profile => setSession({ type: 'teacher', profile })}
            onParentLogin={data     => setSession({ type: 'parent',  profile: data })}
          />
        ) : session.type === 'parent' ? (
          <ParentDashboard studentData={session.profile} onLogout={handleLogout} />
        ) : (
          <EcoleDashboard
            profile={session.profile}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
};

