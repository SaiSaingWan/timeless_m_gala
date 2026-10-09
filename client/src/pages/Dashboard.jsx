import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import EventsTab from '../components/EventsTab';
import AmbassadorsTab from '../components/AmbassadorsTab';
import TicketTab from '../components/TicketTab';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ticket');
  const [studentId, setStudentId] = useState('');
  const [userData, setUserData] = useState(null);
  const [votingFrozen, setVotingFrozen] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem('studentId');

    if (!savedId) {
      navigate('/login');
      return;
    }

    setStudentId(savedId);

    // 1. Listen for current user document
    const unsubUser = onSnapshot(doc(db, 'users', savedId), (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        const localUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        setUserData(localUser);
      }
    });

    // 2. Listen for global voting freeze setting from Firestore
    const unsubConfig = onSnapshot(doc(db, 'settings', 'eventConfig'), (configSnap) => {
      if (configSnap.exists()) {
        setVotingFrozen(configSnap.data().votingFrozen || false);
      }
    });

    return () => {
      unsubUser();
      unsubConfig();
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Dual-Category Vote Handler (Male / Female)
  const handleVote = async (category, candidateId) => {
    if (!studentId || votingFrozen || userData?.paymentStatus !== 'approved') return;

    const updateField = category === 'male' ? { votedMaleId: candidateId } : { votedFemaleId: candidateId };

    // Update local state immediately for fast feedback
    setUserData((prev) => ({ ...prev, ...updateField }));

    try {
      // Update in Firestore
      const userRef = doc(db, 'users', studentId);
      await updateDoc(userRef, updateField);
    } catch (err) {
      console.error('Failed to record vote in Firestore:', err);
    }
  };

  const studentName = userData?.fullName || localStorage.getItem('studentName') || 'MFU Student';

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-zinc-100 flex justify-center font-sans selection:bg-amber-400 selection:text-zinc-950">
      <div className="w-full max-w-md bg-[#0f0f10] min-h-screen flex flex-col shadow-2xl border-x border-zinc-800/60 relative pb-20">
        
        {/* Glow Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <Header 
          studentName={studentName} 
          studentId={studentId} 
          onLogout={handleLogout} 
        />

        <main className="px-5 py-5 flex-1">
          {activeTab === 'events' && <EventsTab />}
          
          {activeTab === 'ambassadors' && (
            <AmbassadorsTab 
              votedMaleId={userData?.votedMaleId || null} 
              votedFemaleId={userData?.votedFemaleId || null} 
              onVote={handleVote} 
              votingFrozen={votingFrozen}
              paymentStatus={userData?.paymentStatus || 'pending'}
            />
          )}

          {activeTab === 'ticket' && (
            <TicketTab 
              studentId={studentId} 
              studentName={studentName} 
              paymentStatus={userData?.paymentStatus || 'pending'} 
              checkedIn={userData?.checkedIn || false} 
            />
          )}
        </main>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}