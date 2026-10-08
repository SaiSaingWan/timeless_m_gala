import { useState } from 'react';
import { Clock, MapPin, Info, Drama, Award, Sparkles, Music, X } from 'lucide-react';

const eventsList = [
  {
    id: 1,
    title: 'A-Nyeint Stage',
    tag: 'Cultural Showcase',
    time: '18:30 - 19:30',
    location: 'Main Stage',
    icon: <Drama className="w-5 h-5 text-amber-400" />,
    shortDesc: 'Traditional stage performance blending comedy, dance, and storytelling.',
    fullDesc: 'A-Nyeint is a traditional dramatic art form combining solo dance with comedic routines and royal cultural storytelling. Performed by student troupes with live classical instrumentation.'
  },
  {
    id: 2,
    title: 'Crowning Ambassador 2026',
    tag: 'Live Gala Contest',
    time: '19:45 - 20:30',
    location: 'Center Arena',
    icon: <Award className="w-5 h-5 text-amber-400" />,
    shortDesc: 'Witness the crowning of our gala ambassadors with live audience voting.',
    fullDesc: 'The highlight of M-Gala! Watch student ambassador finalists showcase elegance and intellect on stage. Every ticket holder gets 1 live vote.'
  },
  {
    id: 3,
    title: 'Musical Drama',
    tag: 'Gala Theatre',
    time: '20:45 - 21:30',
    location: 'Main Stage',
    icon: <Sparkles className="w-5 h-5 text-amber-400" />,
    shortDesc: 'An enchanting musical drama presented by student theatrical performers.',
    fullDesc: 'Immerse yourself in an original theatrical production featuring vocal arrangements and live orchestral backings around the theme of youth and legacy.'
  },
  {
    id: 4,
    title: 'Grand Concert Live',
    tag: 'Music Band',
    time: '21:45 - 23:00',
    location: 'Concert Hall',
    icon: <Music className="w-5 h-5 text-amber-400" />,
    shortDesc: 'High-energy live concert featuring university bands and guest acts.',
    fullDesc: 'Close out the night with live music featuring student rock bands, acoustic ensembles, and special guest DJ sets celebrating M-Gala 2026.'
  }
];

export default function EventsTab() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-zinc-100">Gala Shows & Schedule</h1>
        <p className="text-xs text-zinc-400">Tap any show card to read full event details.</p>
      </div>

      <div className="space-y-3">
        {eventsList.map((evt) => (
          <div
            key={evt.id}
            onClick={() => setSelectedEvent(evt)}
            className="bg-[#1d1d20]/80 border border-zinc-800/80 rounded-2xl p-4 cursor-pointer hover:border-amber-400/50 transition-all shadow-xl group relative overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-[#0f0f10] border border-zinc-800 rounded-xl shrink-0 group-hover:border-amber-500/40 transition-colors">
                {evt.icon}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold uppercase text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {evt.tag}
                  </span>
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-amber-400" /> {evt.time}
                  </span>
                </div>
                <h2 className="text-sm font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                  {evt.title}
                </h2>
                <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">
                  {evt.shortDesc}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-amber-300 font-semibold">
              <span className="flex items-center gap-1 text-zinc-400 font-normal">
                <MapPin className="w-3 h-3 text-amber-400" /> {evt.location}
              </span>
              <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Read Details <Info className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-[#0f0f10] border border-amber-500/30 w-full max-w-sm rounded-2xl p-5 relative shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1d1d20] border border-amber-500/20 text-zinc-300 flex items-center justify-center hover:bg-[#27272a] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#1d1d20] border border-amber-500/20 rounded-xl text-amber-300">
                {selectedEvent.icon}
              </div>
              <div>
                <span className="text-[9px] font-extrabold uppercase text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {selectedEvent.tag}
                </span>
                <h3 className="text-base font-bold text-zinc-100 mt-0.5">{selectedEvent.title}</h3>
              </div>
            </div>

            <div className="bg-[#1d1d20]/80 border border-zinc-800 rounded-xl p-3 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-zinc-200">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Time: <strong>{selectedEvent.time}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Venue: <strong>{selectedEvent.location}</strong></span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Description</p>
              <p className="text-xs text-zinc-300 leading-relaxed">{selectedEvent.fullDesc}</p>
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full py-2.5 rounded-xl bg-[#1d1d20] border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-[#27272a] transition-all cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}