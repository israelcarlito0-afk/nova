// Data & Templates for AFRICANOVA Strategic Partnerships and API Integrations

export interface CollaborationLetterTemplate {
  id: 'banque' | 'universite' | 'ecommerce' | 'media';
  categoryTitle: string;
  targetType: string;
  badge: string;
  subject: string;
  defaultOrganization: string;
  defaultRecipientName: string;
  defaultRecipientTitle: string;
  defaultCountry: string;
  whatWeOffer: string[];
  whatTheyProvide: string[];
  bodyIntro: string;
  bodyKeyPoints: { title: string; desc: string }[];
  bodyCallToAction: string;
  closing: string;
  recommendedPartners: string[];
}

export const COLLABORATION_LETTERS: CollaborationLetterTemplate[] = [
  {
    id: 'banque',
    categoryTitle: 'Partenariat Bancaire & Microfinance',
    targetType: 'Institutions Bancaires & Établissements de Crédit',
    badge: 'Pôle Finance & Crédit Direct',
    subject: 'Partenariat Stratégique AFRICANOVA x [Nom Banque] — Financer l\'Afrique & Intégration Crédit Direct',
    defaultOrganization: 'Ecobank Transnational / Société Générale / UBA / BOA / Attijariwafa',
    defaultRecipientName: 'Monsieur le Directeur Général',
    defaultRecipientTitle: 'Direction Générale & Pôle Banque de Détail',
    defaultCountry: "Côte d'Ivoire (Abidjan)",
    recommendedPartners: ['Ecobank Transnational', 'Attijariwafa Bank', 'Bank of Africa (BOA)', 'UBA Africa', 'Société Générale Afrique', 'Rawbank RDC', 'KCB Bank Kenya'],
    whatWeOffer: [
      'Accès direct à un flux qualifié d\'acquéreurs immobiliers et d\'entrepreneurs PME solvables',
      'Intégration de votre simulateur de prêt officiel en marque blanche sur le Pôle Finance',
      'Pré-qualification automatique des dossiers (scoring BCEAO/OHADA) pour réduire vos coûts d\'acquisition client'
    ],
    whatTheyProvide: [
      'Validation de grilles de taux préférentiels pour les membres agréés AFRICANOVA',
      'API de pré-accord de principe en 48 heures pour les crédits immobiliers et d\'équipement',
      'Sceau de banque partenaire officielle affiché sur la plateforme'
    ],
    bodyIntro: `C'est avec un grand intérêt pour l'engagement de votre institution dans le développement économique de notre continent que la direction d'AFRICANOVA vous soumet cette proposition de collaboration stratégique.

AFRICANOVA (One Africa. Unlimited Opportunities) est la première plateforme panafricaine unifiée interconnectant les 6 moteurs de la croissance africaine : Immobilier certifié, Finance, Formations d'excellence, Business ZLECAf, Emploi et Commerce.`,
    bodyKeyPoints: [
      {
        title: '1. Canal d\'acquisition de crédits immobiliers hautement qualifiés',
        desc: 'Nos utilisateurs — résidents locaux et diaspora africaine en Europe et Amérique — recherchent activement des financements bancaires sécurisés pour des acquisitions immobilières vérifiées.'
      },
      {
        title: '2. Intégration technologique de votre API de prêt en marque blanche',
        desc: 'Nous proposons d\'intégrer directement le moteur de calcul et le formulaire d\'instruction de votre banque au cœur de notre simulateur, garantissant à vos équipes des dossiers complets (KYC, fiches de paie, apport).'
      },
      {
        title: '3. Accélération de l\'inclusion financière et de la bancarisation',
        desc: 'Création d\'offres conjointes d\'épargne-logement et de micro-crédits pour les entrepreneurs du réseau ZLECAf.'
      }
    ],
    bodyCallToAction: `Nous sollicitons une séance de travail (en visioconférence ou au siège de votre direction) afin d\'examiner le protocole d\'accord technique et commercial permettant de lancer cette passerelle dès ce trimestre.`,
    closing: `Persuadés que cette synergie renforcera le leadership de votre banque dans le financement de la classe moyenne et de la diaspora africaine, nous vous prions d'agréer, Monsieur le Directeur Général, l'expression de notre haute considération.`
  },
  {
    id: 'universite',
    categoryTitle: 'Partenariat Universités & Grandes Écoles',
    targetType: 'Institutions d\'Enseignement Supérieur & Centres d\'Excellence',
    badge: 'Pôle Formation & Executive Education',
    subject: 'Partenariat Formation AFRICANOVA x [Nom Université] — Diffusion Panafricaine & Recrutement d\'Étudiants',
    defaultOrganization: 'HEC Paris Afrique / INPHB Yamoussoukro / UCAD Dakar / Ashesi University',
    defaultRecipientName: 'Monsieur le Recteur / Madame la Directrice Générale',
    defaultRecipientTitle: 'Direction des Admissions & Executive Education',
    defaultCountry: 'Sénégal (Dakar)',
    recommendedPartners: ['INPHB Yamoussoukro', 'Université Cheikh Anta Diop (UCAD)', 'Ashesi University Ghana', 'HEC Paris Afrique', 'ESMT Dakar', 'ALU (African Leadership University) Kigali'],
    whatWeOffer: [
      'Vitrine panafricaine auprès de plus de 110 000 cadres, jeunes diplômés et entrepreneurs',
      'Portail de candidature et pré-inscriptions directes pour vos masters, MBA et certifications',
      'Organisation de salons virtuels de l\'étudiant panafricain'
    ],
    whatTheyProvide: [
      'Mise à disposition de cursus certifiants exclusifs et modules en e-learning',
      'Conditions d\'admission et bourses d\'excellence pour les membres du réseau AFRICANOVA',
      'Co-délivrance de certificats spécialisés (Real Estate, Fintech, ZLECAf)'
    ],
    bodyIntro: `Convaincus que le capital humain est le véritable catalyseur de l'essor africain, nous avons l'honneur de vous proposer un partenariat académique stratégique entre AFRICANOVA et votre prestigieuse institution.

AFRICANOVA réunit au quotidien des milliers de cadres supérieurs, de professionnels en reconversion et d'étudiants à travers 54 pays africains et la diaspora, tous animés par la volonté d'acquérir les compétences clés du 21e siècle.`,
    bodyKeyPoints: [
      {
        title: '1. Recrutement ciblé d\'étudiants et de cadres exécutifs',
        desc: 'Mise en avant prioritaire de vos programmes de formation continue, masters exécutifs et bachelors auprès de profils à fort potentiel solvables.'
      },
      {
        title: '2. Digitalisation et commercialisation de cursus courts',
        desc: 'Intégration de vos modules certifiants sur le Campus Numérique AFRICANOVA avec paiement sécurisé multidevises et Mobile Money (Wave, Orange Money, M-Pesa).'
      },
      {
        title: '3. Passerelle directe avec l\'écosystème entrepreneurial et l\'emploi',
        desc: 'Insertion professionnelle immédiate de vos diplômés grâce aux passerelles avec notre Pôle Emploi et nos 2 500 entreprises partenaires.'
      }
    ],
    bodyCallToAction: `Nous aimerions convenir d'un échange avec votre direction académique et des partenariats pour définir les cursus prioritaires à référencer pour la rentrée.`,
    closing: `Dans l'attente de collaborer ensemble au rayonnement de l'excellence éducative africaine, veuillez agréer l'assurance de notre considération distinguée.`
  },
  {
    id: 'ecommerce',
    categoryTitle: 'Partenariat E-Commerce, Marketplaces & Logistique',
    targetType: 'Plateformes Marchandes, Distributeurs & Opérateurs Logistiques',
    badge: 'Pôle Commerce & ZLECAf Corridor',
    subject: 'Partenariat AFRICANOVA Commerce x [Nom Marketplace] — Interconnexion Catalogue & Logistique Transfrontalière',
    defaultOrganization: 'Jumia / Anka / DHL Africa / Bolloré AGL',
    defaultRecipientName: 'Monsieur le Directeur des Opérations & Partenariats',
    defaultRecipientTitle: 'Direction Commerciale & Logistique ZLECAf',
    defaultCountry: 'Nigéria (Lagos)',
    recommendedPartners: ['Jumia Group', 'Anka (Afrikrea)', 'DHL Express Sub-Saharan Africa', 'AGL (Africa Global Logistics)', 'Kobo360', 'TradeDepot'],
    whatWeOffer: [
      'Accès immédiat à un vivier d\'acheteurs B2B et B2C dans l\'espace économique continental ZLECAf',
      'Syndication API de vos catalogues marchands vérifiés dans notre Pôle Commerce',
      'Paiement unifié en 12 devises africaines et internationales avec Mobile Money instantané'
    ],
    whatTheyProvide: [
      'Intégration de vos stocks et tarification préférentielle pour les membres d\'AFRICANOVA',
      'Prise en charge logistique du transport transfrontalier et des formalités douanières',
      'Suivi en temps réel des expéditions inter-États'
    ],
    bodyIntro: `À l'heure de la mise en œuvre accélérée de la Zone de Libre-Échange Continentale Africaine (ZLECAf), AFRICANOVA déploie une infrastructure numérique de pointe pour connecter les acheteurs, vendeurs et industriels du continent.

Votre expertise dans le commerce en ligne et la chaîne logistique transfrontalière en fait le partenaire naturel pour bâtir l'épine dorsale de notre Pôle Commerce.`,
    bodyKeyPoints: [
      {
        title: '1. Connecteur API de catalogues marchands certifiés',
        desc: 'Interconnexion de vos références produits certifiées « Made in Africa » et biens d\'équipement auprès d\'entreprises et de particuliers en quête de fiabilité.'
      },
      {
        title: '2. Solution de paiement transfrontalier sans friction',
        desc: 'Notre passerelle multidevises prend en charge les conversions entre FCFA, Naira, Shilling, Dirham et Dollar, éliminant l\'obstacle des devises pour vos transactions.'
      },
      {
        title: '3. Optimisation des corridors de livraison ZLECAf',
        desc: 'Mise en place de tarifs d\'expédition négociés garantissant aux utilisateurs AFRICANOVA une livraison sécurisée et suivie de bout en bout.'
      }
    ],
    bodyCallToAction: `Nous vous invitons à planifier une réunion technique d'intégration API afin d'établir la feuille de route du déploiement pilote.`,
    closing: `Espérant bâtir ensemble le futur du commerce unifié africain, nous vous prions de recevoir, cher Partenaire, nos salutations les plus chaleureuses.`
  },
  {
    id: 'media',
    categoryTitle: 'Partenariat Médias, Chaînes TV & Radios',
    targetType: 'Chaînes Télévisées Panafricaines, Radios & Groupes de Presse',
    badge: 'Médiatisation & Rayonnement Panafricain',
    subject: 'Partenariat Média AFRICANOVA x [Nom Média] — Sponsoring & Coproduction de « L\'Afrique qui Bouge »',
    defaultOrganization: 'RTI / Canal+ Afrique / Africa 24 / TV5 Monde / RFI',
    defaultRecipientName: 'Monsieur le Directeur des Programmes & de l\'Information',
    defaultRecipientTitle: 'Direction Générale & Pôle Partenariats Médias',
    defaultCountry: "Côte d'Ivoire (Abidjan)",
    recommendedPartners: ['Canal+ Afrique', 'RTI (Radiodiffusion Télévision Ivoirienne)', 'Africa 24', 'TV5 Monde Afrique', 'RFI / France 24', 'VoxAfrica', 'Africanews'],
    whatWeOffer: [
      'Accès exclusif à des success-stories d\'entrepreneurs, d\'acquéreurs et de talents de toute l\'Afrique',
      'Coproduction de capsules vidéo et d\'émissions dédiées à l\'économie et l\'investissement africain',
      'Affichage de votre marque comme « Média Partenaire Officiel » sur l\'application et les réseaux AFRICANOVA'
    ],
    whatTheyProvide: [
      'Diffusion hebdomadaire ou mensuelle de la chronique « L\'Afrique qui Bouge » sponsorisée par AFRICANOVA',
      'Relais médiatique des événements phares, lancements et sommets annuels AFRICANOVA',
      'Espaces publicitaires croisés touchant des millions de téléspectateurs et auditeurs'
    ],
    bodyIntro: `Les transformations économiques et technologiques du continent africain méritent une couverture médiatique positive, rigoureuse et inspirante. C'est le sens de l'initiative que nous avons l'honneur de vous présenter aujourd'hui.

AFRICANOVA souhaite sceller une alliance éditoriale et institutionnelle forte avec votre chaîne/station, afin de valoriser ensemble les femmes et les hommes qui construisent l'Afrique de demain.`,
    bodyKeyPoints: [
      {
        title: '1. Coproduction de l\'émission phare « L\'Afrique qui Bouge »',
        desc: 'Un format court et dynamique mettant en lumière chaque semaine un entrepreneur, un projet immobilier modèle, une innovation fintech ou un talent de la diaspora.'
      },
      {
        title: '2. Mobilisation d\'un réseau exclusif d\'experts et analystes',
        desc: 'Mise à disposition de nos experts sectoriels (immobilier, bourse, agritech, ZLECAf) pour enrichir vos plateaux télévisés et débats d\'actualité économique.'
      },
      {
        title: '3. Amplification cross-média digitale et télévisée',
        desc: 'Relais synchrone de vos émissions sur notre plateforme web, nos newsletters premium et le flux d\'actualités de l\'Agent Nova.'
      }
    ],
    bodyCallToAction: `Nous nous tenons à votre disposition pour vous présenter le conducteur pilote de l'émission et formaliser notre convention de partenariat média.`,
    closing: `Très honorés de l'opportunité de collaborer avec votre antenne de référence, nous vous prions d'agréer, Monsieur le Directeur, nos salutations très distinguées.`
  }
];

export interface ApiIntegrationConfig {
  id: string;
  category: 'payment' | 'banking' | 'jobs' | 'real_estate' | 'whatsapp' | 'maps';
  title: string;
  provider: string;
  description: string;
  whyConnect: string;
  howConnect: string;
  endpoint: string;
  status: 'CONNECTED' | 'SANDBOX' | 'READY';
  latency: string;
  coverage: string;
  iconName: string;
  supportedCurrenciesOrCountries: string[];
  docsUrl: string;
  codeSnippet: string;
}

export const API_INTEGRATIONS: ApiIntegrationConfig[] = [
  {
    id: 'cinetpay-flutterwave',
    category: 'payment',
    title: 'Paiements & Mobile Money Panafricain',
    provider: 'CinetPay / Flutterwave / M-Pesa / Wave',
    description: 'Passerelle tout-en-un pour accepter les paiements par Mobile Money et cartes bancaires locales sans friction dans plus de 15 pays.',
    whyConnect: 'Permet à un acheteur de payer instantanément en FCFA (Wave, Orange, MTN), Shilling (M-Pesa) ou Naira.',
    howConnect: 'SDK REST CinetPay / Flutterwave avec Webhooks de confirmation instantanée (IPN) et reversement direct.',
    endpoint: '/api/integrations/simulate-payment',
    status: 'CONNECTED',
    latency: '42ms',
    coverage: '15+ pays africains (UEMOA, CEMAC, Nigéria, Kenya, Ghana)',
    iconName: 'CreditCard',
    supportedCurrenciesOrCountries: ['Orange Money', 'Wave', 'MTN MoMo', 'M-Pesa', 'Moov Money', 'Airtel Money'],
    docsUrl: 'https://docs.cinetpay.com',
    codeSnippet: `// Exemple d'initialisation Mobile Money
const payment = await cinetpay.initPayment({
  apikey: process.env.CINETPAY_API_KEY,
  site_id: process.env.CINETPAY_SITE_ID,
  amount: 50000,
  currency: 'XOF', // ou KES, NGN, USD
  description: 'Acompte Réservation AFRICANOVA',
  notify_url: 'https://africanova.africa/api/webhook/payment'
});`
  },
  {
    id: 'open-banking-loan',
    category: 'banking',
    title: 'Open Banking & Simulateur de Prêt Direct',
    provider: 'APIs Partenaires Bancaires (Ecobank, BOA, UBA)',
    description: 'Interconnexion directe avec les systèmes d\'octroi de crédit des banques partenaires pour la pré-qualification en temps réel.',
    whyConnect: 'Permet au candidat acquéreur d\'obtenir un accord de principe de prêt immobilier en 48h sans aller en agence.',
    howConnect: 'API REST sécurisée OAuth2 mTLS avec calcul du taux d\'effort BCEAO / OHADA et transmission des pièces justificatives.',
    endpoint: '/api/integrations/bank-scoring',
    status: 'CONNECTED',
    latency: '68ms',
    coverage: 'Zone OHADA (Afrique de l\'Ouest & Centrale) + Maroc, Kenya',
    iconName: 'Landmark',
    supportedCurrenciesOrCountries: ['Ecobank Transnational', 'Bank of Africa', 'Attijariwafa', 'UBA Africa'],
    docsUrl: 'https://developer.ecobank.com',
    codeSnippet: `// Scoring crédit et pré-qualification bancaire
const score = await bankApi.preQualifyLoan({
  applicant: { monthlyIncome: 1800000, country: 'CI' },
  loan: { amount: 65000000, durationYears: 15 },
  collateral: { type: 'REAL_ESTATE_ACCD', value: 90000000 }
});`
  },
  {
    id: 'job-boards-sync',
    category: 'jobs',
    title: 'Job Boards & Vivier Talents Panafricain',
    provider: 'API LinkedIn Talent Solutions / Jobberman / EmploiDakar',
    description: 'Agrégateur et synchronisateur en continu des meilleures offres d\'emploi exécutives et techniques à travers le continent.',
    whyConnect: 'Garantit un catalogue toujours alimenté en offres d\'emploi de prestige sans saisie manuelle.',
    howConnect: 'Flux XML / JSON automatisés avec normalisation des salaires et matching automatique avec les CV déposés via l\'Agent Nova.',
    endpoint: '/api/integrations/jobs-import',
    status: 'CONNECTED',
    latency: '95ms',
    coverage: 'Dakar, Abidjan, Lagos, Nairobi, Casablanca, Kinshasa, Kigali',
    iconName: 'Users',
    supportedCurrenciesOrCountries: ['LinkedIn', 'Jobberman', 'EmploiDakar', 'BrighterMonday', 'APEC Diaspora'],
    docsUrl: 'https://developer.linkedin.com',
    codeSnippet: `// Flux d'import d'offres cadres
const syncJobs = await jobConnector.fetchNewListings({
  category: 'EXECUTIVE_TECH_FINANCE',
  region: 'PAN_AFRICA',
  minSalaryUSD: 35000
});`
  },
  {
    id: 'real-estate-scraping',
    category: 'real_estate',
    title: 'Syndication & Agrégation Immobilière',
    provider: 'Promoteurs Certifiés & Portails Partenaires',
    description: 'Collecte et vérification juridique des annonces de promoteurs agréés avec contrôle des titres fonciers (ACD, Titres Fonciers).',
    whyConnect: 'Permet de lancer rapidement le catalogue avec des centaines de biens vérifiés dès le premier jour.',
    howConnect: 'Webhooks de syndication immobilière, flux RETS / RESO standardisés adaptés au droit foncier africain.',
    endpoint: '/api/properties',
    status: 'CONNECTED',
    latency: '53ms',
    coverage: 'Abidjan (Cocody, Assinie), Dakar (Almadies), Kinshasa (Gombe), Marrakech',
    iconName: 'Building2',
    supportedCurrenciesOrCountries: ['Chambres Immobilières', 'Promoteurs Agréés', 'Notaires Associés'],
    docsUrl: 'https://africanova.africa/api-docs/real-estate',
    codeSnippet: `// Webhook de synchronisation foncière
app.post('/api/webhook/property-feed', async (req, res) => {
  const { property, notaryVerification } = req.body;
  if (notaryVerification.status === 'VERIFIED') {
    await publishToAfricanovaCatalogue(property);
  }
});`
  },
  {
    id: 'whatsapp-business-cloud',
    category: 'whatsapp',
    title: 'WhatsApp Business Cloud API — Agent Nova',
    provider: 'Meta Cloud API / Twilio Africa',
    description: 'Déploiement de l\'intelligence de l\'Agent Nova directement sur WhatsApp pour interagir avec les utilisateurs africains.',
    whyConnect: '92% des transactions et échanges professionnels en Afrique subsaharienne passent par WhatsApp.',
    howConnect: 'Meta WhatsApp Cloud API Webhook raccordé au modèle Gemini pour dialoguer en Français, Anglais, Swahili et Wolof.',
    endpoint: '/api/ask-agent-nova',
    status: 'CONNECTED',
    latency: '31ms',
    coverage: 'Tous numéros WhatsApp (+225, +221, +243, +212, +254, diaspora)',
    iconName: 'MessageSquare',
    supportedCurrenciesOrCountries: ['Meta Verified Partner', 'Twilio Africa', 'Infobip'],
    docsUrl: 'https://developers.facebook.com/docs/whatsapp/cloud-api',
    codeSnippet: `// Webhook WhatsApp Cloud API raccordé à Agent Nova
app.post('/api/webhook/whatsapp', async (req, res) => {
  const { fromPhone, messageText } = extractWhatsAppPayload(req.body);
  const novaReply = await askAgentNova(messageText, { phone: fromPhone });
  await sendWhatsAppTemplate(fromPhone, novaReply.text);
});`
  },
  {
    id: 'google-maps-api',
    category: 'maps',
    title: 'Google Maps Platform & Données Géospatiales',
    provider: 'Google Maps Platform (Places, Geocoding, Directions)',
    description: 'Cartographie de haute précision, calcul de temps de trajet et repérage des infrastructures clés (écoles, aéroports, hôpitaux).',
    whyConnect: 'Essentiel pour rassurer les acheteurs de la diaspora sur l\'emplacement exact et l\'accessibilité des biens.',
    howConnect: 'Google Maps JavaScript API & Geocoding API avec intégration personnalisée aux couleurs de la charte AFRICANOVA.',
    endpoint: '/api/maps',
    status: 'CONNECTED',
    latency: '24ms',
    coverage: 'Villes métropoles & nouvelles zones d\'extension urbaine',
    iconName: 'MapPin',
    supportedCurrenciesOrCountries: ['54 Pays Africains', 'Vues Satellites HD', 'Corridors Commerciaux'],
    docsUrl: 'https://developers.google.com/maps',
    codeSnippet: `// Initialisation de la carte AFRICANOVA
const map = new google.maps.Map(container, {
  center: { lat: 5.3484, lng: -4.0171 }, // Abidjan
  zoom: 13,
  styles: AFRICANOVA_DARK_GOLD_MAP_STYLE
});`
  }
];
