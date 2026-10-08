import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import EventsTab from '../components/EventsTab';
import AmbassadorsTab from '../components/AmbassadorsTab';
import TicketTab from '../components/TicketTab';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ticket');
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [votedCandidateId, setVotedCandidateId] = useState(null);

  useEffect(() => {
    const savedId = localStorage.getItem('studentId');
    const savedName = localStorage.getItem('studentName') || 'MFU Student';
    const savedVote = localStorage.getItem('votedCandidateId');

    if (!savedId) {
      navigate('/login');
    } else {
      setStudentId(savedId);
      setStudentName(savedName);
      if (savedVote) setVotedCandidateId(Number(savedVote));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentName');
    navigate('/login');
  };

  const handleVote = (candidateId) => {
    setVotedCandidateId(candidateId);
    localStorage.setItem('votedCandidateId', candidateId);
  };

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
              votedCandidateId={votedCandidateId} 
              onVote={handleVote} 
            />
          )}
          {activeTab === 'ticket' && (
            <TicketTab studentId={studentId} studentName={studentName} />
          )}
        </main>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}