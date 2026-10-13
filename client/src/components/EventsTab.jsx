import { useState } from 'react';
import { Clock, MapPin, Info, Drama, Award, Sparkles, Music, X, Users, UserCheck } from 'lucide-react';

const eventsList = [
  {
    id: 1,
    title: 'Y I P Band Live Music Concert',
    tag: 'Live Music Concert',
    time: '17:20 - 19:00',
    location: 'Concert Hall',
    banner: '/eventbanner/musicbandbanner.webp',
    icon: <Music className="w-5 h-5 text-amber-400" />,
    shortDesc: 'A live concert performance featuring a full band and a lineup of vocalists.',
    vocalists: ['Emerald Si', 'Ei Mon', 'Rowan', 'Maria', 'Moosoe', 'Htut Myat Kaung', 'Htoi N Dwang', 'Kaven', 'Aung Myo Oo'],
    fullDesc: 'A live musical showcase featuring high-energy musical arrangements performed by the Y I P Band alongside vocal artists.'
  },
  {
    id: 2,
    title: 'Clouds Meeting Point (Tain Tite Toh Sone Yar)',
    tag: 'Musical Drama',
    time: '17:30 - 18:10',
    location: 'Main Stage',
    banner: '/eventbanner/musicaldramabanner.webp',
    icon: <Sparkles className="w-5 h-5 text-amber-400" />,
    shortDesc: 'An emotional musical stage play highlighting story-driven music performances.',
    castList: [
      { name: 'Aung Kham', role: 'Soe Nanda' },
      { name: 'Saw Bar Balute Moo', role: 'Nay Min Khant' },
      { name: 'Htoi N Dwang', role: 'Nadi' },
      { name: 'Naw Nora Lin', role: 'Su Thiri' },
      { name: 'Naw Maria', role: 'Daw Thida Soe' }
    ],
    fullDesc: 'A dramatic theatrical play brought to life through rich character narratives and music routines.'
  },
  {
    id: 3,
    title: 'Ngu Wa Nee Anyeint',
    tag: 'Traditional Burmese Performance',
    time: '19:00 - 20:00',
    location: 'Main Stage',
    banner: '/eventbanner/anyeintbanner.webp',
    icon: <Drama className="w-5 h-5 text-amber-400" />,
    shortDesc: 'A traditional Burmese performing arts showcase featuring graceful dance and humor.',
    cast: {
      lead: 'University Amy',
      supporting: 'University Nay Chi',
      comedians: ['Ko Phyu Tote', 'Ko Pi Si', 'Ko Shwe Moe', 'Ko Shwe Kaung']
    },
    fullDesc: 'A classic cultural performance combining elegant traditional dances by the lead and supporting dancers with lighthearted comedic acts by the featured comedians (Lu Shwen Daw).'
  },
  {
    id: 4,
    title: "Myanmar Students' Association Ambassador Selection & Crowning (2569)",
    tag: 'Crowning Ceremony',
    time: '20:25 - 20:40',
    location: 'Center Arena',
    banner: '/eventbanner/ambassadorsbanner.webp',
    icon: <Award className="w-5 h-5 text-amber-400" />,
    shortDesc: 'The flagship competition and official crowning ceremony for student representatives.',
    fullDesc: 'Male and female contestants (Freshy Ambassadors) compete in traditional attire, leading up to the official crowning moment for the newly selected Myanmar Students\' Association Ambassadors of Mae Fah Luang University.'
  }
];

export default function EventsTab() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-zinc-100">Gala Shows & Schedule</h1>
        <p className="text-xs text-zinc-400">Tap any show card to view banner and full event details.</p>
      </div>

      <div className="space-y-4">
        {eventsList.map((evt) => (
          <div
            key={evt.id}
            onClick={() => setSelectedEvent(evt)}
            className="bg-[#1d1d20]/80 border border-zinc-800/80 rounded-2xl overflow-hidden cursor-pointer hover:border-amber-400/50 transition-all shadow-xl group"
          >
            {/* Event Banner Container (Uncropped Original Aspect Ratio) */}
            <div className="w-full bg-zinc-950 border-b border-zinc-800/80">
              <img
                src={evt.banner}
                alt={evt.title}
                loading="lazy"
                className="w-full h-auto object-contain block group-hover:scale-[1.01] transition-transform duration-300"
              />
            </div>

            {/* Event Content */}
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-[#0f0f10] border border-zinc-800 rounded-xl shrink-0 group-hover:border-amber-500/40 transition-colors">
                  {evt.icon}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-extrabold uppercase text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {evt.tag}
                    </span>
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-mono shrink-0">
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

              <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-amber-300 font-semibold">
                <span className="flex items-center gap-1 text-zinc-400 font-normal">
                  <MapPin className="w-3 h-3 text-amber-400" /> {evt.location}
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Full Program Details <Info className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f0f10] border border-amber-500/30 w-full max-w-md rounded-2xl p-5 relative shadow-2xl space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#1d1d20]/90 border border-amber-500/30 text-zinc-300 flex items-center justify-center hover:bg-[#27272a] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
              <img
                src={selectedEvent.banner}
                alt={selectedEvent.title}
                loading="lazy"
                className="w-full h-auto object-contain block"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#1d1d20] border border-amber-500/20 rounded-xl text-amber-300 shrink-0">
                {selectedEvent.icon}
              </div>
              <div>
                <span className="text-[9px] font-extrabold uppercase text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {selectedEvent.tag}
                </span>
                <h3 className="text-base font-bold text-zinc-100 mt-0.5 leading-snug">{selectedEvent.title}</h3>
              </div>
            </div>

            <div className="bg-[#1d1d20]/80 border border-zinc-800 rounded-xl p-3 text-xs space-y-1.5 font-mono">
              <div className="flex items-center gap-2 text-zinc-200">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Time: <strong className="text-amber-300">{selectedEvent.time}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Venue: <strong className="text-amber-300">{selectedEvent.location}</strong></span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Overview</p>
              <p className="text-xs text-zinc-300 leading-relaxed">{selectedEvent.fullDesc}</p>
            </div>

            {selectedEvent.cast && (
              <div className="space-y-2 bg-[#1d1d20]/60 p-3 rounded-xl border border-zinc-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Users className="w-3 h-3 text-amber-400" /> Cast & Performer Lineup
                </p>
                <div className="text-xs space-y-1 text-zinc-300">
                  <p><strong className="text-zinc-100">Lead Actress (Min Samee):</strong> {selectedEvent.cast.lead}</p>
                  <p><strong className="text-zinc-100">Supporting Actress:</strong> {selectedEvent.cast.supporting}</p>
                  <p><strong className="text-zinc-100">Comedians (Lu Shwen Daw):</strong> {selectedEvent.cast.comedians.join(', ')}</p>
                </div>
              </div>
            )}

            {selectedEvent.castList && (
              <div className="space-y-2 bg-[#1d1d20]/60 p-3 rounded-xl border border-zinc-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-amber-400" /> Cast & Characters
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                  {selectedEvent.castList.map((c, i) => (
                    <div key={i} className="bg-[#0f0f10] p-2 rounded-lg border border-zinc-800/80">
                      <span className="font-bold text-zinc-100">{c.name}</span>
                      <span className="text-amber-300 text-[11px] block">as {c.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedEvent.vocalists && (
              <div className="space-y-2 bg-[#1d1d20]/60 p-3 rounded-xl border border-zinc-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Music className="w-3 h-3 text-amber-400" /> Featured Vocalists
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEvent.vocalists.map((v, i) => (
                    <span key={i} className="bg-[#0f0f10] text-zinc-200 border border-amber-500/20 text-[11px] px-2.5 py-1 rounded-md font-medium">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}

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