import React from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Building2, 
  Compass, 
  Sparkles, 
  MessageSquare, 
  ChevronLeft,
  Share2,
  Heart,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Zap,
  ArrowRight,
  Calendar,
  AlertTriangle,
  Link,
  MessageCircle,
  Check,
  X,
  Bell,
  BellOff,
  BellRing,
  CheckCircle2,
  Clock,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronRight,
  Leaf
} from 'lucide-react';
import { Property } from '../types';
import { AnimatePresence } from 'motion/react';
import { useCurrency } from '../services/currencyService';
import VirtualTour from './VirtualTour';
import PropertyGallery from './PropertyGallery';
import InvestmentTimeline from './InvestmentTimeline';
import EnergyRatingBadge from './EnergyRatingBadge';
import InvestmentScoreBadge from './InvestmentScoreBadge';

interface PropertyDetailsPageProps {
  key?: string;
  property: Property;
  onBack: () => void;
  onContactAgent: () => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  isFavorite: boolean;
  lang: 'fr' | 'en' | 'sw';
  t: (key: any) => any;
  onTogglePriceSubscription?: (id: string, e?: React.MouseEvent) => void;
  isPriceSubscribed?: boolean;
  onToggleWaitlist?: (property: Property, email?: string) => Promise<boolean | void>;
  isWaitlisted?: boolean;
  currentUserEmail?: string | null;
}

export default function PropertyDetailsPage({ 
  property, 
  onBack, 
  onContactAgent, 
  onToggleFavorite, 
  isFavorite, 
  lang, 
  t,
  onTogglePriceSubscription,
  isPriceSubscribed = false,
  onToggleWaitlist,
  isWaitlisted = false,
  currentUserEmail = null
}: PropertyDetailsPageProps) {
  const [activeImage, setActiveImage] = React.useState(0);
  const [isShareOpen, setIsShareOpen] = React.useState(false);
  const [showCopied, setShowCopied] = React.useState(false);
  const [areaUnit, setAreaUnit] = React.useState<'sqm' | 'sqft'>('sqm');
  const { currentCurrency, formatFromUSD } = useCurrency();
  
  // Waitlist Modal state for guests or email prompt
  const [showWaitlistModal, setShowWaitlistModal] = React.useState(false);
  const [waitlistEmail, setWaitlistEmail] = React.useState(currentUserEmail || '');
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = React.useState(false);
  const [waitlistToast, setWaitlistToast] = React.useState<string | null>(null);

  // High-Resolution Click-to-Zoom Lightbox states
  const [isZoomOpen, setIsZoomOpen] = React.useState(false);
  const [zoomScale, setZoomScale] = React.useState(1);
  const [mousePosition, setMousePosition] = React.useState({ x: 50, y: 50 });

  const images = property.images?.length > 0 ? property.images : [property.image];

  const handleNextZoomImage = React.useCallback(() => {
    setActiveImage((prev) => (prev + 1) % images.length);
    setZoomScale(1);
  }, [images.length]);

  const handlePrevZoomImage = React.useCallback(() => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
    setZoomScale(1);
  }, [images.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomScale <= 1) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomOpen) return;
      if (e.key === 'Escape') {
        setIsZoomOpen(false);
        setZoomScale(1);
      } else if (e.key === 'ArrowRight') {
        handleNextZoomImage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevZoomImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomOpen, handleNextZoomImage, handlePrevZoomImage]);

  const shareUrl = window.location.href;
  const shareTitle = `${property.title} | ImmoAI Africa`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-dark-bg text-text-primary pb-24"
    >
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 bg-dark-nav backdrop-blur-xl border-b border-border-subtle">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-brand transition-colors group"
          >
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-brand/20 group-hover:border-brand/40 transition-all">
              <ChevronLeft size={20} />
            </div>
            <span className="font-bold text-sm uppercase tracking-widest">{lang === 'fr' ? 'Retour' : 'Back'}</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsShareOpen(true)}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-brand hover:border-brand/40 transition-all"
            >
              <Share2 size={20} />
            </button>

            <button 
              onClick={(e) => onToggleFavorite(property.id, e)}
              className={`p-3 rounded-2xl border transition-all ${
                isFavorite 
                ? 'bg-brand border-brand text-white' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-red-500 hover:border-red-500/40'
              }`}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "animate-pulse" : ""} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Visuals */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-6">
            <PropertyGallery
              images={images}
              title={property.title}
              category={property.category}
              status={property.status}
              currentIndex={activeImage}
              onIndexChange={setActiveImage}
              onImageClick={() => setIsZoomOpen(true)}
              showThumbnails={true}
              aspectRatio="aspect-[16/9]"
              lang={lang}
              badges={
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-4 py-1.5 bg-black/50 backdrop-blur-md text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/10 shadow-lg">
                      {property.category}
                    </span>
                    <EnergyRatingBadge 
                      rating={property.energyRating} 
                      condition={property.condition} 
                      energyKwh={property.energyKwh}
                      variant="pill"
                      lang={lang}
                    />
                    {property.aiEstimate && (
                      <InvestmentScoreBadge
                        score={property.aiEstimate.investment_score}
                        variant="pill"
                        lang={lang}
                      />
                    )}
                  </div>
                </div>
              }
            />
          </div>

          {/* Right Column: Key Details & Hero Info */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between space-y-12">
            <div>
              <div className="flex items-center gap-2 text-brand font-bold text-sm uppercase tracking-widest mb-6">
                <MapPin size={16} />
                {property.location}
              </div>
              
              <h1 className="font-display text-5xl md:text-6xl font-bold text-text-primary mb-8 tracking-tight leading-[0.9] uppercase overflow-visible">
                {property.title}
              </h1>

              <div className="text-4xl sm:text-5xl font-display font-bold text-brand mb-8 flex flex-wrap items-baseline gap-3">
                <span>{formatFromUSD(property.price)}</span>
                {currentCurrency !== 'USD' && (
                  <span className="text-sm font-mono text-gray-400">
                    (${property.price.toLocaleString()} USD)
                  </span>
                )}
                <span className="text-sm text-gray-500 font-sans tracking-normal mb-1 font-medium">TVA Incluse</span>
              </div>

              {/* Sold Property Waitlist Banner */}
              {property.status === 'sold' && (
                <div className="mb-8 p-6 rounded-[28px] bg-red-950/40 border border-red-500/30 backdrop-blur-xl relative overflow-hidden">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl border border-red-500/30 shrink-0">
                      <Clock size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                          {lang === 'fr' ? 'VENDU' : lang === 'en' ? 'SOLD' : 'IMEUZWA'}
                        </span>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          {lang === 'fr' ? 'Propriété Actuellement Vendue' : 'Property Currently Sold'}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                        {lang === 'fr'
                          ? "Inscrivez-vous à la liste d'attente pour recevoir une notification instantanée si la transaction s'annule ou si ce bien redevient disponible."
                          : "Join the waitlist to receive an instant alert if the transaction cancels or if this listing becomes available again."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Subscription Toggle */}
              <div className="mb-12 p-5 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl transition-all duration-300 ${isPriceSubscribed ? 'bg-brand/10 text-brand' : 'bg-white/5 text-gray-400'}`}>
                    {isPriceSubscribed ? <Bell size={18} className="animate-bounce" /> : <BellOff size={18} />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      {lang === 'fr' ? 'Abonnement Prix' : lang === 'en' ? 'Price Price Alerts' : 'Tahadhari ya Bei'}
                    </h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-tight mt-0.5">
                      {lang === 'fr' ? 'S\'abonner aux baisses de prix' : lang === 'en' ? 'Subscribe to price drops' : 'Tahadhari ya mabadiliko ya bei'}
                    </p>
                  </div>
                </div>
                
                {/* Modern Toggle Button */}
                <button
                  type="button"
                  onClick={(e) => onTogglePriceSubscription && onTogglePriceSubscription(property.id, e)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isPriceSubscribed ? 'bg-brand/20 border-brand/30' : 'bg-white/10 border-white/5'
                  }`}
                  role="switch"
                  aria-checked={isPriceSubscribed}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isPriceSubscribed ? 'translate-x-5 bg-brand' : 'translate-x-0 bg-gray-400'
                    }`}
                  />
                </button>
              </div>

              {/* Key Features Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                <div className="bg-surface-elevated p-5 rounded-[28px] border border-white/5 flex flex-col items-center text-center group hover:border-brand/30 transition-colors">
                  <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-3 group-hover:bg-brand group-hover:text-white transition-all">
                    <Building2 size={20} />
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">{t('beds')}</p>
                  <p className="text-lg font-bold text-text-primary">{property.beds}</p>
                </div>
                <div className="bg-surface-elevated p-5 rounded-[28px] border border-border-subtle flex flex-col items-center text-center group hover:border-brand/30 transition-colors relative">
                  <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-1 group-hover:bg-brand group-hover:text-white transition-all">
                    <Compass size={20} />
                  </div>
                  
                  {/* Interactive m² / sq ft Toggle Pill */}
                  <div className="flex items-center gap-0.5 bg-black/40 border border-white/10 rounded-full p-0.5 mb-1.5">
                    <button
                      type="button"
                      onClick={() => setAreaUnit('sqm')}
                      className={`px-1.5 py-0.5 text-[8px] font-black uppercase rounded-full transition-all cursor-pointer ${
                        areaUnit === 'sqm'
                          ? 'bg-brand text-white shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      m²
                    </button>
                    <button
                      type="button"
                      onClick={() => setAreaUnit('sqft')}
                      className={`px-1.5 py-0.5 text-[8px] font-black uppercase rounded-full transition-all cursor-pointer ${
                        areaUnit === 'sqft'
                          ? 'bg-brand text-white shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      sq ft
                    </button>
                  </div>

                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">{t('sqmLabel')}</p>
                  <motion.p 
                    key={areaUnit}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg font-bold text-text-primary"
                  >
                    {areaUnit === 'sqm' 
                      ? `${property.sqm.toLocaleString()} m²` 
                      : `${Math.round(property.sqm * 10.7639).toLocaleString()} sq ft`}
                  </motion.p>
                </div>
                <div className="bg-surface-elevated p-5 rounded-[28px] border border-border-subtle flex flex-col items-center text-center group hover:border-brand/30 transition-colors">
                  <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-3 group-hover:bg-brand group-hover:text-white transition-all">
                    <Calendar size={20} />
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">{t('yearBuilt')}</p>
                  <p className="text-lg font-bold text-text-primary">{property.yearBuilt || 'N/A'}</p>
                </div>
                {/* Energy Efficiency Card with Tooltip */}
                <EnergyRatingBadge 
                  rating={property.energyRating} 
                  condition={property.condition} 
                  energyKwh={property.energyKwh}
                  variant="card"
                  lang={lang}
                />
                {/* Investment Score Card */}
                {property.aiEstimate ? (
                  <InvestmentScoreBadge 
                    score={property.aiEstimate.investment_score}
                    variant="card"
                    lang={lang}
                  />
                ) : (
                  <div className="bg-surface-elevated p-5 rounded-[28px] border border-border-subtle flex flex-col items-center text-center group hover:border-brand/30 transition-colors">
                    <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-3 group-hover:bg-brand group-hover:text-white transition-all">
                      <Zap size={20} />
                    </div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Score</p>
                    <p className="text-lg font-bold text-text-primary">N/A</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {property.status === 'sold' ? (
                <div className="space-y-3">
                  <button 
                    onClick={async () => {
                      if (currentUserEmail || isWaitlisted) {
                        if (onToggleWaitlist) {
                          await onToggleWaitlist(property, currentUserEmail || undefined);
                          setWaitlistToast(isWaitlisted ? "Retiré de la liste d'attente" : "Ajouté à la liste d'attente !");
                          setTimeout(() => setWaitlistToast(null), 3500);
                        }
                      } else {
                        setShowWaitlistModal(true);
                      }
                    }}
                    className={`w-full py-6 rounded-[24px] font-bold text-xl transition-all shadow-2xl flex items-center justify-center gap-4 group cursor-pointer ${
                      isWaitlisted 
                        ? 'bg-amber-500/20 text-amber-300 border-2 border-amber-500/50 hover:bg-amber-500/30 shadow-amber-500/10' 
                        : 'bg-brand text-white hover:bg-brand-dark shadow-brand/30'
                    }`}
                  >
                    {isWaitlisted ? (
                      <>
                        <CheckCircle2 size={24} className="text-amber-400 animate-pulse" />
                        <span>{lang === 'fr' ? "Inscrit à la liste d'attente" : "On Waitlist"}</span>
                      </>
                    ) : (
                      <>
                        <BellRing size={24} className="group-hover:scale-110 transition-transform" />
                        <span>{lang === 'fr' ? "M'avertir quand disponible" : "Notify Me When Available"}</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={onContactAgent}
                    className="w-full bg-white/5 text-gray-300 py-4 rounded-[20px] font-bold text-sm border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <MessageSquare size={18} />
                    {lang === 'fr' ? "Contacter l'Agent quand même" : "Contact Agent Anyway"}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onContactAgent}
                  className="w-full bg-brand text-white py-6 rounded-[24px] font-bold text-xl hover:bg-brand-dark transition-all shadow-2xl shadow-brand/30 flex items-center justify-center gap-4 group cursor-pointer"
                >
                  <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
                  {lang === 'fr' ? "Contacter l'Agent" : "Contact Agent"}
                </button>
              )}

              {/* Social Share Buttons */}
              <div className="grid grid-cols-4 gap-3">
                <a 
                  href={shareLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-green-500/20 hover:border-green-500/40 transition-all group/social"
                  title="WhatsApp"
                >
                  <MessageCircle size={20} className="group-hover/social:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">WA</span>
                </a>
                <a 
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-blue-600/20 hover:border-blue-600/40 transition-all group/social"
                  title="Facebook"
                >
                  <Share2 size={20} className="group-hover/social:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">FB</span>
                </a>
                <a 
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all group/social"
                  title="X (Twitter)"
                >
                  <Zap size={20} className="group-hover/social:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">X</span>
                </a>
                <a 
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-[20px] bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-blue-700/20 hover:border-blue-700/40 transition-all group/social"
                  title="LinkedIn"
                >
                  <TrendingUp size={20} className="group-hover/social:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">IN</span>
                </a>
              </div>

              <button 
                onClick={() => setIsShareOpen(!isShareOpen)}
                className="w-full bg-white/5 text-white py-6 rounded-[24px] font-bold text-lg border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-4"
              >
                <Link size={22} className="text-brand" />
                {lang === 'fr' ? "Plus d'options de partage" : "More share options"}
              </button>
              <button className="w-full bg-white/5 text-white py-6 rounded-[24px] font-bold text-lg border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-4">
                <ShieldCheck size={22} className="text-brand" />
                {lang === 'fr' ? "Garantie ImmoAI Africa" : "ImmoAI Africa Protected"}
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-24">
          <div className="lg:col-span-8 space-y-12">
            
            {/* Interactive Virtual Tour */}
            <VirtualTour propertyId={property.id} propertyTitle={property.title} lang={lang} />

            {/* Description */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-brand rounded-full" />
                Description
              </h2>
              <div className="bg-surface-elevated p-8 md:p-12 rounded-[40px] border border-border-subtle relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Building2 size={120} />
                </div>
                <p className="text-xl text-gray-400 leading-relaxed font-light italic">
                  "{property.description}"
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-500">
                  <div className="space-y-4">
                    <h4 className="text-text-primary font-bold uppercase tracking-widest text-xs">Points Forts</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <ArrowRight size={14} className="text-brand" /> 
                        Localisation Premium
                      </li>
                      <li className="flex items-center gap-3">
                        <ArrowRight size={14} className="text-brand" /> 
                        Architecture Moderne
                      </li>
                      <li className="flex items-center gap-3">
                        <ArrowRight size={14} className="text-brand" /> 
                        Haut Rendement Locatif
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-white font-bold uppercase tracking-widest text-xs">Services Inclus</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <ArrowRight size={14} className="text-brand" /> 
                        Sécurité 24/7
                      </li>
                      <li className="flex items-center gap-3">
                        <ArrowRight size={14} className="text-brand" /> 
                        Maintenance IA Prédictive
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Location Detail */}
            <section>
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-brand rounded-full" />
                Localisation & Environnement
              </h2>
              <div className="bg-surface-elevated p-8 rounded-[40px] border border-white/5 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand/10 rounded-2xl text-brand">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">{property.location}</h4>
                    <p className="text-gray-500 text-sm">
                      Situé dans l'un des quartiers les plus dynamiques du continent, offrant un accès facile aux centres d'affaires et aux commodités de luxe.
                    </p>
                  </div>
                </div>
                {/* Visual Placeholder for a small map or detailed location view */}
                <div className="aspect-video rounded-3xl bg-dark-nav border border-white/5 flex items-center justify-center overflow-hidden relative group">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand/20 via-transparent to-transparent group-hover:scale-110 transition-transform duration-1000" />
                  <Compass size={64} className="text-brand opacity-20 group-hover:scale-110 group-hover:rotate-45 transition-all duration-700" />
                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                    <p className="text-[10px] text-brand font-bold uppercase tracking-widest mb-1">Index de Connectivité</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-brand w-[85%]" />
                      </div>
                      <span className="text-lg font-display font-bold">8.5/10</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Visual Investment Milestones Timeline */}
            <InvestmentTimeline 
              property={property} 
              lang={lang} 
              onActionClick={onContactAgent}
            />

            {/* Enhanced AI Analysis Section */}
            {property.aiEstimate && (
              <section className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-brand rounded-full" />
                    Analyse Stratégique par ImmoAI
                  </h2>
                  <div className="flex items-center gap-2 px-4 py-2 bg-brand/10 rounded-2xl border border-brand/20">
                    <Sparkles size={16} className="text-brand" />
                    <span className="text-xs font-black text-brand uppercase tracking-widest">Généré par Gemini</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Market Trend Card */}
                  <div className="bg-surface-elevated p-8 rounded-[40px] border border-border-subtle group hover:border-brand/40 transition-all duration-500">
                    <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-6 group-hover:scale-110 transition-transform">
                      <TrendingUp size={24} />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-4 uppercase tracking-tight">Tendance du Marché</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {property.aiEstimate.market_trend || "La demande dans cette zone reste forte avec une appréciation constante des prix."}
                    </p>
                  </div>

                  {/* Risk Factors Card */}
                  <div className="bg-surface-elevated p-8 rounded-[40px] border border-border-subtle group hover:border-red-500/40 transition-all duration-500">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                      <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-4 uppercase tracking-tight">Facteurs de Risque</h3>
                    <ul className="space-y-3">
                      {property.aiEstimate.risk_factors?.map((risk, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                          {risk}
                        </li>
                      )) || (
                        <>
                          <li className="flex items-start gap-3 text-sm text-gray-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                            Fluctuations monétaires potentielles.
                          </li>
                          <li className="flex items-start gap-3 text-sm text-gray-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                            Délais administratifs locaux.
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Full Breakdown Card */}
                <div className="bg-surface-elevated p-10 md:p-12 rounded-[50px] border border-brand/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <PieChart size={180} className="text-brand" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                       <InvestmentScoreBadge
                         score={property.aiEstimate.investment_score}
                         variant="hero"
                         lang={lang}
                       />
                    </div>
                    <h3 className="text-2xl font-display font-black text-white mb-6 uppercase tracking-tighter">Raisonnement d'Investissement</h3>
                    <p className="text-xl text-gray-400 leading-relaxed font-light italic border-l-4 border-brand pl-8">
                      {property.aiEstimate.investment_reasoning || "Cette propriété présente un profil rendement-risque extrêmement attractif dû à sa localisation stratégique et à la qualité de sa construction."}
                    </p>
                    
                    <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
                       <div className="space-y-2">
                         <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Potentiel de Plus-Value</p>
                         <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-brand w-[88%]" />
                         </div>
                       </div>
                       <div className="space-y-2">
                         <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Rendement Locatif</p>
                         <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[72%]" />
                         </div>
                       </div>
                       <div className="space-y-2">
                         <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Indice de Liquidité</p>
                         <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-green-500 w-[65%]" />
                         </div>
                       </div>
                       <div className="space-y-2">
                         <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Déscore de Risque</p>
                         <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-red-500 w-[15%]" />
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* AI Insights Card */}
            {property.aiEstimate && (
              <div className="bg-brand/5 border border-brand/20 rounded-[40px] p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles size={64} className="text-brand" />
                </div>
                <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-widest mb-8">
                  <Sparkles size={16} />
                  Intelligence de Marché
                </div>
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Valeur Estimée (2026)</p>
                    <p className="text-3xl font-display font-bold text-white">{formatFromUSD(property.aiEstimate.price_estimate)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Potientiel ROI</p>
                      <p className="text-2xl font-display font-bold text-brand">+{Math.round((property.aiEstimate.price_estimate / property.price - 1) * 100)}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Condition</p>
                      <p className="text-xl font-bold text-white uppercase tracking-tight">{property.aiEstimate.condition}</p>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-brand/20">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-4">Indicateurs de Performance</p>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-xs text-gray-400">Demande de zone</span>
                        <span className="text-white font-bold">Élevée</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-brand w-[92%]" />
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-xs text-gray-400">Liquidité</span>
                        <span className="text-white font-bold">Moyenne</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[65%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Safety/Certification */}
            <div className="bg-surface-elevated p-8 rounded-[40px] border border-white/5 space-y-6 align-between flex flex-col justify-between">
              <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20 flex gap-4">
                <ShieldCheck className="text-green-500 shrink-0" size={24} />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Titres Certifiés</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-tight">Vérifié par la Blockchain ImmoAI</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Toutes les transactions sur ImmoAI Africa sont garanties et sécurisées. Nos experts vérifient chaque titre de propriété pour assurer votre tranquillité d'esprit.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface-elevated border border-white/10 rounded-[40px] shadow-2xl p-8 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Partager l'offre</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">ImmoAI Africa Premium Network</p>
                  </div>
                  <button 
                    onClick={() => setIsShareOpen(false)}
                    className="p-3 hover:bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <a 
                    href={shareLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-green-500/10 hover:border-green-500/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                      <MessageCircle size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 group-hover:text-white">WhatsApp</span>
                  </a>

                  <a 
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-blue-600/10 hover:border-blue-600/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Share2 size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 group-hover:text-white">Facebook</span>
                  </a>

                  <a 
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                      <Zap size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 group-hover:text-white">X (Twitter)</span>
                  </a>

                  <a 
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-blue-700/10 hover:border-blue-700/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-700/10 flex items-center justify-center text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-all">
                      <TrendingUp size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 group-hover:text-white">LinkedIn</span>
                  </a>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest px-2">Ou copier le lien direct</p>
                  <div className="flex gap-2 p-2 rounded-[24px] bg-black/40 border border-white/10 group">
                    <input 
                      type="text" 
                      readOnly 
                      value={shareUrl} 
                      className="flex-1 bg-transparent border-none text-sm text-gray-400 px-4 outline-none truncate"
                    />
                    <button 
                      onClick={copyToClipboard}
                      className={`px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${
                        showCopied ? 'bg-green-500 text-white' : 'bg-brand text-white hover:bg-white hover:text-black'
                      }`}
                    >
                      {showCopied ? (lang === 'fr' ? 'Copié' : 'Copied') : (lang === 'fr' ? 'Copier' : 'Copy')}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox High-Resolution Zoom Modal */}
      <AnimatePresence>
        {isZoomOpen && (
          <div className="fixed inset-0 z-[250] flex flex-col justify-between p-6 bg-black/95 backdrop-blur-xl select-none">
            {/* Background Closer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsZoomOpen(false);
                setZoomScale(1);
              }}
              className="absolute inset-0 cursor-zoom-out"
            />

            {/* Top Control Bar */}
            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-brand/10 text-brand">
                  <Maximize2 size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider line-clamp-1">{property.title}</h4>
                  <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mt-0.5">
                    {lang === 'fr' 
                      ? `Photo ${activeImage + 1} sur ${images.length}` 
                      : lang === 'en' 
                        ? `Photo ${activeImage + 1} of ${images.length}` 
                        : `Picha ${activeImage + 1} ya ${images.length}`
                    }
                  </p>
                </div>
              </div>

              {/* Interactive Zoom Controls */}
              <div className="flex items-center gap-3 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setZoomScale(prev => Math.max(1, prev - 0.5))}
                  disabled={zoomScale <= 1}
                  className="p-2 sm:p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all"
                  title="Zoom Out"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-xs font-mono font-bold text-brand px-2 min-w-[50px] text-center">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomScale(prev => Math.min(3, prev + 0.5))}
                  disabled={zoomScale >= 3}
                  className="p-2 sm:p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-all"
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>

                <div className="h-4 w-px bg-white/10 mx-1" />

                <button
                  type="button"
                  onClick={() => setZoomScale(1)}
                  disabled={zoomScale === 1}
                  className="px-3 py-1.5 text-[10px] font-black uppercase text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all rounded-lg"
                >
                  {lang === 'fr' ? 'Réinitialiser' : 'Reset'}
                </button>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsZoomOpen(false);
                  setZoomScale(1);
                }}
                className="p-2.5 rounded-2xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Center Area: Navigation + Main Viewport */}
            <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto flex items-center justify-between gap-4 my-6">
              {/* Prev Button */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevZoomImage}
                  className="p-4 rounded-3xl bg-white/5 border border-white/5 text-gray-400 hover:text-brand hover:border-brand/30 hover:bg-white/10 transition-all shrink-0"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Image Viewport Container */}
              <div 
                className="flex-1 h-full max-h-[60vh] md:max-h-[70vh] flex items-center justify-center relative overflow-hidden rounded-[32px] border border-white/15 bg-black/40 shadow-2xl group cursor-pointer"
                onMouseMove={handleMouseMove}
                onClick={() => {
                  // Click image to toggle zoom
                  setZoomScale(prev => prev > 1 ? 1 : 2.5);
                }}
              >
                <img
                  src={images[activeImage]}
                  alt={property.title}
                  style={{
                    transform: `scale(${zoomScale})`,
                    transformOrigin: zoomScale > 1 ? `${mousePosition.x}% ${mousePosition.y}%` : 'center center',
                    transition: 'transform 0.15s ease-out, transform-origin 0.2s ease-out',
                  }}
                  className={`max-w-full max-h-full object-contain pointer-events-none ${
                    zoomScale > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  referrerPolicy="no-referrer"
                />

                {/* Corner instructions */}
                <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-4 py-2 rounded-full bg-black/70 border border-white/10 backdrop-blur-md text-[10px] text-gray-300 font-bold uppercase tracking-wider">
                    {zoomScale > 1 
                      ? (lang === 'fr' ? 'Déplacez le curseur pour explorer • Cliquez pour dézoomer' : 'Move cursor to explore • Click to zoom out')
                      : (lang === 'fr' ? 'Cliquez sur l\'image pour zoomer' : 'Click image to zoom in')
                    }
                  </span>
                </div>
              </div>

              {/* Next Button */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextZoomImage}
                  className="p-4 rounded-3xl bg-white/5 border border-white/5 text-gray-400 hover:text-brand hover:border-brand/30 hover:bg-white/10 transition-all shrink-0"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* Bottom Gallery Slider Carousel */}
            {images.length > 1 && (
              <div className="relative z-10 w-full max-w-7xl mx-auto p-4 rounded-3xl bg-black/40 border border-white/5 flex gap-3 overflow-x-auto justify-center">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveImage(i);
                      setZoomScale(1);
                    }}
                    className={`relative w-20 aspect-video rounded-xl overflow-hidden border transition-all ${
                      activeImage === i ? 'border-brand scale-105 shadow-md shadow-brand/30' : 'border-white/15 opacity-40 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Waitlist Guest Email Modal */}
      <AnimatePresence>
        {showWaitlistModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-elevated border border-white/10 rounded-[32px] p-8 max-w-md w-full shadow-2xl relative text-left"
            >
              <button
                type="button"
                onClick={() => setShowWaitlistModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mb-6">
                <BellRing size={28} />
              </div>

              <h3 className="font-display font-bold text-2xl text-white mb-2">
                {lang === 'fr' ? "Rejoindre la liste d'attente" : "Join the Waitlist"}
              </h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                {lang === 'fr'
                  ? `Entrez votre adresse email pour recevoir une alerte dès que "${property.title}" sera de nouveau disponible.`
                  : `Enter your email address to get notified as soon as "${property.title}" becomes available again.`}
              </p>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!waitlistEmail || !waitlistEmail.includes('@')) return;
                  setIsSubmittingWaitlist(true);
                  if (onToggleWaitlist) {
                    await onToggleWaitlist(property, waitlistEmail);
                  }
                  setIsSubmittingWaitlist(false);
                  setShowWaitlistModal(false);
                  setWaitlistToast(lang === 'fr' ? "Inscrit à la liste d'attente !" : "Added to waitlist!");
                  setTimeout(() => setWaitlistToast(null), 3500);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    required
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingWaitlist}
                  className="w-full bg-brand text-white py-4 rounded-2xl font-bold text-base hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingWaitlist ? (
                    <span>{lang === 'fr' ? "Inscription..." : "Submitting..."}</span>
                  ) : (
                    <>
                      <BellRing size={18} />
                      <span>{lang === 'fr' ? "M'avertir si disponible" : "Notify Me When Available"}</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Waitlist Toast Notification */}
      <AnimatePresence>
        {waitlistToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[250] bg-brand text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 font-bold text-sm"
          >
            <CheckCircle2 size={20} />
            <span>{waitlistToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
