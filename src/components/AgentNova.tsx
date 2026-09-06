import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Sparkles, Send, X, Minimize2, Maximize2, Mic, MicOff, 
  Volume2, VolumeX, ArrowRight, RefreshCw, ChevronRight,
  Home, Landmark, GraduationCap, Briefcase, Users, ShoppingBag, ExternalLink,
  Coins, ArrowLeftRight, Globe
} from 'lucide-react';
import { AfricanovaEmblem } from './AfricanovaLogo';
import { useCurrency, CurrencyCode } from '../services/currencyService';

interface AgentNovaProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigateToPole?: (poleId: string, subSectionId?: string) => void;
  onOpenRealEstateExplorer?: () => void;
  activePoleContext?: string | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'nova';
  text: string;
  poleId?: string;
  timestamp: string;
}

export const AgentNova: React.FC<AgentNovaProps> = ({
  isOpen,
  onToggle,
  onNavigateToPole,
  onOpenRealEstateExplorer,
  activePoleContext,
}) => {
  const { currentCurrency, setCurrency, allCurrencies, meta } = useCurrency();
  const [selectedLang, setSelectedLang] = useState<'fr' | 'en' | 'sw' | 'wo'>('fr');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'nova',
      text: `### Bienvenue sur Agent Nova ⚡\n**Je suis l'assistant officiel de la plateforme AFRICANOVA.**\n\n*Ma mission : Autonomiser les Africains et la diaspora en vous connectant directement aux meilleures opportunités du continent.*\n\n**Ce que je vous apporte :**\n1. **3 actions concrètes ou 3 propositions chiffrées** pour chacune de vos requêtes.\n2. **Conversions et prix directs dans les 12 devises prioritaires** (*XOF, XAF, USD, EUR, NGN, KES, ZAR, GHS, MAD, RWF, CDF, TZS*).\n3. **Mise en relation immédiate avec nos partenaires agréés** (banques, notaires OHADA, transitaires ZLECAf).\n\n*Sur quel projet ou investissement souhaitez-vous avancer aujourd'hui ?*`,
      timestamp: 'À l\'instant'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPole, setSelectedPole] = useState<string>(activePoleContext || 'all');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync active pole if provided from parent
  useEffect(() => {
    if (activePoleContext) {
      setSelectedPole(activePoleContext);
    }
  }, [activePoleContext]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Specific suggested prompts as requested by Israel carlito + Currency conversions
  const polePrompts: Record<string, { label: string; query: string; pole: string }[]> = {
    all: [
      { label: "💱 Convertis 5M FCFA en Shilling", query: "Convertis 5 millions FCFA en Shilling", pole: "all" },
      { label: "🏡 3 pièces à Dakar", query: "Quel budget pour un 3 pièces à Dakar ?", pole: "immobilier" },
      { label: "💰 Financement agricole", query: "Comment financer mon projet agricole ?", pole: "finance" },
      { label: "🎓 Certification projets", query: "Quelle certification pour monter des projets ?", pole: "formation" },
      { label: "💼 Export Nigéria (ZLECAf)", query: "Comment exporter au Nigéria sous la ZLECAf ?", pole: "business" },
      { label: "👥 Poste CFO à Abidjan", query: "Trouve-moi un poste de CFO à Abidjan", pole: "emploi" },
      { label: "📦 Panneaux solaires en gros", query: "Où trouver des panneaux solaires en gros ?", pole: "commerce" },
      { label: "🌍 Les 12 devises acceptées", query: "Quelles sont les 12 devises prioritaires acceptées sur AFRICANOVA ?", pole: "all" },
    ],
    immobilier: [
      { label: "3 pièces à Dakar", query: "Quel budget pour un 3 pièces à Dakar ?", pole: "immobilier" },
      { label: "Villa à Kinshasa (Gombe)", query: "Quels sont les prix et rendements locatifs pour une villa à Kinshasa Gombe ?", pole: "immobilier" },
      { label: "Investir à Kigali ou Abidjan", query: "Quels sont les quartiers les plus rentables entre Abidjan et Kigali en 2026 ?", pole: "immobilier" },
      { label: "Convertir 150 000 $ en FCFA et KES", query: "Convertis 150 000 USD en Franc CFA et en Shilling Kenyan", pole: "immobilier" },
    ],
    finance: [
      { label: "Financer projet agricole", query: "Comment financer mon projet agricole ?", pole: "finance" },
      { label: "Simuler mensualité de prêt", query: "Comment calculer ma mensualité pour un prêt de 150 000 $ sur 15 ans ?", pole: "finance" },
      { label: "Banques partenaires (BOA, Ecobank)", query: "Quelles banques partenaires proposent les meilleurs taux en zone UEMOA/CEMAC ?", pole: "finance" },
      { label: "Convertir 10M FCFA en Shilling", query: "Convertis 10 millions FCFA en Shilling Tanzanien et Kenyan", pole: "finance" },
    ],
    formation: [
      { label: "Certification projets", query: "Quelle certification pour monter des projets ?", pole: "formation" },
      { label: "Executive Master ZLECAf", query: "Comment s'inscrire au cursus Executive Master ZLECAf et droit OHADA ?", pole: "formation" },
      { label: "Bourses pour la Diaspora", query: "Existe-t-il des bourses d'études pour les talents de la diaspora africaine ?", pole: "formation" },
    ],
    business: [
      { label: "Export Nigéria (ZLECAf)", query: "Comment exporter au Nigéria sous la ZLECAf ?", pole: "business" },
      { label: "Créer une SARL OHADA", query: "Quelles sont les étapes pour créer une société commerciale conforme au droit OHADA ?", pole: "business" },
      { label: "Règles d'origine ZLECAf", query: "Qu'est-ce que le certificat d'origine ZLECAf et le seuil de 40% de valeur ajoutée ?", pole: "business" },
    ],
    emploi: [
      { label: "Poste de CFO à Abidjan", query: "Trouve-moi un poste de CFO à Abidjan", pole: "emploi" },
      { label: "Grilles salariales cadres", query: "Quelles sont les rémunérations pour un directeur de projet ou CTO en Afrique de l'Ouest ?", pole: "emploi" },
      { label: "Déposer son CV cadre", query: "Comment faire évaluer mon CV par un chasseur de tête agréé AFRICANOVA ?", pole: "emploi" },
    ],
    commerce: [
      { label: "Panneaux solaires en gros", query: "Où trouver des panneaux solaires en gros ?", pole: "commerce" },
      { label: "Import agroalimentaire ZLECAf", query: "Comment acheter des denrées en gros avec franchise douanière ZLECAf ?", pole: "commerce" },
      { label: "Paiement par Crédit Documentaire", query: "Comment sécuriser un achat B2B par lettre de crédit documentaire ?", pole: "commerce" },
    ],
  };

  const currentPrompts = polePrompts[selectedPole] || polePrompts.all;

  // Speech synthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window) || !voiceEnabled) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown marks
      const cleanText = text.replace(/[#*_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = selectedLang === 'en' ? 'en-US' : selectedLang === 'sw' ? 'sw-KE' : 'fr-FR';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis unavailable:', e);
    }
  };

  // Speech recognition (mic)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée par votre navigateur.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang === 'en' ? 'en-US' : selectedLang === 'sw' ? 'sw-KE' : 'fr-FR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Handle submit query
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/nova-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          currentPole: selectedPole !== 'all' ? selectedPole : undefined,
          lang: selectedLang,
          currentCurrency
        })
      });

      const data = await res.json();
      const answerText = data.text || "Je suis à votre écoute pour vous orienter sur les 6 pôles AFRICANOVA.";

      const novaMessage: ChatMessage = {
        id: `nova-${Date.now()}`,
        sender: 'nova',
        text: answerText,
        poleId: selectedPole !== 'all' ? selectedPole : undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, novaMessage]);
      if (voiceEnabled) {
        speakText(answerText);
      }
    } catch (err) {
      console.error("Agent Nova communication error:", err);
      const fallbackMessage: ChatMessage = {
        id: `nova-err-${Date.now()}`,
        sender: 'nova',
        text: `### ⚡ Recommandation Agent Nova\nPour approfondir votre demande sur **${selectedPole !== 'all' ? selectedPole : 'le continent'}**, je vous invite à consulter directement nos services certifiés dans le pôle dédié ou à relancer votre question.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Language switch handler
  const handleLanguageChange = (newLang: 'fr' | 'en' | 'sw' | 'wo') => {
    setSelectedLang(newLang);
    let greeting = "";
    if (newLang === 'en') {
      greeting = "### Welcome to Agent Nova ⚡\n**Official Assistant for AFRICANOVA.**\n*Mission: Empowering Africans by connecting you to the best continental opportunities.*\n\nHow may I assist your investment or business project today?";
    } else if (newLang === 'sw') {
      greeting = "### Karibu Sana Agent Nova ⚡\n**Msaidizi Rasmi wa Jukwaa la AFRICANOVA.**\n*Dhamira: Kukuwezesha kwa kukuunganisha na fursa bora zaidi za biashara na uwekezaji barani Afrika.*\n\nUngependa kuchunguza nini leo katika nguzo zetu 6?";
    } else if (newLang === 'wo') {
      greeting = "### Dalal ak jàmm ci Agent Nova ⚡\n**Ndawu AFRICANOVA ci yéene jëm kanam.**\n*Sunu yéene : Dimbali askanu Afrik ak diaspora bi ci xéewal yu mag yi nekk ci sunu gox bi.*\n\nLoo bëgg a gëstu tey ci sunu 6 pôle yi ?";
    } else {
      greeting = "### Bienvenue sur Agent Nova ⚡\n**Je suis l'assistant officiel de la plateforme AFRICANOVA.**\n*Ma mission : Autonomiser les Africains en vous connectant aux meilleures opportunités.*\n\nSur quel domaine souhaitez-vous avancer aujourd'hui ?";
    }

    setMessages(prev => [
      ...prev,
      {
        id: `lang-${Date.now()}`,
        sender: 'nova',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Simple Markdown renderer
  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-africanova-serif text-sm font-bold text-[#F5D67A] pt-1">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('**') && line.endsWith('**')) {
            return (
              <p key={idx} className="font-bold text-white">
                {line.replace(/\*\*/g, '')}
              </p>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1">
                <span className="text-[#12B350] font-bold">•</span>
                <span className="text-[#EDEDED]/90">
                  {formatInline(line.substring(2))}
                </span>
              </div>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1 my-1">
                <span className="text-[#D4AF37] font-mono font-bold">{line.match(/^\d+\./)?.[0]}</span>
                <span className="text-[#EDEDED]/90">
                  {formatInline(line.replace(/^\d+\.\s/, ''))}
                </span>
              </div>
            );
          }
          if (line.startsWith('👉 ')) {
            return (
              <div key={idx} className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-[#F5D67A] font-semibold my-2 flex items-center justify-between">
                <span>{line.replace('👉 ', '')}</span>
              </div>
            );
          }
          if (line.trim() === '') {
            return <div key={idx} className="h-1" />;
          }
          return (
            <p key={idx} className="text-[#EDEDED]/90">
              {formatInline(line)}
            </p>
          );
        })}
      </div>
    );
  };

  const formatInline = (str: string) => {
    // Bold **text**
    const parts = str.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="text-[#F5D67A]">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <>
      {/* =========================================================================
          BOUTON FLOTTANT AGENT NOVA (Bas à droite - 2. Où le placer dans le site)
          ========================================================================= */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-in fade-in zoom-in duration-300">
          <button
            onClick={onToggle}
            className="group relative flex items-center gap-3 p-3 sm:px-4 sm:py-3 bg-[#161616] border border-[#D4AF37]/50 hover:border-[#D4AF37] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all transform hover:-translate-y-1 cursor-pointer"
            aria-label="Ouvrir Agent Nova"
          >
            {/* Pulsating green halo ring (#12B350) */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12B350] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#12B350] border-2 border-black"></span>
            </span>

            {/* Emblem */}
            <div className="relative">
              <AfricanovaEmblem size={28} />
            </div>

            {/* Label */}
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-africanova-serif text-xs font-bold text-[#F5D67A] tracking-wide">
                  Agent Nova
                </span>
                <span className="text-[9px] px-1.5 py-0.2 bg-[#12B350]/20 text-[#12B350] border border-[#12B350]/40 rounded-full font-mono font-bold">
                  IA
                </span>
              </div>
              <p className="text-[10px] text-[#EDEDED]/70 line-clamp-1 font-sans">
                Votre conseiller opportunités
              </p>
            </div>
          </button>
        </div>
      )}

      {/* =========================================================================
          FENÊTRE DE CHAT AGENT NOVA (Drawer interactif)
          ========================================================================= */}
      {isOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 shadow-2xl flex flex-col bg-[#0A0A0A] border border-[#D4AF37]/40 rounded-2xl overflow-hidden backdrop-blur-2xl ${
            isExpanded 
              ? 'inset-3 sm:inset-6 md:inset-10 lg:inset-16' 
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[440px] md:w-[480px] h-[85vh] sm:h-[650px] max-h-[92vh]'
          }`}
        >
          {/* HEADER AGENT NOVA */}
          <div className="p-3.5 sm:p-4 bg-[#161616] border-b border-[#D4AF37]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <AfricanovaEmblem size={32} />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#12B350] rounded-full border-2 border-[#161616]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-africanova-serif text-sm font-bold text-[#F5D67A]">
                    Agent Nova
                  </h3>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 bg-[#12B350]/20 text-[#12B350] border border-[#12B350]/30 rounded font-mono font-bold">
                    En Ligne
                  </span>
                </div>
                <p className="text-[11px] text-[#EDEDED]/70 leading-none mt-0.5 font-serif italic">
                  Votre conseiller personnel pour saisir les opportunités
                </p>
              </div>
            </div>

            {/* Actions Header */}
            <div className="flex items-center gap-1">
              {/* Toggle Audio */}
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  voiceEnabled 
                    ? 'bg-[#12B350]/20 text-[#12B350] border border-[#12B350]/30' 
                    : 'text-[#EDEDED]/60 hover:text-white hover:bg-white/5'
                }`}
                title={voiceEnabled ? "Désactiver la voix" : "Activer la synthèse vocale"}
              >
                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              {/* Redémarrer conversation */}
              <button
                onClick={() => setMessages([messages[0]])}
                className="p-1.5 text-[#EDEDED]/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                title="Réinitialiser le dialogue"
              >
                <RefreshCw size={15} />
              </button>

              {/* Plein écran / Réduire */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-[#EDEDED]/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors hidden sm:block"
                title={isExpanded ? "Réduire" : "Agrandir"}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              {/* Fermer */}
              <button
                onClick={onToggle}
                className="p-1.5 text-[#EDEDED]/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Fermer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* BARRE MULTI-LANGUE & 12 DEVISES AFRICANOVA */}
          <div className="px-3 py-1.5 bg-[#0f0f0f] border-b border-[#D4AF37]/20 flex items-center justify-between gap-2 text-[11px]">
            {/* Langue */}
            <div className="flex items-center gap-1">
              <span className="text-[#6B6B6B] text-[10px] hidden sm:inline">Langue :</span>
              <div className="flex items-center bg-black/60 border border-white/10 rounded-lg p-0.5">
                {[
                  { code: 'fr' as const, label: 'FR', flag: '🇫🇷' },
                  { code: 'en' as const, label: 'EN', flag: '🇬🇧' },
                  { code: 'sw' as const, label: 'SWA', flag: '🇹🇿' },
                  { code: 'wo' as const, label: 'WOL', flag: '🇸🇳' },
                ].map(l => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => handleLanguageChange(l.code)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all ${
                      selectedLang === l.code 
                        ? 'bg-[#D4AF37] text-black shadow' 
                        : 'text-[#EDEDED]/70 hover:text-white'
                    }`}
                    title={`Passer Agent Nova en ${l.label}`}
                  >
                    <span className="mr-0.5">{l.flag}</span>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Devise active */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#6B6B6B] text-[10px] hidden sm:inline">Devise :</span>
              <div className="relative flex items-center">
                <select
                  value={currentCurrency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="bg-black/60 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#F5D67A] text-[10px] font-mono font-bold rounded-lg px-2 py-0.5 appearance-none pr-5 focus:outline-none cursor-pointer"
                  title="Changer la devise globale d'AFRICANOVA"
                >
                  {allCurrencies.map(c => (
                    <option key={c.code} value={c.code} className="bg-[#161616] text-white">
                      {c.flag} {c.code} ({c.symbol}) — {c.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-1 text-[#D4AF37] text-[9px]">▾</div>
              </div>
            </div>
          </div>

          {/* SÉLECTEUR DE PÔLE TRANSVERSE */}
          <div className="px-3 py-2 bg-[#121212] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
            <span className="text-[#D4AF37] font-mono text-[10px] uppercase font-bold shrink-0 pl-1">
              Pôle :
            </span>
            {[
              { id: 'all', label: 'Tous', icon: <Sparkles size={12} /> },
              { id: 'immobilier', label: 'Immobilier', icon: <Home size={12} /> },
              { id: 'finance', label: 'Finance', icon: <Landmark size={12} /> },
              { id: 'formation', label: 'Formation', icon: <GraduationCap size={12} /> },
              { id: 'business', label: 'Business', icon: <Briefcase size={12} /> },
              { id: 'emploi', label: 'Emploi', icon: <Users size={12} /> },
              { id: 'commerce', label: 'Commerce', icon: <ShoppingBag size={12} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedPole(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full whitespace-nowrap transition-all font-medium ${
                  selectedPole === tab.id
                    ? 'bg-[#D4AF37] text-black font-bold shadow-sm'
                    : 'bg-white/5 text-[#EDEDED]/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* CORPS DE DISCUSSION */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0A0A0A]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="shrink-0 mt-0.5">
                      <AfricanovaEmblem size={24} />
                    </div>
                  )}

                  <div 
                    className={`max-w-[85%] rounded-2xl p-3 sm:p-3.5 shadow-md ${
                      isUser
                        ? 'bg-gradient-to-br from-[#D4AF37] to-[#A9791E] text-black rounded-tr-none font-medium'
                        : 'bg-[#161616] border border-white/10 text-[#EDEDED] rounded-tl-none'
                    }`}
                  >
                    {isUser ? (
                      <p className="text-xs sm:text-[13px] font-semibold">{msg.text}</p>
                    ) : (
                      renderMessageContent(msg.text)
                    )}

                    <div className={`mt-1.5 flex items-center justify-end text-[9px] ${isUser ? 'text-black/60' : 'text-[#6B6B6B]'}`}>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Indicateur de chargement */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <AfricanovaEmblem size={24} />
                <div className="bg-[#161616] border border-white/10 rounded-2xl rounded-tl-none p-3 text-xs text-[#EDEDED]/70 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#12B350] animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse delay-100" />
                  <span className="w-2 h-2 rounded-full bg-[#F5D67A] animate-pulse delay-200" />
                  <span className="font-mono text-[11px] text-[#F5D67A]">Agent Nova consulte les données panafricaines...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUESTIONS RAPIDES SUGGÉRÉES (selon le tableau officiel d'Israel Carlito) */}
          <div className="px-3 py-2 bg-[#121212] border-t border-white/5">
            <div className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider mb-1.5 flex items-center justify-between">
              <span>Suggestions rapides ({selectedPole}) :</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {currentPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSendMessage(p.query);
                  }}
                  className="px-2.5 py-1 bg-white/[0.04] hover:bg-[#D4AF37]/15 hover:border-[#D4AF37]/40 border border-white/10 rounded-lg text-[11px] text-[#EDEDED]/80 hover:text-[#F5D67A] whitespace-nowrap transition-colors shrink-0"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* ZONE DE SAISIE & MICROPHONE */}
          <div className="p-3 bg-[#161616] border-t border-[#D4AF37]/30">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Posez votre question à Agent Nova (ex: 3 pièces Dakar, ZLECAf...)"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-[#0A0A0A] border border-white/15 focus:border-[#D4AF37] rounded-xl text-xs sm:text-[13px] text-white placeholder:text-[#6B6B6B] focus:outline-none transition-colors"
                />
                
                {/* Voice Dictation Button */}
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-500/20 text-red-400 animate-pulse' 
                      : 'text-[#EDEDED]/50 hover:text-white'
                  }`}
                  title={isListening ? "Écoute en cours..." : "Dicter vocalement"}
                >
                  {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                </button>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 rounded-xl bg-an-gold-gradient text-black font-bold hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 transition-all cursor-pointer shadow-md"
                title="Envoyer"
              >
                <Send size={16} />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[10px] text-[#6B6B6B]">
              <span>Propulsé par AFRICANOVA Intelligence</span>
              {selectedPole === 'immobilier' && onOpenRealEstateExplorer && (
                <button
                  onClick={onOpenRealEstateExplorer}
                  className="text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Explorer le catalogue immobilier</span>
                  <ExternalLink size={10} />
                </button>
              )}
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default AgentNova;
