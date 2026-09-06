import React from 'react';
import { AfricanovaCollaborationHub } from './AfricanovaCollaborationHub';

interface AfricanovaPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'letters' | 'apis' | 'apply';
  onOpenAgentNova?: () => void;
}

export const AfricanovaPartnerModal: React.FC<AfricanovaPartnerModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'letters',
  onOpenAgentNova,
}) => {
  return (
    <AfricanovaCollaborationHub
      isOpen={isOpen}
      onClose={onClose}
      initialTab={initialTab}
      onOpenAgentNova={onOpenAgentNova}
    />
  );
};

export default AfricanovaPartnerModal;
