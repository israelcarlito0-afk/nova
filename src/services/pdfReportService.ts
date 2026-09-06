import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Property } from '../types';
import { Transaction } from './transactionService';

export interface ReportExportOptions {
  userEmail?: string;
  userName?: string;
  walletBalance?: number;
  savedProperties: Property[];
  transactions: Transaction[];
  lang?: 'fr' | 'en' | 'sw';
}

export function generatePdfReport({
  userEmail = 'Utilisateur ImmoAI',
  userName = 'Investisseur',
  walletBalance = 0,
  savedProperties = [],
  transactions = [],
  lang = 'fr'
}: ReportExportOptions) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const isFr = lang === 'fr';
  const isEn = lang === 'en';

  const dateStr = new Date().toLocaleDateString(
    isFr ? 'fr-FR' : isEn ? 'en-US' : 'sw-KE',
    { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  );

  // --- Primary Colors ---
  const brandRed: [number, number, number] = [230, 57, 70]; // #E63946
  const darkBg: [number, number, number] = [18, 18, 18]; // #121212
  const textDark: [number, number, number] = [30, 30, 30];
  const textGray: [number, number, number] = [100, 100, 100];
  const lightBg: [number, number, number] = [245, 247, 250];

  let currentY = 15;

  // Header Banner
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, 210, 42, 'F');

  // Brand Accent Line
  doc.setFillColor(...brandRed);
  doc.rect(0, 41, 210, 2, 'F');

  // Title in Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('IMMOAI AFRICA', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  const subtitle = isFr 
    ? "Rapport d'Investissement Immobilier & Historique Financier" 
    : isEn 
    ? "Real Estate Investment & Financial History Report"
    : "Ripoti ya Uwekezaji wa Majengo na Historia ya Fedha";
  doc.text(subtitle, 14, 26);

  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text(`${isFr ? 'Généré le' : 'Generated on'}: ${dateStr}`, 14, 34);

  // User details on right side of header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(230, 57, 70);
  doc.text(userName, 196, 18, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.text(userEmail, 196, 25, { align: 'right' });

  currentY = 50;

  // --- EXECUTIVE SUMMARY CARDS ---
  doc.setTextColor(...textDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(isFr ? 'Synthèse du Portefeuille' : 'Portfolio Executive Summary', 14, currentY);

  currentY += 6;

  const totalSavedValue = savedProperties.reduce((acc, p) => acc + p.price, 0);
  const totalTxVolume = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalNet = transactions.reduce((acc, t) => acc + t.net, 0);

  // Draw 3 Summary Cards
  const cardWidth = 56;
  const cardHeight = 22;
  const cardGap = 5;

  const cards = [
    { 
      label: isFr ? 'Solde Wallet' : 'Wallet Balance', 
      val: `$${walletBalance.toLocaleString()}`,
      color: brandRed 
    },
    { 
      label: isFr ? 'Biens Enregistrés' : 'Saved Properties', 
      val: `${savedProperties.length} ($${(totalSavedValue / 1000).toFixed(0)}k)`,
      color: textDark 
    },
    { 
      label: isFr ? 'Volume Transactions' : 'Transaction Volume', 
      val: `$${totalTxVolume.toLocaleString()}`,
      color: textDark 
    }
  ];

  cards.forEach((c, idx) => {
    const x = 14 + idx * (cardWidth + cardGap);
    doc.setFillColor(...lightBg);
    doc.roundedRect(x, currentY, cardWidth, cardHeight, 3, 3, 'F');

    doc.setFillColor(...c.color);
    doc.rect(x, currentY, 2, cardHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...textGray);
    doc.text(c.label.toUpperCase(), x + 6, currentY + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...c.color);
    doc.text(c.val, x + 6, currentY + 16);
  });

  currentY += cardHeight + 12;

  // --- SECTION 1: SAVED PROPERTIES LIST ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...textDark);
  doc.text(
    isFr 
      ? `1. Liste des Biens Favoris (${savedProperties.length})` 
      : `1. Saved Properties List (${savedProperties.length})`,
    14, 
    currentY
  );

  currentY += 4;

  if (savedProperties.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...textGray);
    doc.text(
      isFr ? 'Aucun bien enregistré dans vos favoris.' : 'No saved properties in your favorites list.',
      14,
      currentY + 6
    );
    currentY += 14;
  } else {
    const propertyRows = savedProperties.map((p, idx) => [
      (idx + 1).toString(),
      p.title,
      p.location,
      p.category,
      `$${p.price.toLocaleString()}`,
      `${p.beds} ch / ${p.baths} sdb / ${p.sqm} m²`,
      p.aiEstimate?.investment_score ? `${p.aiEstimate.investment_score}/10` : 'N/A'
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [[
        '#', 
        isFr ? 'Titre du bien' : 'Property Title', 
        isFr ? 'Localisation' : 'Location', 
        'Catégorie', 
        isFr ? 'Prix ($)' : 'Price ($)', 
        'Détails', 
        'Score IA'
      ]],
      body: propertyRows,
      theme: 'grid',
      headStyles: {
        fillColor: brandRed,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'left'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [40, 40, 40]
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250]
      },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 45 },
        2: { cellWidth: 45 },
        3: { cellWidth: 22 },
        4: { cellWidth: 25, fontStyle: 'bold' },
        5: { cellWidth: 25 },
        6: { cellWidth: 15, halign: 'center' }
      },
      margin: { left: 14, right: 14 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;
  }

  // Check if we need a new page for transactions section
  if (currentY > 220) {
    doc.addPage();
    currentY = 20;
  }

  // --- SECTION 2: TRANSACTION HISTORY ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...textDark);
  doc.text(
    isFr 
      ? `2. Historique des Transactions (${transactions.length})` 
      : `2. Transaction History (${transactions.length})`,
    14, 
    currentY
  );

  currentY += 4;

  if (transactions.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...textGray);
    doc.text(
      isFr ? 'Aucune transaction enregistrée.' : 'No transactions recorded yet.',
      14,
      currentY + 6
    );
    currentY += 14;
  } else {
    const txRows = transactions.map((t, idx) => {
      let dateText = 'N/A';
      if (t.createdAt) {
        if (typeof t.createdAt.toDate === 'function') {
          dateText = t.createdAt.toDate().toLocaleDateString(isFr ? 'fr-FR' : 'en-US');
        } else if (t.createdAt.seconds) {
          dateText = new Date(t.createdAt.seconds * 1000).toLocaleDateString(isFr ? 'fr-FR' : 'en-US');
        } else if (typeof t.createdAt === 'string' || typeof t.createdAt === 'number') {
          dateText = new Date(t.createdAt).toLocaleDateString(isFr ? 'fr-FR' : 'en-US');
        }
      }

      const formattedType = t.type ? t.type.replace('_', ' ').toUpperCase() : 'TRANSACTION';

      return [
        (idx + 1).toString(),
        dateText,
        formattedType,
        `$${t.amount.toLocaleString()}`,
        `-$${t.commission.toLocaleString()}`,
        `$${t.net.toLocaleString()}`
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [[
        '#', 
        'Date', 
        'Type', 
        isFr ? 'Montant Brut' : 'Gross Amount', 
        'Com. ImmoAI', 
        isFr ? 'Montant Net' : 'Net Amount'
      ]],
      body: txRows,
      theme: 'grid',
      headStyles: {
        fillColor: darkBg,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'left'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [40, 40, 40]
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250]
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 30 },
        2: { cellWidth: 45 },
        3: { cellWidth: 33, fontStyle: 'bold' },
        4: { cellWidth: 30, textColor: brandRed },
        5: { cellWidth: 34, fontStyle: 'bold', textColor: [34, 139, 34] }
      },
      margin: { left: 14, right: 14 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;
  }

  // --- FOOTER & CERTIFICATION ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 280, 196, 280);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...textGray);
    doc.text(
      "ImmoAI Africa — Plateforme d'Investissement Immobilier Optimisée par l'IA",
      14,
      285
    );

    doc.text(
      `Page ${i} / ${totalPages}`,
      196,
      285,
      { align: 'right' }
    );
  }

  // Save PDF file
  const fileName = `ImmoAI_Rapport_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}
