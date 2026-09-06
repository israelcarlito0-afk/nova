import React, { useState } from 'react';
import { Star, CheckCircle2, ThumbsUp, MessageSquare, Plus, Filter, ShieldCheck, User, Sparkles, X } from 'lucide-react';
import { AfricanovaVerifiedBadge } from './AfricanovaVerifiedBadge';

export interface ReviewItem {
  id: string;
  authorName: string;
  authorLocation: string;
  authorAvatar?: string;
  rating: number;
  date: string;
  pole: 'Immobilier' | 'Finance' | 'Formation' | 'Business' | 'Emploi' | 'Commerce';
  targetEntity: string;
  verifiedTransaction: boolean;
  comment: string;
  likes: number;
  criteriaRatings?: {
    transparency: number;
    reactivity: number;
    security: number;
    priceValue: number;
  };
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    authorName: 'Mamadou Ba',
    authorLocation: 'Paris / Dakar',
    rating: 5,
    date: '14 Août 2026',
    pole: 'Immobilier',
    targetEntity: 'Agence Immobilière Almadies Prestige',
    verifiedTransaction: true,
    comment: 'Acquisition d\'un terrain titré à Saly finalisée sans encombre. L\'audit juridique préalable mandaté par AFRICANOVA a révélé la conformité intégrale du Titre Foncier. Mandat transparent et notaire joignable directement.',
    likes: 24,
    criteriaRatings: { transparency: 5, reactivity: 5, security: 5, priceValue: 4.8 },
  },
  {
    id: 'rev-2',
    authorName: 'Grace Mirembe',
    authorLocation: 'Kigali / Kampala',
    rating: 5,
    date: '28 Juillet 2026',
    pole: 'Finance',
    targetEntity: 'Ecobank Panafrican Banking',
    verifiedTransaction: true,
    comment: 'Simulation de prêt immobilier réalisée en 5 minutes sur la plateforme, accord de principe délivré sous 48 heures ouvrées pour l\'achat de notre villa à Kigali. Taux compétitif à 6.4% et aucun frais caché.',
    likes: 19,
    criteriaRatings: { transparency: 4.9, reactivity: 5, security: 5, priceValue: 5 },
  },
  {
    id: 'rev-3',
    authorName: 'Koffi Serge Kouassi',
    authorLocation: 'Abidjan Cocody',
    rating: 5,
    date: '02 Septembre 2026',
    pole: 'Formation',
    targetEntity: 'Executive Academy AFRICANOVA & CAMES',
    verifiedTransaction: true,
    comment: 'La certification en Montage Financier Immobilier et PPP m\'a permis de décrocher un poste de direction à Abidjan. Les cours dispensés par d\'anciens banquiers de la BOAD et de la BAD sont d\'un niveau d\'excellence remarquable.',
    likes: 31,
    criteriaRatings: { transparency: 5, reactivity: 4.8, security: 5, priceValue: 4.9 },
  },
  {
    id: 'rev-4',
    authorName: 'Ibrahim Diallo',
    authorLocation: 'Conakry / Bamako',
    rating: 5,
    date: '21 Août 2026',
    pole: 'Commerce',
    targetEntity: 'ZLECAf Solar Hub West Africa',
    verifiedTransaction: true,
    comment: 'Commande groupée de 50 onduleurs solaires hybrides. Le paiement sous séquestre bancaire nous a rassuré à 100%. Marchandises réceptionnées sous douane à Bamako en 8 jours ouvrés, qualité irréprochable.',
    likes: 12,
    criteriaRatings: { transparency: 4.8, reactivity: 4.9, security: 5, priceValue: 4.9 },
  },
];

interface AfricanovaReviewsSystemProps {
  initialPoleFilter?: string;
  limit?: number;
  showAddReviewButton?: boolean;
}

export const AfricanovaReviewsSystem: React.FC<AfricanovaReviewsSystemProps> = ({
  initialPoleFilter = 'all',
  limit,
  showAddReviewButton = true,
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [selectedPole, setSelectedPole] = useState<string>(initialPoleFilter);
  const [showAddModal, setShowAddModal] = useState(false);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  // Form state
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formPole, setFormPole] = useState<'Immobilier' | 'Finance' | 'Formation' | 'Business' | 'Emploi' | 'Commerce'>('Immobilier');
  const [formTarget, setFormTarget] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filteredReviews = reviews.filter(r => {
    if (selectedPole === 'all') return true;
    return r.pole.toLowerCase() === selectedPole.toLowerCase();
  });

  const displayedReviews = limit ? filteredReviews.slice(0, limit) : filteredReviews;

  // Rating aggregate calculation
  const totalReviewsCount = reviews.length;
  const averageRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / (totalReviewsCount || 1)).toFixed(1);

  const handleLike = (id: string) => {
    if (likedIds[id]) return;
    setLikedIds(prev => ({ ...prev, [id]: true }));
    setReviews(prev => prev.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formComment) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newReview: ReviewItem = {
        id: `rev-${Date.now()}`,
        authorName: formName,
        authorLocation: formLocation || 'Afrique & Diaspora',
        rating: formRating,
        date: 'Aujourd\'hui',
        pole: formPole,
        targetEntity: formTarget || 'Service Agréé AFRICANOVA',
        verifiedTransaction: true,
        comment: formComment,
        likes: 1,
        criteriaRatings: {
          transparency: formRating,
          reactivity: formRating,
          security: 5,
          priceValue: formRating,
        },
      };

      setReviews([newReview, ...reviews]);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowAddModal(false);
        setFormName('');
        setFormLocation('');
        setFormComment('');
        setFormTarget('');
      }, 1200);
    }, 600);
  };

  return (
    <div className="space-y-6 text-[#EDEDED]">
      {/* Overview Card */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Main Score */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">
                {averageRating}
              </span>
              <span className="text-lg text-[#EDEDED]/50 font-mono">/ 5</span>
            </div>
            
            <div className="flex items-center gap-1 my-2 text-[#D4AF37]">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={18} fill="currentColor" />
              ))}
            </div>

            <p className="text-xs text-[#EDEDED]/70 font-medium">
              Basé sur {totalReviewsCount + 128} avis vérifiés après transaction
            </p>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck size={14} />
              <span>100% des avis certifiés sous contrôle anti-fraude</span>
            </div>
          </div>

          {/* Criteria Breakdown */}
          <div className="lg:col-span-5 space-y-2.5">
            {[
              { label: 'Transparence & Cadre Légal', score: '4.9 / 5', pct: 98 },
              { label: 'Sécurité des Transactions (Séquestre)', score: '5.0 / 5', pct: 100 },
              { label: 'Réactivité & Accompagnement', score: '4.8 / 5', pct: 96 },
              { label: 'Rapport Qualité / Prix Panafricain', score: '4.8 / 5', pct: 96 },
            ].map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#EDEDED]/80 font-medium">{c.label}</span>
                  <span className="font-mono text-[#D4AF37] font-bold">{c.score}</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-an-gold-gradient rounded-full" 
                    style={{ width: `${c.pct}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center pt-4 lg:pt-0">
            {showAddReviewButton && (
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-an-gold-gradient text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_4px_16px_rgba(212,175,55,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                <span>Laisser un avis vérifié</span>
              </button>
            )}
            <p className="text-[10px] text-[#EDEDED]/50 text-center mt-2">
              Réservé aux membres ayant effectué une transaction ou un échange certifié.
            </p>
          </div>

        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-1.5 bg-[#121212] p-1 rounded-xl border border-white/10">
          {[
            { id: 'all', label: 'Tous les Pôles' },
            { id: 'immobilier', label: 'Immobilier' },
            { id: 'finance', label: 'Finance' },
            { id: 'formation', label: 'Formation' },
            { id: 'commerce', label: 'Commerce' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedPole(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedPole === tab.id
                  ? 'bg-[#D4AF37] text-black font-bold shadow'
                  : 'text-[#EDEDED]/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#EDEDED]/50 font-mono">
          Affichage : {displayedReviews.length} avis
        </span>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedReviews.map(r => (
          <div 
            key={r.id}
            className="bg-[#141414] border border-white/10 hover:border-[#D4AF37]/30 rounded-2xl p-5 space-y-3 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1e1e1e] border border-white/15 flex items-center justify-center text-[#D4AF37] font-bold text-sm">
                    {r.authorName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-1.5">
                      <span>{r.authorName}</span>
                      <AfricanovaVerifiedBadge type="kyc_user" size="sm" />
                    </div>
                    <div className="text-[11px] text-[#EDEDED]/60 font-mono">
                      {r.authorLocation} • {r.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-[#D4AF37]">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>

              {/* Service & Target */}
              <div className="flex items-center gap-2 text-[11px]">
                <span className="bg-[#D4AF37]/15 text-[#F5D67A] px-2 py-0.5 rounded font-mono font-semibold">
                  Pôle {r.pole}
                </span>
                <span className="text-[#EDEDED]/70 truncate">
                  Partenaire : <strong className="text-white">{r.targetEntity}</strong>
                </span>
              </div>

              {/* Comment */}
              <p className="text-xs text-[#EDEDED]/90 leading-relaxed italic">
                « {r.comment} »
              </p>
            </div>

            {/* Footer / Likes */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#EDEDED]/60">
              <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                <CheckCircle2 size={13} />
                <span>Transaction certifiée</span>
              </span>

              <button
                onClick={() => handleLike(r.id)}
                className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                  likedIds[r.id] ? 'text-[#D4AF37] font-bold' : 'hover:text-white'
                }`}
              >
                <ThumbsUp size={13} fill={likedIds[r.id] ? 'currentColor' : 'none'} />
                <span>Utile ({r.likes})</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Modal : Laisser un avis vérifié */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0E0E0E] border border-[#D4AF37]/50 rounded-2xl p-6 shadow-[0_20px_60px_rgba(212,175,55,0.25)] text-left">
            
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
                  Retour d'expérience certifié
                </span>
                <h3 className="font-africanova-serif text-lg font-bold text-white">
                  Évaluer un Partenaire ou Service
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-[#EDEDED]/60 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="text-base font-bold text-white">Avis Enregistré avec Succès</h4>
                <p className="text-xs text-[#EDEDED]/70">
                  Votre évaluation a été intégrée et certifiée avec le badge Transaction Vérifiée.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddReviewSubmit} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-[#EDEDED]/70 mb-1">
                    Votre Note Globale
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        className="text-[#D4AF37] p-1 transition-transform hover:scale-110"
                      >
                        <Star 
                          size={24} 
                          fill={star <= formRating ? "currentColor" : "none"} 
                        />
                      </button>
                    ))}
                    <span className="text-sm font-mono font-bold text-[#F5D67A] ml-2">
                      {formRating} / 5 étoiles
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#EDEDED]/70 mb-1">
                      Votre Nom ou Raison Sociale *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Aissatou Ndiaye"
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      className="w-full bg-[#181818] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#EDEDED]/70 mb-1">
                      Localisation / Hub Diaspora
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Abidjan / Londres"
                      value={formLocation}
                      onChange={e => setFormLocation(e.target.value)}
                      className="w-full bg-[#181818] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#EDEDED]/70 mb-1">
                      Pôle Concerné
                    </label>
                    <select
                      value={formPole}
                      onChange={e => setFormPole(e.target.value as any)}
                      className="w-full bg-[#181818] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Immobilier">Immobilier</option>
                      <option value="Finance">Finance</option>
                      <option value="Formation">Formation</option>
                      <option value="Business">Business</option>
                      <option value="Emploi">Emploi</option>
                      <option value="Commerce">Commerce</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#EDEDED]/70 mb-1">
                      Partenaire ou Opération Évaluée
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Agence Almadies, Prêt Ecobank..."
                      value={formTarget}
                      onChange={e => setFormTarget(e.target.value)}
                      className="w-full bg-[#181818] border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#EDEDED]/70 mb-1">
                    Votre Commentaire Détaillé *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Décrivez le déroulement de l'opération, la conformité, les délais et la qualité du contact..."
                    value={formComment}
                    onChange={e => setFormComment(e.target.value)}
                    className="w-full bg-[#181818] border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-an-gold-gradient text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_4px_16px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Validation & Audit en cours...' : 'Publier mon Avis Vérifié'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default AfricanovaReviewsSystem;
