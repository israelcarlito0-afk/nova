import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Info, TrendingUp, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccentColor } from '../hooks/useAccentColor';

export interface InvestmentScoreBadgeProps {
  score: number;
  variant?: 'pill' | 'metric' | 'card' | 'inline' | 'hero';
  lang?: 'fr' | 'en' | 'sw';
  className?: string;
  showIcon?: boolean;
}

export default function InvestmentScoreBadge({
  score,
  variant = 'pill',
  lang = 'fr',
  className = '',
  showIcon = true
}: InvestmentScoreBadgeProps) {
  const { isGoldTheme } = useAccentColor();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

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

  const getScoreRating = (val: number) => {
    if (val >= 9.0) return { label: { fr: 'Investissement Exceptionnel', en: 'Exceptional Investment', sw: 'Uwekezaji Bora Zaidi' }, tier: 'AAA' };
    if (val >= 8.0) return { label: { fr: 'Très Fort Potentiel', en: 'High Potential Yield', sw: 'Uwezo Mkubwa Sana' }, tier: 'AA' };
    if (val >= 7.0) return { label: { fr: 'Investissement Solide', en: 'Solid Investment', sw: 'Uwekezaji Imara' }, tier: 'A' };
    return { label: { fr: 'Rendement Modéré', en: 'Moderate Return', sw: 'Faida ya Wastani' }, tier: 'BBB' };
  };

  const ratingInfo = getScoreRating(score);

  const titleText = `${lang === 'fr' ? 'Score IA' : lang === 'sw' ? 'Alama IA' : 'AI Score'} : ${score}/10 - ${ratingInfo.label[lang] || ratingInfo.label.fr}`;

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
              : 'bg-brand/20 border-brand/40 text-brand'
          }`}>
            <Sparkles size={14} className={isGoldTheme ? 'text-amber-400' : 'text-brand'} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-black px-1.5 py-0.5 rounded border ${
                isGoldTheme 
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300' 
                  : 'bg-brand/20 border-brand/40 text-brand'
              }`}>
                {score}/10
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {lang === 'fr' ? 'Score d\'Investissement' : lang === 'sw' ? 'Alama ya Uwekezaji' : 'Investment Score'}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">
              {ratingInfo.label[lang] || ratingInfo.label.fr}
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
          isGoldTheme
            ? 'bg-amber-500/10 border-amber-400/30 text-amber-300'
            : 'bg-brand/10 border-brand/20 text-brand'
        }`}>
          Tier {ratingInfo.tier}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-300 leading-relaxed mb-3">
        {lang === 'fr'
          ? "Ce score est calculé par notre algorithme IA prédictif d'après la rentabilité locative estimée, le dynamisme du quartier et le potentiel de valorisation patrimoniale."
          : lang === 'sw'
          ? "Alama hii inakokotolewa na akili mnemba (IA) yetu kulingana na faida ya kodi, eneo na ukuaji wa thamani."
          : "Calculated by our predictive AI analyzing gross rental yields, micro-location capital growth, and tenant occupancy rates."}
      </p>

      {/* Progress Bar */}
      <div className="pt-2 border-t border-white/10 space-y-1.5">
        <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <TrendingUp size={10} className={isGoldTheme ? 'text-amber-400' : 'text-brand'} />
            {lang === 'fr' ? 'Indice de rentabilité' : 'Yield Index'}
          </span>
          <span className={isGoldTheme ? 'text-amber-300 font-mono' : 'text-brand font-mono'}>
            {Math.round(score * 10)}%
          </span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isGoldTheme 
                ? 'bg-gradient-to-r from-amber-500 to-amber-300' 
                : 'bg-brand'
            }`}
            style={{ width: `${Math.min(100, score * 10)}%` }}
          />
        </div>
      </div>

      {/* Tooltip pointer arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-[#080C0E]/95" />
    </motion.div>
  );

  // Variant: Pill (On Property Card Images / Hero Gallery)
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
        title={titleText}
      >
        <span 
          className={`px-4 py-1.5 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg w-fit transition-all duration-300 hover:scale-105 cursor-pointer select-none border ${
            isGoldTheme 
              ? 'badge-score-gold bg-black/75 border-amber-400/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/20' 
              : 'bg-brand text-white border-white/20'
          }`}
        >
          {showIcon && (
            <Sparkles 
              size={10} 
              className={`shrink-0 ${isGoldTheme ? 'text-amber-400 animate-pulse' : 'text-white animate-pulse'}`} 
            />
          )}
          <span>{lang === 'fr' ? 'SCORE IA' : lang === 'sw' ? 'ALAMA IA' : 'AI SCORE'}: {score}/10</span>
          <Info size={10} className={`shrink-0 ml-0.5 opacity-70 hover:opacity-100 ${isGoldTheme ? 'text-amber-400' : 'text-white/80'}`} />
        </span>

        <AnimatePresence>
          {showTooltip && renderTooltipContent()}
        </AnimatePresence>
      </div>
    );
  }

  // Variant: Hero (For Large ROI Breakdown Banners)
  if (variant === 'hero') {
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
        title={titleText}
      >
        <div 
          className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 cursor-pointer border ${
            isGoldTheme 
              ? 'badge-score-gold bg-black/85 border-amber-400/70 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)]' 
              : 'bg-brand text-white border-transparent'
          }`}
        >
          <Sparkles size={12} className={isGoldTheme ? 'text-amber-400 animate-pulse' : 'text-white'} />
          <span>Expertise ROI : {score}/10</span>
          <Info size={11} className={`ml-1 opacity-70 ${isGoldTheme ? 'text-amber-400' : 'text-white/80'}`} />
        </div>

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
            : 'border-border-subtle hover:border-brand/30'
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
            : 'bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white'
        }`}>
          <Sparkles size={20} className={isGoldTheme ? 'text-amber-400' : ''} />
        </div>
        <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 flex items-center gap-1 ${
          isGoldTheme ? 'text-amber-400/80' : 'text-gray-500'
        }`}>
          <span>{lang === 'fr' ? 'Score IA' : lang === 'sw' ? 'Alama IA' : 'AI Score'}</span>
          <Info size={10} className={isGoldTheme ? 'text-amber-400/60' : 'text-gray-400'} />
        </p>
        <p className={`text-lg font-bold ${
          isGoldTheme ? 'text-amber-300' : 'text-text-primary'
        }`}>
          {score}/10
        </p>

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
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border flex items-center gap-1.5 ${
        isGoldTheme 
          ? 'badge-score-gold bg-black/75 border-amber-400/60 text-amber-300' 
          : 'bg-brand/15 border-brand/30 text-brand'
      }`}>
        <Sparkles size={10} className={isGoldTheme ? 'text-amber-400' : 'text-brand'} />
        <span>{score}/10</span>
      </span>

      <AnimatePresence>
        {showTooltip && renderTooltipContent()}
      </AnimatePresence>
    </div>
  );
}
