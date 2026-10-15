import { Calendar, Award, Ticket, ShoppingBag, Heart } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'ticket', label: 'My Ticket', icon: Ticket },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'ambassadors', label: 'Ambassadors', icon: Award },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'mokephoe', label: 'Moke Phoe', icon: Heart },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#0f0f10]/90 backdrop-blur-lg border-t border-zinc-800/80 px-3 py-2.5 flex justify-around items-center z-40">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-amber-300 font-bold scale-105'
                : 'text-zinc-500 hover:text-zinc-300 font-medium'
            }`}
          >
            <div className={`p-1.5 rounded-lg transition-colors ${
              isActive ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-transparent'
            }`}>
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : ''}`} />
            </div>
            <span className="text-[9px] tracking-wide whitespace-nowrap">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}