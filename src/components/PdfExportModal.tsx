import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Download, CheckCircle2, Building2, PieChart, X, Sparkles, ShieldCheck } from 'lucide-react';
import { Property } from '../types';
import { Transaction } from '../services/transactionService';
import { generatePdfReport } from '../services/pdfReportService';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  userWallet: any;
  savedProperties: Property[];
  transactions: Transaction[];
  lang: 'fr' | 'en' | 'sw';
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  userWallet,
  savedProperties,
  transactions,
  lang
}) => {
  const [includeFavorites, setIncludeFavorites] = useState(true);
  const [includeTransactions, setIncludeTransactions] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const propsToExport = includeFavorites ? savedProperties : [];
      const txsToExport = includeTransactions ? transactions : [];

      generatePdfReport({
        userEmail: currentUser?.email || 'guest@immoai.africa',
        userName: currentUser?.displayName || 'Investisseur ImmoAI',
        walletBalance: userWallet?.balance || 0,
        savedProperties: propsToExport,
        transactions: txsToExport,
        lang
      });

      setIsGenerating(false);
      setIsDone(true);
      setTimeout(() => {
        setIsDone(false);
        onClose();
      }, 1800);
    }, 600);
  };

  const isFr = lang === 'fr';
  const isEn = lang === 'en';

  const totalSavedValue = savedProperties.reduce((acc, p) => acc + p.price, 0);
  const totalTxVolume = transactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-dark-bg border border-white/10 rounded-[36px] shadow-2xl overflow-hidden p-6 md:p-8"
        >
          {/* Top Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand/20 rounded-2xl flex items-center justify-center text-brand border border-brand/30">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-white uppercase tracking-tight">
                  {isFr ? "Exporter Rapport PDF" : isEn ? "Export PDF Report" : "Hamisha Ripoti ya PDF"}
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  {isFr 
                    ? "Téléchargez un relevé complet de vos favoris et transactions" 
                    : isEn 
                    ? "Download a complete summary of your saved items & transactions" 
                    : "Pakua muhtasari wa nyumba zako na miamala"}
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-2.5 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Profile Overview Header */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand/10 text-brand rounded-xl flex items-center justify-center font-bold text-sm">
                {(currentUser?.displayName || 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-white text-sm font-bold truncate max-w-[200px]">
                  {currentUser?.displayName || 'Investisseur ImmoAI'}
                </p>
                <p className="text-gray-400 text-[11px] truncate max-w-[200px]">
                  {currentUser?.email || 'guest@immoai.africa'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Solde Wallet</span>
              <span className="text-brand font-black text-sm">${userWallet?.balance ? userWallet.balance.toLocaleString() : '0'}</span>
            </div>
          </div>

          {/* Options Selection */}
          <div className="space-y-3 mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              {isFr ? "Contenu à inclure" : isEn ? "Content to Include" : "Mambo ya kujumuisha"}
            </p>

            {/* Option 1: Saved Properties */}
            <label 
              onClick={() => setIncludeFavorites(!includeFavorites)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                includeFavorites 
                  ? 'bg-brand/10 border-brand/40 text-white' 
                  : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${includeFavorites ? 'bg-brand text-white' : 'bg-white/10 text-gray-400'}`}>
                  <Building2 size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {isFr ? "Biens Immobiliers Enregistrés" : isEn ? "Saved Properties List" : "Orodha ya Nyumba Zilizohifadhiwa"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {savedProperties.length} {isFr ? "biens" : "items"} (${totalSavedValue.toLocaleString()})
                  </p>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                includeFavorites ? 'bg-brand border-brand text-white' : 'border-gray-500'
              }`}>
                {includeFavorites && <CheckCircle2 size={14} />}
              </div>
            </label>

            {/* Option 2: Transactions */}
            <label 
              onClick={() => setIncludeTransactions(!includeTransactions)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                includeTransactions 
                  ? 'bg-brand/10 border-brand/40 text-white' 
                  : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${includeTransactions ? 'bg-brand text-white' : 'bg-white/10 text-gray-400'}`}>
                  <PieChart size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {isFr ? "Historique des Transactions" : isEn ? "Transaction History" : "Historia ya Miamala"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {transactions.length} {isFr ? "transactions enregistrées" : "transactions"} (${totalTxVolume.toLocaleString()})
                  </p>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                includeTransactions ? 'bg-brand border-brand text-white' : 'border-gray-500'
              }`}>
                {includeTransactions && <CheckCircle2 size={14} />}
              </div>
            </label>
          </div>

          {/* Action Button */}
          <button
            onClick={handleExport}
            disabled={(!includeFavorites && !includeTransactions) || isGenerating}
            className="w-full bg-brand text-white py-4 rounded-2xl font-bold text-base hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{isFr ? "Génération du PDF..." : "Generating PDF..."}</span>
              </>
            ) : isDone ? (
              <>
                <CheckCircle2 size={20} className="text-green-400" />
                <span>{isFr ? "Document Téléchargé !" : "Document Downloaded!"}</span>
              </>
            ) : (
              <>
                <Download size={20} />
                <span>{isFr ? "Générer & Télécharger PDF" : "Generate & Download PDF"}</span>
              </>
            )}
          </button>

          {/* Footer note */}
          <p className="text-[10px] text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
            <ShieldCheck size={12} className="text-brand" />
            <span>
              {isFr ? "Document officiel sécurisé ImmoAI Africa - Format PDF standard A4" : "Official secure ImmoAI Africa report - Standard A4 PDF"}
            </span>
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
