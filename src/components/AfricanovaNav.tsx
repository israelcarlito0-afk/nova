import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ChevronDown, User, Heart, Sparkles, 
  Home, Landmark, GraduationCap, Briefcase, Users, ShoppingBag, 
  ArrowRight, ShieldCheck, Compass, Coins
} from 'lucide-react';
import { AfricanovaLogo } from './AfricanovaLogo';
import { AFRICANOVA_POLES, Pole, SubSection } from '../data/africanovaData';
import { useCurrency, CurrencyCode } from '../services/currencyService';

interface AfricanovaNavProps {
  onSelectPole: (poleId: string, subSectionId?: string) => void;
  onOpenMemberSpace: () => void;
  onOpenBrandGuide: () => void;
  onOpenPartnerModal: () => void;
  onOpenRealEstateExplorer?: () => void;
  onOpenAgentNova?: () => void;
  onOpenListingModal?: () => void;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
  currentActivePole?: string | null;
}

export const AfricanovaNav: React.FC<AfricanovaNavProps> = ({
  onSelectPole,
  onOpenMemberSpace,
  onOpenBrandGuide,
  onOpenPartnerModal,
  onOpenRealEstateExplorer,
  onOpenAgentNova,
  onOpenListingModal,
  favoritesCount = 0,
  onOpenFavorites,
  currentActivePole,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobilePole, setExpandedMobilePole] = useState<string | null>(null);
  const { currentCurrency, setCurrency, allCurrencies } = useCurrency();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getPoleIcon = (poleId: string) => {
    switch (poleId) {
      case 'immobilier': return <Home size={16} className="text-amber-400" />;
      case 'finance': return <Landmark size={16} className="text-emerald-400" />;
      case 'formation': return <GraduationCap size={16} className="text-amber-400" />;
      case 'business': return <Briefcase size={16} className="text-emerald-400" />;
      case 'emploi': return <Users size={16} className="text-amber-400" />;
      case 'commerce': return <ShoppingBag size={16} className="text-emerald-400" />;
      default: return <Compass size={16} className="text-amber-400" />;
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#D4AF37]/25 shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3' 
            : 'bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/90 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* GAUCHE : Logo officiel AFRICANOVA (horizontal : emblème + wordmark) */}
          <div className="flex items-center gap-3">
            <AfricanovaLogo 
              variant="horizontal" 
              size="md" 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer"
            />
            {/* Tagline discret pour desktop */}
            <span className="hidden xl:inline-block text-[10px] font-serif italic text-[#EDEDED]/60 border-l border-[#D4AF37]/30 pl-3">
              One Africa. Unlimited Opportunities.
            </span>
          </div>

          {/* CENTRE : Les 6 Pôles (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {AFRICANOVA_POLES.map((pole) => {
              const isActive = currentActivePole === pole.id;
              const isHovered = activeDropdown === pole.id;

              return (
                <div 
                  key={pole.id}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(pole.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => onSelectPole(pole.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'text-[#F5D67A] bg-[#161616] border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
                        : 'text-[#EDEDED]/80 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {getPoleIcon(pole.id)}
                    <span>{pole.name}</span>
                    <ChevronDown 
                      size={13} 
                      className={`transition-transform duration-200 opacity-60 ${isHovered ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  {/* Dropdown Menu des sous-rubriques */}
                  {isHovered && (
                    <div 
                      className="absolute top-full left-0 mt-1 w-72 bg-[#161616] border border-[#D4AF37]/30 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl"
                    >
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <div className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider flex items-center justify-between">
                          <span>Pôle {pole.name}</span>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                            {pole.metrics.value}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#EDEDED]/70 mt-0.5 leading-snug">
                          {pole.shortDescription}
                        </p>
                      </div>

                      <div className="space-y-1">
                        {pole.subSections.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(null);
                              onSelectPole(pole.id, sub.id);
                            }}
                            className="w-full text-left p-2.5 rounded-lg hover:bg-white/[0.06] transition-colors group cursor-pointer flex items-start justify-between"
                          >
                            <div>
                              <div className="text-xs font-semibold text-white group-hover:text-[#F5D67A] transition-colors flex items-center gap-1.5">
                                <span>{sub.title}</span>
                              </div>
                              <p className="text-[10px] text-[#EDEDED]/60 line-clamp-1 mt-0.5">
                                {sub.description}
                              </p>
                            </div>
                            {sub.badge && (
                              <span className="text-[9px] px-1.5 py-0.5 bg-[#D4AF37]/15 text-[#F5D67A] border border-[#D4AF37]/30 rounded font-medium shrink-0 ml-2">
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="pt-2 mt-1 border-t border-white/10 px-2 pb-1">
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            onSelectPole(pole.id);
                          }}
                          className="w-full py-1.5 px-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D67A] text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>Voir le Pôle Complet</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* DROITE : Agent Nova, Déposer, Espace Membre, Favoris, CTA "Rejoindre" */}
          <div className="hidden sm:flex items-center gap-2">
            {/* BOUTON AGENT NOVA AVEC PASTILLE VERTE #12B350 (2. Où le placer dans le site) */}
            {onOpenAgentNova && (
              <button
                onClick={onOpenAgentNova}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161616] hover:bg-white/[0.08] border border-[#D4AF37]/35 text-xs font-semibold text-[#F5D67A] hover:border-[#D4AF37] transition-all cursor-pointer shadow-sm group"
                title="Consulter Agent Nova — Conseiller IA Personnel"
              >
                {/* Pastille verte #12B350 avec effet radar */}
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12B350] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#12B350]"></span>
                </span>
                <span className="font-africanova-serif font-bold tracking-wide">Agent Nova</span>
              </button>
            )}

            {/* SÉLECTEUR DE DEVISES PANAFRICAINES (12 Devises Prioritaires) */}
            <div className="relative flex items-center">
              <div className="flex items-center gap-1 bg-[#161616] border border-[#D4AF37]/35 hover:border-[#D4AF37] rounded-xl px-2 py-1 shadow-sm transition-all">
                <Coins size={13} className="text-[#D4AF37] shrink-0" />
                <select
                  value={currentCurrency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="bg-transparent text-[#F5D67A] text-xs font-mono font-bold appearance-none pr-3 focus:outline-none cursor-pointer"
                  title="Changer la devise d'affichage globale (12 devises phares)"
                >
                  {allCurrencies.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#161616] text-white">
                      {c.flag} {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none -ml-2 text-[#D4AF37] text-[8px]">▾</span>
              </div>
            </div>

            {/* Dépôt d'annonce */}
            {onOpenListingModal && (
              <button
                onClick={onOpenListingModal}
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#EDEDED]/80 hover:text-white hover:bg-white/5 border border-white/10 transition-colors cursor-pointer"
                title="Déposer une annonce ou opportunité"
              >
                <span className="text-[#D4AF37] font-bold">+</span>
                <span>Déposer</span>
              </button>
            )}

            {/* Bouton Charte & Logo */}
            <button
              onClick={onOpenBrandGuide}
              className="text-[11px] font-semibold text-[#EDEDED]/70 hover:text-[#D4AF37] px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors flex items-center gap-1 cursor-pointer"
              title="Consulter la Charte Graphique & les 5 déclinaisons de logo"
            >
              <Sparkles size={13} className="text-[#D4AF37]" />
              <span className="hidden xl:inline">Charte</span>
            </button>

            {/* Favoris */}
            {onOpenFavorites && (
              <button
                onClick={onOpenFavorites}
                className="relative p-2 text-[#EDEDED]/70 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer"
                title="Vos favoris sauvegardés"
              >
                <Heart size={17} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}

            {/* Espace Membre */}
            <button
              onClick={onOpenMemberSpace}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#EDEDED] hover:text-white bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 transition-all cursor-pointer"
            >
              <User size={13} className="text-[#D4AF37]" />
              <span className="hidden lg:inline">Espace Membre</span>
              <span className="lg:hidden">Compte</span>
            </button>

            {/* CTA Principal selon la charte (Or principal #D4AF37) */}
            <button
              onClick={onOpenPartnerModal}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-an-gold-gradient text-[#0A0A0A] hover:brightness-110 shadow-[0_4px_16px_rgba(212,175,55,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck size={14} />
              <span>Partenaires & APIs</span>
            </button>
          </div>

          {/* Bouton Hamburger Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#EDEDED] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </nav>

      {/* MENU MOBILE EN ACCORDÉON (2.4 de la structure) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] z-40 bg-[#0A0A0A] border-t border-[#D4AF37]/30 flex flex-col p-4 overflow-y-auto pb-24 lg:hidden">
          
          {/* Header Mobile Menu */}
          <div className="mb-4 pb-3 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="font-africanova-serif text-lg font-bold text-[#F5D67A]">AFRICANOVA</span>
              <p className="text-[11px] font-serif italic text-[#EDEDED]/70">One Africa. Unlimited Opportunities.</p>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBrandGuide();
              }}
              className="text-[11px] text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg px-2.5 py-1"
            >
              Charte Logo
            </button>
          </div>

          {/* Sélecteur de Devise Mobile */}
          <div className="mb-4 p-3 bg-[#161616] border border-[#D4AF37]/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins size={16} className="text-[#D4AF37]" />
              <div>
                <div className="text-xs font-bold text-white">Devise active</div>
                <div className="text-[10px] text-[#EDEDED]/60">12 devises convertibles</div>
              </div>
            </div>
            <select
              value={currentCurrency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-black/60 border border-[#D4AF37]/40 text-[#F5D67A] text-xs font-mono font-bold rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              {allCurrencies.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#161616] text-white">
                  {c.flag} {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Accordéon des 6 Pôles */}
          <div className="space-y-2 mb-6">
            <div className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold px-2 mb-1">
              Les 6 Pôles Panafricains
            </div>

            {AFRICANOVA_POLES.map((pole) => {
              const isExpanded = expandedMobilePole === pole.id;

              return (
                <div 
                  key={pole.id}
                  className="bg-[#161616] border border-white/10 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedMobilePole(isExpanded ? null : pole.id)}
                    className="w-full p-3 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.03]"
                  >
                    <div className="flex items-center gap-2.5">
                      {getPoleIcon(pole.id)}
                      <div>
                        <div className="text-sm font-bold text-white">{pole.name}</div>
                        <div className="text-[10px] text-[#EDEDED]/60 line-clamp-1">{pole.shortDescription}</div>
                      </div>
                    </div>
                    <ChevronDown 
                      size={16} 
                      className={`text-[#D4AF37] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  {/* Contenu de l'accordéon */}
                  {isExpanded && (
                    <div className="p-3 pt-0 border-t border-white/5 space-y-2 bg-black/40">
                      <div className="space-y-1.5 pt-2">
                        {pole.subSections.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              onSelectPole(pole.id, sub.id);
                            }}
                            className="w-full text-left p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] transition-colors flex items-center justify-between"
                          >
                            <span className="text-xs text-[#EDEDED] font-medium">{sub.title}</span>
                            <ArrowRight size={12} className="text-[#D4AF37]" />
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onSelectPole(pole.id);
                        }}
                        className="w-full mt-2 py-2 bg-an-gold-gradient text-black text-xs font-bold rounded-lg uppercase tracking-wider"
                      >
                        Consulter {pole.name}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions rapides mobile */}
          <div className="space-y-2 mt-auto pt-4 border-t border-white/10">
            {onOpenAgentNova && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAgentNova();
                }}
                className="w-full py-2.5 rounded-xl bg-[#161616] border border-[#D4AF37]/50 text-[#F5D67A] font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[#12B350] animate-pulse" />
                <span>Parler à Agent Nova (Conseiller IA)</span>
              </button>
            )}

            {onOpenListingModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenListingModal();
                }}
                className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2"
              >
                <span className="text-[#D4AF37] font-bold">+</span>
                <span>Déposer une opportunité</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMemberSpace();
              }}
              className="w-full py-3 rounded-xl bg-white/10 text-white font-bold text-sm flex items-center justify-center gap-2"
            >
              <User size={16} className="text-[#D4AF37]" />
              <span>Espace Membre & Tableau de Bord</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPartnerModal();
              }}
              className="w-full py-3.5 rounded-xl bg-an-gold-gradient text-black font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} />
              <span>Partenariats & APIs (4 Lettres + Connecteurs)</span>
            </button>
          </div>

        </div>
      )}
    </>
  );
};

export default AfricanovaNav;
