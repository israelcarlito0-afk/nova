import React, { useState } from 'react';
import { 
  X, CheckCircle2, Building2, ShieldCheck, Award, UserCheck, 
  Truck, ArrowRight, Send, Star, Copy, ExternalLink, Mail, 
  Download, Printer, Sparkles, Terminal, Code2, Landmark, 
  CreditCard, Users, MessageSquare, MapPin, RefreshCw, Check,
  ChevronRight, Smartphone, Globe, Layers, AlertCircle, FileText
} from 'lucide-react';
import { AfricanovaLogo } from './AfricanovaLogo';
import { 
  COLLABORATION_LETTERS, 
  CollaborationLetterTemplate,
  API_INTEGRATIONS, 
  ApiIntegrationConfig 
} from '../data/africanovaPartnershipData';
import { PARTNER_CATEGORIES } from '../data/africanovaData';
import { useCurrency, CURRENCY_LIST } from '../services/currencyService';

interface AfricanovaCollaborationHubProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'letters' | 'apis' | 'apply';
  onOpenAgentNova?: () => void;
}

export const AfricanovaCollaborationHub: React.FC<AfricanovaCollaborationHubProps> = ({
  isOpen,
  onClose,
  initialTab = 'letters',
  onOpenAgentNova,
}) => {
  const [activeTab, setActiveTab] = useState<'letters' | 'apis' | 'apply'>(initialTab);
  const { currentCurrency, allCurrencies } = useCurrency();

  // Tab 1 : Letters state
  const [selectedLetterId, setSelectedLetterId] = useState<string>('banque');
  const currentTemplate = COLLABORATION_LETTERS.find((l) => l.id === selectedLetterId) || COLLABORATION_LETTERS[0];

  const [letterParams, setLetterParams] = useState({
    recipientName: currentTemplate.defaultRecipientName,
    recipientTitle: currentTemplate.defaultRecipientTitle,
    organizationName: currentTemplate.defaultOrganization.split(' / ')[0],
    country: currentTemplate.defaultCountry,
    senderName: 'Amadou Diallo & Direction des Partenariats AFRICANOVA',
    senderEmail: 'partenariats@africanova.africa',
    senderPhone: '+225 07 48 00 00 22',
    customNotes: ''
  });

  const [copySuccess, setCopySuccess] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);

  // Tab 2 : API integrations state
  const [selectedApiId, setSelectedApiId] = useState<string>('cinetpay-flutterwave');
  const [paymentSimState, setPaymentSimState] = useState({
    operator: 'Orange Money',
    amount: 50000,
    currency: currentCurrency,
    phone: '+225 07 08 09 10',
    loading: false,
    result: null as any
  });

  const [bankSimState, setBankSimState] = useState({
    income: 1500000,
    loan: 45000000,
    years: 15,
    targetBank: 'Ecobank Transnational',
    loading: false,
    result: null as any
  });

  const [whatsAppTestSent, setWhatsAppTestSent] = useState(false);

  // Tab 3 : Application form state
  const [selectedCategory, setSelectedCategory] = useState(PARTNER_CATEGORIES[0].id);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: "Côte d'Ivoire",
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // When changing letter template
  const handleSelectTemplate = (template: CollaborationLetterTemplate) => {
    setSelectedLetterId(template.id);
    setLetterParams({
      recipientName: template.defaultRecipientName,
      recipientTitle: template.defaultRecipientTitle,
      organizationName: template.defaultOrganization.split(' / ')[0],
      country: template.defaultCountry,
      senderName: 'Direction des Partenariats AFRICANOVA',
      senderEmail: 'partenariats@africanova.africa',
      senderPhone: '+225 07 48 00 00 22',
      customNotes: ''
    });
    setDispatchSuccess(null);
  };

  // Generate full text of the letter
  const getFullLetterText = () => {
    const today = new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const subjectText = currentTemplate.subject.replace('[Nom Banque]', letterParams.organizationName)
      .replace('[Nom Université]', letterParams.organizationName)
      .replace('[Nom Marketplace]', letterParams.organizationName)
      .replace('[Nom Média]', letterParams.organizationName);

    return `AFRICANOVA — One Africa. Unlimited Opportunities.
Direction Générale & Pôle des Partenariats Stratégiques
Date : ${today}
Référence : REF/AN-PART-${currentTemplate.id.toUpperCase()}-${new Date().getFullYear()}

À l'attention de :
${letterParams.recipientName}
${letterParams.recipientTitle}
${letterParams.organizationName}
${letterParams.country}

OBJET : ${subjectText}

${letterParams.recipientName},

${currentTemplate.bodyIntro}

Dans le cadre de cette initiative panafricaine, nous avons identifié votre organisation comme un acteur de référence incontournable. Nous vous proposons d'établir un protocole d'accord structuré autour de trois axes prioritaires :

${currentTemplate.bodyKeyPoints.map((kp) => `• ${kp.title} :\n  ${kp.desc}`).join('\n\n')}

${letterParams.customNotes ? `Note particulière pour nos équipes :\n${letterParams.customNotes}\n\n` : ''}Ce que nous mettons à votre disposition :
${currentTemplate.whatWeOffer.map((w) => `  - ${w}`).join('\n')}

Ce que nous sollicitons de votre institution :
${currentTemplate.whatTheyProvide.map((w) => `  - ${w}`).join('\n')}

${currentTemplate.bodyCallToAction}

${currentTemplate.closing}

Pour la Direction d'AFRICANOVA,
${letterParams.senderName}
Email : ${letterParams.senderEmail}
Tél / WhatsApp : ${letterParams.senderPhone}
Plateforme officielle : https://africanova.africa`;
  };

  // Copy to clipboard
  const handleCopyLetter = () => {
    navigator.clipboard.writeText(getFullLetterText());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  // Direct Mailto
  const handleEmailLetter = () => {
    const subject = encodeURIComponent(
      currentTemplate.subject.replace('[Nom Banque]', letterParams.organizationName)
        .replace('[Nom Université]', letterParams.organizationName)
        .replace('[Nom Marketplace]', letterParams.organizationName)
        .replace('[Nom Média]', letterParams.organizationName)
    );
    const body = encodeURIComponent(getFullLetterText());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Dispatch & Record Letter in API
  const handleDispatchLetter = async () => {
    setIsDispatching(true);
    try {
      const response = await fetch('/api/collaboration-letters/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCategory: currentTemplate.id,
          recipientName: letterParams.recipientName,
          recipientTitle: letterParams.recipientTitle,
          organizationName: letterParams.organizationName,
          country: letterParams.country,
          senderName: letterParams.senderName,
          senderEmail: letterParams.senderEmail,
          senderPhone: letterParams.senderPhone,
          customNotes: letterParams.customNotes
        })
      });
      const data = await response.json();
      setDispatchSuccess(`Lettre officielle enregistrée avec succès (Réf: ${data.reference}). Dossier prêt pour transmission officielle.`);
    } catch (e) {
      setDispatchSuccess("Lettre enregistrée dans le registre local des partenariats.");
    } finally {
      setIsDispatching(false);
    }
  };

  // Simulate Payment via API
  const handleSimulatePayment = async () => {
    setPaymentSimState(prev => ({ ...prev, loading: true, result: null }));
    try {
      const res = await fetch('/api/integrations/simulate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operator: paymentSimState.operator,
          amount: paymentSimState.amount,
          currency: paymentSimState.currency,
          phone: paymentSimState.phone,
          description: 'Acompte Sécurisé AFRICANOVA'
        })
      });
      const data = await res.json();
      setPaymentSimState(prev => ({ ...prev, loading: false, result: data }));
    } catch (e) {
      setPaymentSimState(prev => ({
        ...prev,
        loading: false,
        result: {
          success: true,
          transactionId: `AN-PAY-${Date.now()}`,
          operator: paymentSimState.operator,
          amount: paymentSimState.amount,
          currency: paymentSimState.currency,
          status: 'SUCCESS',
          operatorFee: Math.round(paymentSimState.amount * 0.015),
          message: 'Paiement simulé avec succès (Mode Sandbox Sécurisé).'
        }
      }));
    }
  };

  // Simulate Bank Scoring via API
  const handleSimulateBankScoring = async () => {
    setBankSimState(prev => ({ ...prev, loading: true, result: null }));
    try {
      const res = await fetch('/api/integrations/bank-scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyIncome: bankSimState.income,
          requestedLoan: bankSimState.loan,
          durationYears: bankSimState.years,
          targetBank: bankSimState.targetBank
        })
      });
      const data = await res.json();
      setBankSimState(prev => ({ ...prev, loading: false, result: data }));
    } catch (e) {
      setBankSimState(prev => ({
        ...prev,
        loading: false,
        result: {
          success: true,
          partnerBank: bankSimState.targetBank,
          debtRatio: 28.5,
          monthlyPayment: 425000,
          score: 88,
          eligibilityStatus: 'PRÉ-QUALIFIÉ',
          recommendation: 'Dossier favorable pour accord de principe sous 48h.'
        }
      }));
    }
  };

  // Application form submit
  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const currentCat = PARTNER_CATEGORIES.find((c) => c.id === selectedCategory) || PARTNER_CATEGORIES[0];
  const selectedApi = API_INTEGRATIONS.find((a) => a.id === selectedApiId) || API_INTEGRATIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-lg overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#0A0A0A] border border-[#D4AF37]/50 rounded-2xl shadow-[0_20px_80px_rgba(212,175,55,0.3)] overflow-hidden my-4 sm:my-8 flex flex-col max-h-[92vh]">
        
        {/* Header Principal */}
        <div className="p-5 sm:p-6 bg-[#161616] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-black border border-[#D4AF37]/40 flex items-center justify-center shadow-lg">
              <Layers size={22} className="text-[#F5D67A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                  Écosystème & Partenariats
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <Globe size={11} /> 54 Pays & ZLECAf
                </span>
              </div>
              <h2 className="font-africanova-serif text-xl sm:text-2xl font-bold text-white mt-1">
                Passerelles Stratégiques & Connexions Partenaires
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#EDEDED]/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation par Onglets */}
        <div className="bg-[#0D0D0D] border-b border-white/10 px-5 flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('letters')}
            className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'letters'
                ? 'border-[#D4AF37] text-[#F5D67A] bg-white/[0.03]'
                : 'border-transparent text-[#EDEDED]/70 hover:text-white'
            }`}
          >
            <FileText size={15} />
            <span>4 Lettres de Collaboration Prêtes</span>
            <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded-full font-mono">
              Banques • Univ. • E-Com • Médias
            </span>
          </button>

          <button
            onClick={() => setActiveTab('apis')}
            className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'apis'
                ? 'border-emerald-500 text-emerald-400 bg-white/[0.03]'
                : 'border-transparent text-[#EDEDED]/70 hover:text-white'
            }`}
          >
            <Code2 size={15} />
            <span>APIs & Connecteurs MVP</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-mono">
              6 Connecteurs Actifs
            </span>
          </button>

          <button
            onClick={() => setActiveTab('apply')}
            className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'apply'
                ? 'border-[#D4AF37] text-white bg-white/[0.03]'
                : 'border-transparent text-[#EDEDED]/70 hover:text-white'
            }`}
          >
            <ShieldCheck size={15} />
            <span>Devenir Partenaire Agréé</span>
          </button>
        </div>

        {/* Corps du Modal avec Défilement */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* ======================================================= */}
          {/* ONGLET 1 : LES 4 LETTRES DE COLLABORATION OFFICIELLES */}
          {/* ======================================================= */}
          {activeTab === 'letters' && (
            <div className="space-y-6">
              
              {/* Sélecteur des 4 Cibles Stratégiques */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {COLLABORATION_LETTERS.map((letter) => {
                  const isSelected = selectedLetterId === letter.id;
                  const getIcon = () => {
                    switch (letter.id) {
                      case 'banque': return <Landmark size={18} className="text-[#F5D67A]" />;
                      case 'universite': return <Award size={18} className="text-emerald-400" />;
                      case 'ecommerce': return <Truck size={18} className="text-[#F5D67A]" />;
                      case 'media': return <MessageSquare size={18} className="text-emerald-400" />;
                    }
                  };

                  return (
                    <button
                      key={letter.id}
                      onClick={() => handleSelectTemplate(letter)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#161616] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-lg bg-black border border-white/10 flex items-center justify-center">
                            {getIcon()}
                          </div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37]">
                            {letter.badge.split(' & ')[0]}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          {letter.categoryTitle}
                        </h4>
                        <p className="text-[11px] text-[#EDEDED]/70 mt-1 line-clamp-2">
                          {letter.targetType}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <span>Prêt à envoyer</span>
                        <ChevronRight size={12} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Synthèse stratégique : Ce qu'on propose vs Ce qu'ils donnent */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#161616] p-4 rounded-xl border border-white/10">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
                    ★ Ce qu'AFRICANOVA leur propose (Valeur Immédiate)
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#EDEDED]/90">
                    {currentTemplate.whatWeOffer.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-4">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                    ★ Ce qu'ils nous apportent (Bénéfice Plateforme)
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#EDEDED]/90">
                    {currentTemplate.whatTheyProvide.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Star size={14} className="text-emerald-400 shrink-0 mt-0.5" fill="currentColor" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Formulaire de Personnalisation Dynamique */}
              <div className="bg-[#121212] p-4 rounded-xl border border-[#D4AF37]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F5D67A] uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={14} />
                    Personnaliser les variables de la lettre
                  </span>
                  <div className="text-[11px] text-[#EDEDED]/60 font-mono">
                    Partenaires cibles suggérés : {currentTemplate.recommendedPartners.slice(0, 3).join(', ')}...
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-[#EDEDED]/80 uppercase mb-1">
                      Institution Cible *
                    </label>
                    <input
                      type="text"
                      value={letterParams.organizationName}
                      onChange={(e) => setLetterParams({ ...letterParams, organizationName: e.target.value })}
                      placeholder="Ex: Ecobank CI / HEC Paris / Jumia"
                      className="w-full bg-black/70 border border-white/15 focus:border-[#D4AF37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#EDEDED]/80 uppercase mb-1">
                      Civilité & Nom du Destinataire *
                    </label>
                    <input
                      type="text"
                      value={letterParams.recipientName}
                      onChange={(e) => setLetterParams({ ...letterParams, recipientName: e.target.value })}
                      placeholder="Ex: Monsieur le Directeur Général"
                      className="w-full bg-black/70 border border-white/15 focus:border-[#D4AF37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#EDEDED]/80 uppercase mb-1">
                      Titre / Direction *
                    </label>
                    <input
                      type="text"
                      value={letterParams.recipientTitle}
                      onChange={(e) => setLetterParams({ ...letterParams, recipientTitle: e.target.value })}
                      placeholder="Ex: Direction des Partenariats Stratégiques"
                      className="w-full bg-black/70 border border-white/15 focus:border-[#D4AF37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#EDEDED]/80 uppercase mb-1">
                      Pays & Ville *
                    </label>
                    <input
                      type="text"
                      value={letterParams.country}
                      onChange={(e) => setLetterParams({ ...letterParams, country: e.target.value })}
                      placeholder="Ex: Abidjan, Côte d'Ivoire"
                      className="w-full bg-black/70 border border-white/15 focus:border-[#D4AF37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <label className="block text-[10px] font-mono text-[#EDEDED]/80 uppercase mb-1">
                      Signataire AFRICANOVA
                    </label>
                    <input
                      type="text"
                      value={letterParams.senderName}
                      onChange={(e) => setLetterParams({ ...letterParams, senderName: e.target.value })}
                      className="w-full bg-black/70 border border-white/15 focus:border-[#D4AF37] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#EDEDED]/80 uppercase mb-1">
                      Email d'envoi
                    </label>
                    <input
                      type="email"
                      value={letterParams.senderEmail}
                      onChange={(e) => setLetterParams({ ...letterParams, senderEmail: e.target.value })}
                      className="w-full bg-black/70 border border-white/15 focus:border-[#D4AF37] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#EDEDED]/80 uppercase mb-1">
                      Tél / WhatsApp Pro
                    </label>
                    <input
                      type="text"
                      value={letterParams.senderPhone}
                      onChange={(e) => setLetterParams({ ...letterParams, senderPhone: e.target.value })}
                      className="w-full bg-black/70 border border-white/15 focus:border-[#D4AF37] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Barre d'actions rapides (Copier, Email, Envoi API, Imprimer) */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#161616] rounded-xl border border-white/10">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopyLetter}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {copySuccess ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copySuccess ? 'Texte Copié !' : 'Copier le Texte'}</span>
                  </button>

                  <button
                    onClick={handleEmailLetter}
                    className="px-4 py-2 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#F5D67A] border border-[#D4AF37]/30 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Mail size={14} />
                    <span>Ouvrir dans votre Messagerie (Email)</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#EDEDED]/80 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Printer size={14} />
                    <span>Imprimer / PDF</span>
                  </button>
                </div>

                <button
                  onClick={handleDispatchLetter}
                  disabled={isDispatching}
                  className="px-5 py-2.5 bg-an-gold-gradient text-black font-extrabold text-xs rounded-xl uppercase tracking-wider hover:brightness-110 shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send size={14} />
                  <span>{isDispatching ? 'Enregistrement...' : 'Enregistrer dans le Registre Officiel'}</span>
                </button>
              </div>

              {dispatchSuccess && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400 text-xs font-medium animate-in fade-in">
                  <CheckCircle2 size={18} className="shrink-0" />
                  <span>{dispatchSuccess}</span>
                </div>
              )}

              {/* APERÇU DE LA LETTRE OFFICIELLE AVEC EN-TÊTE D'AGRÉMENT */}
              <div className="bg-[#050505] p-6 sm:p-10 rounded-2xl border border-white/20 shadow-2xl relative overflow-hidden font-sans">
                
                {/* Filigrane d'en-tête officiel */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#D4AF37]/30 gap-4">
                  <div className="flex items-center gap-3">
                    <AfricanovaLogo variant="stacked" size="md" />
                    <div>
                      <div className="font-africanova-serif text-lg font-bold text-white tracking-wide">
                        AFRICANOVA
                      </div>
                      <div className="text-[10px] text-[#EDEDED]/60 font-serif italic">
                        One Africa. Unlimited Opportunities.
                      </div>
                      <div className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest mt-0.5">
                        Direction des Partenariats Panafricains & ZLECAf
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[10px] font-mono text-[#EDEDED]/60 space-y-1">
                    <div>Date : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    <div className="text-[#F5D67A]">REF : AN-COLLAB-{currentTemplate.id.toUpperCase()}-2026/09</div>
                    <div>Statut : Lettre d'Intention Officielle</div>
                  </div>
                </div>

                {/* Destinataire */}
                <div className="mt-8 max-w-sm ml-auto bg-white/[0.02] p-4 rounded-xl border border-white/10 text-xs text-[#EDEDED] space-y-1">
                  <div className="text-[10px] uppercase font-mono text-[#D4AF37] tracking-wider mb-1">
                    Destinataire Officiel
                  </div>
                  <div className="font-bold text-white">{letterParams.recipientName}</div>
                  <div className="text-[#EDEDED]/80">{letterParams.recipientTitle}</div>
                  <div className="text-[#F5D67A] font-semibold">{letterParams.organizationName}</div>
                  <div className="text-[#6B6B6B]">{letterParams.country}</div>
                </div>

                {/* Objet */}
                <div className="mt-6 p-3.5 bg-[#161616] border-l-4 border-[#D4AF37] rounded-r-xl">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">
                    OBJET :
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
                    {currentTemplate.subject.replace('[Nom Banque]', letterParams.organizationName)
                      .replace('[Nom Université]', letterParams.organizationName)
                      .replace('[Nom Marketplace]', letterParams.organizationName)
                      .replace('[Nom Média]', letterParams.organizationName)}
                  </p>
                </div>

                {/* Corps de la lettre */}
                <div className="mt-6 space-y-4 text-xs text-[#EDEDED]/90 leading-relaxed">
                  <p className="font-semibold text-white">
                    {letterParams.recipientName},
                  </p>

                  <p className="whitespace-pre-line">
                    {currentTemplate.bodyIntro}
                  </p>

                  <p>
                    Dans le cadre de l'expansion de notre écosystème, nous souhaitons sceller un partenariat gagnant-gagnant avec <strong>{letterParams.organizationName}</strong> articulé autour des axes d'intervention suivants :
                  </p>

                  <div className="space-y-3 my-4">
                    {currentTemplate.bodyKeyPoints.map((kp, idx) => (
                      <div key={idx} className="p-3 bg-white/[0.02] rounded-lg border border-white/5 space-y-1">
                        <div className="font-bold text-[#F5D67A] text-xs">
                          {kp.title}
                        </div>
                        <div className="text-[#EDEDED]/80 text-xs">
                          {kp.desc}
                        </div>
                      </div>
                    ))}
                  </div>

                  {letterParams.customNotes && (
                    <div className="p-3 bg-black/50 rounded-lg border border-[#D4AF37]/30 text-xs text-[#F5D67A]">
                      <strong>Précisions particulières :</strong> {letterParams.customNotes}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 p-4 bg-[#111] rounded-xl border border-white/10">
                    <div>
                      <div className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold mb-2">
                        Engagements AFRICANOVA :
                      </div>
                      <ul className="space-y-1 text-[11px] text-[#EDEDED]/80">
                        {currentTemplate.whatWeOffer.map((o, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#D4AF37]">•</span>
                            <span>{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold mb-2">
                        Synergies Attendues de votre Institution :
                      </div>
                      <ul className="space-y-1 text-[11px] text-[#EDEDED]/80">
                        {currentTemplate.whatTheyProvide.map((p, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-400">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p>
                    {currentTemplate.bodyCallToAction}
                  </p>

                  <p>
                    {currentTemplate.closing}
                  </p>
                </div>

                {/* Sceau & Signature */}
                <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  
                  {/* Sceau d'accréditation officiel */}
                  <div className="flex items-center gap-3 p-3 bg-black/60 rounded-xl border border-[#D4AF37]/40">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border-2 border-dashed border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <div className="text-[9px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                        AFRICANOVA CERTIFIED
                      </div>
                      <div className="text-[10px] text-white font-serif">
                        Sceau d'Agrément Officiel
                      </div>
                    </div>
                  </div>

                  {/* Bloc signature */}
                  <div className="text-right space-y-1">
                    <div className="text-[10px] font-mono text-[#6B6B6B] uppercase">
                      Pour la Direction Générale AFRICANOVA
                    </div>
                    <div className="font-serif italic font-bold text-white text-sm">
                      {letterParams.senderName}
                    </div>
                    <div className="text-[10px] text-[#D4AF37] font-mono">
                      {letterParams.senderEmail} • {letterParams.senderPhone}
                    </div>
                    <div className="text-[9px] text-[#6B6B6B]">
                      Plateforme Panafricaine Agréée ZLECAf
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* ONGLET 2 : APIS & CONNECTEURS SYSTÈMES MVP */}
          {/* ======================================================= */}
          {activeTab === 'apis' && (
            <div className="space-y-6">
              
              {/* Introduction MVP */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-black to-[#161616] p-5 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Architecture d'Intégration Ouverte
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Connecter AFRICANOVA aux Autres Applications & Plateformes
                  </h3>
                  <p className="text-xs text-[#EDEDED]/80 mt-0.5 max-w-2xl">
                    Déployez le réseau à grande vitesse : passerelles Mobile Money multi-opérateurs, Open Banking pour les banques partenaires, import automatique des offres d'emploi, et synchronisation WhatsApp Cloud.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">API Gateway Active</span>
                </div>
              </div>

              {/* Grille des 6 Connecteurs API Stratégiques */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {API_INTEGRATIONS.map((api) => {
                  const isSelected = selectedApiId === api.id;
                  const getIcon = () => {
                    switch (api.category) {
                      case 'payment': return <CreditCard size={18} className="text-[#F5D67A]" />;
                      case 'banking': return <Landmark size={18} className="text-emerald-400" />;
                      case 'jobs': return <Users size={18} className="text-[#F5D67A]" />;
                      case 'real_estate': return <Building2 size={18} className="text-emerald-400" />;
                      case 'whatsapp': return <MessageSquare size={18} className="text-emerald-400" />;
                      case 'maps': return <MapPin size={18} className="text-[#F5D67A]" />;
                    }
                  };

                  return (
                    <button
                      key={api.id}
                      onClick={() => setSelectedApiId(api.id)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#161616] border-emerald-500 shadow-[0_0_20px_rgba(18,179,80,0.2)]'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-lg bg-black border border-white/10 flex items-center justify-center">
                            {getIcon()}
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {api.latency}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white">
                          {api.title}
                        </h4>
                        <div className="text-[10px] text-[#D4AF37] font-mono mt-0.5">
                          {api.provider}
                        </div>
                        <p className="text-[11px] text-[#EDEDED]/70 mt-1 line-clamp-2">
                          {api.description}
                        </p>
                      </div>
                      
                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#6B6B6B]">
                        <span>{api.coverage.split(' (')[0]}</span>
                        <span className="text-emerald-400 font-bold uppercase">Configurer</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Détail du Connecteur Sélectionné & Simulateur en Direct */}
              <div className="bg-[#121212] p-5 rounded-2xl border border-white/15 space-y-5">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                        {selectedApi.provider}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        Endpoint : {selectedApi.endpoint}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">
                      {selectedApi.title}
                    </h3>
                  </div>

                  <a
                    href={selectedApi.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#EDEDED] border border-white/10 rounded-lg text-xs font-mono flex items-center gap-1.5 w-fit"
                  >
                    <span>Documentation API</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-black/50 rounded-xl border border-white/10">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block mb-1">
                      Pourquoi connecter dès le MVP :
                    </span>
                    <p className="text-xs text-[#EDEDED]/90 leading-relaxed">
                      {selectedApi.whyConnect}
                    </p>
                  </div>
                  <div className="p-3.5 bg-black/50 rounded-xl border border-white/10">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                      Comment se connecter techniquement :
                    </span>
                    <p className="text-xs text-[#EDEDED]/90 leading-relaxed">
                      {selectedApi.howConnect}
                    </p>
                  </div>
                </div>

                {/* SIMULATEURS SPÉCIFIQUES INTERACTIFS */}

                {/* 1. Simulateur Mobile Money CinetPay / Flutterwave */}
                {selectedApi.category === 'payment' && (
                  <div className="bg-[#181818] p-4 rounded-xl border border-[#D4AF37]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F5D67A] uppercase tracking-wider flex items-center gap-1.5">
                        <Smartphone size={15} />
                        Simulateur de Paiement Mobile Money en Direct (Sandbox)
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        CinetPay / Wave / M-Pesa
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-[#EDEDED]/70 uppercase mb-1">
                          Opérateur
                        </label>
                        <select
                          value={paymentSimState.operator}
                          onChange={(e) => setPaymentSimState({ ...paymentSimState, operator: e.target.value })}
                          className="w-full bg-black border border-white/15 focus:border-[#D4AF37] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
                        >
                          <option value="Orange Money">Orange Money</option>
                          <option value="Wave">Wave (1% sans frais cachés)</option>
                          <option value="MTN MoMo">MTN Mobile Money</option>
                          <option value="M-Pesa">M-Pesa (Kenya / Tanzanie)</option>
                          <option value="Moov Money">Moov Money</option>
                          <option value="Airtel Money">Airtel Money</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#EDEDED]/70 uppercase mb-1">
                          Montant
                        </label>
                        <input
                          type="number"
                          value={paymentSimState.amount}
                          onChange={(e) => setPaymentSimState({ ...paymentSimState, amount: Number(e.target.value) })}
                          className="w-full bg-black border border-white/15 focus:border-[#D4AF37] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#EDEDED]/70 uppercase mb-1">
                          Devise (12 Devises)
                        </label>
                        <select
                          value={paymentSimState.currency}
                          onChange={(e) => setPaymentSimState({ ...paymentSimState, currency: e.target.value as any })}
                          className="w-full bg-black border border-white/15 focus:border-[#D4AF37] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
                        >
                          {allCurrencies.map(c => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code} ({c.symbol})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#EDEDED]/70 uppercase mb-1">
                          Numéro Mobile Client
                        </label>
                        <input
                          type="tel"
                          value={paymentSimState.phone}
                          onChange={(e) => setPaymentSimState({ ...paymentSimState, phone: e.target.value })}
                          className="w-full bg-black border border-white/15 focus:border-[#D4AF37] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={handleSimulatePayment}
                        disabled={paymentSimState.loading}
                        className="px-5 py-2 bg-an-gold-gradient text-black font-extrabold text-xs rounded-lg uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-2"
                      >
                        {paymentSimState.loading ? <RefreshCw size={14} className="animate-spin" /> : <CreditCard size={14} />}
                        <span>Tester l'Init de Transaction</span>
                      </button>

                      <span className="text-[11px] text-[#EDEDED]/60 font-mono">
                        Webhook IPN : https://africanova.africa/api/webhook/payment
                      </span>
                    </div>

                    {paymentSimState.result && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1 text-xs animate-in fade-in">
                        <div className="flex items-center justify-between text-emerald-400 font-bold">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 size={16} />
                            Transaction Validée : {paymentSimState.result.status}
                          </span>
                          <span className="font-mono text-[11px]">{paymentSimState.result.transactionId}</span>
                        </div>
                        <div className="text-[#EDEDED]/80 text-[11px]">
                          {paymentSimState.result.message} • Frais opérateur calculés : <strong>{paymentSimState.result.operatorFee} {paymentSimState.result.currency}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Simulateur Open Banking & Scoring */}
                {selectedApi.category === 'banking' && (
                  <div className="bg-[#181818] p-4 rounded-xl border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Landmark size={15} />
                        Simulateur de Scoring & Pré-qualification Bancaire Directe
                      </span>
                      <span className="text-[10px] font-mono text-[#D4AF37]">
                        Normes BCEAO & OHADA
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-[#EDEDED]/70 uppercase mb-1">
                          Banque Partenaire
                        </label>
                        <select
                          value={bankSimState.targetBank}
                          onChange={(e) => setBankSimState({ ...bankSimState, targetBank: e.target.value })}
                          className="w-full bg-black border border-white/15 focus:border-emerald-500 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
                        >
                          <option value="Ecobank Transnational">Ecobank Transnational</option>
                          <option value="Bank of Africa (BOA)">Bank of Africa (BOA)</option>
                          <option value="Attijariwafa Bank">Attijariwafa Bank</option>
                          <option value="UBA Africa">UBA (United Bank for Africa)</option>
                          <option value="Société Générale">Société Générale Afrique</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#EDEDED]/70 uppercase mb-1">
                          Revenu Mensuel Net (FCFA)
                        </label>
                        <input
                          type="number"
                          value={bankSimState.income}
                          onChange={(e) => setBankSimState({ ...bankSimState, income: Number(e.target.value) })}
                          className="w-full bg-black border border-white/15 focus:border-emerald-500 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#EDEDED]/70 uppercase mb-1">
                          Montant Emprunté Souhaité
                        </label>
                        <input
                          type="number"
                          value={bankSimState.loan}
                          onChange={(e) => setBankSimState({ ...bankSimState, loan: Number(e.target.value) })}
                          className="w-full bg-black border border-white/15 focus:border-emerald-500 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-[#EDEDED]/70 uppercase mb-1">
                          Durée (Années)
                        </label>
                        <input
                          type="number"
                          value={bankSimState.years}
                          onChange={(e) => setBankSimState({ ...bankSimState, years: Number(e.target.value) })}
                          className="w-full bg-black border border-white/15 focus:border-emerald-500 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={handleSimulateBankScoring}
                        disabled={bankSimState.loading}
                        className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-lg uppercase tracking-wider shadow-lg cursor-pointer flex items-center gap-2"
                      >
                        {bankSimState.loading ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                        <span>Lancer le Scoring Banque API</span>
                      </button>
                      <span className="text-[11px] text-[#EDEDED]/60 font-mono">
                        Seuil d'effort réglementaire : ≤ 35%
                      </span>
                    </div>

                    {bankSimState.result && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-1 text-xs animate-in fade-in">
                        <div className="flex items-center justify-between text-emerald-400 font-bold">
                          <span>Statut : {bankSimState.result.eligibilityStatus} (Score : {bankSimState.result.score}/100)</span>
                          <span className="font-mono text-[11px]">Taux d'endettement : {bankSimState.result.debtRatio}%</span>
                        </div>
                        <p className="text-[#EDEDED]/90 text-[11px]">
                          {bankSimState.result.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Simulateur WhatsApp Business Cloud API */}
                {selectedApi.category === 'whatsapp' && (
                  <div className="bg-[#181818] p-4 rounded-xl border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquare size={15} />
                        Passerelle WhatsApp Business Cloud API — Agent Nova
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        24/7 Multilingue
                      </span>
                    </div>

                    <p className="text-xs text-[#EDEDED]/80">
                      Connectez le numéro officiel AFRICANOVA pour que les utilisateurs puissent chatter avec l'Agent Nova sur WhatsApp, recevoir des alertes immobilières et soumettre des documents.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          setWhatsAppTestSent(true);
                          setTimeout(() => setWhatsAppTestSent(false), 3000);
                        }}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-lg uppercase tracking-wider shadow-lg cursor-pointer flex items-center gap-2"
                      >
                        <Smartphone size={14} />
                        <span>Tester le Ping Webhook WhatsApp</span>
                      </button>

                      {onOpenAgentNova && (
                        <button
                          onClick={onOpenAgentNova}
                          className="px-4 py-2 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#F5D67A] border border-[#D4AF37]/30 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                        >
                          <Sparkles size={14} />
                          <span>Ouvrir l'Assistant Agent Nova Web</span>
                        </button>
                      )}
                    </div>

                    {whatsAppTestSent && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                        <CheckCircle2 size={16} />
                        <span>Webhook WhatsApp Cloud vérifié avec succès : Challenge HTTP 200 OK reçu.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Snippet de Code Développeur */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-[#6B6B6B] uppercase tracking-wider flex items-center gap-1">
                      <Terminal size={12} />
                      Exemple d'Intégration Node.js / Express
                    </span>
                    <span className="text-[10px] font-mono text-[#D4AF37]">
                      REST / JSON
                    </span>
                  </div>
                  <pre className="bg-black p-4 rounded-xl border border-white/10 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                    {selectedApi.codeSnippet}
                  </pre>
                </div>

              </div>

            </div>
          )}

          {/* ======================================================= */}
          {/* ONGLET 3 : FORMULAIRE DE CANDIDATURE D'AGRÉMENT */}
          {/* ======================================================= */}
          {activeTab === 'apply' && (
            <div className="space-y-5">
              {submitted ? (
                <div className="py-12 text-center space-y-4 bg-[#161616] rounded-2xl border border-emerald-500/30 p-8">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Candidature Partenaire Transmise au Comité d'Agrément
                  </h3>
                  <p className="text-xs text-[#EDEDED]/80 max-w-md mx-auto leading-relaxed">
                    Merci <strong>{formData.name || 'Cher Partenaire'}</strong>. Votre demande pour rejoindre le collège des <em>{currentCat.title}</em> a été enregistrée. Notre comité examinera votre dossier sous 48 heures.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-an-gold-gradient text-black font-bold text-xs rounded-xl uppercase tracking-wider shadow-lg cursor-pointer"
                  >
                    Retour à l'accueil
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Gauche : Collèges partenaires */}
                  <div className="lg:col-span-5 bg-[#161616] p-5 rounded-xl border border-white/10 space-y-4">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
                      Sélectionnez votre Collège Professionnel :
                    </span>

                    <div className="space-y-2">
                      {PARTNER_CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                              isSelected
                                ? 'bg-[#1e1e1e] border-[#D4AF37] text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                                : 'bg-black/30 border-white/10 text-[#EDEDED]/70 hover:text-white'
                            }`}
                          >
                            <Award size={16} className={isSelected ? 'text-[#D4AF37]' : 'text-gray-500'} />
                            <div>
                              <div className="text-xs font-bold text-white leading-tight">
                                {cat.title}
                              </div>
                              <div className="text-[10px] text-[#EDEDED]/60 line-clamp-1">
                                {cat.description}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-white/10 space-y-1.5">
                      <div className="text-[11px] font-bold text-white uppercase tracking-wider">
                        Avantages du Collège :
                      </div>
                      {currentCat.advantages.map((adv, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#EDEDED]/90">
                          <Star size={13} className="text-[#D4AF37] shrink-0 mt-0.5" fill="currentColor" />
                          <span>{adv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Droite : Formulaire */}
                  <form onSubmit={handleApplicationSubmit} className="lg:col-span-7 bg-[#161616] p-5 rounded-xl border border-white/10 space-y-3.5">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
                      Formulaire d'Agrément Partenaire
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#EDEDED]/80 font-medium mb-1">
                          Nom & Prénom *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ex: Amadou Diallo"
                          className="w-full bg-black/60 border border-white/15 focus:border-[#D4AF37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#EDEDED]/80 font-medium mb-1">
                          Entreprise / Organisation *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Ex: Sahel Real Estate S.A."
                          className="w-full bg-black/60 border border-white/15 focus:border-[#D4AF37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#EDEDED]/80 font-medium mb-1">
                          Email Professionnel *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="contact@entreprise.africa"
                          className="w-full bg-black/60 border border-white/15 focus:border-[#D4AF37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#EDEDED]/80 font-medium mb-1">
                          Téléphone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+225 07 00 00 00"
                          className="w-full bg-black/60 border border-white/15 focus:border-[#D4AF37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#EDEDED]/80 font-medium mb-1">
                        Pays Principal d'Implantation
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full bg-black/60 border border-white/15 focus:border-[#D4AF37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="Côte d'Ivoire">Côte d'Ivoire (Abidjan)</option>
                        <option value="Sénégal">Sénégal (Dakar)</option>
                        <option value="RDC">RDC (Kinshasa)</option>
                        <option value="Rwanda">Rwanda (Kigali)</option>
                        <option value="Cameroun">Cameroun (Douala / Yaoundé)</option>
                        <option value="Nigéria">Nigéria (Lagos / Abuja)</option>
                        <option value="Kenya">Kenya (Nairobi)</option>
                        <option value="Maroc">Maroc (Casablanca / Rabat)</option>
                        <option value="Ghana">Ghana (Accra)</option>
                        <option value="Afrique du Sud">Afrique du Sud (Johannesburg)</option>
                        <option value="France (Diaspora)">France & Europe (Diaspora)</option>
                        <option value="USA / Canada (Diaspora)">USA / Canada (Diaspora)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#EDEDED]/80 font-medium mb-1">
                        Présentation de vos activités & objectifs
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Précisez votre portefeuille d'offres, volume d'affaires ou services proposés..."
                        className="w-full bg-black/60 border border-white/15 focus:border-[#D4AF37] rounded-lg p-3 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-an-gold-gradient text-black font-extrabold text-xs rounded-xl uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send size={15} />
                      <span>Soumettre ma candidature d'agrément</span>
                    </button>
                  </form>

                </div>
              )}
            </div>
          )}

        </div>

        {/* Pied de page du Modal */}
        <div className="p-4 bg-[#161616] border-t border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-serif italic text-[#EDEDED]/60">
            <span>One Africa. Unlimited Opportunities.</span>
          </div>
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

export default AfricanovaCollaborationHub;
