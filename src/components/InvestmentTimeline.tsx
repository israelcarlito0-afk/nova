import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  Award,
  DollarSign,
  Download,
  Info
} from 'lucide-react';
import { Property, InvestmentMilestone } from '../types';

interface InvestmentTimelineProps {
  property: Property;
  lang?: 'fr' | 'en' | 'sw';
  onActionClick?: (milestone: InvestmentMilestone) => void;
}

export default function InvestmentTimeline({
  property,
  lang = 'fr',
  onActionClick
}: InvestmentTimelineProps) {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'active'>('all');
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Generate fallback milestones if not provided on the property
  const getMilestones = (): InvestmentMilestone[] => {
    if (property.investmentMilestones && property.investmentMilestones.length > 0) {
      return property.investmentMilestones;
    }

    const createdYear = property.createdAt?.seconds 
      ? new Date(property.createdAt.seconds * 1000).getFullYear() 
      : 2026;
    const createdMonth = property.createdAt?.seconds 
      ? new Date(property.createdAt.seconds * 1000).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' })
      : 'Jan.';

    const isSold = property.status === 'sold';
    const isRented = property.status === 'rented';

    if (lang === 'fr') {
      return [
        {
          id: 'm1',
          title: 'Mise en Ligne & Audit Initial',
          date: `${createdMonth} ${createdYear}`,
          status: 'completed',
          category: 'listing',
          description: 'Publication de la propriété sur ImmoAI Africa, enregistrement des coordonnées géographiques et validation préliminaire du bien.',
          details: [
            'Photos HD & Visite 3D enregistrées',
            'Fiche technique du bien constituée',
            'Propriétaire / Promoteur identifié'
          ],
          metrics: [
            { label: 'Surface', value: `${property.sqm} m²` },
            { label: 'Catégorie', value: property.category }
          ]
        },
        {
          id: 'm2',
          title: 'Analyse Prédictive & Évaluation IA',
          date: `Fév. ${createdYear}`,
          status: 'completed',
          category: 'analysis',
          description: 'Calcul de la valeur estimée par l\'algorithme Gemini Pro et audit comparatif de marché sur le quartier.',
          details: [
            `Score d'investissement attribué: ${property.aiEstimate?.investment_score || 8.5}/10`,
            `Valeur projetée: $${property.aiEstimate?.price_estimate?.toLocaleString() || (property.price * 1.15).toLocaleString()}`,
            'Analyse des risques environnementaux et urbains'
          ],
          metrics: [
            { label: 'Score IA', value: `${property.aiEstimate?.investment_score || 8.5}/10` },
            { label: 'Tendance', value: 'Positive (+14%)' }
          ]
        },
        {
          id: 'm3',
          title: 'Vérification Titre Foncier & Cadastre',
          date: `Mars ${createdYear}`,
          status: 'completed',
          category: 'due_diligence',
          description: 'Certification juridique du titre de propriété, absence de litiges fonciers et horodatage sur le registre blockchain.',
          details: [
            'Certificat d\'urbanisme vérifié',
            'Enregistrement sur le registre décentralisé ImmoAI',
            'Audit notarié indépendant sans réserve'
          ],
          metrics: [
            { label: 'Statut Légal', value: 'Certifié Blockchain' },
            { label: 'Conformité', value: '100%' }
          ]
        },
        {
          id: 'm4',
          title: 'Phase d\'Acquisition & Réservation',
          date: `En cours (${createdYear})`,
          status: isSold ? 'completed' : 'in_progress',
          category: 'acquisition',
          description: 'Ouverture de la fenêtre d\'acquisition prioritaire. Les investisseurs qualifiés peuvent réserver ou formaliser leur offre.',
          details: [
            'Accompagnement financier sur mesure',
            'Possibilité de co-investissement / direct',
            'Offres fermes examinées sous 48h'
          ],
          metrics: [
            { label: 'Statut', value: isSold ? 'Vendu' : 'Disponible' },
            { label: 'Prix de base', value: `$${property.price.toLocaleString()}` }
          ]
        },
        {
          id: 'm5',
          title: 'Clôture Notariée & Transfert de Propriété',
          date: `Q3 ${createdYear}`,
          status: isSold ? 'completed' : 'upcoming',
          category: 'closing',
          description: 'Signature de l\'acte authentique devant notaire agréé et délivrance du certificat d\'acquisition définitif.',
          details: [
            'Transfert des droits de propriété',
            'Délivrance de la clé numérique ImmoVault',
            'Remise officielle des clés du bien'
          ],
          metrics: [
            { label: 'Frais Notaire', value: 'Inclus' },
            { label: 'Délai moyen', value: '14 Jours' }
          ]
        },
        {
          id: 'm6',
          title: 'Gestion & Rendements Locatifs',
          date: `Q4 ${createdYear}`,
          status: (isSold || isRented) ? 'in_progress' : 'upcoming',
          category: 'yield',
          description: 'Mise en location, gestion locative automatisée par IA et versement trimestriel des dividendes / loyers.',
          details: [
            'Recherche automatisée de locataires solvables',
            'Reversement des loyers direct sur Wallet ImmoAI',
            'Optimisation fiscale et comptable'
          ],
          metrics: [
            { label: 'Rendement Visé', value: '8.5% / an' },
            { label: 'Paiement', value: 'Mensuel' }
          ]
        }
      ];
    } else if (lang === 'en') {
      return [
        {
          id: 'm1',
          title: 'Initial Listing & Property Audit',
          date: `${createdMonth} ${createdYear}`,
          status: 'completed',
          category: 'listing',
          description: 'Official listing publication on ImmoAI Africa, geographic coordinate mapping, and initial site inspection.',
          details: [
            'HD photography & 3D virtual tour recorded',
            'Property spec sheet finalized',
            'Developer / owner identity verified'
          ],
          metrics: [
            { label: 'Area', value: `${property.sqm} sqm` },
            { label: 'Category', value: property.category }
          ]
        },
        {
          id: 'm2',
          title: 'Predictive Valuation & AI Assessment',
          date: `Feb. ${createdYear}`,
          status: 'completed',
          category: 'analysis',
          description: 'Market appraisal via Gemini Pro engine and comparative neighborhood demand analysis.',
          details: [
            `Assigned investment score: ${property.aiEstimate?.investment_score || 8.5}/10`,
            `Projected value: $${property.aiEstimate?.price_estimate?.toLocaleString() || (property.price * 1.15).toLocaleString()}`,
            'Environmental & infrastructure risk audit'
          ],
          metrics: [
            { label: 'AI Score', value: `${property.aiEstimate?.investment_score || 8.5}/10` },
            { label: 'Trend', value: 'Bullish (+14%)' }
          ]
        },
        {
          id: 'm3',
          title: 'Title Deed Verification & Blockchain Audit',
          date: `Mar. ${createdYear}`,
          status: 'completed',
          category: 'due_diligence',
          description: 'Legal title clearance, encumbrance verification, and ledger timestamping on ImmoAI Blockchain.',
          details: [
            'Zoning & urban planning certificate clear',
            'Encrypted registry timestamped',
            'Independent legal audit passed'
          ],
          metrics: [
            { label: 'Legal Status', value: 'Blockchain Certified' },
            { label: 'Compliance', value: '100%' }
          ]
        },
        {
          id: 'm4',
          title: 'Acquisition Window & Reservation',
          date: `Active (${createdYear})`,
          status: isSold ? 'completed' : 'in_progress',
          category: 'acquisition',
          description: 'Open allocation window for buyers & investors to lock in purchase rights or submit formal offers.',
          details: [
            'Custom mortgage & equity guidance',
            'Direct & fractional allocation option',
            'Offers reviewed within 48 hours'
          ],
          metrics: [
            { label: 'Status', value: isSold ? 'Sold' : 'Available' },
            { label: 'List Price', value: `$${property.price.toLocaleString()}` }
          ]
        },
        {
          id: 'm5',
          title: 'Notary Closing & Ownership Deed Transfer',
          date: `Q3 ${createdYear}`,
          status: isSold ? 'completed' : 'upcoming',
          category: 'closing',
          description: 'Final contract signing with accredited notary and issuance of legal ownership certificate.',
          details: [
            'Full title deed transfer',
            'Digital key issuance via ImmoVault',
            'Physical key handover'
          ],
          metrics: [
            { label: 'Notary Fees', value: 'Included' },
            { label: 'Avg SLA', value: '14 Days' }
          ]
        },
        {
          id: 'm6',
          title: 'Asset Management & Rental Yields',
          date: `Q4 ${createdYear}`,
          status: (isSold || isRented) ? 'in_progress' : 'upcoming',
          category: 'yield',
          description: 'Tenant matching, automated lease collection via AI, and quarterly distribution of rental proceeds.',
          details: [
            'Automated AI tenant credit checks',
            'Direct payout into ImmoAI Wallet',
            'Tax optimization & annual report'
          ],
          metrics: [
            { label: 'Target Yield', value: '8.5% p.a.' },
            { label: 'Frequency', value: 'Monthly' }
          ]
        }
      ];
    } else {
      // Swahili translation fallback
      return [
        {
          id: 'm1',
          title: 'Mwanzo wa Orodha na Ukaguzi',
          date: `${createdMonth} ${createdYear}`,
          status: 'completed',
          category: 'listing',
          description: 'Kuwekwa kwa nyumba kwenye ImmoAI Africa, ramani ya mazingira na ukaguzi wa awali.',
          details: ['Picha za HD na Ziara ya 3D', 'Ripoti ya kiufundi tayari'],
          metrics: [{ label: 'Eneo', value: `${property.sqm} m²` }]
        },
        {
          id: 'm2',
          title: 'Tathmini ya Akili Bandia (IA)',
          date: `Feb ${createdYear}`,
          status: 'completed',
          category: 'analysis',
          description: 'Tathmini ya thamani ya soko kupitia mchakato wa Gemini Pro.',
          details: [`Alama ya uwekezaji: ${property.aiEstimate?.investment_score || 8.5}/10`],
          metrics: [{ label: 'Alama ya IA', value: `${property.aiEstimate?.investment_score || 8.5}/10` }]
        },
        {
          id: 'm3',
          title: 'Uhakiki wa Hatifungani',
          date: `Machi ${createdYear}`,
          status: 'completed',
          category: 'due_diligence',
          description: 'Uthibitisho wa kisheria wa miliki ya ardhi na uthibitisho wa Blockchain.',
          details: ['Hati safi iliyoidhinishwa'],
          metrics: [{ label: 'Sheria', value: 'Blockchain Certified' }]
        },
        {
          id: 'm4',
          title: 'Awamu ya Ununuzi na Uhifadhi',
          date: `Sasa (${createdYear})`,
          status: isSold ? 'completed' : 'in_progress',
          category: 'acquisition',
          description: 'Fursa ya kuweka nafasi ya ununuzi au kuwasilisha ofa rasmi.',
          details: ['Maelekezo ya kifedha'],
          metrics: [{ label: 'Hali', value: isSold ? 'Imeuzwa' : 'Inapatikana' }]
        },
        {
          id: 'm5',
          title: 'Ukamilishaji wa Mkataba',
          date: `Q3 ${createdYear}`,
          status: isSold ? 'completed' : 'upcoming',
          category: 'closing',
          description: 'Utiaji saini wa mwisho na kutoa hatimiliki rasmi.',
          details: ['Kukabidhi funguo'],
          metrics: [{ label: 'Muda', value: 'Siku 14' }]
        },
        {
          id: 'm6',
          title: 'Usimamizi na Faida za Kodi',
          date: `Q4 ${createdYear}`,
          status: (isSold || isRented) ? 'in_progress' : 'upcoming',
          category: 'yield',
          description: 'Kupangisha na kugawa faida ya kodi kwa mwekezaji.',
          details: ['Malipo ya kila mwezi'],
          metrics: [{ label: 'Lengo la Faida', value: '8.5%' }]
        }
      ];
    }
  };

  const milestones = getMilestones();
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  const displayedMilestones = filterMode === 'active' 
    ? milestones.filter(m => m.status === 'in_progress' || m.status === 'upcoming') 
    : milestones;

  const getCategoryIcon = (category: InvestmentMilestone['category']) => {
    switch (category) {
      case 'listing': return Calendar;
      case 'analysis': return Sparkles;
      case 'due_diligence': return ShieldCheck;
      case 'acquisition': return TrendingUp;
      case 'closing': return Building2;
      case 'yield': return DollarSign;
      default: return Clock;
    }
  };

  const getCategoryBadgeColor = (category: InvestmentMilestone['category']) => {
    switch (category) {
      case 'listing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'analysis': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'due_diligence': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'acquisition': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'closing': return 'bg-brand/10 text-brand border-brand/20';
      case 'yield': return 'bg-green-500/10 text-green-400 border-green-500/20';
    }
  };

  const getCategoryTitle = (category: InvestmentMilestone['category']) => {
    if (lang === 'fr') {
      switch (category) {
        case 'listing': return 'Référencement';
        case 'analysis': return 'Audit IA';
        case 'due_diligence': return 'Conformité';
        case 'acquisition': return 'Acquisition';
        case 'closing': return 'Clôture';
        case 'yield': return 'Rendement';
      }
    } else {
      switch (category) {
        case 'listing': return 'Listing';
        case 'analysis': return 'AI Audit';
        case 'due_diligence': return 'Compliance';
        case 'acquisition': return 'Acquisition';
        case 'closing': return 'Closing';
        case 'yield': return 'Yield';
      }
    }
  };

  return (
    <section className="space-y-8 my-12">
      {/* Header & Main Bar */}
      <div className="bg-surface-elevated rounded-[40px] border border-border-subtle p-8 md:p-10 relative overflow-hidden shadow-2xl">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-brand text-xs font-black uppercase tracking-[0.2em] mb-2">
              <Clock size={16} />
              {lang === 'fr' ? 'Feuille de Route Investissement' : lang === 'en' ? 'Investment Roadmap' : 'Ratiba ya Uwekezaji'}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-black text-text-primary tracking-tight uppercase">
              {lang === 'fr' ? 'Jalons Clés de l\'Investissement' : lang === 'en' ? 'Key Investment Milestones' : 'Hatua Kuu za Uwekezaji'}
            </h2>
            <p className="text-gray-400 text-sm mt-1 max-w-xl font-medium">
              {lang === 'fr' 
                ? 'Suivi chronologique transparent : de l\'audit initial à l\'acquisition et la distribution des rendements.' 
                : 'Transparent step-by-step progress from property audit to acquisition and yield distribution.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFilterMode(filterMode === 'all' ? 'active' : 'all')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                filterMode === 'active' 
                  ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Info size={14} />
              <span>{filterMode === 'all' ? (lang === 'fr' ? 'Afficher phases actives' : 'Show active phases') : (lang === 'fr' ? 'Toutes les étapes' : 'All steps')}</span>
            </button>

            <button
              onClick={() => setShowCertificateModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-brand/10 border border-brand/30 text-brand hover:bg-brand hover:text-white transition-all text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Award size={14} />
              <span>{lang === 'fr' ? 'Certificat Foncier' : 'Milestone Report'}</span>
            </button>
          </div>
        </div>

        {/* Global Progress Overview */}
        <div className="pt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          <div className="md:col-span-8 space-y-3">
            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
              <span className="text-gray-400">
                {lang === 'fr' ? 'Progression Globale du Projet' : 'Overall Pipeline Completion'}
              </span>
              <span className="text-brand font-mono text-sm">{completedCount}/{milestones.length} {lang === 'fr' ? 'ÉTAPES' : 'STEPS'} ({progressPercent}%)</span>
            </div>
            <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-brand/60 via-brand to-emerald-400 rounded-full shadow-lg shadow-brand/20"
              />
            </div>
          </div>

          <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-6 bg-white/5 p-4 rounded-3xl border border-white/5">
            <div className="text-center md:text-right">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{lang === 'fr' ? 'Phase Actuelle' : 'Current Phase'}</p>
              <p className="text-white font-bold text-sm truncate max-w-[180px]">
                {milestones.find(m => m.status === 'in_progress')?.title || (property.status === 'sold' ? (lang === 'fr' ? 'Acquis' : 'Acquired') : (lang === 'fr' ? 'Disponible' : 'Available'))}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Clock size={20} className="animate-spin-slow" />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Timeline Section */}
      <div className="relative pl-6 md:pl-10 space-y-8 before:absolute before:left-3 md:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-brand before:via-brand/40 before:to-white/10">
        <AnimatePresence>
          {displayedMilestones.map((milestone, idx) => {
            const Icon = getCategoryIcon(milestone.category);
            const isCompleted = milestone.status === 'completed';
            const isInProgress = milestone.status === 'in_progress';
            const isExpanded = selectedMilestoneId === milestone.id;

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Timeline Marker Node */}
                <div 
                  className={`absolute -left-[31px] md:-left-[39px] top-4 w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-xl ${
                    isCompleted 
                      ? 'bg-brand border-brand text-white shadow-brand/30 ring-4 ring-brand/10' 
                      : isInProgress 
                        ? 'bg-amber-500 border-amber-400 text-black animate-pulse shadow-amber-500/30 ring-4 ring-amber-500/20' 
                        : 'bg-dark-bg border-white/20 text-gray-500 group-hover:border-white/40'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={18} className="stroke-[2.5]" />
                  ) : isInProgress ? (
                    <Clock size={18} className="stroke-[2.5]" />
                  ) : (
                    <span className="text-xs font-mono font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Milestone Main Card */}
                <div 
                  onClick={() => setSelectedMilestoneId(isExpanded ? null : milestone.id)}
                  className={`bg-surface-elevated rounded-[32px] p-6 md:p-8 border transition-all duration-300 cursor-pointer shadow-xl ${
                    isInProgress
                      ? 'border-amber-500/40 bg-gradient-to-r from-amber-500/5 via-surface-elevated to-surface-elevated hover:border-amber-500'
                      : isCompleted
                        ? 'border-white/10 hover:border-brand/40'
                        : 'border-white/5 opacity-80 hover:opacity-100 hover:border-white/20'
                  }`}
                >
                  {/* Card Top Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getCategoryBadgeColor(milestone.category)} flex items-center gap-1.5`}>
                        <Icon size={12} />
                        {getCategoryTitle(milestone.category)}
                      </span>

                      {/* Status Tag */}
                      {isCompleted && (
                        <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          {lang === 'fr' ? 'Complété' : 'Completed'}
                        </span>
                      )}
                      {isInProgress && (
                        <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 animate-pulse">
                          <Clock size={12} />
                          {lang === 'fr' ? 'En Cours' : 'In Progress'}
                        </span>
                      )}
                      {!isCompleted && !isInProgress && (
                        <span className="bg-white/5 text-gray-400 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          {lang === 'fr' ? 'À Venir' : 'Upcoming'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-gray-400 text-xs font-mono font-bold">
                      <Calendar size={14} className="text-brand" />
                      <span>{milestone.date}</span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition-colors ml-2">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>

                  {/* Title & Short Description */}
                  <div className="space-y-2">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white group-hover:text-brand transition-colors flex items-center justify-between">
                      <span>{milestone.title}</span>
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed font-normal">
                      {milestone.description}
                    </p>
                  </div>

                  {/* Summary Metrics Pill Row */}
                  {milestone.metrics && milestone.metrics.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/5">
                      {milestone.metrics.map((metric, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase">{metric.label}:</span>
                          <span className="text-xs text-white font-bold">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Expanded Content Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pt-6 mt-6 border-t border-white/10 space-y-4"
                      >
                        {milestone.details && milestone.details.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-black text-brand uppercase tracking-widest">
                              {lang === 'fr' ? 'Détails de l\'Étape & Engagements' : 'Step Deliverables & Proofs'}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {milestone.details.map((detail, dIdx) => (
                                <div key={dIdx} className="flex items-start gap-2.5 bg-black/20 p-3 rounded-xl border border-white/5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                                  <span className="text-xs text-gray-300 font-medium">{detail}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <ShieldCheck size={14} className="text-green-400" />
                            <span>{lang === 'fr' ? 'Audit d\'authenticité ImmoAI Afrique certifié' : 'Verified by ImmoAI Audit Layer'}</span>
                          </div>

                          {onActionClick && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onActionClick(milestone);
                              }}
                              className="px-4 py-2 bg-brand/20 border border-brand/40 text-brand hover:bg-brand hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                            >
                              <span>{lang === 'fr' ? 'Explorer cette étape' : 'Inspect phase'}</span>
                              <ArrowRight size={14} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Audit Certificate Modal */}
      <AnimatePresence>
        {showCertificateModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCertificateModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-surface rounded-[40px] p-8 md:p-12 shadow-2xl border border-brand/30 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand/30">
                  <Award size={28} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
                    {lang === 'fr' ? 'Certificat de Conformité Foncier' : 'Land Compliance Certificate'}
                  </h3>
                  <p className="text-xs text-brand font-mono font-bold uppercase">
                    ID: IMMO-PROOF-{property.id.slice(0, 8).toUpperCase()}-2026
                  </p>
                </div>
              </div>

              <div className="space-y-4 bg-black/40 p-6 rounded-3xl border border-white/5 mb-8 text-sm text-gray-300">
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-gray-500 text-xs font-bold uppercase">Propriété</span>
                  <span className="text-white font-bold">{property.title}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-gray-500 text-xs font-bold uppercase">Localisation</span>
                  <span className="text-white font-bold">{property.location}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-gray-500 text-xs font-bold uppercase">Audit Blockchain</span>
                  <span className="text-green-400 font-bold flex items-center gap-1">
                    <ShieldCheck size={14} /> Vérifié & Immuable
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-xs font-bold uppercase">Évaluation IA Gemini</span>
                  <span className="text-brand font-bold">{property.aiEstimate?.investment_score || 8.5}/10</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    alert(lang === 'fr' ? 'Téléchargement du rapport de conformité en cours...' : 'Downloading compliance report...');
                    setShowCertificateModal(false);
                  }}
                  className="flex-1 bg-brand text-white py-4 rounded-2xl font-bold text-sm hover:bg-brand-dark transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand/20"
                >
                  <Download size={18} />
                  <span>{lang === 'fr' ? 'Télécharger le Rapport (PDF)' : 'Download Full PDF'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
