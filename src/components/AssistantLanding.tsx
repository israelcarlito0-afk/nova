import React, { useState } from 'react';
import { AfricanovaNav } from './AfricanovaNav';
import { AfricanovaHome } from './AfricanovaHome';
import { AfricanovaBrandModal } from './AfricanovaBrandModal';
import { AfricanovaPoleModal } from './AfricanovaPoleModal';
import { AfricanovaPartnerModal } from './AfricanovaPartnerModal';
import { AfricanovaMemberModal } from './AfricanovaMemberModal';
import { AgentNova } from './AgentNova';
import { AfricanovaAuthModal } from './AfricanovaAuthModal';
import { AfricanovaListingModal } from './AfricanovaListingModal';

interface AssistantLandingProps {
  onEnter: (language: 'fr' | 'en' | 'sw') => void;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
}

export default function AssistantLanding({ 
  onEnter, 
  favoritesCount = 0,
  onOpenFavorites 
}: AssistantLandingProps) {
  // Modal states
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [showAgentNova, setShowAgentNova] = useState(false);
  const [selectedPoleId, setSelectedPoleId] = useState<string | null>(null);
  const [selectedSubSectionId, setSelectedSubSectionId] = useState<string | null>(null);

  const handleSelectPole = (poleId: string, subSectionId?: string) => {
    // If it's real estate direct listing explorer
    if (poleId === 'immobilier' && subSectionId === 'annonces') {
      onEnter('fr');
      return;
    }
    setSelectedPoleId(poleId);
    setSelectedSubSectionId(subSectionId || null);
  };

  const handleOpenAgentNovaWithPrompt = (prompt?: string) => {
    setShowAgentNova(true);
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#EDEDED]">
      {/* Barre de navigation fixe (2.4 de la structure) */}
      <AfricanovaNav
        onSelectPole={handleSelectPole}
        onOpenMemberSpace={() => setShowAuthModal(true)}
        onOpenBrandGuide={() => setShowBrandModal(true)}
        onOpenPartnerModal={() => setShowPartnerModal(true)}
        onOpenRealEstateExplorer={() => onEnter('fr')}
        onOpenAgentNova={() => setShowAgentNova(true)}
        onOpenListingModal={() => setShowListingModal(true)}
        favoritesCount={favoritesCount}
        onOpenFavorites={onOpenFavorites}
        currentActivePole={selectedPoleId}
      />

      {/* Page d'accueil officielle AFRICANOVA avec les 7 sections */}
      <AfricanovaHome
        onSelectPole={handleSelectPole}
        onOpenBrandGuide={() => setShowBrandModal(true)}
        onOpenPartnerModal={() => setShowPartnerModal(true)}
        onOpenMemberSpace={() => setShowAuthModal(true)}
        onOpenRealEstateExplorer={() => onEnter('fr')}
        onOpenAgentNova={handleOpenAgentNovaWithPrompt}
        onOpenListingModal={() => setShowListingModal(true)}
      />

      {/* AGENT NOVA - 7ÈME SERVICE TRANSVERSE (Bouton flottant & tiroir IA) */}
      <AgentNova
        isOpen={showAgentNova}
        onToggle={() => setShowAgentNova(!showAgentNova)}
        onNavigateToPole={(poleId) => {
          setSelectedPoleId(poleId);
        }}
        onOpenRealEstateExplorer={() => {
          setShowAgentNova(false);
          onEnter('fr');
        }}
        activePoleContext={selectedPoleId || undefined}
      />

      {/* Modal 1: Charte Graphique & les 5 déclinaisons officielles du logo */}
      <AfricanovaBrandModal
        isOpen={showBrandModal}
        onClose={() => setShowBrandModal(false)}
      />

      {/* Modal 2: Détail du Pôle & Outils Interactifs (Simulateur, Formations, Emploi...) */}
      <AfricanovaPoleModal
        poleId={selectedPoleId}
        initialSubSectionId={selectedSubSectionId}
        onClose={() => {
          setSelectedPoleId(null);
          setSelectedSubSectionId(null);
        }}
        onOpenRealEstate={() => {
          setSelectedPoleId(null);
          onEnter('fr');
        }}
      />

      {/* Modal 3: Devenir Partenaire Agréé AFRICANOVA & Hub APIs / Lettres */}
      <AfricanovaPartnerModal
        isOpen={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
        onOpenAgentNova={() => setShowAgentNova(true)}
      />

      {/* Modal 4: Espace Membre (Tableau de Bord) */}
      <AfricanovaMemberModal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        onOpenRealEstate={() => {
          setShowMemberModal(false);
          onEnter('fr');
        }}
      />

      {/* Modal 5: Authentification (Connexion & Inscription) */}
      <AfricanovaAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(user) => {
          setShowMemberModal(true);
        }}
      />

      {/* Modal 6: Dépôt d'Opportunité avec Audit IA Nova */}
      <AfricanovaListingModal
        isOpen={showListingModal}
        onClose={() => setShowListingModal(false)}
        defaultPoleId={selectedPoleId || 'immobilier'}
        onListingCreated={(listing) => {
          console.log('Listing created:', listing);
        }}
      />
    </div>
  );
}
