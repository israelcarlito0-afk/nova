import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Award, Building, ExternalLink, X, FileCheck, Landmark, Check } from 'lucide-react';

export type VerifiedBadgeType = 'gold_pro' | 'kyc_user' | 'bank_partner' | 'university' | 'escrow_seller';

interface AfricanovaVerifiedBadgeProps {
  type?: VerifiedBadgeType;
  entityName?: string;
  size?: 'sm' | 'md' | 'lg';
  showPopoverOnClick?: boolean;
  className?: string;
}

export const AfricanovaVerifiedBadge: React.FC<AfricanovaVerifiedBadgeProps> = ({
  type = 'gold_pro',
  entityName = 'Partenaire Agréé',
  size = 'md',
  showPopoverOnClick = true,
  className = '',
}) => {
  const [showModal, setShowModal] = useState(false);

  const badgeConfig = {
    gold_pro: {
      label: 'Partenaire Agréé Gold',
      shortLabel: 'Agréé Gold',
      bg: 'bg-[#D4AF37]/15 text-[#F5D67A] border-[#D4AF37]/40 hover:bg-[#D4AF37]/25',
      icon: <ShieldCheck size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} className="text-[#D4AF37]" />,
      description: 'Entité légale auditée par AFRICANOVA. Titres fonciers, solvabilité financière et statut juridique vérifiés sous contrôle OHADA.',
      authority: 'Comité de Certification Panafricain AFRICANOVA',
      registryId: 'AN-CERT-2026-8849-OHADA',
    },
    kyc_user: {
      label: 'Identité Vérifiée KYC',
      shortLabel: 'Vérifié KYC',
      bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25',
      icon: <CheckCircle2 size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} className="text-emerald-400" />,
      description: 'Pièce d\'identité officielle (CNI ou Passeport biométrique) et justificatif de domicile validés avec reconnaissance faciale.',
      authority: 'AFRICANOVA Identity Trust Network',
      registryId: 'AN-KYC-CIV-9281',
    },
    bank_partner: {
      label: 'Banque Partenaire Agréée',
      shortLabel: 'Banque Agréée',
      bg: 'bg-blue-500/15 text-blue-400 border-blue-500/40 hover:bg-blue-500/25',
      icon: <Landmark size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} className="text-blue-400" />,
      description: 'Établissement de crédit agréé par la Banque Centrale (BCEAO, BEAC, Bank of Tanzania) avec simulateur API certifié.',
      authority: 'Commission Bancaire Régionale',
      registryId: 'AN-BANK-ECO-2026',
    },
    university: {
      label: 'Établissement Reconnu CAMES / État',
      shortLabel: 'Université Reconnue',
      bg: 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25',
      icon: <Award size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} className="text-amber-400" />,
      description: 'Université ou Grande École délivrant des diplômes et certifications académiques accrédités à l\'échelle continentale.',
      authority: 'Ministère de l\'Enseignement Supérieur & CAMES',
      registryId: 'AN-UNIV-ACCRED-402',
    },
    escrow_seller: {
      label: 'Vendeur Certifié Séquestre ZLECAf',
      shortLabel: 'Vendeur Séquestre',
      bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25',
      icon: <Check size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} className="text-emerald-400" />,
      description: 'Fonds bloqués sur compte séquestre bancaire jusqu\'à validation de la réception des marchandises sous règles ZLECAf.',
      authority: 'AFRICANOVA Escrow Protocol',
      registryId: 'AN-ESCROW-B2B-190',
    },
  }[type];

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (showPopoverOnClick) setShowModal(true);
        }}
        title="Cliquer pour afficher l'attestation de vérification officielle"
        className={`inline-flex items-center font-semibold rounded-lg border transition-all cursor-pointer ${badgeConfig.bg} ${sizeClasses} ${className}`}
      >
        {badgeConfig.icon}
        <span>{size === 'sm' ? badgeConfig.shortLabel : badgeConfig.label}</span>
      </button>

      {/* Modal / Popover d'attestation de vérification */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
        >
          <div 
            className="relative w-full max-w-md bg-[#0D0D0D] border border-[#D4AF37]/50 rounded-2xl p-6 shadow-[0_20px_60px_rgba(212,175,55,0.2)] text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  {badgeConfig.icon}
                </div>
                <div>
                  <div className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
                    Certificat de Conformité
                  </div>
                  <h4 className="font-africanova-serif text-base font-bold text-white">
                    {badgeConfig.label}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-[#EDEDED]/60 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="mt-4 space-y-4 text-xs text-[#EDEDED]/80">
              <div className="p-3 bg-black/60 rounded-xl border border-white/10">
                <div className="text-[10px] text-[#EDEDED]/50 uppercase font-mono">Entité vérifiée</div>
                <div className="text-sm font-bold text-white mt-0.5">{entityName}</div>
                <div className="text-[11px] text-emerald-400 font-mono mt-0.5">Statut : Actif & Conforme 2026</div>
              </div>

              <p className="leading-relaxed">
                {badgeConfig.description}
              </p>

              {/* Checkpoints */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Registre de Commerce & NIF contrôlés</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Titres fonciers / Attestations d'agrément authentifiés</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Garantie anti-fraude & Séquestre AFRICANOVA actif</span>
                </div>
              </div>

              {/* ID & Authority */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#EDEDED]/60">
                <span>Réf: {badgeConfig.registryId}</span>
                <span className="text-[#D4AF37]">Audit 2026</span>
              </div>
            </div>

            {/* Action */}
            <div className="mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Fermer l'attestation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AfricanovaVerifiedBadge;
