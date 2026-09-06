import React, { useState } from 'react';
import { 
  X, User, Shield, Briefcase, MessageSquare, Settings, 
  TrendingUp, Bell, CheckCircle2, Building, DollarSign, 
  FileText, LogOut, ArrowRight, Eye, Sparkles
} from 'lucide-react';
import { AfricanovaLogo } from './AfricanovaLogo';

interface AfricanovaMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRealEstate?: () => void;
}

type UserRole = 'investisseur' | 'partenaire' | 'admin';

export const AfricanovaMemberModal: React.FC<AfricanovaMemberModalProps> = ({
  isOpen,
  onClose,
  onOpenRealEstate,
}) => {
  const [role, setRole] = useState<UserRole>('investisseur');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'messages' | 'settings'>('dashboard');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0A0A0A] border border-[#D4AF37]/40 rounded-2xl shadow-[0_15px_60px_rgba(212,175,55,0.25)] overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 bg-[#161616] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <User size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-africanova-serif font-bold text-white text-lg">
                  Kofi Mensah
                </span>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Compte Vérifié KYC
                </span>
              </div>
              <p className="text-xs text-[#EDEDED]/70 font-mono">ID Membre: AN-2026-8942 • Hub Diaspora Paris / Abidjan</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role switch simulation for 2.3 Parcours utilisateurs */}
            <div className="bg-black/60 p-1 rounded-xl border border-white/10 flex gap-1">
              {[
                { id: 'investisseur', label: 'Investisseur' },
                { id: 'partenaire', label: 'Partenaire Pro' },
                { id: 'admin', label: 'Admin' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id as UserRole)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    role === r.id
                      ? 'bg-[#D4AF37] text-black shadow'
                      : 'text-[#EDEDED]/70 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#EDEDED]/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Member Space Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-[#0A0A0A] px-6">
          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: <TrendingUp size={14} /> },
            { id: 'messages', label: 'Messagerie & Alertes (3)', icon: <MessageSquare size={14} /> },
            { id: 'settings', label: 'Paramètres du compte', icon: <Settings size={14} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#D4AF37] text-[#F5D67A] bg-white/[0.02]'
                  : 'border-transparent text-[#EDEDED]/60 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Member Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          
          {/* TAB 1 : TABLEAU DE BORD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Metrics bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#161616] border border-[#D4AF37]/30 p-4 rounded-xl">
                  <div className="text-[11px] text-[#EDEDED]/60 font-medium">Portefeuille Engagé</div>
                  <div className="text-xl font-black text-[#F5D67A] font-mono mt-1">125 000 $</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">+12.4% rendement annuel</div>
                </div>

                <div className="bg-[#161616] border border-white/10 p-4 rounded-xl">
                  <div className="text-[11px] text-[#EDEDED]/60 font-medium">Biens Immobiliers Suivis</div>
                  <div className="text-xl font-black text-white font-mono mt-1">4 mandats</div>
                  <div className="text-[10px] text-[#D4AF37] mt-0.5">Abidjan, Dakar, Douala</div>
                </div>

                <div className="bg-[#161616] border border-white/10 p-4 rounded-xl">
                  <div className="text-[11px] text-[#EDEDED]/60 font-medium">Formations & Certificats</div>
                  <div className="text-xl font-black text-white font-mono mt-1">2 Certifications</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">100% validées</div>
                </div>

                <div className="bg-[#161616] border border-white/10 p-4 rounded-xl">
                  <div className="text-[11px] text-[#EDEDED]/60 font-medium">Dossier Prêt Partenaire</div>
                  <div className="text-xl font-black text-emerald-400 font-mono mt-1">Pré-approuvé</div>
                  <div className="text-[10px] text-[#EDEDED]/60 mt-0.5">Banque UBA Côte d'Ivoire</div>
                </div>
              </div>

              {/* Specific role actions */}
              {role === 'investisseur' && (
                <div className="bg-[#161616] border border-white/10 p-5 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles size={16} className="text-[#D4AF37]" />
                      <span>Recommandations Personnalisées pour Investisseur</span>
                    </h3>
                    {onOpenRealEstate && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenRealEstate();
                        }}
                        className="text-xs text-[#F5D67A] hover:underline flex items-center gap-1"
                      >
                        <span>Catalogue Complet</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-black/40 border border-white/10 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">Duplex Almadies Dakar</div>
                        <div className="text-[10px] text-emerald-400 font-mono">Score Investissement: 9.6/10 • Rendement 12.8%</div>
                      </div>
                      <span className="text-xs font-bold text-[#F5D67A] font-mono">240 000 $</span>
                    </div>

                    <div className="p-3 bg-black/40 border border-white/10 rounded-lg flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">Obligation Panafricaine Énergie Solaire</div>
                        <div className="text-[10px] text-emerald-400 font-mono">Ticket minimum : 10 000 $ • Coupon 8.5%</div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 font-mono">Émission 2026</span>
                    </div>
                  </div>
                </div>
              )}

              {role === 'partenaire' && (
                <div className="bg-[#161616] border border-emerald-500/30 p-5 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <Building size={16} />
                      <span>Espace Partenaire Pro — Gestion des Mandats & Leads</span>
                    </h3>
                    <span className="text-xs font-mono text-[#D4AF37]">Statut: Agréé Gold</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-black/50 rounded-lg border border-white/10">
                      <div className="text-lg font-black text-white font-mono">38</div>
                      <div className="text-[10px] text-[#EDEDED]/70">Leads Acheteurs Reçus</div>
                    </div>
                    <div className="p-3 bg-black/50 rounded-lg border border-white/10">
                      <div className="text-lg font-black text-emerald-400 font-mono">14</div>
                      <div className="text-[10px] text-[#EDEDED]/70">Visites Virtuelles Réalisées</div>
                    </div>
                    <div className="p-3 bg-black/50 rounded-lg border border-white/10">
                      <div className="text-lg font-black text-[#F5D67A] font-mono">4.9 / 5</div>
                      <div className="text-[10px] text-[#EDEDED]/70">Avis Clients Vérifiés</div>
                    </div>
                  </div>
                </div>
              )}

              {role === 'admin' && (
                <div className="bg-[#161616] border border-[#D4AF37]/50 p-5 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#F5D67A] uppercase tracking-wider flex items-center gap-2">
                      <Shield size={16} />
                      <span>Console d'Administration Panafricaine AFRICANOVA</span>
                    </h3>
                    <span className="text-xs font-mono bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Super Admin</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 bg-black/50 rounded-lg border border-white/10">
                      <div className="text-lg font-black text-white font-mono">250 412</div>
                      <div className="text-[10px] text-[#EDEDED]/70">Utilisateurs Inscrits</div>
                    </div>
                    <div className="p-3 bg-black/50 rounded-lg border border-white/10">
                      <div className="text-lg font-black text-emerald-400 font-mono">18 420</div>
                      <div className="text-[10px] text-[#EDEDED]/70">Annonces & Biens Actifs</div>
                    </div>
                    <div className="p-3 bg-black/50 rounded-lg border border-white/10">
                      <div className="text-lg font-black text-[#F5D67A] font-mono">12</div>
                      <div className="text-[10px] text-[#EDEDED]/70">Dossiers KYC en attente</div>
                    </div>
                    <div className="p-3 bg-black/50 rounded-lg border border-white/10">
                      <div className="text-lg font-black text-emerald-400 font-mono">99.98%</div>
                      <div className="text-[10px] text-[#EDEDED]/70">Disponibilité Plateforme</div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2 : MESSAGERIE */}
          {activeTab === 'messages' && (
            <div className="space-y-3">
              {[
                {
                  from: 'Conseiller Privé AFRICANOVA (Abidjan)',
                  time: 'Il y a 20 min',
                  title: 'Offre contre-signée pour la Villa Cocody',
                  snippet: 'Le notaire a confirmé la conformité du titre foncier ACD. Vous pouvez consulter les actes...',
                  unread: true,
                },
                {
                  from: 'Banque Partenaire UBA',
                  time: 'Il y a 3 heures',
                  title: 'Accord de principe pour financement diaspora',
                  snippet: 'Votre dossier n° CI-2026-78 a reçu un avis favorable au taux négocié de 6.75%...',
                  unread: true,
                },
                {
                  from: 'AFRICANOVA Academy',
                  time: 'Hier',
                  title: 'Attestation de Réussite Cursus Montage Financier',
                  snippet: 'Félicitations, votre certificat officiel blockchain est maintenant disponible en téléchargement...',
                  unread: false,
                },
              ].map((msg, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    msg.unread 
                      ? 'bg-[#161616] border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                      : 'bg-black/40 border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      {msg.unread && <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
                      {msg.from}
                    </span>
                    <span className="text-[10px] text-[#6B6B6B] font-mono">{msg.time}</span>
                  </div>
                  <div className="text-xs font-semibold text-[#F5D67A]">{msg.title}</div>
                  <p className="text-xs text-[#EDEDED]/70 mt-1">{msg.snippet}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3 : PARAMÈTRES */}
          {activeTab === 'settings' && (
            <div className="bg-[#161616] p-6 rounded-xl border border-white/10 space-y-4 max-w-xl">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Paramètres de Sécurité & Notifications
              </h4>
              <div className="space-y-3 text-xs text-[#EDEDED]">
                <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/10">
                  <span>Authentification à double facteur (2FA)</span>
                  <span className="text-emerald-400 font-bold">Activée</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/10">
                  <span>Alertes nouvelles opportunités par WhatsApp</span>
                  <span className="text-emerald-400 font-bold">Oui (+225)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/10">
                  <span>Devise d'affichage principale</span>
                  <span className="text-[#F5D67A] font-bold font-mono">USD ($) / FCFA</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#161616] border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold"
          >
            <LogOut size={14} />
            <span>Fermer la session</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-an-gold-gradient text-black rounded-xl text-xs font-bold uppercase tracking-wider hover:brightness-110 cursor-pointer"
          >
            Continuer la navigation
          </button>
        </div>

      </div>
    </div>
  );
};

export default AfricanovaMemberModal;
