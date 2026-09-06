import React, { useState } from 'react';
import { X, Check, Copy, Sparkles, Shield, AlertTriangle, Download, Eye, Layers } from 'lucide-react';
import { AfricanovaLogo, LogoVariant } from './AfricanovaLogo';

interface AfricanovaBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AfricanovaBrandModal: React.FC<AfricanovaBrandModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'logo' | 'colors' | 'typography' | 'rules'>('logo');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const colors = [
    { name: 'Noir profond', role: 'Fond principal (60%)', hex: '#0A0A0A', rgb: '10, 10, 10', textDark: false },
    { name: 'Or clair', role: 'Dégradé logo (haut)', hex: '#F5D67A', rgb: '245, 214, 122', textDark: true },
    { name: 'Or principal', role: 'Wordmark, accents (25%)', hex: '#D4AF37', rgb: '212, 175, 55', textDark: true },
    { name: 'Or foncé', role: 'Dégradé logo (bas), ombres', hex: '#A9791E', rgb: '169, 121, 30', textDark: false },
    { name: 'Vert clair', role: 'Dégradé accent (15%), succès', hex: '#12B350', rgb: '18, 179, 80', textDark: false },
    { name: 'Vert foncé', role: 'Dégradé accent (bas), liens', hex: '#087A36', rgb: '8, 122, 54', textDark: false },
    { name: 'Gris texte', role: 'Texte secondaire sur fond noir', hex: '#EDEDED', rgb: '237, 237, 237', textDark: true },
    { name: 'Gris discret', role: 'Mentions légales, signatures', hex: '#6B6B6B', rgb: '107, 107, 107', textDark: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0A0A0A] border border-[#D4AF37]/40 rounded-2xl shadow-[0_10px_50px_rgba(212,175,55,0.25)] overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 bg-[#161616] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AfricanovaLogo variant="emblem" size="sm" />
            <div>
              <h2 className="font-africanova-serif text-xl font-bold text-[#F5D67A]">
                AFRICANOVA — Charte Graphique Officielle
              </h2>
              <p className="text-xs font-serif italic text-[#EDEDED]/70">
                One Africa. Unlimited Opportunities.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#EDEDED]/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#0A0A0A] px-6">
          {[
            { id: 'logo', label: '1. Le Logo & 5 Déclinaisons' },
            { id: 'colors', label: '2. Palette de Couleurs (60/25/15)' },
            { id: 'typography', label: '3. Typographie & Hiérarchie' },
            { id: 'rules', label: '4. Règles & Interdits' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#D4AF37] text-[#F5D67A]'
                  : 'border-transparent text-[#EDEDED]/60 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* TAB 1 : LE LOGO & 5 DÉCLINAISONS */}
          {activeTab === 'logo' && (
            <div className="space-y-6">
              <div className="bg-[#161616] p-4 rounded-xl border border-white/10">
                <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Sparkles size={16} />
                  <span>Anatomie de l'emblème aux 6 Pôles</span>
                </h3>
                <p className="text-xs text-[#EDEDED]/80 leading-relaxed">
                  L'emblème est constitué d'un <strong>hub central vert</strong> (vert clair <code className="text-emerald-400">#12B350</code> vers vert foncé <code className="text-emerald-500">#087A36</code>) symbolisant la dynamique africaine unie, relié par des circuits dorés à <strong>6 nœuds interconnectés</strong> représentant les 6 pôles majeurs : Immobilier, Finance, Formation, Business, Emploi et Commerce.
                </p>
              </div>

              {/* Les 5 Déclinaisons */}
              <div className="space-y-4">
                <div className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                  Les 5 Déclinaisons Officielles à Produire
                </div>

                {/* 1. Logo Complet */}
                <div className="bg-[#161616] border border-[#D4AF37]/30 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest mb-3 bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/20">
                    1. Logo Complet (Emblème + Wordmark + Slogan) — Documents officiels
                  </span>
                  <div className="p-4 bg-[#0A0A0A] rounded-xl border border-white/10 w-full flex items-center justify-center">
                    <AfricanovaLogo variant="full" size="lg" />
                  </div>
                </div>

                {/* 2. Logo Horizontal */}
                <div className="bg-[#161616] border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest mb-3 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                    2. Logo Horizontal (Emblème + Wordmark, sans slogan) — En-tête de site
                  </span>
                  <div className="p-4 bg-[#0A0A0A] rounded-xl border border-white/10 w-full flex items-center justify-center">
                    <AfricanovaLogo variant="horizontal" size="md" />
                  </div>
                </div>

                {/* 3. Emblème Seul */}
                <div className="bg-[#161616] border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest mb-3 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                    3. Emblème Seul — Favicon, icône d'app, réseaux sociaux
                  </span>
                  <div className="p-4 bg-[#0A0A0A] rounded-xl border border-white/10 w-full flex items-center justify-center gap-6">
                    <AfricanovaLogo variant="emblem" customEmblemSize={64} />
                    <AfricanovaLogo variant="emblem" customEmblemSize={44} />
                    <AfricanovaLogo variant="emblem" customEmblemSize={32} />
                  </div>
                </div>

                {/* 4 & 5. Versions Monochromes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Monochrome Blanche */}
                  <div className="bg-[#161616] border border-white/10 rounded-xl p-5 flex flex-col items-center text-center">
                    <span className="text-[10px] font-mono text-white uppercase tracking-widest mb-3">
                      4. Monochrome Blanche — Sur fond photo/sombre
                    </span>
                    <div className="p-6 bg-gradient-to-br from-zinc-800 to-black rounded-xl w-full flex items-center justify-center border border-white/10">
                      <AfricanovaLogo variant="monochrome-white" size="md" />
                    </div>
                  </div>

                  {/* Monochrome Noire */}
                  <div className="bg-[#161616] border border-white/10 rounded-xl p-5 flex flex-col items-center text-center">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest mb-3">
                      5. Monochrome Noire — Sur fond clair
                    </span>
                    <div className="p-6 bg-white rounded-xl w-full flex items-center justify-center border border-gray-300">
                      <AfricanovaLogo variant="monochrome-black" size="md" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2 : COULEURS */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              {/* Règle d'usage 60 / 25 / 15 */}
              <div className="bg-[#161616] p-5 rounded-xl border border-[#D4AF37]/30">
                <h3 className="text-sm font-bold text-[#F5D67A] uppercase tracking-wider mb-2">
                  Règle d'usage de la palette (60% / 25% / 15%)
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center mb-3">
                  <div className="p-3 bg-[#0A0A0A] border border-white/10 rounded-lg">
                    <div className="text-xl font-black text-white font-mono">60%</div>
                    <div className="text-[11px] font-bold text-[#EDEDED]/80 uppercase">Noir Profond</div>
                    <div className="text-[9px] text-[#EDEDED]/60">Fond principal</div>
                  </div>
                  <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg">
                    <div className="text-xl font-black text-[#D4AF37] font-mono">25%</div>
                    <div className="text-[11px] font-bold text-[#F5D67A] uppercase">Or Principal</div>
                    <div className="text-[9px] text-[#EDEDED]/60">Titres, CTA, badges</div>
                  </div>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-lg">
                    <div className="text-xl font-black text-emerald-400 font-mono">15%</div>
                    <div className="text-[11px] font-bold text-emerald-300 uppercase">Vert Clair/Foncé</div>
                    <div className="text-[9px] text-[#EDEDED]/60">Accents, statuts, liens</div>
                  </div>
                </div>
                <p className="text-[11px] text-[#EDEDED]/70 italic">
                  * Note impérative : Le vert ne doit jamais être utilisé pour du texte long — il est strictement réservé aux accents et pictogrammes.
                </p>
              </div>

              {/* Nuancier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {colors.map((c) => (
                  <div 
                    key={c.hex}
                    className="bg-[#161616] border border-white/10 rounded-xl overflow-hidden hover:border-[#D4AF37]/50 transition-all group"
                  >
                    <div 
                      className="h-20 w-full flex items-end p-2 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: c.hex }}
                    >
                      <button
                        onClick={() => copyColor(c.hex)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md flex items-center gap-1 shadow cursor-pointer ${
                          c.textDark ? 'bg-black/40 text-white' : 'bg-white/40 text-black'
                        }`}
                      >
                        {copiedHex === c.hex ? <Check size={11} /> : <Copy size={11} />}
                        <span>{c.hex}</span>
                      </button>
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-bold text-white">{c.name}</div>
                      <div className="text-[10px] text-[#EDEDED]/60">{c.role}</div>
                      <div className="text-[9px] text-[#6B6B6B] font-mono mt-1">RGB: {c.rgb}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3 : TYPOGRAPHIE */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              <div className="bg-[#161616] p-5 rounded-xl border border-white/10 space-y-3">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                    Titres / Wordmark
                  </h4>
                  <p className="text-sm font-africanova-serif text-white mt-1">
                    Serif classique (Cinzel, Playfair Display, Georgia) — Évoque la solidité, le patrimoine, et la confiance financière.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <h4 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                    Corps de texte / UI
                  </h4>
                  <p className="text-sm font-sans text-[#EDEDED]/90 mt-1">
                    Sans-serif (Inter, Helvetica, Arial) — Garantit une lisibilité maximale et une modernité fonctionnelle.
                  </p>
                </div>
              </div>

              {/* Échelle de hiérarchie desktop */}
              <div className="space-y-4">
                <div className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                  Hiérarchie Typographique Desktop
                </div>

                <div className="p-4 bg-[#161616] rounded-xl border border-white/10 space-y-4">
                  <div className="border-b border-white/5 pb-3">
                    <span className="text-[10px] font-mono text-[#D4AF37]">H1 — 88px (Display Hero)</span>
                    <h1 className="africanova-h1 text-white mt-1">
                      One Africa. Unlimited Opportunities.
                    </h1>
                  </div>

                  <div className="border-b border-white/5 pb-3">
                    <span className="text-[10px] font-mono text-[#D4AF37]">H2 — 48px (Sections Majeures)</span>
                    <h2 className="africanova-h2 text-white mt-1">
                      Les 6 Pôles Panafricains d'Excellence
                    </h2>
                  </div>

                  <div className="border-b border-white/5 pb-3">
                    <span className="text-[10px] font-mono text-[#D4AF37]">H3 — 28px (Sous-titres & Cartes)</span>
                    <h3 className="africanova-h3 text-white mt-1">
                      Investissement, Croissance & Synergies
                    </h3>
                  </div>

                  <div className="border-b border-white/5 pb-3">
                    <span className="text-[10px] font-mono text-emerald-400">Corps — 16px (1.6 Line Height)</span>
                    <p className="africanova-body text-[#EDEDED] mt-1">
                      Plateforme unifiée connectant les porteurs de projets, les investisseurs institutionnels et les talents de toute l'Afrique.
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-[#6B6B6B]">Légendes — 13px</span>
                    <p className="africanova-caption text-[#6B6B6B] mt-1">
                      Mentions légales, signatures et indicateurs de performance certifiés conforme OHADA / ZLECAf.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4 : RÈGLES & INTERDITS */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              {/* Zone de protection */}
              <div className="bg-[#161616] p-5 rounded-xl border border-white/10">
                <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Shield size={16} />
                  <span>Zone de Protection & Dimensions Minimales</span>
                </h3>
                <ul className="text-xs text-[#EDEDED]/80 space-y-2 list-disc list-inside">
                  <li><strong>Zone de protection :</strong> Laisser un espace vide autour du logo égal à la hauteur du hub central vert (le cercle du milieu de l'emblème).</li>
                  <li><strong>Taille minimale :</strong> 40px de hauteur pour l'emblème seul (favicon/app mobile).</li>
                  <li><strong>Largeur minimale :</strong> 120px de largeur pour la version complète avec wordmark.</li>
                </ul>
              </div>

              {/* Interdits absolus */}
              <div className="bg-red-500/10 border border-red-500/30 p-5 rounded-xl">
                <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>Interdits de la Charte (Non Négociable)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#EDEDED]/90">
                  <div className="p-2 bg-black/40 rounded border border-red-500/20">❌ Ne pas étirer ou déformer le logo</div>
                  <div className="p-2 bg-black/40 rounded border border-red-500/20">❌ Ne pas altérer les couleurs du dégradé</div>
                  <div className="p-2 bg-black/40 rounded border border-red-500/20">❌ Ne pas séparer les 6 nœuds du hub central vert</div>
                  <div className="p-2 bg-black/40 rounded border border-red-500/20">❌ Ne pas placer sur un fond qui casse le contraste or/vert</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#161616] border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-[#6B6B6B] font-mono">
            Document de Référence AFRICANOVA © 2026
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-an-gold-gradient text-black rounded-xl text-xs font-bold uppercase tracking-wider hover:brightness-110 cursor-pointer"
          >
            Fermer le Guide
          </button>
        </div>

      </div>
    </div>
  );
};

export default AfricanovaBrandModal;
