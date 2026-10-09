import { useState } from 'react';
import { CheckCircle2, Vote, Info, X, User, Lock, Clock, ShieldAlert } from 'lucide-react';

const maleCandidates = [
  {
    id: 'm1',
    gender: 'male',
    name: 'Wai Phyo Zaw',
    number: 'Male #01',
    faculty: 'School of Management',
    motto: 'ဟောဒီ...ရှေ့ဆက်ရဲတဲ့ ခြေလှမ်းတွေဟာ ပြည့်စုံကျွမ်းကျင်မှု နဲ့ မဟုတ်။ စိတ်အားထက်သန်မှုနဲ့သာဖြစ်တယ်။',
    bio: 'Ethan has spearheaded IT community initiatives and organized tech workshops across MFU for two consecutive years.',
    image: '/males/3.png'
  },
  {
    id: 'm2',
    gender: 'male',
    name: 'Thukha Nyan',
    number: 'Male #02',
    faculty: 'School of Applied Digital Technology',
    motto: 'အတားအဆီးမဲ့',
    bio: 'Lucas is a student council representative passionate about business strategy, public speaking, and youth empowerment.',
    image: '/males/4.png'
  },
  {
    id: 'm3',
    gender: 'male',
    name: 'Saw Hay Let Bwe Htoo',
    number: 'Male #03',
    faculty: 'School of Health Science',
    motto: 'သင့်ရဲ့ စွမ်းဆောင်ရည်တွေဟာ အကန့်အသတ်မရှိပါဘူး။ သင်တကယ်ဖြစ်ချင်တဲ့ အရာကိုပဲ ရအောင်လုပ်ဆောင်ပါ။',
    bio: 'Daniel leads campus wellness drives and student athletics associations.',
    image: '/males/5.png'
  },
  {
    id: 'm4',
    gender: 'male',
    name: 'Maw Kun',
    number: 'Male #04',
    faculty: 'School of Management',
    motto: 'ကိုယ့်ဘဝကို ကိုယ်တိုင်ရေးဆွဲရတဲ့အတွက် ရွေးချယ်မှုတိုင်းကို ဂုဏ်ယူနိုင်အောင် ရွေးချယ်မယ်',
    bio: 'Julian is an advocate for creative writing and global student exchange programs.',
    image: '/males/10.png'
  },
  {
    id: 'm5',
    gender: 'male',
    name: 'Aung Phone Thant',
    number: 'Male #05',
    faculty: 'School of Applied Digital Technology',
    motto: 'Freshersများကို representပေးပြီး ပျော်ရွှင်စရာကောင်းတဲ့ University life ရအောင်ကြိုးစားသွားမယ်ဗျ။',
    bio: 'Alexander works on student research projects in environmental sustainability.',
    image: '/males/13.png'
  },
  {
    id: 'm6',
    gender: 'male',
    name: 'Hein Htet Aung',
    number: 'Male #06',
    faculty: 'School of Management',
    motto: 'ခက်ခဲနေပါစေ အားလုံးအတူရင်ဆိုင်သွားမှာမို့ ကျွန်တော်တို့ဆက်ပြီး ရှင်သန်သွားပေးပါ',
    bio: 'Marcus represents MFU in national mock trial competitions.',
    image: '/males/14.png'
  },
  {
    id: 'm7',
    gender: 'male',
    name: 'Min Htet Aung',
    number: 'Male #07',
    faculty: 'School of Applied Digital Technology',
    motto: 'Macha ချစ်သူ၊ မနက်ပိုင်းအတန်းမုန်းသူ',
    bio: 'Gabriel organizes rural health outreach programs in Chiang Rai.',
    image: '/males/15.png'
  }
];

const femaleCandidates = [
  {
    id: 'f1',
    gender: 'female',
    name: 'Yunn Eaint Myint Mo',
    number: 'Female #01',
    faculty: 'School of Liberal Arts',
    motto: 'တခြားလူတွေရဲ့ရင်ထဲကခံစားချက်တွေကိုနားထောင်ပေးပြီး သူတို့နဲ့စကားတွေပြောနေရရင်ကိုပျော်တယ်',
    bio: 'Sophia excels in classical dance performance and debate. She represents MFU in international cultural exchange programs.',
    image: '/females/1.png'
  },
  {
    id: 'f2',
    gender: 'female',
    name: 'Wati Thae Maung',
    number: 'Female #02',
    faculty: 'School of Liberal Arts',
    motto: 'နှေးနိုင်ပေမယ့် မရပ်လိုက်နဲ့။',
    bio: 'Maya is active in campus theatre and health science research, advocating for wellness and creative student initiatives.',
    image: '/females/2.png'
  },
  {
    id: 'f3',
    gender: 'female',
    name: 'Pyae Sone Chan Thar',
    number: 'Female #03',
    faculty: 'School of Science',
    motto: 'ငှက်တစ်သောင်းနားခိုနိုင်တဲ့သစ်ပင်ဖြစ်ပါ၊ သို့သော် ကြီးထွားဆဲအပင်ငယ်လေးတွေပေါ်မှာ ကိုယ့်ရဲ့လောင်းရိပ်ကင်းပါစေ။',
    bio: 'Elena is president of the Student Business Society and founder of youth startup forums.',
    image: '/females/6.png'
  },
  {
    id: 'f4',
    gender: 'female',
    name: 'Phyo Thiri Khaing',
    number: 'Female #04',
    faculty: 'School of Applied Digital Technology',
    motto: 'ဘဝမှာ ပြီးပြည့်စုံဖို့ထက် နေ့တိုင်းပိုကောင်းလာဖို့ကိုပဲရွေးချယ်မယ်...လမ်းပျောက်ရင်တောင် ကိုယ့်အိပ်မက်ကို မမေ့ဘူး..',
    bio: 'Chloe leads women-in-tech workshops and mobile app hackathons.',
    image: '/females/7.png'
  },
  {
    id: 'f5',
    gender: 'female',
    name: 'Ngwe Kant Kaw',
    number: 'Female #05',
    faculty: 'School of Cosmetic Science',
    motto: 'အပြုံးနဲ့ကြို၊ မေတ္တာနဲ့ပျိုး၊ ရိုးသားစွာနေ၊ ကောင်းခြင်းနဲ့သာရှင်သန်သွားမည်။',
    bio: 'Aria volunteers at local community clinics and student wellness fairs.',
    image: '/females/8.png'
  },
  {
    id: 'f6',
    gender: 'female',
    name: 'Naw Mercy Zaw',
    number: 'Female #06',
    faculty: 'School of Liberal Arts',
    motto: 'အဆိုးအားဖြင့် အရှုံးမခံနှင့်။ အကောင်းအားဖြင့် အဆိုးကို နိုင်လော့။ ရောမ ၁၂:၂၁',
    bio: 'Isabella coordinates international language forums and cultural galas.',
    image: '/females/9.png'
  },
  {
    id: 'f7',
    gender: 'female',
    name: 'Nang Aye Aye Aung',
    number: 'Female #07',
    faculty: 'School of Health Science',
    motto: 'ဖြစ်ချင်တာဖြစ်ဖို့ သတ္တိတွေအများကြီးမလိုဘူး။ စလုပ်ဖို့ပဲလိုတယ်။',
    bio: 'Hannah researches sustainable food processing and eco-friendly packaging.',
    image: '/females/11.png'
  },
  {
    id: 'f8',
    gender: 'female',
    name: 'Hsu Yi Htwe',
    number: 'Female #08',
    faculty: 'School of Social Innovation',
    motto: 'ယုံကြည်မှု၊ အကျင့်စာရိတ္တ၊ လူသားဆန်မှု',
    bio: 'Victoria promotes mental health awareness and holistic wellness campaigns.',
    image: '/females/12.png'
  }
];

export default function AmbassadorsTab({ 
  votedMaleId, 
  votedFemaleId, 
  onVote, 
  votingFrozen = false,
  paymentStatus = 'pending' 
}) {
  const [activeCategory, setActiveCategory] = useState('male');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const isApproved = paymentStatus === 'approved';
  const canVote = isApproved && !votingFrozen;

  const currentList = activeCategory === 'male' ? maleCandidates : femaleCandidates;
  const currentVotedId = activeCategory === 'male' ? votedMaleId : votedFemaleId;

  return (
    <div className="space-y-4">
      {/* Title & Lock Status */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-lg font-bold text-zinc-100">Vote Ambassador 2026</h1>
          <p className="text-xs text-zinc-400">Cast 1 vote for Male Ambassador and 1 vote for Female Ambassador.</p>
        </div>

        {votingFrozen ? (
          <span className="bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
            <Lock className="w-3 h-3 text-red-400" /> Voting Closed
          </span>
        ) : !isApproved && (
          <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3 text-amber-400" /> Pass Pending
          </span>
        )}
      </div>

      {/* Warning Banners */}
      {votingFrozen ? (
        <div className="bg-red-950/40 border border-red-500/40 text-red-200 text-xs p-3 rounded-xl text-center font-medium flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-red-400 shrink-0" />
          <span>Voting has been officially frozen by the Gala Committee.</span>
        </div>
      ) : !isApproved && (
        <div className="bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs p-3 rounded-xl text-center font-medium flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Voting unlocks once your payment slip (39 THB) is approved by admin.</span>
        </div>
      )}

      {/* Category Toggle Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-[#1d1d20] p-1.5 rounded-xl border border-zinc-800">
        <button
          onClick={() => setActiveCategory('male')}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeCategory === 'male'
              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950 shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Male Candidates
          {votedMaleId && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
        </button>

        <button
          onClick={() => setActiveCategory('female')}
          className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeCategory === 'female'
              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950 shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Female Candidates
          {votedFemaleId && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
        </button>
      </div>

      {/* Candidate Cards Grid */}
      <div className="space-y-4">
        {currentList.map((cand) => {
          const isVoted = currentVotedId === cand.id;
          return (
            <div
              key={cand.id}
              className={`bg-[#1d1d20]/90 border rounded-2xl overflow-hidden shadow-xl transition-all ${
                isVoted 
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30' 
                  : 'border-zinc-800/80 hover:border-amber-500/40'
              }`}
            >
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-900">
                <img 
                  src={cand.image} 
                  alt={cand.name} 
                  className="w-full h-full object-cover object-center" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1d1d20] via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 left-3 bg-[#0f0f10]/80 backdrop-blur-md text-amber-300 font-black text-[10px] px-2.5 py-1 rounded-full border border-amber-500/30 uppercase tracking-wider">
                  {cand.number}
                </span>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h2 className="text-base font-extrabold text-zinc-100">{cand.name}</h2>
                  <p className="text-xs text-amber-300 font-medium">{cand.faculty}</p>
                  <p className="text-[11px] text-zinc-300 italic mt-1 font-serif leading-relaxed">"{cand.motto}"</p>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setSelectedCandidate(cand)}
                    className="flex-1 py-2.5 rounded-xl bg-[#0f0f10] border border-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-[#27272a] hover:border-amber-500/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5 text-amber-400" /> Bio
                  </button>

                  <button
                    disabled={!canVote}
                    onClick={() => canVote && onVote(cand.gender, cand.id)}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      !canVote
                        ? 'bg-zinc-800 text-zinc-500 border border-zinc-700/60 cursor-not-allowed opacity-60'
                        : isVoted 
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-zinc-950 font-black shadow-lg shadow-emerald-500/25 border border-emerald-300/40 cursor-pointer' 
                        : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-zinc-950 hover:brightness-110 cursor-pointer'
                    }`}
                  >
                    {votingFrozen ? (
                      <><Lock className="w-3.5 h-3.5 text-zinc-500" /> Voting Closed</>
                    ) : !isApproved ? (
                      <><Clock className="w-3.5 h-3.5 text-zinc-500" /> Pass Unverified</>
                    ) : isVoted ? (
                      <><CheckCircle2 className="w-4 h-4 text-zinc-950" /> Voted</>
                    ) : (
                      <><Vote className="w-4 h-4 text-zinc-950" /> Vote {cand.gender === 'male' ? 'Male' : 'Female'}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-[#0f0f10] border border-amber-500/30 w-full max-w-sm rounded-2xl p-5 relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1d1d20] border border-amber-500/20 text-zinc-300 flex items-center justify-center hover:bg-[#27272a] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border-2 border-amber-500/40 shadow-lg">
                <img 
                  src={selectedCandidate.image} 
                  alt={selectedCandidate.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="bg-amber-500/10 text-amber-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-500/30 uppercase tracking-wider inline-block">
                {selectedCandidate.number}
              </span>
              <h3 className="text-lg font-extrabold text-zinc-100">{selectedCandidate.name}</h3>
              <p className="text-xs text-amber-300 font-medium">{selectedCandidate.faculty}</p>
            </div>

            <div className="space-y-1 bg-[#1d1d20]/80 border border-zinc-800 p-3 rounded-xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Candidate Bio</p>
              <p className="text-xs text-zinc-300 leading-relaxed">{selectedCandidate.bio}</p>
            </div>

            <button
              disabled={!canVote}
              onClick={() => {
                if (canVote) {
                  onVote(selectedCandidate.gender, selectedCandidate.id);
                  setSelectedCandidate(null);
                }
              }}
              className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
                !canVote
                  ? 'bg-zinc-800 text-zinc-500 border border-zinc-700/60 cursor-not-allowed opacity-60'
                  : currentVotedId === selectedCandidate.id
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-zinc-950 font-black shadow-lg shadow-emerald-500/25 border border-emerald-300/40 cursor-pointer'
                  : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-zinc-950 hover:brightness-110 cursor-pointer shadow-lg shadow-amber-500/15'
              }`}
            >
              {votingFrozen ? (
                <><Lock className="w-4 h-4 text-zinc-500" /> Voting Closed</>
              ) : !isApproved ? (
                <><Clock className="w-4 h-4 text-zinc-500" /> Pass Unverified</>
              ) : currentVotedId === selectedCandidate.id ? (
                <><CheckCircle2 className="w-4 h-4 text-zinc-950" /> Voted</>
              ) : (
                <><Vote className="w-4 h-4" /> Vote For {selectedCandidate.name}</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}