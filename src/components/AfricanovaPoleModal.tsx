import React, { useState } from 'react';
import { 
  X, Home, Landmark, GraduationCap, Briefcase, Users, ShoppingBag, 
  ArrowRight, Calculator, CheckCircle2, Search, Filter, Download, 
  ExternalLink, Upload, Star, ShieldCheck, MapPin, Building2, Sparkles, Send, Coins
} from 'lucide-react';
import { AFRICANOVA_POLES, Pole, SubSection } from '../data/africanovaData';
import { useCurrency, CURRENCY_LIST, CurrencyCode } from '../services/currencyService';

interface AfricanovaPoleModalProps {
  poleId: string | null;
  initialSubSectionId?: string | null;
  onClose: () => void;
  onOpenRealEstate?: () => void;
}

export const AfricanovaPoleModal: React.FC<AfricanovaPoleModalProps> = ({
  poleId,
  initialSubSectionId,
  onClose,
  onOpenRealEstate,
}) => {
  const pole = AFRICANOVA_POLES.find((p) => p.id === poleId) || AFRICANOVA_POLES[0];
  const [selectedSubId, setSelectedSubId] = useState<string>(
    initialSubSectionId || pole.subSections[0].id
  );

  const { currentCurrency, formatPriceString } = useCurrency();

  // Financial simulator state
  const [loanAmount, setLoanAmount] = useState<number>(() => {
    if (currentCurrency === 'XOF' || currentCurrency === 'XAF') return 50000000;
    if (currentCurrency === 'NGN') return 100000000;
    if (currentCurrency === 'KES') return 10000000;
    return 100000;
  });
  const [interestRate, setInterestRate] = useState<number>(7.5);
  const [loanDuration, setLoanDuration] = useState<number>(15);
  const [currency, setCurrency] = useState<CurrencyCode>(currentCurrency);

  // Form states
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!poleId) return null;

  // Monthly loan payment formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const calculateMonthlyPayment = () => {
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = loanDuration * 12;
    if (monthlyRate === 0) return loanAmount / totalMonths;
    const payment = (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) / 
                    (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return Math.round(payment);
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * loanDuration * 12;
  const totalInterest = totalPayment - loanAmount;

  const currentSub = pole.subSections.find((s) => s.id === selectedSubId) || pole.subSections[0];

  const getPoleIcon = (id: string) => {
    switch (id) {
      case 'immobilier': return <Home size={22} className="text-[#F5D67A]" />;
      case 'finance': return <Landmark size={22} className="text-emerald-400" />;
      case 'formation': return <GraduationCap size={22} className="text-[#F5D67A]" />;
      case 'business': return <Briefcase size={22} className="text-emerald-400" />;
      case 'emploi': return <Users size={22} className="text-[#F5D67A]" />;
      case 'commerce': return <ShoppingBag size={22} className="text-emerald-400" />;
      default: return <Home size={22} className="text-[#F5D67A]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0A0A0A] border border-[#D4AF37]/40 rounded-2xl shadow-[0_15px_60px_rgba(212,175,55,0.25)] overflow-hidden my-8">
        
        {/* Header du Pôle */}
        <div className="p-6 bg-[#161616] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-black border border-[#D4AF37]/40 flex items-center justify-center shadow-lg">
              {getPoleIcon(pole.id)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                  Nœud {pole.nodeNumber} — Pôle Officiel
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {pole.metrics.label} : {pole.metrics.value}
                </span>
              </div>
              <h2 className="font-africanova-serif text-2xl font-bold text-white mt-0.5">
                {pole.name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#EDEDED]/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Sous-rubriques Tabs */}
        <div className="flex border-b border-white/10 bg-[#0A0A0A] px-6 overflow-x-auto no-scrollbar">
          {pole.subSections.map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubId(sub.id);
                setSubmissionSuccess(null);
              }}
              className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                selectedSubId === sub.id
                  ? 'border-[#D4AF37] text-[#F5D67A] bg-white/[0.02]'
                  : 'border-transparent text-[#EDEDED]/60 hover:text-white'
              }`}
            >
              <span>{sub.title}</span>
              {sub.badge && (
                <span className="ml-2 text-[9px] px-1.5 py-0.5 bg-[#D4AF37]/10 text-[#F5D67A] rounded-full border border-[#D4AF37]/20">
                  {sub.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Bannière descriptive de la sous-rubrique */}
          <div className="bg-[#161616] p-4 rounded-xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{currentSub.title}</span>
              </h3>
              <p className="text-xs text-[#EDEDED]/80 mt-1 max-w-2xl leading-relaxed">
                {currentSub.description}
              </p>
            </div>
            {pole.id === 'immobilier' && onOpenRealEstate && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRealEstate();
                }}
                className="px-4 py-2 bg-an-gold-gradient text-black font-bold text-xs rounded-xl uppercase tracking-wider shrink-0 hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-1.5"
              >
                <span>Accéder au Catalogue Immobilier</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>

          {/* RENDU SPÉCIFIQUE SELON LA SOUS-RUBRIQUE */}

          {/* 1. SIMULATEUR DE FINANCEMENT */}
          {selectedSubId === 'simulateur-financement' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#161616] p-6 rounded-xl border border-[#D4AF37]/30">
              {/* Controls */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                    <Calculator size={16} />
                    Paramètres du Crédit
                  </span>
                  <div className="flex items-center gap-1.5 bg-black px-2.5 py-1 rounded-lg border border-white/15">
                    <Coins size={12} className="text-[#D4AF37]" />
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                      className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
                    >
                      {CURRENCY_LIST.map((c) => (
                        <option key={c.code} value={c.code} className="bg-[#161616] text-white">
                          {c.flag} {c.code} ({c.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Amount slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#EDEDED]">Montant emprunté</span>
                    <span className="font-bold text-[#F5D67A] font-mono">
                      {loanAmount.toLocaleString()} {currency}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="5000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-[#D4AF37] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#6B6B6B] mt-1 font-mono">
                    <span>10 000 {currency}</span>
                    <span>1 000 000 {currency}</span>
                  </div>
                </div>

                {/* Interest rate slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#EDEDED]">Taux d'intérêt annuel négocié</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {interestRate} %
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="16"
                    step="0.25"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#6B6B6B] mt-1 font-mono">
                    <span>4.0% (Partenaire Préférentiel)</span>
                    <span>16.0% (Standard)</span>
                  </div>
                </div>

                {/* Duration slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#EDEDED]">Durée du prêt</span>
                    <span className="font-bold text-white font-mono">
                      {loanDuration} ans ({loanDuration * 12} mois)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="25"
                    step="1"
                    value={loanDuration}
                    onChange={(e) => setLoanDuration(Number(e.target.value))}
                    className="w-full accent-[#D4AF37] cursor-pointer"
                  />
                </div>
              </div>

              {/* Simulation Output Card */}
              <div className="lg:col-span-5 bg-[#0A0A0A] p-5 rounded-xl border border-[#D4AF37]/30 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#D4AF37] tracking-widest block mb-1">
                    Estimation Mensualité AFRICANOVA
                  </span>
                  <div className="text-3xl font-black text-[#F5D67A] font-mono mt-1">
                    {monthlyPayment.toLocaleString()} <span className="text-sm">{currency} / mois</span>
                  </div>

                  <div className="space-y-2 mt-4 pt-4 border-t border-white/10 text-xs">
                    <div className="flex justify-between text-[#EDEDED]/80">
                      <span>Total des intérêts :</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {Math.round(totalInterest).toLocaleString()} {currency}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#EDEDED]/80">
                      <span>Montant total remboursé :</span>
                      <span className="font-mono text-white font-bold">
                        {Math.round(totalPayment).toLocaleString()} {currency}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#EDEDED]/80">
                      <span>Recommandation salaire min. :</span>
                      <span className="font-mono text-[#F5D67A] font-bold">
                        {Math.round(monthlyPayment * 3).toLocaleString()} {currency}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10">
                  <button
                    onClick={() => setSubmissionSuccess("Votre dossier de pré-qualification a été transmis aux banques partenaires agréées AFRICANOVA.")}
                    className="w-full py-2.5 bg-an-gold-gradient text-black font-bold text-xs rounded-xl uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={16} />
                    <span>Déposer une demande de prêt</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. CATALOGUE DE FORMATIONS */}
          {selectedSubId === 'catalogue-formations' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Executive Real Estate Mastery',
                    duration: '8 Semaines',
                    level: 'Professionnel',
                    rating: '4.9/5',
                    students: '1 420 inscrits',
                    tag: 'Immobilier',
                  },
                  {
                    title: 'Fintech & Mobile Money Architecture',
                    duration: '6 Semaines',
                    level: 'Avancé',
                    rating: '4.8/5',
                    students: '2 850 inscrits',
                    tag: 'Finance',
                  },
                  {
                    title: 'Supply Chain & Commerce ZLECAf',
                    duration: '5 Semaines',
                    level: 'Tous Niveaux',
                    rating: '4.9/5',
                    students: '3 100 inscrits',
                    tag: 'Commerce',
                  },
                ].map((course, idx) => (
                  <div key={idx} className="bg-[#161616] border border-white/10 rounded-xl p-5 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-mono text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                          {course.tag}
                        </span>
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <Star size={12} fill="currentColor" />
                          {course.rating}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                        {course.title}
                      </h4>
                      <div className="text-[11px] text-[#EDEDED]/70 space-y-1">
                        <div>Durée : <strong className="text-white">{course.duration}</strong></div>
                        <div>Niveau : <strong className="text-white">{course.level}</strong></div>
                        <div>Audience : <strong className="text-white">{course.students}</strong></div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSubmissionSuccess(`Inscription enregistrée pour "${course.title}". Vous recevrez les accès au campus en ligne.`)}
                      className="mt-4 w-full py-2 bg-white/5 hover:bg-[#D4AF37] hover:text-black border border-white/10 hover:border-[#D4AF37] text-white text-xs font-bold rounded-lg transition-all"
                    >
                      S'inscrire au Cursus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. OFFRES D'EMPLOI */}
          {selectedSubId === 'offres-emploi' && (
            <div className="space-y-3">
              {[
                {
                  title: 'Chief Financial Officer (CFO)',
                  company: 'Pan-African Energy Consortium',
                  location: 'Abidjan, Côte d\'Ivoire',
                  type: 'CDI Exécutif',
                  salary: '80k - 110k $ / an',
                },
                {
                  title: 'Senior Lead Architect & Urbaniste',
                  company: 'Atlas Development Partners',
                  location: 'Casablanca & Dakar',
                  type: 'Plein Temps',
                  salary: '65k - 85k $ / an',
                },
                {
                  title: 'Ingénieur Full-Stack IA / Data Panafricain',
                  company: 'AFRICANOVA Tech Labs',
                  location: 'Kigali / Télétravail Hybride',
                  type: 'CDI',
                  salary: '50k - 70k $ / an',
                },
              ].map((job, idx) => (
                <div key={idx} className="bg-[#161616] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-emerald-500/50 transition-all">
                  <div>
                    <h4 className="text-sm font-bold text-white">{job.title}</h4>
                    <div className="text-xs text-[#EDEDED]/80 font-medium">{job.company}</div>
                    <div className="flex items-center gap-3 text-[11px] text-[#6B6B6B] mt-1">
                      <span className="flex items-center gap-1 text-emerald-400"><MapPin size={11} /> {job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                      <span>•</span>
                      <span className="text-[#F5D67A] font-mono">{formatPriceString(job.salary)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSubmissionSuccess(`Votre candidature pour "${job.title}" a été soumise au recruteur.`)}
                    className="px-4 py-2 bg-emerald-500/15 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg transition-all shrink-0"
                  >
                    Postuler Directement
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 4. DÉPÔT DE CV */}
          {selectedSubId === 'depot-cv' && (
            <div className="bg-[#161616] p-6 rounded-xl border border-white/10 max-w-xl mx-auto text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto text-[#D4AF37]">
                <Upload size={24} />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Déposer votre CV dans le Vivier AFRICANOVA</h4>
                <p className="text-xs text-[#EDEDED]/70 mt-1">
                  Rejoignez plus de 110 000 cadres et experts africains visibles auprès de 2 500 entreprises partenaires.
                </p>
              </div>
              <div className="border-2 border-dashed border-white/20 hover:border-[#D4AF37] rounded-xl p-6 transition-colors cursor-pointer">
                <p className="text-xs text-[#EDEDED]/80">Glissez-déposez votre CV au format PDF ou Word</p>
                <span className="inline-block mt-2 px-3 py-1 bg-white/5 text-[11px] text-[#D4AF37] rounded-lg">Parcourir vos fichiers</span>
              </div>
              <button
                onClick={() => setSubmissionSuccess("CV enregistré avec succès. Notre algorithme vous notifiera dès qu'un poste correspond à vos compétences.")}
                className="w-full py-3 bg-an-gold-gradient text-black font-bold text-xs rounded-xl uppercase tracking-wider shadow-lg"
              >
                Confirmer l'inscription au vivier
              </button>
            </div>
          )}

          {/* Formulaire générique pour les autres rubriques */}
          {selectedSubId !== 'simulateur-financement' && 
           selectedSubId !== 'catalogue-formations' && 
           selectedSubId !== 'offres-emploi' && 
           selectedSubId !== 'depot-cv' && (
            <div className="bg-[#161616] p-6 rounded-xl border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider">
                Accéder aux services : {currentSub.title}
              </h4>
              <p className="text-xs text-[#EDEDED]/80">
                Remplissez vos coordonnées pour être mis en relation avec le référent AFRICANOVA de votre pays de résidence.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nom complet"
                  className="bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email professionnel"
                  className="bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Détaillez votre projet ou votre demande spécifique..."
                className="w-full bg-black/60 border border-white/10 rounded-lg p-3 text-xs text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none"
              />
              <button
                onClick={() => setSubmissionSuccess("Votre demande a été enregistrée avec succès. Un conseiller AFRICANOVA prendra contact sous 24h.")}
                className="px-6 py-2.5 bg-an-gold-gradient text-black font-bold text-xs rounded-xl uppercase tracking-wider shadow-lg hover:brightness-110 cursor-pointer flex items-center gap-2"
              >
                <Send size={14} />
                <span>{currentSub.actionText}</span>
              </button>
            </div>
          )}

          {/* Feedback message de succès */}
          {submissionSuccess && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xl flex items-center gap-3 text-emerald-400 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>{submissionSuccess}</span>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#161616] border-t border-white/10 flex items-center justify-between">
          <span className="text-xs font-serif italic text-[#EDEDED]/60">
            One Africa. Unlimited Opportunities.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};

export default AfricanovaPoleModal;
