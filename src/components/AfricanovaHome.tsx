import React, { useState } from 'react';
import { 
  Search, ArrowRight, ShieldCheck, TrendingUp, Sparkles, MapPin, 
  Home, Landmark, GraduationCap, Briefcase, Users, ShoppingBag, 
  Star, ChevronRight, Globe, CheckCircle2, Award, Building2, PhoneCall, Coins
} from 'lucide-react';
import { AfricanovaLogo } from './AfricanovaLogo';
import { 
  AFRICANOVA_POLES, 
  KEY_STATISTICS, 
  FEATURED_OPPORTUNITIES, 
  TESTIMONIALS, 
  PARTNER_CATEGORIES, 
  Pole 
} from '../data/africanovaData';
import { useCurrency, CurrencyCode } from '../services/currencyService';

interface AfricanovaHomeProps {
  onSelectPole: (poleId: string, subSectionId?: string) => void;
  onOpenBrandGuide: () => void;
  onOpenPartnerModal: () => void;
  onOpenMemberSpace: () => void;
  onOpenRealEstateExplorer: () => void;
  onOpenAgentNova?: (prompt?: string) => void;
  onOpenListingModal?: () => void;
}

export const AfricanovaHome: React.FC<AfricanovaHomeProps> = ({
  onSelectPole,
  onOpenBrandGuide,
  onOpenPartnerModal,
  onOpenMemberSpace,
  onOpenRealEstateExplorer,
  onOpenAgentNova,
  onOpenListingModal,
}) => {
  // Transverse search bar state across the 6 poles
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoleFilter, setSelectedPoleFilter] = useState<string>('all');
  const [currentLang, setCurrentLang] = useState<'FR' | 'EN' | 'PT'>('FR');
  const { currentCurrency, setCurrency, formatPriceString, allCurrencies } = useCurrency();

  const getPoleIcon = (id: string, className = "text-[#F5D67A]") => {
    switch (id) {
      case 'immobilier': return <Home size={22} className={className} />;
      case 'finance': return <Landmark size={22} className="text-emerald-400" />;
      case 'formation': return <GraduationCap size={22} className={className} />;
      case 'business': return <Briefcase size={22} className="text-emerald-400" />;
      case 'emploi': return <Users size={22} className={className} />;
      case 'commerce': return <ShoppingBag size={22} className="text-emerald-400" />;
      default: return <Sparkles size={22} className={className} />;
    }
  };

  // Filtered opportunities
  const filteredOpportunities = FEATURED_OPPORTUNITIES.filter((opp) => {
    const matchesPole = selectedPoleFilter === 'all' || opp.poleId === selectedPoleFilter;
    const matchesQuery = searchQuery === '' || 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPole && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-africanova-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* =========================================================================
          SECTION 1 : HÉRO (Slogan, Proposition de valeur, Moteur transverse, CTA)
          ========================================================================= */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background Ambient Glows (60% Noir profond, 25% Or, 15% Vert) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-br from-[#D4AF37]/15 via-[#12B350]/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#D4AF37]/10 blur-[100px] pointer-events-none rounded-full" />
        
        {/* Subtle geometric grid background */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Logo Full Variant Badge Showcase */}
          <div className="inline-flex items-center justify-center mb-6">
            <AfricanovaLogo variant="full" size="xl" />
          </div>

          {/* Slogan & Proposition de Valeur */}
          <div className="max-w-3xl mx-auto mt-4 space-y-4">
            <h1 className="africanova-h1 text-white font-extrabold tracking-tight">
              One Africa. <br />
              <span className="text-an-gold-gradient">Unlimited Opportunities.</span>
            </h1>

            <p className="africanova-body text-[#EDEDED]/85 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-normal">
              La plateforme panafricaine d'excellence reliant la diaspora et le continent à travers 
              6 pôles stratégiques : <strong>Immobilier, Finance, Formation, Business, Emploi et Commerce</strong>.
            </p>
          </div>

          {/* Moteur de recherche transverse interrogeant les 6 pôles */}
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="bg-[#161616] p-2 sm:p-2.5 rounded-2xl border border-[#D4AF37]/35 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2">
              
              {/* Selecteur de pôle */}
              <div className="w-full sm:w-auto shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 pr-2">
                <select
                  value={selectedPoleFilter}
                  onChange={(e) => setSelectedPoleFilter(e.target.value)}
                  className="w-full sm:w-44 bg-black/50 text-[#F5D67A] font-bold text-xs rounded-xl px-3 py-3 border border-white/10 focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="all">Tous les 6 Pôles</option>
                  <option value="immobilier">🏡 Immobilier</option>
                  <option value="finance">🏛️ Finance & Prêts</option>
                  <option value="formation">🎓 Formation & Diplômes</option>
                  <option value="business">💼 Business & PME</option>
                  <option value="emploi">👥 Emploi & Talents</option>
                  <option value="commerce">🛍️ Commerce & Marketplace</option>
                </select>
              </div>

              {/* Champ de saisie */}
              <div className="relative flex-1 w-full">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une villa, un financement, une formation, une opportunité..."
                  className="w-full bg-transparent pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                  >
                    Effacer
                  </button>
                )}
              </div>

              {/* Bouton Recherche Principal */}
              <button
                onClick={() => {
                  const targetElement = document.getElementById('opportunites-section');
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-an-gold-gradient text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Explorer</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Tags rapides de recherche */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] text-[#EDEDED]/70">
              <span className="font-semibold text-[#D4AF37]">Tendances :</span>
              {[
                { label: 'Villa Abidjan Cocody', pole: 'immobilier' },
                { label: 'Prêt Diaspora 6.5%', pole: 'finance' },
                { label: 'Masterclass Montage Financier', pole: 'formation' },
                { label: 'Offre Directeur Kinshasa', pole: 'emploi' },
                { label: 'Deals ZLECAf Agro', pole: 'business' },
              ].map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPoleFilter(tag.pole);
                    setSearchQuery(tag.label);
                  }}
                  className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-[#D4AF37]/40 rounded-full text-[#EDEDED]/90 transition-colors cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Double CTA Hero */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onOpenRealEstateExplorer}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-an-gold-gradient text-[#0A0A0A] font-extrabold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home size={16} />
              <span>Catalogue Immobilier & Investissement</span>
            </button>

            <button
              onClick={onOpenPartnerModal}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-[#D4AF37]/40 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 size={16} className="text-[#D4AF37]" />
              <span>Devenir Partenaire Agréé</span>
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2 : LES 6 PÔLES (Grille interactive avec sous-rubriques)
          ========================================================================= */}
      <section id="poles-section" className="py-20 bg-[#0A0A0A] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/25">
              Architecture Panafricaine
            </span>
            <h2 className="africanova-h2 text-white mt-3">
              Les 6 Pôles d'Excellence AFRICANOVA
            </h2>
            <p className="africanova-body text-[#EDEDED]/75 mt-2">
              Un écosystème intégré où chaque pôle nourrit les autres pour propulser le développement continental et la réussite de la diaspora.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AFRICANOVA_POLES.map((pole) => (
              <div
                key={pole.id}
                className="an-card p-6 flex flex-col justify-between group hover:translate-y-[-4px]"
              >
                <div>
                  {/* Card Header with node number and metrics */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-black border border-[#D4AF37]/30 flex items-center justify-center shadow-lg group-hover:border-[#D4AF37] transition-colors">
                      {getPoleIcon(pole.id)}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                      {pole.metrics.value}
                    </span>
                  </div>

                  <h3 className="font-africanova-serif text-xl font-bold text-white group-hover:text-[#F5D67A] transition-colors">
                    {pole.name}
                  </h3>

                  <p className="text-xs text-[#EDEDED]/70 mt-2 leading-relaxed">
                    {pole.shortDescription}
                  </p>

                  {/* 3 Sub-sections list */}
                  <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
                    <div className="text-[10px] uppercase font-mono text-[#D4AF37] tracking-wider font-bold">
                      Sous-rubriques dédiées :
                    </div>
                    {pole.subSections.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => onSelectPole(pole.id, sub.id)}
                        className="w-full text-left p-2 rounded-lg bg-black/40 hover:bg-[#D4AF37]/15 border border-white/5 hover:border-[#D4AF37]/40 transition-all flex items-center justify-between group/sub cursor-pointer"
                      >
                        <span className="text-xs text-[#EDEDED] group-hover/sub:text-white font-medium">
                          {sub.title}
                        </span>
                        <ChevronRight size={13} className="text-[#D4AF37] opacity-60 group-hover/sub:opacity-100 group-hover/sub:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pole Action Button */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={() => onSelectPole(pole.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-an-gold-gradient hover:text-black text-white font-bold text-xs uppercase tracking-wider border border-white/10 hover:border-transparent transition-all flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <span>Explorer le Pôle {pole.name}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3 : CHIFFRES CLÉS (Compteurs 250k+, 34 pays, 185M $, 48k+)
          ========================================================================= */}
      <section className="py-16 bg-[#161616] border-y border-[#D4AF37]/25 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {KEY_STATISTICS.map((stat) => (
              <div key={stat.id} className="p-4 rounded-xl bg-[#0A0A0A]/50 border border-white/5">
                <div className={`font-mono text-3xl sm:text-4xl lg:text-5xl font-black ${stat.color} tracking-tight`}>
                  {stat.value}
                </div>
                <div className="font-africanova-serif text-sm sm:text-base font-bold text-white mt-2">
                  {stat.label}
                </div>
                <div className="text-[11px] text-[#EDEDED]/60 mt-1 max-w-[200px] mx-auto leading-snug">
                  {stat.subtext}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 : MISE EN AVANT (Opportunités du moment tous pôles confondus)
          ========================================================================= */}
      <section id="opportunites-section" className="py-20 bg-[#0A0A0A] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/25">
                Sélection du Moment
              </span>
              <h2 className="africanova-h2 text-white mt-3">
                Opportunités Panafricaines à la Une
              </h2>
              <p className="africanova-body text-[#EDEDED]/75 mt-1">
                Biens d'exception, levées de fonds stratégiques, formations phares et recrutements clés.
              </p>
            </div>

            {/* Quick Pole filter pill list */}
            <div className="flex flex-wrap gap-1.5 bg-[#161616] p-1.5 rounded-xl border border-white/10">
              {['all', 'immobilier', 'finance', 'formation', 'emploi', 'business', 'commerce'].map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPoleFilter(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                    selectedPoleFilter === p
                      ? 'bg-an-gold-gradient text-black font-extrabold shadow'
                      : 'text-[#EDEDED]/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p === 'all' ? 'Tous' : p}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opp) => (
              <div 
                key={opp.id}
                className="bg-[#161616] rounded-2xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/60 transition-all duration-300 group flex flex-col justify-between shadow-xl"
              >
                <div>
                  {/* Opportunity Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={opp.image} 
                      alt={opp.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-black/40" />

                    {/* Badge Category */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[#F5D67A] border border-[#D4AF37]/40 shadow">
                        {opp.category}
                      </span>
                    </div>

                    {/* Badge Indicator */}
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/90 text-black shadow">
                        {opp.badge}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white/90">
                      <MapPin size={13} className="text-[#D4AF37]" />
                      <span>{opp.location}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-africanova-serif text-lg font-bold text-white group-hover:text-[#F5D67A] transition-colors leading-snug">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-[#EDEDED]/70 mt-2 line-clamp-2 leading-relaxed">
                      {opp.detail}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-[#EDEDED]/50 uppercase font-mono">Tarif / Ticket ({currentCurrency})</div>
                      <div className="text-sm font-bold text-[#F5D67A] font-mono">
                        {formatPriceString(opp.price)}
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectPole(opp.poleId)}
                      className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Consulter</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          <div className="mt-12 text-center">
            <button
              onClick={onOpenRealEstateExplorer}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-[#D4AF37]/50 text-[#F5D67A] text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
            >
              <span>Voir l'ensemble du catalogue & moteur d'annonces</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION SPÉCIALE : AGENT NOVA (7ème SERVICE TRANSVERSE)
          "Votre conseiller personnel pour saisir les opportunités"
          ========================================================================= */}
      <section className="py-20 bg-gradient-to-b from-[#0A0A0A] via-[#121212] to-[#0A0A0A] border-t border-[#D4AF37]/30 relative overflow-hidden">
        {/* Ambient golden and emerald glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#12B350]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12B350]/15 border border-[#12B350]/30 text-[#12B350] text-xs font-mono font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#12B350] animate-ping" />
              <span>7ème Service Transverse</span>
            </div>
            
            <h2 className="africanova-h2 text-white flex items-center justify-center gap-3">
              <Sparkles size={26} className="text-[#D4AF37]" />
              <span>Agent Nova</span>
            </h2>
            
            <p className="africanova-lead text-[#F5D67A] mt-2 font-serif italic">
              "Votre conseiller personnel pour saisir les opportunités"
            </p>
            <p className="text-xs sm:text-sm text-[#EDEDED]/75 max-w-2xl mx-auto mt-2 leading-relaxed">
              Accessible 24/7 sur l'ensemble de la plateforme, Agent Nova croise les données de nos 6 pôles pour vous délivrer des réponses précises, chiffrées et conformes aux réglementations OHADA & ZLECAf.
            </p>
          </div>

          {/* Matrice des 6 rôles de l'Agent Nova selon Israel Carlito */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                pole: 'Immobilier',
                icon: <Home size={18} className="text-[#F5D67A]" />,
                question: 'Quel budget pour un 3 pièces à Dakar ?',
                action: 'Propose 3 biens vérifiés + simulation de rendement locatif immédiate',
                badge: 'Estimation & Rendement',
              },
              {
                pole: 'Finance',
                icon: <Landmark size={18} className="text-emerald-400" />,
                question: 'Comment financer mon projet agricole ?',
                action: 'Recommande 2 banques partenaires agréées (BOA, Ecobank) + calcul de mensualités',
                badge: 'Courtage & Taux',
              },
              {
                pole: 'Formation',
                icon: <GraduationCap size={18} className="text-[#F5D67A]" />,
                question: 'Quelle certification pour monter des projets ?',
                action: 'Oriente vers le bon cursus exécutif + vérifie l’éligibilité aux bourses diaspora',
                badge: 'Cursus & Bourses',
              },
              {
                pole: 'Business & ZLECAf',
                icon: <Briefcase size={18} className="text-emerald-400" />,
                question: 'Comment exporter au Nigéria sous la ZLECAf ?',
                action: 'Délivre les règles d’origine OHADA, taux de douane préférentiels et modèle de contrat',
                badge: 'Conformité & Export',
              },
              {
                pole: 'Emploi & Recrutement',
                icon: <Users size={18} className="text-[#F5D67A]" />,
                question: 'Trouve-moi un poste de CFO à Abidjan',
                action: 'Match votre profil avec les mandats de chasse de tête en cours + grilles salariales',
                badge: 'Talents & Carrières',
              },
              {
                pole: 'Commerce B2B',
                icon: <ShoppingBag size={18} className="text-emerald-400" />,
                question: 'Où trouver des panneaux solaires en gros ?',
                action: 'Suggère 3 grossistes certifiés ZLECAf avec garantie de paiement par crédit documentaire',
                badge: 'Sourcing & Gros',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => onOpenAgentNova && onOpenAgentNova(item.question)}
                className="group p-5 bg-[#161616] hover:bg-[#1c1c1c] border border-white/10 hover:border-[#D4AF37]/50 rounded-2xl transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#D4AF37]/10 transition-colors">
                        {item.icon}
                      </div>
                      <span className="font-africanova-serif text-xs font-bold text-white uppercase tracking-wider">
                        {item.pole}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/25">
                      {item.badge}
                    </span>
                  </div>

                  <div className="p-3 bg-[#0A0A0A] rounded-xl border border-white/5 my-3">
                    <p className="text-xs font-medium text-[#F5D67A] italic">
                      "{item.question}"
                    </p>
                  </div>

                  <p className="text-[11px] text-[#EDEDED]/70 leading-relaxed">
                    {item.action}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#D4AF37] font-semibold group-hover:text-[#F5D67A]">
                  <span>Consulter Agent Nova</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* CTA Principal Agent Nova */}
          <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenAgentNova && onOpenAgentNova()}
              className="px-8 py-3.5 rounded-xl bg-an-gold-gradient text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={16} />
              <span>Ouvrir Agent Nova en direct</span>
            </button>

            {onOpenListingModal && (
              <button
                onClick={onOpenListingModal}
                className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Déposer une annonce vérifiée</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5 : TÉMOIGNAGES / SUCCESS STORIES (Diaspora & Locaux)
          ========================================================================= */}
      <section className="py-20 bg-[#161616] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25">
              Success Stories
            </span>
            <h2 className="africanova-h2 text-white mt-3">
              Ils Réussissent avec AFRICANOVA
            </h2>
            <p className="africanova-body text-[#EDEDED]/75 mt-2">
              Retours d'expérience d'investisseurs de la diaspora, d'entrepreneurs locaux et de recruteurs panafricains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div 
                key={t.id}
                className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#D4AF37]/30 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <img 
                      src={t.avatar} 
                      alt={t.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]"
                    />
                    <div>
                      <h4 className="font-africanova-serif text-sm font-bold text-white">
                        {t.name}
                      </h4>
                      <p className="text-[11px] text-[#EDEDED]/60 font-medium">
                        {t.role}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#EDEDED]/90 italic leading-relaxed">
                    {t.quote}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                    {t.poleName}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    {t.outcome}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 6 : DEVENIR PARTENAIRE (Appel aux pros, agences, banques, etc.)
          ========================================================================= */}
      <section className="py-20 bg-[#0A0A0A] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#161616] via-[#1A1A1A] to-[#161616] border border-[#D4AF37]/50 rounded-3xl p-8 sm:p-12 shadow-[0_15px_50px_rgba(212,175,55,0.15)] relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/15 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                  Développement Réseau Panafricain
                </span>

                <h2 className="africanova-h2 text-white">
                  Développez votre Activité avec AFRICANOVA
                </h2>

                <p className="africanova-body text-[#EDEDED]/80 leading-relaxed text-sm sm:text-base">
                  Vous êtes une <strong>agence immobilière</strong>, une <strong>banque</strong>, un <strong>organisme de formation</strong>, un <strong>recruteur</strong> ou un <strong>vendeur ZLECAf</strong> ? Intégrez le premier réseau certifié continental et accédez à une audience qualifiée en Afrique et au sein de la diaspora mondiale.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-white">
                    <CheckCircle2 size={14} className="text-[#D4AF37]" />
                    <span>4 Lettres Officielles Prêtes</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>APIs & Connecteurs Ouverts</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white">
                    <CheckCircle2 size={14} className="text-[#D4AF37]" />
                    <span>Mobile Money & Open Banking</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-[#0A0A0A]/80 border border-white/10 rounded-2xl text-center space-y-4">
                <AfricanovaLogo variant="emblem" customEmblemSize={64} />
                <div>
                  <h3 className="font-africanova-serif text-base font-bold text-white">
                    Partenariats Stratégiques & Connexions APIs
                  </h3>
                  <p className="text-xs text-[#EDEDED]/70 mt-1">
                    4 lettres de collaboration rédigées (Banques, Universités, E-Commerce, Médias) + Passerelles d'intégration.
                  </p>
                </div>
                <button
                  onClick={onOpenPartnerModal}
                  className="w-full py-3.5 px-6 rounded-xl bg-an-gold-gradient text-[#0A0A0A] font-extrabold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={16} />
                  <span>Ouvrir le Hub Partenariats & APIs</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7 : FOOTER (Plan du site complet, 6 pôles + sous-rubriques)
          ========================================================================= */}
      <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-12 text-[#EDEDED]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Footer : Brand & Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-white/10">
            <div className="lg:col-span-4 space-y-4">
              <AfricanovaLogo variant="full" size="md" />
              <p className="text-xs text-[#EDEDED]/70 leading-relaxed max-w-sm mt-3">
                AFRICANOVA est la plateforme panafricaine dédiée à la convergence des talents, des capitaux et des projets sur tout le continent et au sein de la diaspora mondiale.
              </p>
              
              {/* Sélecteur de Langue et Devise */}
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-1.5 bg-[#161616] px-2.5 py-1.5 rounded-lg border border-white/10 text-xs">
                  <Globe size={13} className="text-[#D4AF37]" />
                  <select 
                    value={currentLang} 
                    onChange={(e) => setCurrentLang(e.target.value as any)}
                    className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="FR" className="bg-black">Français (FR)</option>
                    <option value="EN" className="bg-black">English (EN)</option>
                    <option value="PT" className="bg-black">Português (PT)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-[#161616] px-2.5 py-1.5 rounded-lg border border-white/10 text-xs">
                  <Coins size={13} className="text-[#D4AF37]" />
                  <select 
                    value={currentCurrency} 
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                    className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
                    title="Devise globale d'affichage AFRICANOVA"
                  >
                    {allCurrencies.map(c => (
                      <option key={c.code} value={c.code} className="bg-black text-white">
                        {c.flag} {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Plan du site complet : Les 6 Pôles + Agent Nova (Colonnes 5 à 12) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
              {AFRICANOVA_POLES.map((pole) => (
                <div key={pole.id} className="space-y-2">
                  <button
                    onClick={() => onSelectPole(pole.id)}
                    className="font-africanova-serif font-bold text-[#F5D67A] hover:text-white uppercase tracking-wider text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{pole.name}</span>
                  </button>
                  <ul className="space-y-1.5 text-[11px] text-[#EDEDED]/60">
                    {pole.subSections.map((sub) => (
                      <li key={sub.id}>
                        <button
                          onClick={() => onSelectPole(pole.id, sub.id)}
                          className="hover:text-[#D4AF37] transition-colors text-left cursor-pointer"
                        >
                          {sub.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* 7ème SERVICE TRANSVERSE : AGENT NOVA (Dans le footer : Lien 'Parler à Agent Nova') */}
              <div className="space-y-2 col-span-2 sm:col-span-1 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#12B350] animate-ping" />
                  <span className="font-africanova-serif font-bold text-[#F5D67A] uppercase tracking-wider text-xs">
                    Agent Nova
                  </span>
                </div>
                <p className="text-[10px] text-[#EDEDED]/60 leading-tight">
                  Conseiller IA transverse actif sur 34 pays africains.
                </p>
                <div className="pt-2 space-y-1.5">
                  <button
                    onClick={() => onOpenAgentNova && onOpenAgentNova()}
                    className="text-xs font-bold text-[#12B350] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>⚡ Parler à Agent Nova</span>
                  </button>
                  {onOpenListingModal && (
                    <button
                      onClick={onOpenListingModal}
                      className="text-[11px] text-[#D4AF37] hover:underline block pt-1 cursor-pointer"
                    >
                      + Déposer une opportunité
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer : Mentions Légales & Droits */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B6B6B] gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span>© 2026 AFRICANOVA S.A. Tous droits réservés.</span>
              <button onClick={onOpenBrandGuide} className="hover:text-[#D4AF37] underline cursor-pointer">
                Charte Graphique & Déclinaisons Logo
              </button>
              <span>•</span>
              <a href="#poles-section" className="hover:text-white">Conditions Générales (OHADA)</a>
              <span>•</span>
              <a href="#poles-section" className="hover:text-white">Confidentialité & RGPD</a>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded">
                One Africa. Unlimited Opportunities.
              </span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default AfricanovaHome;
