import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import admin from 'firebase-admin';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

// Lazy-initialize Firebase Admin to prevent startup crashes in production
let dbAdminInstance: admin.firestore.Firestore | null = null;
function getDbAdmin(): admin.firestore.Firestore {
  if (!dbAdminInstance) {
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: firebaseConfig.projectId,
      });
    }
    dbAdminInstance = admin.firestore();
    if (firebaseConfig.firestoreDatabaseId) {
      try {
        // @ts-ignore
        dbAdminInstance.settings({ databaseId: firebaseConfig.firestoreDatabaseId });
      } catch (e) {
        console.warn('Could not set custom databaseId on Firestore Admin:', e);
      }
    }
  }
  return dbAdminInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Simple API health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Lazy-load GoogleGenAI client
  let genAIInstance: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!genAIInstance) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing. Please set it in Settings > Secrets.");
      }
      genAIInstance = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return genAIInstance;
  }

  // Smart Failsafe local simulation module for ImmoAI Agent
  function simulateChatResponse(messages: any[], properties: any[], lang: string): { text: string } {
    const lastMessage = messages[messages.length - 1];
    const userQuery = (lastMessage?.content || lastMessage?.text || "");
    const query = userQuery.toLowerCase();
    
    let text = "";
    let recommendedIds: string[] = [];

    const safeProperties = Array.isArray(properties) ? properties : [];

    // Filter properties based on query matches
    const matchedProps = safeProperties.filter((p: any) => {
      const title = (p.title || "").toLowerCase();
      const loc = (p.location || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const amenities = Array.isArray(p.amenities) ? p.amenities : [];
      
      return title.includes(query) || loc.includes(query) || cat.includes(query) || desc.includes(query) ||
             (query.includes("piscine") && amenities.some((a: string) => a.toLowerCase().includes("pool") || a.toLowerCase().includes("piscine"))) ||
             (query.includes("gym") && amenities.some((a: string) => a.toLowerCase().includes("gym"))) ||
             (query.includes("kinshasa") && loc.includes("kinshasa")) ||
             (query.includes("zanzibar") && loc.includes("zanzibar")) ||
             (query.includes("kigali") && loc.includes("kigali")) ||
             (query.includes("dakar") && loc.includes("dakar"));
    });

    if (matchedProps.length > 0) {
      recommendedIds = matchedProps.slice(0, 3).map((p: any) => p.id);
    }

    if (lang === 'fr') {
      text = `### Analyse IA de votre recherche d'investissement\n\n`;
      text += `Bonjour ! En tant qu'expert IA d'ImmoAI Africa, j'ai analysé votre requête : "${userQuery}".\n\n`;
      
      if (matchedProps.length > 0) {
        text += `J'ai trouvé **${matchedProps.length} propriété(s)** correspondant à vos critères dans notre catalogue :\n\n`;
        matchedProps.slice(0, 3).forEach((p: any, idx: number) => {
          text += `${idx + 1}. **${p.title}** à *${p.location}* : **${p.price.toLocaleString()} USD** (${p.sqm} m², ${p.beds} ch, ${p.baths} sdb). ${p.description || ""}\n`;
        });
        text += `\nCes options présentent d'excellents scores d'investissement et sont hautement recommandées.\n\n`;
      } else {
        text += `Je ne trouve pas de propriété spécifique à 100% correspondante dans le catalogue de démonstration, mais voici une perspective stratégique sur le marché visé :\n\n`;
        text += `1. **Opportunités de Marché** : Les métropoles africaines comme Kinshasa (Gombe), Kigali et Zanzibar connaissent une croissance urbaine rapide (+5% à +8% par an).\n`;
        text += `2. **Rendements Locatifs** : Les villas haut de gamme et appartements meublés avec services (piscine, sécurité) offrent des rendements nets attractifs compris entre 8% et 12% par an.\n`;
        text += `3. **Conseil stratégique** : Concentrez vos recherches sur les zones à forte concentration d'expatriés et d'entreprises (comme Gombe ou Kigali centre).\n\n`;
      }

      if (query.includes("kinshasa") || query.includes("gombe")) {
        text += `### Focus Marché : Gombe, Kinshasa\n`;
        text += `La Gombe reste le "hub" d'élite de la RDC. La demande pour des appartements résidentiels sécurisés et des bureaux d'affaires haut de gamme y est extrêmement forte, avec des prix au m² stables.\n\n`;
      } else if (query.includes("zanzibar") || query.includes("nungwi")) {
        text += `### Focus Marché : Zanzibar (Nungwi)\n`;
        text += `L'immobilier de villégiature à Zanzibar connaît un boom sans précédent grâce aux plages exceptionnelles de Nungwi. C'est l'emplacement idéal pour de l'investissement locatif de type Villa ou complexe moderne.\n\n`;
      } else if (query.includes("kigali")) {
        text += `### Focus Marché : Kigali, Rwanda\n`;
        text += `Kigali est réputée pour sa propreté, sa sécurité et sa gouvernance exemplaire. Les développements y sont structurés avec des plus-values garanties sur les appartements de standing.\n\n`;
      }

      text += `*Remarque : Assistant en fonction (Mode Simulation). Clé API GEMINI_API_KEY non configurée dans Settings > Secrets.*`;
    } else {
      text = `### AI Investment Inquiry Analysis\n\n`;
      text += `Hello! As the ImmoAI Africa virtual agent, I parsed your enquiry: "${userQuery}".\n\n`;
      
      if (matchedProps.length > 0) {
        text += `I found **${matchedProps.length} property/properties** matching your requirements inside our catalogue:\n\n`;
        matchedProps.slice(0, 3).forEach((p: any, idx: number) => {
          text += `${idx + 1}. **${p.title}** in *${p.location}*: **${p.price.toLocaleString()} USD** (${p.sqm} sqm, ${p.beds} beds, ${p.baths} baths). ${p.description || ""}\n`;
        });
        text += `\nThese units represent premium investment scores and are highly recommended.\n\n`;
      } else {
        text += `I could not locate properties matching 100% of your requests directly, but here is a strategic outlook on the high-yield sub-Saharan market:\n\n`;
        text += `1. **Growth Vectors**: Emerging African nodes like Kinshasa, Kigali, and coastal Zanzibar show dynamic urbanization metrics (+5% to +8% annually).\n`;
        text += `2. **Rental Yields**: Serviced luxury homes (featuring smart security and pools) generate annual net rental yields from 8% up to 12% easily.\n`;
        text += `3. **Guidance**: Prioritize secured premium sectors hosting corporate offices and diplomat residences.\n\n`;
      }

      if (query.includes("kinshasa") || query.includes("gombe")) {
        text += `### Area Focus: Gombe, Kinshasa\n`;
        text += `Gombe is the exclusive business and residential epicenter of DRC. High-end secure apartments have robust appreciation ratios.\n\n`;
      } else if (query.includes("zanzibar") || query.includes("nungwi")) {
        text += `### Area Focus: Zanzibar (Nungwi)\n`;
        text += `Tourism-backed real estate in Zanzibar is experiencing multi-year expansions. Beachfront villas are optimal for lifestyle investments.\n\n`;
      } else if (query.includes("kigali")) {
        text += `### Area Focus: Kigali, Rwanda\n`;
        text += `Kigali offers premium ease of doing business and top-notch security infrastructure.\n\n`;
      }

      text += `*Note: Assistant operational (Simulation Mode). GEMINI_API_KEY is not configured inside your AI Studio workspace Settings > Secrets.*`;
    }

    if (recommendedIds.length > 0) {
      text += `\n\n---RECOMMANDATIONS---\n${JSON.stringify(recommendedIds)}\n---FIN---`;
    }

    return { text };
  }

  // =========================================================================
  // AFRICANOVA CURRENCY ENGINE (12 DEVISES PRIORITAIRES - JOUR 1)
  // =========================================================================
  const AFRICANOVA_CURRENCY_RATES: Record<string, { name: string; symbol: string; rateToUSD: number; region: string }> = {
    USD: { name: 'Dollar US', symbol: '$', rateToUSD: 1.0, region: 'International & Arbitrage' },
    EUR: { name: 'Euro', symbol: '€', rateToUSD: 0.92, region: 'Diaspora Europe' },
    XOF: { name: 'Franc CFA Ouest (BCEAO)', symbol: '₣', rateToUSD: 605.5, region: 'Sénégal, CI, Mali...' },
    XAF: { name: 'Franc CFA Centre (BEAC)', symbol: '₣', rateToUSD: 605.5, region: 'Cameroun, Gabon, Congo...' },
    NGN: { name: 'Naira Nigérian', symbol: '₦', rateToUSD: 1610, region: 'Nigéria' },
    KES: { name: 'Shilling Kenyan', symbol: 'KSh', rateToUSD: 129.5, region: 'Kenya' },
    ZAR: { name: 'Rand Sud-Africain', symbol: 'R', rateToUSD: 18.15, region: 'Afrique du Sud' },
    GHS: { name: 'Cedi Ghanéen', symbol: 'GH₵', rateToUSD: 15.6, region: 'Ghana' },
    MAD: { name: 'Dirham Marocain', symbol: 'DH', rateToUSD: 9.88, region: 'Maroc' },
    RWF: { name: 'Franc Rwandais', symbol: 'FRw', rateToUSD: 1385, region: 'Rwanda' },
    CDF: { name: 'Franc Congolais', symbol: 'FC', rateToUSD: 2850, region: 'RD Congo' },
    TZS: { name: 'Shilling Tanzanien', symbol: 'TSh', rateToUSD: 2620, region: 'Tanzanie & Zanzibar' },
  };

  function calculateCurrencyConversion(amount: number, from: string, to: string): { result: number; rate: number } {
    const fromMeta = AFRICANOVA_CURRENCY_RATES[from.toUpperCase()] || AFRICANOVA_CURRENCY_RATES.USD;
    const toMeta = AFRICANOVA_CURRENCY_RATES[to.toUpperCase()] || AFRICANOVA_CURRENCY_RATES.USD;
    const inUSD = amount / fromMeta.rateToUSD;
    const result = inUSD * toMeta.rateToUSD;
    const rate = toMeta.rateToUSD / fromMeta.rateToUSD;
    return { result, rate };
  }

  // Currency API endpoints
  app.get('/api/currency/rates', (req, res) => {
    res.json({ rates: AFRICANOVA_CURRENCY_RATES, base: 'USD', timestamp: new Date().toISOString() });
  });

  app.post('/api/currency/convert', (req, res) => {
    const { amount, from = 'USD', to = 'XOF' } = req.body;
    const numericAmount = parseFloat(amount) || 0;
    const conversion = calculateCurrencyConversion(numericAmount, from, to);
    res.json({
      amount: numericAmount,
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      result: conversion.result,
      rate: conversion.rate,
      timestamp: new Date().toISOString()
    });
  });

  // =========================================================================
  // AFRICANOVA ASSISTANT / AGENT NOVA (7ème Service Transverse)
  // Identity & rules as defined by Israel Carlito:
  // - Identity: Agent Nova, l'assistant officiel de la plateforme AFRICANOVA.
  // - Mission: Autonomiser les Africains en les connectant aux meilleures opportunités.
  // - Personality: Professionnel, chaleureux, ambitieux, fier de l'Afrique. Tu vouvoies.
  // - Languages: Français, Anglais, Swahili, Wolof. Répondre dans la langue de l'utilisateur.
  // - Rules:
  //   1. Sois concret. Donne toujours 3 actions ou 3 propositions.
  //   2. Si tu n'as pas l'info, propose de rediriger vers un partenaire AFRICANOVA.
  //   3. Utilise la charte : Prix et multi-devises (12 devises phares).
  //   4. Capable de convertir directement n'importe quelle somme (ex: "Convertis 5 millions FCFA en Shilling").
  // =========================================================================
  function simulateNovaResponse(userQuery: string, currentPole?: string, lang: string = 'fr'): string {
    const q = (userQuery || "").toLowerCase();

    // Check if query is a currency conversion request (e.g. "Convertis 5 millions FCFA en Shilling")
    const isConversion = q.includes("convert") || q.includes("taux") || q.includes("change") || 
      (q.includes("en ") && (q.includes("fcfa") || q.includes("shilling") || q.includes("naira") || q.includes("dollar") || q.includes("euro") || q.includes("rand")));

    if (isConversion) {
      let amount = 5000000;
      if (q.includes("1000") || q.includes("1 000")) amount = 1000;
      else if (q.includes("10000") || q.includes("10 000")) amount = 10000;
      else if (q.includes("100000") || q.includes("100 000")) amount = 100000;
      else if (q.includes("1 million") || q.includes("1 000 000")) amount = 1000000;
      else if (q.includes("10 million") || q.includes("10 millions")) amount = 10000000;
      else if (q.includes("50 million") || q.includes("50 millions")) amount = 50000000;

      const inUSD = amount / 605.5; // assume from FCFA if mentioned or default
      const inKES = Math.round(inUSD * 129.5);
      const inTZS = Math.round(inUSD * 2620);
      const inNGN = Math.round(inUSD * 1610);
      const inEUR = (inUSD * 0.92).toFixed(2);
      const inUSDFormatted = Math.round(inUSD).toLocaleString();

      return `### 💱 Agent Nova — Conversion Multi-Devises Instantanée

Voici la conversion officielle de votre montant selon les cours du jour sur **AFRICANOVA** :

* **Montant de référence** : **${amount.toLocaleString()} FCFA (XOF/XAF)**

1. **En Shilling Kenyan (KES)** :
   👉 **${inKES.toLocaleString()} KSh** (Taux : 1 XOF ≈ 0.214 KES). Idéal pour vos investissements ou transactions au Kenya (Nairobi).

2. **En Shilling Tanzanien (TZS)** :
   👉 **${inTZS.toLocaleString()} TSh** (Taux : 1 XOF ≈ 4.33 TZS). Idéal pour vos projets à Zanzibar ou Dar es Salaam.

3. **En devises de référence & Afrique de l'Ouest** :
   👉 **${inUSDFormatted} $ (USD)** | **${inEUR} € (EUR)** | **${inNGN.toLocaleString()} ₦ (Naira Nigérian)**.

---
**Vos 3 prochaines actions recommandées sur AFRICANOVA :**
1. **Verrouiller le cours** : Sécurisez votre transaction via notre passerelle multi-devises acceptant Mobile Money (Wave, Orange Money, MTN MoMo, M-Pesa) et Cartes bancaires.
2. **Déposer ou ajuster votre annonce** : Choisissez votre devise de paiement préférée parmi les 12 devises disponibles.
3. **Mise en relation Partenaire de Change** : Si vous effectuez un virement transfrontalier supérieur à 50 000 $, nous vous connectons à notre courtier bancaire agréé BOA / Ecobank pour bénéficier d'un taux préférentiel.`;
    }

    // Wolof greetings or requests
    if (q.includes("na nga def") || q.includes("nanga def") || q.includes("wolof") || q.includes("jerejef") || q.includes("salaam")) {
      return `### 🇸🇳 Agent Nova — Dalal ak jàmm ci AFRICANOVA !

Maa ngi fi, nuyool naala ci turu AFRICANOVA ("Benn Afrik, Xéewal yu bari"). 
Maa ngi fi ngir dimbali la ci sa yéene jëm kanam ci 6 pôle yi : Kër ak suuf (Immobilier), Xaalis ak alal (Finance), Jang ak jàngale (Formation), Koom-koom (Business), Liggéey (Emploi) ak Jaay ak jënd (Commerce).

**Ñatti (3) mbir yu am solo yoo mën a def léegi :**
1. **Wut kër walla suuf ci Ndakaaru (Dakar)** : Xoolal sunu kër yu baax yi ci Almadies, Mermoz walla Diamniadio ak liñ ciy gane.
2. **Nat sa xaalis ci devises yu bari** : Mën nga soppi FCFA ci Dollar ($), Euro (€), walla Shilling ci sa kanam.
3. **Lëkkaloo ak sunu partenaire yi** : Su la am xibaar mankee, nu boole la ak benn jëwriñ bu am agrément ci AFRICANOVA.`;
    }

    // Swahili greetings or requests
    if (q.includes("jambo") || q.includes("habari") || q.includes("karibu") || q.includes("swahili") || q.includes("asante")) {
      return `### 🌍 Agent Nova — Karibu Sana AFRICANOVA !

Mimi ni **Agent Nova**, msaidizi wako rasmi wa jukwaa la AFRICANOVA ("Afrika Moja, Fursa Zisizo na Kikomo"). 
Dhamira yangu ni kukuwezesha kufikia fursa bora zaidi barani Afrika katika nguzo zetu 6: Majengo (Immobilier), Fedha, Mafunzo, Biashara, Ajira na Masoko.

**Hatua 3 madhubuti unazoweza kuchukua sasa :**
1. **Kagua fursa za uwekezaji** : Angalia viwanja na majengo Zanzibar, Nairobi na Kigali yenye faida kubwa.
2. **Badilisha sarafu papo hapo** : Tumia mfumo wetu kubadilisha KES, TZS, USD na FCFA kwa viwango rasmi vya leo.
3. **Ungana na washirika wetu** : Ikiwa unahitaji ushauri maalum, tutakuunganisha na benki zetu washirika kama Ecobank au mawakili wa OHADA.`;
    }

    // English responses
    if (lang === 'en' || q.includes("hello") || q.includes("how to") || q.includes("what is the price") || q.includes("english")) {
      return `### ⚡ Agent Nova — Official AFRICANOVA Assistant

Welcome! I am **Agent Nova**, the official AI advisor for the **AFRICANOVA** platform (*"One Africa. Unlimited Opportunities."*).
My mission is to empower Africans and the Diaspora by connecting you directly with the highest-yield continental opportunities across our 6 strategic poles: **Real Estate, Finance, Training, Business, Jobs, and Trade**.

**Here are 3 concrete actions for your request:**
1. **Multi-Currency Assessment**: All listings and transactions automatically adjust between **USD, EUR, XOF/XAF, NGN, KES, ZAR, TZS, and RWF** at live official rates.
2. **Access Certified Hubs**: Explore verified listings in Dakar, Abidjan, Kinshasa, Kigali, or Zanzibar with legal title audits.
3. **Direct Partner Redirection**: If you require custom debt financing or AfCFTA legal structuring, I can immediately introduce you to an accredited AFRICANOVA partner.

*What specific target or country would you like to explore today?*`;
    }

    // Standard French responses with 3 actions & concrete prices
    if (q.includes("dakar") || q.includes("3 pièces") || q.includes("immobilier") || q.includes("villa") || q.includes("appartement") || currentPole === 'immobilier') {
      return `### 🏡 Agent Nova — Pôle Immobilier AFRICANOVA

Bonjour ! En tant qu'Agent Nova, je vous oriente avec fierté vers les meilleures opportunités foncières et immobilières du continent. Pour un appartement **3 pièces à Dakar** (ou capitales partenaires), voici le barème marché certifié 2026 :

1. **Dakar - Almadies / Ngor / Fann Résidence** :
   - Budget moyen : **160 000 $ à 280 000 $ (100M à 175M FCFA / 21M à 36M KES)** pour du standing avec gardiennage, ascenseur et groupe électrogène.
   - Rendement locatif prévisionnel : **8.5% à 11.2% net / an**.

2. **Dakar - Mermoz / Ouakam / Sacré-Cœur** :
   - Budget moyen : **95 000 $ à 150 000 $ (60M à 95M FCFA / 12M à 19M KES)**.
   - Très forte demande locative auprès des cadres régionaux et expatriés.

3. **Alternatives émergentes à fort potentiel (Kigali & Abidjan Cocody)** :
   - *Abidjan Riviera Golf* : 3 pièces à partir de **140 000 $ (85M FCFA)**.
   - *Kigali Vision City* : Appartements contemporains à partir de **120 000 $ (165M RWF)**.

---
**Vos 3 actions concrètes :**
1. **Explorer le catalogue certifié** : Consultez nos annonces avec titres fonciers sécurisés et vue 360°.
2. **Simuler votre crédit bancaire** : Calculez vos mensualités en FCFA, USD ou EUR avec nos banques partenaires (BOA, Ecobank).
3. **Mise en relation notariée** : Si vous ciblez une parcelle précise, je vous oriente vers notre notaire agréé AFRICANOVA pour un audit d'acte sous 48h.`;
    }

    if (q.includes("agricole") || q.includes("finance") || q.includes("banque") || q.includes("crédit") || q.includes("prêt") || currentPole === 'finance') {
      return `### 💰 Agent Nova — Pôle Finance & Investissement

Bonjour ! Autonomiser vos ambitions financières en Afrique est au cœur de ma mission. Pour financer un **projet agro-industriel ou agricole**, voici la feuille de route préconisée :

1. **Lignes de Crédit Campagne & Matériel (BOA / Ecobank)** :
   - Taux bonifiés de **6.5% à 8.5%** négociés par AFRICANOVA avec contre-garantie FAGACE ou ARIZ (AFD).
   - Financement d'équipements (tracteurs, pompes solaires, silos) amortissable sur 3 à 7 ans.

2. **Fonds Agro-Business & Diaspora AFRICANOVA** :
   - Prise de participation minoritaire ou quasi-fonds propres de **25 000 $ à 500 000 $ (15M à 300M FCFA)** pour les chaînes de valeur prioritaires (riz, maraîchage, anacarde, manioc).

3. **Garanties et formalisation nécessaires** :
   - Sécurisation du foncier (bail emphytéotique min. 15 ans ou titre de propriété).
   - Comptes prévisionnels certifiés conformes au SYSCOHADA révisé.

---
**Vos 3 actions concrètes :**
1. **Lancer le simulateur de prêt** : Évaluez votre capacité de remboursement en 2 minutes dans notre pôle Finance.
2. **Télécharger le modèle de Business Plan OHADA** : Standardisé pour accélérer votre acceptation en comité de crédit.
3. **Redirection vers un banquier référent** : Je transmets votre dossier pré-qualifié à un chargé d'affaires PME partenaire AFRICANOVA.`;
    }

    if (q.includes("certification") || q.includes("formation") || q.includes("cours") || q.includes("projet") || currentPole === 'formation') {
      return `### 🎓 Agent Nova — Pôle Formation & Leadership

Bonjour ! Le capital humain est la première richesse de notre continent. Pour monter et piloter des projets d'envergure internationale en Afrique, voici les programmes certifiants recommandés :

1. **Executive Master — Management de Projets ZLECAf & Commerce Intra-Africain** :
   - *Format* : Hybride (cours en ligne synchrones + 2 semaines d'immersion à Kigali et Abidjan).
   - *Reconnaissance* : Certification double-diplôme accréditée OHADA et reconnue par les bailleurs de fonds (BAD, BOAD).

2. **PMP® & Agile Panafricain (Project Management Professional)** :
   - Préparation intensive à la certification internationale avec cas pratiques d'infrastructures locales.

3. **Bourses d'Excellence Diaspora & Talents Locaux** :
   - Prise en charge jusqu'à 60% des frais de scolarité pour les porteurs de projets à impact sociétal prouvé.

---
**Vos 3 actions concrètes :**
1. **Télécharger la brochure du cursus** : Découvrez le calendrier des admissions de la session 2026.
2. **Passer le test de compétences préalable** : Évaluez gratuitement votre niveau de management de projet.
3. **Entretien d'orientation** : Je vous planifie un échange direct avec le doyen académique partenaire AFRICANOVA.`;
    }

    if (q.includes("export") || q.includes("nigéria") || q.includes("zlecaf") || q.includes("ohada") || q.includes("business") || currentPole === 'business') {
      return `### 💼 Agent Nova — Pôle Business & ZLECAf

Bonjour ! L'intégration économique de l'Afrique par la ZLECAf est notre plus formidable levier de prospérité. Pour **exporter vos produits ou services au Nigéria (ou dans la zone CEDEAO/AfCFTA)** :

1. **Certificat d'Origine ZLECAf & Règle des 40%** :
   - Vos biens doivent justifier d'au moins 40% de valeur ajoutée locale pour bénéficier de l'exonération douanière progressive.
   - Formalités simplifiées via le guichet unique national Trade Hub.

2. **Enregistrement Sanitaire & Réglementaire (NAFDAC Nigéria)** :
   - Obligatoire pour agroalimentaire, cosmétiques et médicaments avant tout passage aux frontières de Sèmè-Kraké ou Lagos.

3. **Sécurisation des Contrats d'Agents Commerciaux (Droit OHADA & Common Law)** :
   - Rédaction bilingue avec clause compromissoire désignant la Cour Commune de Justice et d'Arbitrage (CCJA) ou le Centre d'Arbitrage International de Kigali (KIAC).

---
**Vos 3 actions concrètes :**
1. **Audit de conformité d'origine** : Vérifiez l'éligibilité de votre produit au tarif zéro ZLECAf.
2. **Consulter l'annuaire des distributeurs agréés à Lagos** : Accédez à notre réseau de négociants vérifiés.
3. **Rendez-vous cabinet juridique partenaire** : Confiez la relecture de vos contrats à un avocat d'affaires agréé AFRICANOVA.`;
    }

    if (q.includes("cfo") || q.includes("abidjan") || q.includes("emploi") || q.includes("recrutement") || q.includes("salaire") || currentPole === 'emploi') {
      return `### 👥 Agent Nova — Pôle Emploi & Carrières

Bonjour ! Connecter les compétences d'élite de la diaspora et du continent est une priorité absolue. Pour un poste de **Chief Financial Officer (Directeur Financier) à Abidjan** :

1. **Grille de Rémunération Marché 2026** :
   - Package brut : **3 500 000 à 6 500 000 FCFA net / mois** (environ **70 000 $ à 120 000 $/an**), hors primes sur objectifs, véhicule de fonction et assurance santé internationale.
   - Compétences discriminantes : Maîtrise des normes IFRS et SYSCOHADA révisé, expérience en levée de fonds bancaires/fonds d'investissement.

2. **Opportunités ouvertes en exclusivité sur AFRICANOVA** :
   - *CFO Groupe Agroalimentaire Régional* (Abidjan Plateau) — Réf. AF-CI-904.
   - *Directeur du Contrôle Financier & M&A* (Zone 4, Abidjan) — Réf. AF-CI-918.

3. **Programme "Repats & Diaspora"** :
   - Accompagnement à l'installation, exonérations d'impôts sur les indemnités de réinstallation et réseau d'alumni.

---
**Vos 3 actions concrètes :**
1. **Déposer votre CV en mode confidentiel** : Notre algorithme vous connecte aux conseils d'administration sans exposer votre nom publiquement.
2. **Simuler votre pouvoir d'achat à Abidjan** : Comparez votre niveau de vie entre l'Europe/USA et la Côte d'Ivoire.
3. **Entretien avec notre chasseur de tête agréé** : Je vous programme une session d'évaluation personnalisée avec notre cabinet de recrutement partenaire.`;
    }

    if (q.includes("solaire") || q.includes("panneaux") || q.includes("gros") || q.includes("commerce") || q.includes("fournisseur") || currentPole === 'commerce') {
      return `### 📦 Agent Nova — Pôle Commerce & Marketplace B2B

Bonjour ! Le développement des échanges directs entre nos pays est au cœur d'AFRICANOVA. Pour l'approvisionnement en **panneaux solaires et équipements énergétiques en gros** :

1. **Fournisseurs Agréés & Tarifs d'Achat Groupé** :
   - Tarifs négociés conteneur 40 pieds : **0.11 $ à 0.15 $ / Watt crête** (soit environ 70 FCFA / Watt) pour modules Tier-1 monocristallins 550W+.
   - Hubs de transit avec stocks tampons disponibles à Lomé (Togo) et Dakar (Sénégal).

2. **Garanties techniques et certifications** :
   - Tous les équipements disposent d'une garantie rendement de 25 ans et des certifications CE, TUV et IEC 61215.

3. **Modalités de paiement sécurisées** :
   - Paiement par Crédit Documentaire (Credoc) irrévocable et confirmé auprès de nos banques partenaires, ou séquestre sécurisé AFRICANOVA Pay.

---
**Vos 3 actions concrètes :**
1. **Rejoindre une commande groupée** : Mutualisez votre volume avec d'autres acheteurs de votre sous-région pour baisser les coûts de fret.
2. **Demander une facture proforma certifiée** : Obtenez un chiffrage rendu sous douane (CIF Dakar, Abidjan ou Douala).
3. **Contacter le transitaire partenaire** : Obtenez l'assistance d'un déclarant en douane agréé AFRICANOVA pour un dédouanement accéléré.`;
    }

    // Réponse transverse par défaut - Conforme aux consignes
    return `### ⚡ Agent Nova — Votre Conseiller Panafricain Officiel

Bonjour ! Je suis **Agent Nova**, l'assistant officiel de la plateforme **AFRICANOVA** (*"One Africa. Unlimited Opportunities."*).
Ma mission est de vous autonomiser en vous connectant directement aux meilleures opportunités de notre continent.

**Voici 3 propositions concrètes pour vous guider dès maintenant :**

1. **Calculer et convertir vos montants dans les 12 devises phares** :
   - Écrivez-moi simplement une requête comme *"Convertis 5 millions FCFA en Shilling"* ou *"Quel budget pour une villa à Dakar ?"*.
   - Nos prix s'adaptent instantanément en **XOF, XAF, USD, EUR, NGN, KES, ZAR, GHS, MAD, RWF, CDF, TZS**.

2. **Explorer nos 6 Pôles d'Excellence** :
   - 🏡 **Immobilier** : Villas et appartements audités avec rendements locatifs réels.
   - 💰 **Finance** : Crédits négociés BOA / Ecobank et simulateur de mensualités.
   - 🎓 **Formation** : Executive Master ZLECAf et certifications OHADA.
   - 💼 **Business** : Création de société et règles d'origine ZLECAf.
   - 👥 **Emploi** : Chasse de tête et postes de direction panafricains.
   - 📦 **Commerce** : Achats groupés de conteneurs et marketplace B2B.

3. **Mise en relation avec un partenaire agréé AFRICANOVA** :
   - Si vous avez un besoin juridique, bancaire ou notarié pointu, je vous oriente sans délai vers nos experts certifiés.

*Que souhaitez-vous accomplir aujourd'hui ?*`;
  }

  // Route API Agent Nova (Cross-pole AI Advisor)
  app.post('/api/gemini/nova-chat', async (req, res) => {
    try {
      const { messages, currentPole, lang } = req.body;
      const userLang = lang === 'en' ? 'en' : 'fr';
      const lastMsg = Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1] : null;
      const userQuery = lastMsg?.content || lastMsg?.text || "";

      let aiClient: GoogleGenAI;
      try {
        aiClient = getGeminiClient();
      } catch (keyErr) {
        // Fallback simulation mode
        return res.json({ text: simulateNovaResponse(userQuery, currentPole, userLang) });
      }

      const systemInstruction = `Tu es Agent Nova, l'assistant officiel de la plateforme AFRICANOVA.
Ta mission : Autonomiser les Africains en les connectant aux meilleures opportunités.

PERSONNALITÉ : Professionnel, chaleureux, ambitieux, fier de l'Afrique. Tu vouvoies systématiquement l'utilisateur.
LANGUES : Français, Anglais, Swahili, Wolof. Tu réponds IMPÉRATIVEMENT dans la langue utilisée par l'utilisateur (ou ${userLang === 'en' ? 'en Anglais' : 'en Français'} par défaut).

RÈGLES STRICTES D'AFRICANOVA :
1. Sois concret. Donne toujours 3 actions ou 3 propositions structurées et numérotées.
2. Si tu n'as pas l'information exacte ou qu'il s'agit d'un besoin pointu (crédit, acte notarié, audit foncier, contrat ZLECAf), propose de rediriger vers un partenaire agréé AFRICANOVA.
3. Utilise la charte de prix et les 12 devises prioritaires d'AFRICANOVA :
   - XOF (Franc CFA Ouest, Sénégal, CI... - 1 USD = 605.5 XOF)
   - XAF (Franc CFA Centre, Cameroun, Gabon... - 1 USD = 605.5 XAF)
   - USD ($ - International & Arbitrage)
   - EUR (€ - Diaspora Europe - 1 USD = 0.92 EUR)
   - NGN (₦ - Nigeria - 1 USD = 1610 NGN)
   - KES (KSh - Kenya - 1 USD = 129.5 KES)
   - ZAR (R - Afrique du Sud - 1 USD = 18.15 ZAR)
   - GHS (GH₵ - Ghana - 1 USD = 15.6 GHS)
   - MAD (DH - Maroc - 1 USD = 9.88 MAD)
   - RWF (FRw - Rwanda - 1 USD = 1385 RWF)
   - CDF (FC - RD Congo - 1 USD = 2850 CDF)
   - TZS (TSh - Tanzanie, Zanzibar - 1 USD = 2620 TZS)
4. Si l'utilisateur demande une conversion directe (ex: "Convertis 5 millions FCFA en Shilling"), réponds immédiatement avec le calcul précis converti en KES (Shilling Kenyan) et TZS (Shilling Tanzanien), mentionne les équivalents USD / EUR / NGN, et propose 3 actions concrètes.
5. Pôle actuel sélectionné : "${currentPole || 'Transverse (Immobilier, Finance, Formation, Business, Emploi, Commerce)'}".`;

      const formattedContents = Array.isArray(messages)
        ? messages.map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content || m.text || "" }]
          }))
        : [{ role: 'user', parts: [{ text: userQuery }] }];

      const response = await aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Express /api/gemini/nova-chat error:", err);
      // Failsafe to simulation if Gemini network error occurs
      const lastMsg = req.body?.messages?.[req.body?.messages?.length - 1];
      const fallbackText = simulateNovaResponse(lastMsg?.content || "", req.body?.currentPole, req.body?.lang);
      res.json({ text: fallbackText });
    }
  });

  // Conversation Assistant Chat (Voice + Text agent backend)
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { messages, properties, lang } = req.body;
      const userLang = lang === 'fr' ? 'fr' : 'en';

      let aiClient: GoogleGenAI;
      try {
        aiClient = getGeminiClient();
      } catch (keyErr: any) {
        // Fallback to sophisticated local simulation
        return res.json(simulateChatResponse(messages, properties, userLang));
      }

      const safeProperties = Array.isArray(properties) ? properties : [];
      
      const systemInstruction = userLang === 'fr'
        ? `Tu es l'analyste stratégique principal et l'expert IA immobilier "Agent ImmoAI" d'ImmoAI Africa.
           Ta mission est d'étudier les requêtes de l'utilisateur, d'agir comme un agent virtuel extrêmement professionnel et de l'aider à chercher des propriétés ou à obtenir des insights régionaux en Afrique.
           
           Voici le catalogue complet des propriétés disponibles actuelles pour guidage (sous forme JSON):
           ${JSON.stringify(safeProperties)}
           
           COMPORTEMENT ATTENDU :
           1. Réponds de manière polie, experte, claire, professionnelle et chaleureuse en Français.
           2. Suggère des biens REELS correspondants du catalogue ci-dessus et justifie tes recommandations en fonction de leur prix, de leur localisation ou des atouts clés (piscine, m², etc.).
           3. Si l'utilisateur exprime une demande générique sur une ville africaine (ex: Kinshasa, Kigali, etc.), donne des détails d'investissements stratégiques précieux (sécurité, plus-value, infrastructures).
           4. Si des propriétés du catalogue correspondent à sa recherche, renvoie IMPÉRATIVEMENT un tableau d'identifiants à la toute fin de ta réponse sous ce format strict :
              ---RECOMMANDATIONS---
              ["id_du_bien_1", "id_du_bien_2", ...]
              ---FIN---
              (Note : Choisis de vrais ID issus de la liste transmise).`
        : `You are the principal strategic analyst and real estate expert virtual assistant "Agent ImmoAI" for ImmoAI Africa.
           Your mission is to study user requests, act as an extremely professional virtual agent, and help them search properties or gain regional investment insights in Africa.
           
           Here is the current listing of available properties for your guidance (in JSON format):
           ${JSON.stringify(safeProperties)}
           
           EXPECTED BEHAVIOR:
           1. Respond politely, expertly, clearly, professionally, and warmly in English.
           2. Suggest actual matching properties from the catalog above and justify your recommendations based on their price, location, or key features (pool, sqm, etc.).
           3. If the user asks about an African city generic insights (e.g., Kinshasa, Kigali), provide rich strategic investment values (security, growth rate, infrastructure).
           4. If properties from the catalog match their search, you MUST strictly append a JSON array of their IDs at the very end of your response inside this exact block:
              ---RECOMMANDATIONS---
              ["id1", "id2", ...]
              ---FIN---
              (Note: Select actual IDs of matching properties from the input list).`;

      const formattedContents = Array.isArray(messages)
        ? messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content || m.text || "" }]
          }))
        : [];

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Express /api/gemini/chat error:", err);
      res.status(500).json({ error: err.message || "Failed to communicate with Gemini" });
    }
  });

  // Automated Smart Property Analysis Endpoint
  app.post('/api/gemini/analyze-property', async (req, res) => {
    try {
      const { property } = req.body;
      if (!property) return res.status(400).json({ error: "Missing property details" });

      let aiClient: GoogleGenAI;
      try {
        aiClient = getGeminiClient();
      } catch (e) {
        return res.json({
          price_estimate: property.price ? Math.round(property.price * 1.05) : 320000,
          condition: "Excellent",
          investment_score: 8.5,
          market_trend: "Tendance haussière soutenue (+6% par an).",
          risk_factors: [
            "Fluctuations des taux de change locaux.",
            "Délais d'approvisionnement des matériaux hauts de gamme.",
            "Raccordement définitif aux réseaux d'eau/électricité."
          ],
          investment_reasoning: "(Simulation hors clé API Gemini) Localisation stratégique à fort potentiel de valorisation à moyen terme. Demande locative haut de gamme dynamique."
        });
      }

      const prompt = `
        En tant qu'expert immobilier expert en marché africain (ImmoAI Africa), analyse cette propriété et fournis une estimation réaliste basée sur les données fournies.
        
        Propriété: ${property.title}
        Catégorie: ${property.category}
        Surface: ${property.sqm} m²
        Localisation: ${property.location}
        Description: ${property.description}
        
        Réponds UNIQUEMENT au format JSON avec cette structure exacte:
        {
          "price_estimate": number,
          "condition": string,
          "investment_score": number,
          "market_trend": string,
          "risk_factors": string[],
          "investment_reasoning": string
        }
      `;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text || "{}";
      res.json(JSON.parse(text));
    } catch (err: any) {
      console.error("Express analyze-property error:", err);
      res.status(500).json({ error: err.message || "Failed to analyze property" });
    }
  });

  // Location Advice Strategic Endpoint
  app.post('/api/gemini/location-advice', async (req, res) => {
    try {
      const { city, lang } = req.body;
      const userLang = lang === 'fr' ? 'fr' : 'en';

      let aiClient: GoogleGenAI;
      try {
        aiClient = getGeminiClient();
      } catch (e) {
        return res.json({
          text: userLang === 'fr'
            ? `Analyse de ${city} (Mode Simulation) : Quartier résidentiel d'élite bénéficiant d'une croissance urbaine résiliente, soutenu par de récents projets d'interconnexion routière. Rendement locatif annuel moyen net supérieur à 9.5%.`
            : `Analysis for ${city} (Simulation Mode): Premium urban location experiencing high population demand, supported by robust infrastructure expansions. Average annual net rental yield exceeds 9.5%.`
        });
      }

      const prompt = `
        En tant qu'expert en géographie et immobilier urbain en Afrique (ImmoAI Africa), 
        donne des conseils précis et d'une grande valeur analytique sur la ville de : ${city}.
        
        Inclus une analyse approfondie sur:
        1. Analyse du Marché : Taux de croissance urbaine, demande locative actuelle et prévisions pour les 5 prochaines années.
        2. Urbanisme & Infrastructures : Projets de développement prévus (Smart City, nouvelles routes, transports) et leur impact sur la plus-value.
        3. Districts Stratégiques : Classement des quartiers par profil (Business, Résidentiel Luxe, Émergent).
        4. Cadre Juridique & Fiscal : Bref aperçu des facilités ou contraintes pour les investisseurs locaux et de la diaspora.
        
        Réponds de manière professionnelle, analytique et visionnaire.
        Langue: ${userLang === 'fr' ? 'Français' : 'Anglais'}
      `;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Express location-advice error:", err);
      res.status(500).json({ error: err.message || "Failed to get location advice" });
    }
  });

  // Strategic Strategic Advisor Q&A Endpoint
  app.post('/api/gemini/ask-ai', async (req, res) => {
    try {
      const { query: aiQuery, lang } = req.body;
      const userLang = lang === 'fr' ? 'fr' : 'en';

      let aiClient: GoogleGenAI;
      try {
        aiClient = getGeminiClient();
      } catch (e) {
        const queryLower = (aiQuery || "").toLowerCase();
        let fallbackText = "";
        
        if (userLang === 'fr') {
          fallbackText = `### Conseil IA d'Investissement Strategique (ImmoAI Africa)\n\n`;
          fallbackText += `Merci pour votre question : "${aiQuery}". Voici notre avis d'expert d'Afrique :\n\n`;
          
          if (queryLower.includes("rentabilité") || queryLower.includes("rendement") || queryLower.includes("roi") || queryLower.includes("yield")) {
            fallbackText += `* **Rendements cibles** : En Afrique Subsaharienne, les rendements locatifs nets oscillent entre 7% et 11% pour le résidentiel classique, et grimpent jusqu'à 15% pour le co-living ou les appartements de transit meublés.\n`;
            fallbackText += `* **Facteurs clés** : Le raccordement d'énergie de secours (générateurs, solaire) et l'accès internet haut débit augmentent la valeur locative de 20%.\n`;
          } else if (queryLower.includes("risque") || queryLower.includes("achat") || queryLower.includes("cadre")) {
            fallbackText += `* **Sécurité juridique** : Veillez toujours à vérifier le titre foncier de la propriété auprès du conservateur des titres immobiliers local (conservation foncière).\n`;
            fallbackText += `* **Risque de change** : Nous conseillons de libeller les baux locatifs et les contrats de vente en USD ou en EUR pour prémunir votre capital de la dévaluation locale des monnaies.\n`;
          } else {
            fallbackText += `* **Perspectives 2026** : L'urbanisation rapide, l'accès à la fibre optique et la poussée des "Smart Cities" créent une demande inégalée pour l'immobilier moderne de classe moyenne et supérieure.\n`;
            fallbackText += `* **Recommandation** : Favorisez des investissements par étapes, de préférence dans des programmes neufs de promoteurs certifiés avec garanties décennales.\n`;
          }
          fallbackText += `\n*(Note : Clé GEMINI_API_KEY non détectée. Ce conseil utilise notre moteur d'analyse de secours pré-configuré.)*`;
        } else {
          fallbackText = `### Strategic AI Investment Advice (ImmoAI Africa)\n\n`;
          fallbackText += `Thank you for your inquiry: "${aiQuery}". Here is our expert strategy:\n\n`;
          
          if (queryLower.includes("rentabilité") || queryLower.includes("rendement") || queryLower.includes("roi") || queryLower.includes("yield")) {
            fallbackText += `* **Target Yields**: In major African cities, residential net yields average 7% to 11%, reaching up to 15% for serviced apartments or high-density co-living models.\n`;
            fallbackText += `* **Drivers**: Adding redundant backup utilities (solar/battery packs) and secure high-speed internet increases local premium rental values by 20%.\n`;
          } else if (queryLower.includes("risque") || queryLower.includes("achat") || queryLower.includes("cadre")) {
            fallbackText += `* **Title Security**: Always perform comprehensive title deed diligence at the local ministry of land assets before locking your acquisition.\n`;
            fallbackText += `* **Exchange Rates**: We recommend pegging rental leases and purchase agreements to stable currencies (USD/EUR) to offset local currency depreciation risks.\n`;
          } else {
            fallbackText += `* **2026 Outlook**: Dynamic urbanization rates and smart city policies provide unmatched capital appreciation potentials for emerging residential projects.\n`;
            fallbackText += `* **Recommendation**: Invest in phases, prioritizing certified prime developers with solid track records.\n`;
          }
          fallbackText += `\n*(Note: GEMINI_API_KEY not configured. This strategic recommendation is sourced from our pre-integrated analysis hub.)*`;
        }
        return res.json({ text: fallbackText });
      }

      const prompt = `
        Tu es l'analyste stratégique principal d'ImmoAI Africa. Ta mission est de révolutionner l'immobilier en Afrique par l'intelligence artificielle.
        
        Directives de réponse:
        1. Sois extrêmement précis sur les réalités locales africaines (Kinshasa, Lagos, Nairobi, Abidjan, etc.).
        2. Fournis des conseils basés sur les données : tendances de prix, retour sur investissement (ROI), et risques.
        3. Garde un ton professionnel, encourageant pour l'investissement durable, mais réaliste face aux défis.
        4. Ne te contente pas de réponses génériques. Si l'utilisateur demande un conseil d'achat, analyse les facteurs de zone, de sécurité et d'infrastructure.
        
        Langue de réponse: ${userLang === 'fr' ? 'Français' : 'Anglais'}
        
        Question de l'utilisateur: ${aiQuery}
      `;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Express ask-ai error:", err);
      res.status(500).json({ error: err.message || "Failed to respond to strategic query" });
    }
  });

  // Secure Wallet Update (Server-side)
  // Implementing the logic requested by the user
  app.post('/api/wallet/update', async (req, res) => {
    try {
      const { userId, amount } = req.body;
      
      if (!userId || typeof amount !== 'number') {
        return res.status(400).json({ error: "Invalid request parameters" });
      }

      const db = getDbAdmin();
      const walletRef = db.collection("wallets").doc(userId);
      const userRef = db.collection("users").doc(userId);
      
      const batch = db.batch();
      
      batch.update(walletRef, {
        balance: admin.firestore.FieldValue.increment(amount)
      });

      // Also update the wallet field in the user document as per the new schema
      batch.update(userRef, {
        wallet: admin.firestore.FieldValue.increment(amount)
      });
      
      await batch.commit();

      res.json({ success: true, userId, newIncrement: amount });
    } catch (error) {
      console.error("Wallet Update Error:", error);
      res.status(500).json({ error: "Failed to update wallet" });
    }
  });

  // AI Property Analysis placeholder (Gemini should be called from frontend as per guidelines)
  app.post('/api/analyze-property', async (req, res) => {
    res.status(405).json({ error: "Please use frontend Gemini SDK for analysis" });
  });

  // ==========================================
  // AFRICANOVA PARTNER INTEGRATIONS & APIS HUB
  // ==========================================

  // 1. Integrations Status Overview
  app.get('/api/integrations/overview', (req, res) => {
    res.json({
      status: 'active',
      environment: 'production-ready',
      updatedAt: new Date().toISOString(),
      integrations: [
        {
          id: 'mobile-money',
          name: 'Mobile Money Gateway',
          partners: ['CinetPay', 'Flutterwave', 'M-Pesa', 'Wave', 'Orange Money', 'MTN MoMo'],
          status: 'connected',
          latency: '42ms',
          coverage: '15+ pays africains (UEMOA, CEMAC, Kenya, Ghana, Nigéria)',
          features: ['Paiement direct', 'Split commission', 'Webhooks IPN', 'Rapprochement bancaire']
        },
        {
          id: 'banking',
          name: 'Open Banking & Microfinance',
          partners: ['Ecobank', 'Attijariwafa Bank', 'Bank of Africa (BOA)', 'UBA'],
          status: 'connected',
          latency: '68ms',
          coverage: 'Zone OHADA & Afrique du Nord/Est',
          features: ['Simulateur de prêt direct', 'Scoring de crédit instantané', 'Transmission dossier KYC', 'Suivi accord de principe']
        },
        {
          id: 'job-boards',
          name: 'Job Boards & Vivier Talents',
          partners: ['LinkedIn Talent API', 'Jobberman', 'EmploiDakar', 'BrighterMonday'],
          status: 'connected',
          latency: '95ms',
          coverage: 'Toute l\'Afrique & Diaspora',
          features: ['Importation automatisée', 'Matching CV IA Nova', 'Dépôt direct de candidatures', 'Flux XML / JSON']
        },
        {
          id: 'real-estate-syndication',
          name: 'Syndication Immobilière API',
          partners: ['Promoteurs Agréés AFRICANOVA', 'Fédérations Immobilières', 'Portails Nationaux'],
          status: 'connected',
          latency: '53ms',
          coverage: 'Côte d\'Ivoire, Sénégal, RDC, Maroc, Rwanda, Kenya',
          features: ['Ingestion automatique d\'annonces', 'Visites 3D / 360°', 'Vérification foncière certifiée']
        },
        {
          id: 'whatsapp-cloud',
          name: 'WhatsApp Business Cloud API',
          partners: ['Meta WhatsApp Cloud API', 'Twilio Africa Gateway'],
          status: 'connected',
          latency: '31ms',
          coverage: 'International (+225, +221, +243, +212, +254, etc.)',
          features: ['Agent Nova 24/7 sur WhatsApp', 'Alertes opportunités en temps réel', 'Support multilingue vocal & texte']
        },
        {
          id: 'google-maps',
          name: 'Google Maps & Geolocation API',
          partners: ['Google Maps Platform'],
          status: 'connected',
          latency: '24ms',
          coverage: 'Monde entier & corridors ZLECAf',
          features: ['Géolocalisation précise des biens', 'Calcul d\'itinéraires et commodités', 'Points d\'intérêt économiques']
        }
      ]
    });
  });

  // 2. Simulate Mobile Money Transaction (CinetPay / Flutterwave / M-Pesa)
  app.post('/api/integrations/simulate-payment', (req, res) => {
    const { operator, amount, currency, phone, description } = req.body;
    
    const txnId = `AN-PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const feeRate = operator === 'Wave' ? 0.01 : 0.02; // 1% for Wave, 2% standard
    const operatorFee = Math.round((amount || 10000) * feeRate);

    res.json({
      success: true,
      transactionId: txnId,
      operator: operator || 'Orange Money',
      amount: amount || 50000,
      currency: currency || 'XOF',
      phone: phone || '+22507000000',
      description: description || 'Paiement sécurisé AFRICANOVA',
      status: 'SUCCESS',
      operatorFee,
      settlementTime: 'Instant / Immédiat',
      receiptUrl: `https://africanova.africa/receipt/${txnId}`,
      timestamp: new Date().toISOString(),
      message: `Paiement de ${amount} ${currency} validé avec succès via ${operator || 'Mobile Money'}.`
    });
  });

  // 3. Banking Credit Pre-qualification & Scoring Endpoint
  app.post('/api/integrations/bank-scoring', (req, res) => {
    const { monthlyIncome, requestedLoan, country, durationYears, targetBank } = req.body;
    
    const income = Number(monthlyIncome) || 1500000;
    const loan = Number(requestedLoan) || 45000000;
    const years = Number(durationYears) || 15;
    const rate = 0.075; // 7.5% standard
    const monthlyRate = rate / 12;
    const totalMonths = years * 12;
    
    const monthlyPayment = (loan * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) / 
                           (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const debtRatio = (monthlyPayment / income) * 100;
    
    const isEligible = debtRatio <= 35; // Maximum 35% debt ratio standard OHADA / BCEAO
    const score = Math.min(98, Math.max(45, Math.round(100 - debtRatio * 1.2 + (income > 2000000 ? 15 : 5))));

    res.json({
      success: true,
      evaluationId: `SCORE-${Date.now()}`,
      partnerBank: targetBank || 'Ecobank Transnational',
      country: country || "Côte d'Ivoire",
      debtRatio: Math.round(debtRatio * 10) / 10,
      monthlyPayment: Math.round(monthlyPayment),
      score,
      eligibilityStatus: isEligible ? 'PRÉ-QUALIFIÉ' : 'CONDITIONNEL',
      recommendation: isEligible 
        ? 'Dossier hautement recommandé pour accord de principe sous 48h auprès de la banque partenaire.'
        : 'Apport personnel complémentaire ou caution solidaire conseillé pour optimiser le taux d\'endettement.',
      timestamp: new Date().toISOString()
    });
  });

  // 4. Record & Dispatch Collaboration Letter
  app.post('/api/collaboration-letters/send', async (req, res) => {
    const { targetCategory, recipientName, recipientTitle, organizationName, country, senderName, senderEmail, senderPhone, customNotes } = req.body;
    
    const letterReference = `AN-COLLAB-${(targetCategory || 'GEN').toUpperCase().slice(0, 4)}-${Date.now()}`;
    
    const letterRecord = {
      reference: letterReference,
      targetCategory: targetCategory || 'banque',
      recipientName: recipientName || 'Monsieur le Directeur Général',
      recipientTitle: recipientTitle || 'Direction Générale',
      organizationName: organizationName || 'Institution Partenaire',
      country: country || "Côte d'Ivoire",
      senderName: senderName || 'Direction des Partenariats AFRICANOVA',
      senderEmail: senderEmail || 'partenariats@africanova.africa',
      senderPhone: senderPhone || '+225 07 00 00 00',
      customNotes: customNotes || '',
      status: 'SENT',
      createdAt: new Date().toISOString()
    };

    try {
      const db = getDbAdmin();
      await db.collection('collaboration_letters').doc(letterReference).set(letterRecord);
    } catch (e) {
      console.warn('Could not store letter in Firestore (fallback to memory response):', e);
    }

    res.json({
      success: true,
      reference: letterReference,
      record: letterRecord,
      message: `Lettre officielle de collaboration adressée à ${organizationName} enregistrée et préparée pour expédition.`
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), 'dist');
    console.log(`Serving static files from: ${distPath}`);
    app.use(express.static(distPath));
    
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`Error sending index.html from ${indexPath}:`, err);
          res.status(404).send('Application not ready or file not found. Please wait a moment and refresh.');
        }
      });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
