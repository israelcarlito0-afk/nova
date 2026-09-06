import React, { useState, useRef, useEffect } from 'react';
import { Leaf, Info, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccentColor } from '../hooks/useAccentColor';

export interface EnergyRatingBadgeProps {
  rating?: string;
  condition?: string;
  energyKwh?: number;
  variant?: 'pill' | 'metric' | 'card' | 'inline';
  lang?: 'fr' | 'en' | 'sw';
  className?: string;
  accentColor?: string;
}

export interface RatingDetail {
  grade: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  shortLabel: { fr: string; en: string; sw: string };
  description: { fr: string; en: string; sw: string };
  kwhRange: string;
}

export const ENERGY_RATINGS_DATA: Record<string, RatingDetail> = {
  'A+': {
    grade: 'A+',
    color: '#10B981',
    badgeBg: 'bg-emerald-500/25',
    badgeBorder: 'border-emerald-500/40',
    badgeText: 'text-emerald-300',
    shortLabel: {
      fr: 'Ultra-Performant / Zéro Carbone',
      en: 'Highly Efficient / Net Zero',
      sw: 'Ufanisi wa Juu Zaidi / Sifuri Kaboni'
    },
    description: {
      fr: "A+ représente une très haute efficacité énergétique, une consommation minimale et une isolation passive de pointe (solaire & écologique).",
      en: "A+ represents highly efficient, low energy consumption (Net Zero / Eco-solar certified and maximum thermal insulation).",
      sw: "A+ inamaanisha ufanisi wa hali ya juu sana wa nishati, matumizi madogo zaidi na insulation ya kisasa ya sola."
    },
    kwhRange: '< 50 kWh/m²/an'
  },
  'A': {
    grade: 'A',
    color: '#059669',
    badgeBg: 'bg-emerald-600/25',
    badgeBorder: 'border-emerald-500/40',
    badgeText: 'text-emerald-300',
    shortLabel: {
      fr: 'Excellente Efficacité',
      en: 'Excellent Efficiency',
      sw: 'Ufanisi Bora Sana'
    },
    description: {
      fr: "A représente une excellente performance énergétique, une isolation supérieure et de faibles dépenses en électricité.",
      en: "A represents excellent energy efficiency, low operating costs, and superior climate control insulation.",
      sw: "A inamaanisha ufanisi bora wa nishati, gharama nafuu za uendeshaji na insulation bora ya joto."
    },
    kwhRange: '51 - 90 kWh/m²/an'
  },
  'B+': {
    grade: 'B+',
    color: '#14B8A6',
    badgeBg: 'bg-teal-500/25',
    badgeBorder: 'border-teal-500/40',
    badgeText: 'text-teal-300',
    shortLabel: {
      fr: 'Très Bonne Efficacité',
      en: 'Very Good Efficiency',
      sw: 'Ufanisi Mzuri Sana'
    },
    description: {
      fr: "B+ représente une très bonne efficacité énergétique avec une consommation maîtrisée et des équipements récents.",
      en: "B+ represents very good energy efficiency with optimized power consumption and modern climate systems.",
      sw: "B+ inamaanisha ufanisi mzuri sana wa nishati na mifumo ya kisasa ya matumizi ya umeme."
    },
    kwhRange: '91 - 120 kWh/m²/an'
  },
  'B': {
    grade: 'B',
    color: '#0D9488',
    badgeBg: 'bg-teal-600/25',
    badgeBorder: 'border-teal-500/40',
    badgeText: 'text-teal-300',
    shortLabel: {
      fr: 'Bonne Efficacité',
      en: 'Good Efficiency',
      sw: 'Ufanisi Mzuri'
    },
    description: {
      fr: "B représente une bonne performance énergétique globale, un logement bien isolé et économe au quotidien.",
      en: "B represents solid energy performance, well-insulated structures, and lower than average utility bills.",
      sw: "B inamaanisha utendaji mzuri wa nishati, muundo bora na gharama za wastani za umeme."
    },
    kwhRange: '121 - 150 kWh/m²/an'
  },
  'C+': {
    grade: 'C+',
    color: '#F59E0B',
    badgeBg: 'bg-amber-500/25',
    badgeBorder: 'border-amber-500/40',
    badgeText: 'text-amber-300',
    shortLabel: {
      fr: 'Efficacité Standard Supérieure',
      en: 'Standard High Efficiency',
      sw: 'Ufanisi wa Kawaida wa Juu'
    },
    description: {
      fr: "C+ représente une efficacité satisfaisante conforme aux normes de construction urbaines modernes.",
      en: "C+ represents standard, moderate energy consumption meeting standard residential building codes.",
      sw: "C+ inamaanisha matumizi ya kawaida ya nishati yanayozingatia viwango vya kisasa vya ujenzi."
    },
    kwhRange: '151 - 190 kWh/m²/an'
  },
  'C': {
    grade: 'C',
    color: '#D97706',
    badgeBg: 'bg-amber-600/25',
    badgeBorder: 'border-amber-500/40',
    badgeText: 'text-amber-300',
    shortLabel: {
      fr: 'Efficacité Moyenne',
      en: 'Moderate Efficiency',
      sw: 'Ufanisi wa Wastani'
    },
    description: {
      fr: "C représente une consommation d'énergie moyenne avec des possibilités de modernisation d'équipements.",
      en: "C represents average energy consumption with opportunities for renewable energy upgrades.",
      sw: "C inamaanisha matumizi ya wastani ya nishati yenye fursa za kuongeza nishati ya jua."
    },
    kwhRange: '191 - 230 kWh/m²/an'
  },
  'D': {
    grade: 'D',
    color: '#F97316',
    badgeBg: 'bg-orange-500/25',
    badgeBorder: 'border-orange-500/40',
    badgeText: 'text-orange-300',
    shortLabel: {
      fr: 'Consommation Moyenne Élevée',
      en: 'Moderate-High Consumption',
      sw: 'Matumizi ya Juu Kiasi'
    },
    description: {
      fr: "D représente une consommation modérément élevée qui bénéficierait d'une rénovation thermique ciblée.",
      en: "D represents moderate to high energy consumption with potential for insulation and solar improvements.",
      sw: "D inamaanisha matumizi ya juu kiasi yanayohitaji uboreshaji wa insulation na nishati."
    },
    kwhRange: '231 - 330 kWh/m²/an'
  },
  'E': {
    grade: 'E',
    color: '#EF4444',
    badgeBg: 'bg-red-500/25',
    badgeBorder: 'border-red-500/40',
    badgeText: 'text-red-300',
    shortLabel: {
      fr: 'Consommation Énergétique Élevée',
      en: 'High Energy Demand',
      sw: 'Matumizi Makubwa ya Nishati'
    },
    description: {
      fr: "E représente une consommation importante nécessitant un audit énergétique et des travaux d'isolation.",
      en: "E represents high energy demands, indicating higher heating/cooling expenses and renovation potential.",
      sw: "E inamaanisha matumizi makubwa ya nishati yanayohitaji marekebisho ya dharura."
    },
    kwhRange: '> 330 kWh/m²/an'
  }
};

const ALL_GRADES = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'E'];

export default function EnergyRatingBadge({
  rating,
  condition,
  energyKwh,
  variant = 'pill',
  lang = 'fr',
  className = '',
  accentColor
}: EnergyRatingBadgeProps) {
  const { isGoldTheme: detectedGoldTheme } = useAccentColor();
  const isGoldTheme = accentColor === 'gold-black' || accentColor === 'gold' || detectedGoldTheme;
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Compute rating if not explicitly supplied
  const effectiveRating = rating || (condition === 'New' ? 'A+' : condition === 'Excellent' ? 'A' : 'B+');
  const normalizedRating = ENERGY_RATINGS_DATA[effectiveRating] ? effectiveRating : 'B+';
  const detail = ENERGY_RATINGS_DATA[normalizedRating] || ENERGY_RATINGS_DATA['A+'];

  const titleText = `${detail.grade} : ${detail.description[lang] || detail.description.fr}`;

  // Close tooltip on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        triggerRef.current && 
        !triggerRef.current.contains(e.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const showTooltip = isOpen || isHovered;

  const renderTooltipContent = () => (
    <motion.div
      ref={tooltipRef}
      initial={{ opacity: 0, scale: 0.95, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-[150] w-72 sm:w-80 p-4 rounded-2xl bg-[#080C0E]/95 backdrop-blur-xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-left cursor-default pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
            isGoldTheme 
              ? 'bg-amber-500/20 border-amber-400/50 text-amber-400' 
              : `${detail.badgeBg} border ${detail.badgeBorder}`
          }`}>
            <Leaf size={14} className={isGoldTheme ? 'text-amber-400' : detail.badgeText} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-black px-1.5 py-0.5 rounded border ${
                isGoldTheme 
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300' 
                  : `${detail.badgeBg} border ${detail.badgeBorder} ${detail.badgeText}`
              }`}>
                {detail.grade}
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {lang === 'fr' ? 'Diagnostic DPE' : lang === 'sw' ? 'Kiwango cha Nishati' : 'Energy Rating'}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">
              {detail.shortLabel[lang] || detail.shortLabel.fr}
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
          isGoldTheme 
            ? 'text-amber-300 bg-amber-500/10 border-amber-400/30' 
            : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
        }`}>
          {energyKwh ? `${energyKwh} kWh/m²` : detail.kwhRange}
        </span>
      </div>

      {/* Rating Explanation (As requested by the prompt) */}
      <div className="space-y-2 mb-3.5">
        <p className="text-xs text-gray-200 leading-relaxed font-normal">
          <strong className="text-white font-bold">{detail.grade} : </strong>
          {detail.description[lang] || detail.description.fr}
        </p>
      </div>

      {/* Visual Energy Efficiency Ladder scale */}
      <div className="pt-2 border-t border-white/10 space-y-1.5">
        <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider">
          <span>{lang === 'fr' ? 'Échelle d\'efficacité' : lang === 'sw' ? 'Kipimo cha Nishati' : 'Efficiency Scale'}</span>
          <span className={isGoldTheme ? 'text-amber-400' : 'text-emerald-400'}>
            {lang === 'fr' ? 'A+ = Optimal' : 'A+ = Top Eco'}
          </span>
        </div>
        <div className="grid grid-cols-8 gap-1 pt-1">
          {ALL_GRADES.map((g) => {
            const isCurrent = g === detail.grade;
            const item = ENERGY_RATINGS_DATA[g];
            return (
              <div key={g} className="flex flex-col items-center gap-1">
                <div 
                  className={`w-full h-2 rounded-full transition-all ${
                    isCurrent 
                      ? 'ring-2 ring-white scale-110 shadow-lg' 
                      : 'opacity-40 hover:opacity-80'
                  }`}
                  style={{ backgroundColor: item.color }}
                />
                <span className={`text-[8px] font-black ${isCurrent ? 'text-white font-extrabold scale-110' : 'text-gray-500'}`}>
                  {g}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tooltip pointer arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-[#080C0E]/95" />
    </motion.div>
  );

  // Variant: Pill (On Property Card Image / Gallery)
  if (variant === 'pill') {
    return (
      <div 
        ref={triggerRef}
        className={`relative inline-block ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <span 
          title={titleText}
          className={`px-3 py-1.5 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 border transition-all duration-300 hover:scale-105 cursor-pointer select-none ${
            isGoldTheme
              ? 'badge-energy-gold bg-black/75 border-amber-400/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/20'
              : `${detail.badgeBg} ${detail.badgeBorder} ${detail.badgeText} shadow-[0_0_15px_rgba(16,185,129,0.15)]`
          }`}
        >
          <Leaf size={11} className={`shrink-0 ${isGoldTheme ? 'text-amber-400' : 'text-emerald-400'}`} />
          <span>DPE {detail.grade}</span>
          <Info size={10} className={`shrink-0 opacity-70 hover:opacity-100 ml-0.5 ${isGoldTheme ? 'text-amber-400' : ''}`} />
        </span>

        <AnimatePresence>
          {showTooltip && renderTooltipContent()}
        </AnimatePresence>
      </div>
    );
  }

  // Variant: Metric (Card Bottom 3-column stats bar)
  if (variant === 'metric') {
    return (
      <div 
        ref={triggerRef}
        className={`relative flex flex-col items-center group/metric cursor-pointer ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title={titleText}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <Leaf size={14} className={isGoldTheme ? 'text-amber-400' : detail.badgeText} />
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border transition-transform group-hover/metric:scale-105 ${
            isGoldTheme
              ? 'badge-energy-gold bg-amber-500/15 border-amber-400/60 text-amber-300'
              : `${detail.badgeBg} ${detail.badgeBorder} ${detail.badgeText}`
          }`}>
            {detail.grade}
          </span>
          <Info size={10} className={`opacity-60 group-hover/metric:opacity-100 ${isGoldTheme ? 'text-amber-400/70' : 'text-gray-500'}`} />
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${
          isGoldTheme ? 'text-amber-300/80' : 'text-gray-400'
        }`}>
          <span>{lang === 'fr' ? 'ÉNERGIE' : lang === 'sw' ? 'NISHATI' : 'ENERGY'}</span>
        </span>

        <AnimatePresence>
          {showTooltip && renderTooltipContent()}
        </AnimatePresence>
      </div>
    );
  }

  // Variant: Card (Property Details Page Spec Grid)
  if (variant === 'card') {
    return (
      <div 
        ref={triggerRef}
        className={`relative bg-surface-elevated p-5 rounded-[28px] border flex flex-col items-center text-center group cursor-pointer transition-colors ${
          isGoldTheme 
            ? 'border-amber-400/30 hover:border-amber-400/70 shadow-[0_0_20px_rgba(245,158,11,0.08)]' 
            : 'border-border-subtle hover:border-emerald-500/50'
        } ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title={titleText}
      >
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 transition-all group-hover:scale-105 ${
          isGoldTheme
            ? 'bg-amber-500/15 border border-amber-400/30 text-amber-400 group-hover:bg-amber-500 group-hover:text-black'
            : `${detail.badgeBg} ${detail.badgeText}`
        }`}>
          <Leaf size={20} />
        </div>
        <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 flex items-center gap-1 ${
          isGoldTheme ? 'text-amber-400/80' : 'text-gray-500'
        }`}>
          <span>{lang === 'fr' ? 'DPE Énergie' : lang === 'sw' ? 'Nishati' : 'Energy DPE'}</span>
          <Info size={10} className={isGoldTheme ? 'text-amber-400/60' : 'text-gray-400'} />
        </p>
        <div className="flex items-center gap-1.5">
          <span className={`text-lg font-black ${isGoldTheme ? 'text-amber-300' : detail.badgeText}`}>
            {detail.grade}
          </span>
          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
            isGoldTheme ? 'bg-amber-500/10 border border-amber-400/30 text-amber-200' : 'bg-white/5 border border-white/10 text-gray-300'
          }`}>
            {energyKwh ? `${energyKwh} kWh` : detail.kwhRange.split(' ')[0]}
          </span>
        </div>

        <AnimatePresence>
          {showTooltip && renderTooltipContent()}
        </AnimatePresence>
      </div>
    );
  }

  // Default Inline Variant
  return (
    <div 
      ref={triggerRef}
      className={`relative inline-flex items-center gap-1 cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}
      title={titleText}
    >
      <span className={`px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 ${
        isGoldTheme
          ? 'badge-energy-gold bg-amber-500/15 border-amber-400/60 text-amber-300'
          : `${detail.badgeBg} ${detail.badgeBorder} ${detail.badgeText}`
      }`}>
        <Leaf size={10} className={isGoldTheme ? 'text-amber-400' : ''} />
        <span>{detail.grade}</span>
      </span>

      <AnimatePresence>
        {showTooltip && renderTooltipContent()}
      </AnimatePresence>
    </div>
  );
}
