import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  TrendingUp, 
  MapPin, 
  Bot, 
  ShieldCheck, 
  Globe, 
  Target, 
  Users, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import ImmoAILogo from './ImmoAILogo';

interface BrandHeroShowcaseProps {
  lang: 'fr' | 'en' | 'sw';
  onExplore?: () => void;
  onOpenAi?: () => void;
}

export const BrandHeroShowcase: React.FC<BrandHeroShowcaseProps> = ({
  lang,
  onExplore,
  onOpenAi
}) => {
  const content = {
    fr: {
      tag: "PLATEFORME IMMOBILIÈRE IA PANAFRICAINE",
      slogan: "IMMOBILIER INTELLIGENT, AFRIQUE PLUS FORTE",
      headline: "L'AVENIR DE L'IMMOBILIER EN AFRIQUE EST ICI.",
      description: "ImmoAI Africa est une plateforme immobilière intelligente propulsée par la technologie et l'innovation pour connecter acheteurs, vendeurs, investisseurs et agents à travers toute l'Afrique.",
      pillars: [
        { icon: Home, title: "RECHERCHE IMMOBILIÈRE INTELLIGENTE", desc: "Filtres DPE, géolocalisation et matching instantané" },
        { icon: TrendingUp, title: "ANALYSE D'INVESTISSEMENT IA", desc: "Calcul ROI prédictif, rendements locatifs et tendances" },
        { icon: MapPin, title: "CARTES INTERACTIVES", desc: "Exploration immersive cartographique par quartier" },
        { icon: Bot, title: "ASSISTANT IA CONVERSATIONNEL", desc: "Conseils sur mesure 24/7 propulsés par Gemini" },
        { icon: ShieldCheck, title: "SÉCURISÉ & TRANSPARENT", desc: "Transactions vérifiées et conformité juridique" },
        { icon: Globe, title: "PLATEFORME MULTILINGUE", desc: "Français, Anglais et Swahili natifs" }
      ],
      missionTitle: "NOTRE MISSION",
      missionDesc: "Transformer l'immobilier en Afrique grâce à l'IA, l'innovation et la confiance.",
      joinTitle: "REJOIGNEZ-NOUS AUJOURD'HUI",
      joinDesc: "Bâtissez l'avenir de l'immobilier en Afrique.",
      exploreBtn: "Explorer les propriétés",
      aiBtn: "Consulter l'Assistant IA"
    },
    en: {
      tag: "PAN-AFRICAN AI REAL ESTATE PLATFORM",
      slogan: "SMART REAL ESTATE, STRONGER AFRICA",
      headline: "THE FUTURE OF REAL ESTATE IN AFRICA IS HERE.",
      description: "ImmoAI Africa is an intelligent real estate platform powered by technology and innovation to connect buyers, sellers, investors and agents across Africa.",
      pillars: [
        { icon: Home, title: "SMART PROPERTY SEARCH", desc: "Eco-energy ratings, geocoding and live matching" },
        { icon: TrendingUp, title: "INVESTMENT ANALYSIS", desc: "Predictive ROI calculator, yield metrics and market trends" },
        { icon: MapPin, title: "INTERACTIVE MAPS", desc: "Dynamic interactive neighborhood radar and map layers" },
        { icon: Bot, title: "AI ASSISTANT", desc: "24/7 tailored advisory powered by Gemini AI" },
        { icon: ShieldCheck, title: "SECURE & TRANSPARENT", desc: "Verified transactions and local regulatory compliance" },
        { icon: Globe, title: "MULTILINGUAL PLATFORM", desc: "English, French and Swahili native support" }
      ],
      missionTitle: "OUR MISSION",
      missionDesc: "To transform real estate in Africa through AI, innovation and trust.",
      joinTitle: "JOIN US TODAY",
      joinDesc: "Build the future of real estate in Africa.",
      exploreBtn: "Explore Properties",
      aiBtn: "Ask AI Assistant"
    },
    sw: {
      tag: "JUKWAA LA KISASA LA NYUMBA AFRIKA",
      slogan: "IMMOBILI YA AKILI, AFRIKA IMARA",
      headline: "MUSTAKABALI WA UWEKEZAJI WA NYUMBA AFRIKA UPO HAPA.",
      description: "ImmoAI Africa ni jukwaa la kisasa la uwekezaji wa nyumba linalotumia teknolojia na uvumbuzi kuwaunganisha wanunuzi, wauzaji, wawekezaji na mawakala kote Afrika.",
      pillars: [
        { icon: Home, title: "UTAFUTAJI WA NYUMBA KISASA", desc: "Vigezo vya nishati, maeneo na uchaguzi wa haraka" },
        { icon: TrendingUp, title: "UCHAMBUZI WA UWEKEZAJI", desc: "Kadirio la faida ya uwekezaji (ROI) na mwelekeo wa soko" },
        { icon: MapPin, title: "RAMANI ZA KISASA", desc: "Tazama nyumba kwenye ramani shirikishi" },
        { icon: Bot, title: "MSAIDIZI WA AI", desc: "Msaidizi mahiri wa Gemini anayejibu maswali yako 24/7" },
        { icon: ShieldCheck, title: "USALAMA NA UAMINIFU", desc: "Miamala iliyothibitishwa na wazi kabisa" },
        { icon: Globe, title: "JUKWAA LA LUGHA NYINGI", desc: "Kiswahili, Kifaransa na Kiingereza" }
      ],
      missionTitle: "DIRA YETU",
      missionDesc: "Kubadilisha sekta ya nyumba Afrika kwa kutumia AI, uvumbuzi na uaminifu.",
      joinTitle: "JIUNGE NASI SASA",
      joinDesc: "Tujenge mustakabali wa nyumba Afrika.",
      exploreBtn: "Tazama Nyumba",
      aiBtn: "Ongea na AI"
    }
  }[lang];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#0A0E12] via-[#070B0E] to-[#040608] text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-white/10 shadow-2xl">
      {/* Background Accent Glows */}
      <div className="absolute -top-40 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Header Ribbon / Slogan */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-2 rounded-2xl bg-black/60 border border-white/10 shadow-2xl backdrop-blur-md">
            <ImmoAILogo size="lg" showSubtitle={true} showSlogan={false} />
          </div>

          <div className="flex items-center gap-3">
            <span className="h-[1px] w-8 bg-amber-400/60" />
            <span className="text-[11px] sm:text-xs font-black tracking-[0.25em] text-amber-400 uppercase font-sans">
              {content.slogan}
            </span>
            <span className="h-[1px] w-8 bg-amber-400/60" />
          </div>

          {/* Slogan Small Continent Marker */}
          <div className="flex items-center justify-center text-amber-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.5 4 16 5 18 8C19.5 10 20 13 18 16C16 19 14 21 12 22C10.5 20 8 18 7 15C6 12 7 9 9 6C10 4 11 3 12 2Z" opacity="0.9" />
            </svg>
          </div>
        </div>

        {/* Hero Main Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headline, Narrative & 6 Value Pillars */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
                {lang === 'fr' ? (
                  <>L'AVENIR DE <span className="text-amber-400">L'IMMOBILIER</span> EN AFRIQUE EST <span className="text-emerald-400">ICI.</span></>
                ) : lang === 'sw' ? (
                  <>MUSTAKABALI WA <span className="text-amber-400">UWEKEZAJI WA NYUMBA</span> AFRIKA UPO <span className="text-emerald-400">HAPA.</span></>
                ) : (
                  <>THE FUTURE OF <span className="text-amber-400">REAL ESTATE</span> IN AFRICA IS <span className="text-emerald-400">HERE.</span></>
                )}
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                {content.description}
              </p>
            </div>

            {/* 6 Value Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {content.pillars.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <div 
                    key={idx}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/40 hover:bg-black/60 transition-all duration-300 shadow-lg group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-emerald-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:text-emerald-300 group-hover:scale-110 transition-transform shrink-0">
                      <IconComponent size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black tracking-wider text-white uppercase truncate group-hover:text-amber-300 transition-colors">
                        {pillar.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 truncate">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              {onExplore && (
                <button
                  onClick={onExplore}
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs tracking-wider uppercase shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <span>{content.exploreBtn}</span>
                  <ArrowRight size={16} />
                </button>
              )}
              {onOpenAi && (
                <button
                  onClick={onOpenAi}
                  className="px-7 py-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-bold text-xs tracking-wider uppercase backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles size={16} className="text-emerald-400" />
                  <span>{content.aiBtn}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Mission Cards & Brand Poster Card */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            
            {/* Mission Card */}
            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#0F171A] to-[#0A1012] border-2 border-emerald-500/30 shadow-2xl overflow-hidden group hover:border-emerald-400/60 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
                  <Target size={24} />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] block">
                    {content.missionTitle}
                  </span>
                  <p className="text-sm font-semibold text-white leading-snug">
                    {content.missionDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Join Us Card */}
            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#17130B] to-[#0E0C07] border-2 border-amber-500/30 shadow-2xl overflow-hidden group hover:border-amber-400/60 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
                  <Users size={24} />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] block">
                    {content.joinTitle}
                  </span>
                  <p className="text-sm font-semibold text-white leading-snug">
                    {content.joinDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Brand Official Footer Strip */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Globe size={15} className="text-amber-400" />
                <span className="font-mono text-amber-300 font-bold tracking-wider">www.immoaiafrica.com</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-bold text-gray-300">
                <span className="text-emerald-400">f</span>
                <span className="text-emerald-400">ig</span>
                <span className="text-emerald-400">in</span>
                <span className="tracking-wider">ImmoAI Africa</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default BrandHeroShowcase;
