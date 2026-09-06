import React, { useState } from 'react';
import { 
  X, Mail, Lock, User, Phone, MapPin, Building, Briefcase, 
  ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { AfricanovaEmblem } from './AfricanovaLogo';

interface AfricanovaAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  onAuthSuccess?: (userData: any) => void;
}

const AFRICAN_COUNTRIES = [
  { code: 'SN', name: 'Sénégal', dial: '+221' },
  { code: 'CI', name: "Côte d'Ivoire", dial: '+225' },
  { code: 'CD', name: 'RD Congo', dial: '+243' },
  { code: 'RW', name: 'Rwanda', dial: '+250' },
  { code: 'NG', name: 'Nigeria', dial: '+234' },
  { code: 'CM', name: 'Cameroun', dial: '+237' },
  { code: 'MA', name: 'Maroc', dial: '+212' },
  { code: 'TG', name: 'Togo', dial: '+228' },
  { code: 'BJ', name: 'Bénin', dial: '+229' },
  { code: 'GA', name: 'Gabon', dial: '+241' },
  { code: 'FR', name: 'France (Diaspora)', dial: '+33' },
  { code: 'US', name: 'USA / Canada (Diaspora)', dial: '+1' },
  { code: 'GB', name: 'Royaume-Uni (Diaspora)', dial: '+44' },
];

const PROFILES = [
  { id: 'investisseur', title: 'Investisseur / Particulier', desc: 'Acquisition immobilière, placements, projets' },
  { id: 'promoteur', title: 'Promoteur / Entreprise', desc: 'Vente de programmes, business, export B2B' },
  { id: 'partenaire', title: 'Partenaire Agréé', desc: 'Banque, agence, notaire, organisme formateur' },
  { id: 'talent', title: 'Talent & Cadre', desc: 'Postuler aux opportunités d’emploi et formations' },
];

export const AfricanovaAuthModal: React.FC<AfricanovaAuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [selectedProfile, setSelectedProfile] = useState('investisseur');
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+221');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Veuillez renseigner votre email et mot de passe.");
      return;
    }

    if (mode === 'register' && !fullName) {
      setErrorMessage("Veuillez renseigner votre nom complet.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const user = {
        fullName: fullName || email.split('@')[0],
        email,
        phone: `${countryCode} ${phone}`,
        profile: selectedProfile,
        authenticated: true,
      };

      try {
        localStorage.setItem('africanova_session_user', JSON.stringify(user));
      } catch (err) {
        console.warn(err);
      }

      setSuccessMessage(mode === 'login' ? "Connexion réussie !" : "Compte créé avec succès ! Bienvenue sur AFRICANOVA.");
      
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(user);
        onClose();
        setSuccessMessage(null);
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#161616] border border-[#D4AF37]/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-[#EDEDED] max-h-[90vh] overflow-y-auto"
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
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-2">
            <AfricanovaEmblem size={38} />
          </div>
          <h2 className="font-africanova-serif text-xl sm:text-2xl font-bold text-[#F5D67A]">
            AFRICANOVA
          </h2>
          <p className="text-xs text-[#EDEDED]/70 font-serif italic mt-0.5">
            One Africa. Unlimited Opportunities.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-[#0A0A0A] p-1 rounded-xl border border-white/10 mt-5">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-an-gold-gradient text-black shadow-md'
                  : 'text-[#EDEDED]/70 hover:text-white'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-an-gold-gradient text-black shadow-md'
                  : 'text-[#EDEDED]/70 hover:text-white'
              }`}
            >
              Inscription
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 bg-[#12B350]/15 border border-[#12B350]/40 rounded-xl text-[#12B350] text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/15 border border-red-500/40 rounded-xl text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* PROFILE SELECTOR IF REGISTER */}
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                Type de Profil :
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PROFILES.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setSelectedProfile(p.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedProfile === p.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white'
                        : 'border-white/10 bg-[#0A0A0A] text-[#EDEDED]/70 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#F5D67A] line-clamp-1">{p.title}</div>
                    <div className="text-[10px] text-[#EDEDED]/60 line-clamp-1 mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FULL NAME (if register) */}
          {mode === 'register' && (
            <div>
              <label className="text-xs font-medium text-[#EDEDED]/80 block mb-1">
                Nom complet ou Raison Sociale
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex : Amadou Diallo / Diaspora Invest SAS"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0A0A0A] border border-white/15 focus:border-[#D4AF37] rounded-xl text-xs sm:text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="text-xs font-medium text-[#EDEDED]/80 block mb-1">
              Adresse Email Professionnelle ou Personnelle
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@exemple.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#0A0A0A] border border-white/15 focus:border-[#D4AF37] rounded-xl text-xs sm:text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* PHONE & COUNTRY (if register) */}
          {mode === 'register' && (
            <div>
              <label className="text-xs font-medium text-[#EDEDED]/80 block mb-1">
                Téléphone WhatsApp & Pays
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-32 bg-[#0A0A0A] border border-white/15 focus:border-[#D4AF37] rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none"
                >
                  {AFRICAN_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.dial} className="bg-black">
                      {c.name} ({c.dial})
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="77 123 45 67"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#0A0A0A] border border-white/15 focus:border-[#D4AF37] rounded-xl text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASSWORD */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-[#EDEDED]/80">
                Mot de passe
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert("Un lien de réinitialisation sécurisé a été envoyé à votre adresse.")}
                  className="text-[11px] text-[#D4AF37] hover:underline cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#0A0A0A] border border-white/15 focus:border-[#D4AF37] rounded-xl text-xs sm:text-sm text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#EDEDED]/50 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* TERMS CHECKBOX (if register) */}
          {mode === 'register' && (
            <label className="flex items-start gap-2 pt-1 text-[11px] text-[#EDEDED]/70 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 rounded border-white/20 text-[#D4AF37] focus:ring-0"
              />
              <span>
                J'accepte les Conditions Générales AFRICANOVA et la charte de confidentialité OHADA.
              </span>
            </label>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-an-gold-gradient text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <span>Vérification en cours...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Se Connecter' : 'Créer mon Espace Membre'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* SOCIAL AUTH DIVIDER */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative bg-[#161616] px-3 text-[11px] text-[#EDEDED]/60 font-mono">
            OU ACCÈS RAPIDE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              handleSubmit({ preventDefault: () => {} } as any);
            }}
            className="py-2.5 px-3 bg-[#0A0A0A] hover:bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span className="font-bold text-red-400">G</span>
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => {
              handleSubmit({ preventDefault: () => {} } as any);
            }}
            className="py-2.5 px-3 bg-[#0A0A0A] hover:bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span className="font-bold text-blue-400">in</span>
            <span>LinkedIn</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AfricanovaAuthModal;
