import React, { useState } from 'react';
import { 
  X, Upload, Sparkles, CheckCircle2, ArrowRight, ArrowLeft,
  Home, Briefcase, Users, ShoppingBag, GraduationCap, MapPin, DollarSign, ShieldCheck, Coins
} from 'lucide-react';
import { AfricanovaEmblem } from './AfricanovaLogo';
import { CURRENCY_LIST, CurrencyCode } from '../services/currencyService';

interface AfricanovaListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPoleId?: string;
  onListingCreated?: (listing: any) => void;
}

const POLES_AVAILABLE = [
  { id: 'immobilier', name: 'Immobilier', icon: <Home size={16} />, desc: 'Villas, appartements, terrains, bureaux' },
  { id: 'business', name: 'Business & ZLECAf', icon: <Briefcase size={16} />, desc: 'Cessions d’entreprises, projets, investissements' },
  { id: 'emploi', name: 'Emploi & Recrutement', icon: <Users size={16} />, desc: 'Postes de direction, experts, recrutements cadres' },
  { id: 'commerce', name: 'Commerce B2B', icon: <ShoppingBag size={16} />, desc: 'Ventes en gros, matières premières, conteneurs' },
  { id: 'formation', name: 'Formation & Cursus', icon: <GraduationCap size={16} />, desc: 'Formations certifiantes, séminaires exécutifs' },
];

export const AfricanovaListingModal: React.FC<AfricanovaListingModalProps> = ({
  isOpen,
  onClose,
  defaultPoleId = 'immobilier',
  onListingCreated,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPole, setSelectedPole] = useState<string>(defaultPoleId);
  
  // Fields
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('Sénégal');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  
  // AI Nova Audit
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{ score: number; tips: string[] } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRunAiAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditResult({
        score: 9.4,
        tips: [
          "Titre attractif et clair pour les investisseurs de la diaspora.",
          "Prix positionné dans le corridor de rentabilité optimale.",
          "Recommandation : Joindre le certificat d'immatriculation foncière ou numéro RCCM OHADA pour le badge 'Certifié'."
        ]
      });
      setStep(3);
    }, 900);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    const newListing = {
      id: `novalist-${Date.now()}`,
      poleId: selectedPole,
      title,
      location: `${location}, ${country}`,
      price: Number(price.replace(/[^0-9]/g, '')) || 0,
      currency,
      description,
      whatsapp,
      createdAt: new Date().toISOString(),
      status: 'pending_verification'
    };

    setTimeout(() => {
      if (onListingCreated) onListingCreated(newListing);
      setIsSuccess(false);
      onClose();
      // Reset
      setStep(1);
      setTitle('');
      setDescription('');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#161616] border border-[#D4AF37]/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#EDEDED] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <AfricanovaEmblem size={32} />
          <div>
            <h2 className="font-africanova-serif text-lg font-bold text-[#F5D67A]">
              Déposer une Opportunité Agréée
            </h2>
            <p className="text-xs text-[#EDEDED]/60 font-serif italic">
              AFRICANOVA — Visibilité garantie sur 34 pays et auprès de la diaspora
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-6 text-[11px] font-mono font-semibold">
          <span className={step >= 1 ? 'text-[#D4AF37]' : 'text-white/40'}>1. Pôle</span>
          <span className="text-white/20">───</span>
          <span className={step >= 2 ? 'text-[#D4AF37]' : 'text-white/40'}>2. Détails</span>
          <span className="text-white/20">───</span>
          <span className={step >= 3 ? 'text-[#D4AF37]' : 'text-white/40'}>3. Audit IA</span>
          <span className="text-white/20">───</span>
          <span className={step >= 4 ? 'text-[#12B350]' : 'text-white/40'}>4. Publication</span>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#12B350]/20 border border-[#12B350] text-[#12B350] flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="font-africanova-serif text-xl font-bold text-white">
              Opportunité Soumise avec Succès !
            </h3>
            <p className="text-xs text-[#EDEDED]/80 max-w-md mx-auto leading-relaxed">
              Votre dossier est en cours de vérification par notre comité de conformité OHADA & ZLECAf. 
              Vous recevrez une notification sous 24h ouvrées.
            </p>
          </div>
        ) : (
          <div>
            {/* STEP 1: CHOIX DU PÔLE */}
            {step === 1 && (
              <div className="space-y-4">
                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                  Sélectionnez le pôle concerné :
                </label>
                <div className="space-y-2">
                  {POLES_AVAILABLE.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPole(p.id)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedPole === p.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white shadow-md'
                          : 'border-white/10 bg-[#0A0A0A] text-[#EDEDED]/70 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${selectedPole === p.id ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white'}`}>
                          {p.icon}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#F5D67A]">{p.name}</div>
                          <div className="text-[11px] text-[#EDEDED]/60">{p.desc}</div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedPole === p.id ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-white/30'}`}>
                        {selectedPole === p.id && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-an-gold-gradient text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110"
                  >
                    <span>Continuer vers les détails</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DÉTAILS DE L'ANNONCE */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#EDEDED]/80 block mb-1">
                    Titre de l'opportunité *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex : Villa de prestige 4 chambres Almadies / Levée de fonds Coopérative Cacao"
                    className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/15 focus:border-[#D4AF37] rounded-xl text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#EDEDED]/80 block mb-1">
                      Pays *
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#0A0A0A] border border-white/15 focus:border-[#D4AF37] rounded-xl text-xs text-white focus:outline-none"
                    >
                      <option value="Sénégal">Sénégal</option>
                      <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                      <option value="RD Congo">RD Congo</option>
                      <option value="Rwanda">Rwanda</option>
                      <option value="Nigéria">Nigéria</option>
                      <option value="Cameroun">Cameroun</option>
                      <option value="Togo">Togo</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#EDEDED]/80 block mb-1">
                      Ville ou Quartier *
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ex : Dakar, Almadies / Abidjan, Cocody"
                      className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/15 focus:border-[#D4AF37] rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-[#EDEDED]/80 block mb-1">
                      Montant / Budget / Prix demandé
                    </label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Ex : 250000"
                      className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/15 focus:border-[#D4AF37] rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#EDEDED]/80 block mb-1">
                      Devise
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#0A0A0A] border border-white/15 focus:border-[#D4AF37] rounded-xl text-xs text-white focus:outline-none"
                    >
                      {CURRENCY_LIST.map((c) => (
                        <option key={c.code} value={c.code} className="bg-[#161616] text-white">
                          {c.flag} {c.code} ({c.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#EDEDED]/80 block mb-1">
                    Description détaillée des atouts
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Précisez les garanties juridiques, la rentabilité espérée, les commodités ou les débouchés..."
                    className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/15 focus:border-[#D4AF37] rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#EDEDED]/80 block mb-1">
                    Contact WhatsApp Direct
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+221 77 123 45 67"
                    className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/15 focus:border-[#D4AF37] rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-white/70 hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft size={14} />
                    <span>Retour</span>
                  </button>

                  <button
                    type="button"
                    disabled={!title}
                    onClick={handleRunAiAudit}
                    className="px-5 py-2.5 rounded-xl bg-an-gold-gradient text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 disabled:opacity-40"
                  >
                    <Sparkles size={14} />
                    <span>{isAuditing ? 'Audit IA en cours...' : 'Auditer avec Agent Nova'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: AUDIT IA NOVA & CONFIRMATION */}
            {step === 3 && auditResult && (
              <div className="space-y-4">
                <div className="p-4 bg-[#121212] border border-[#D4AF37]/40 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-[#D4AF37]" />
                      <h4 className="font-africanova-serif text-sm font-bold text-[#F5D67A]">
                        Score d'Attractivité IA Nova
                      </h4>
                    </div>
                    <span className="font-mono text-sm font-bold bg-[#12B350]/20 text-[#12B350] px-2.5 py-1 rounded-lg border border-[#12B350]/40">
                      {auditResult.score} / 10
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-[#EDEDED]/90">
                    {auditResult.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-[#12B350] font-bold">✓</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recap */}
                <div className="p-3 bg-[#0A0A0A] border border-white/10 rounded-xl space-y-1 text-xs">
                  <div className="text-[#D4AF37] font-semibold">{title}</div>
                  <div className="text-white/70">{location}, {country} • {price} {currency}</div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-white/70 hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft size={14} />
                    <span>Modifier</span>
                  </button>

                  <button
                    onClick={handleFinalSubmit}
                    className="px-6 py-2.5 rounded-xl bg-[#12B350] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 shadow-lg shadow-[#12B350]/20"
                  >
                    <ShieldCheck size={16} />
                    <span>Publier sur AFRICANOVA</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AfricanovaListingModal;
