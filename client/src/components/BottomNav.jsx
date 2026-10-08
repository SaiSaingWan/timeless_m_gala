import { Calendar, Award, Ticket } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'ambassadors', label: 'Ambassadors', icon: Award },
    { id: 'ticket', label: 'My Ticket', icon: Ticket },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#0f0f10]/90 backdrop-blur-lg border-t border-zinc-800/80 px-6 py-2.5 flex justify-around items-center z-40">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-amber-300 font-bold scale-105'
                : 'text-zinc-500 hover:text-zinc-300 font-medium'
            }`}
          >
            <div className={`p-1.5 rounded-lg transition-colors ${
              isActive ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-transparent'
            }`}>
              <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : ''}`} />
            </div>
            <span className="text-[10px] tracking-wide">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}