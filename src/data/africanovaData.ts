export interface SubSection {
  id: string;
  title: string;
  description: string;
  badge?: string;
  actionText: string;
}

export interface Pole {
  id: 'immobilier' | 'finance' | 'formation' | 'business' | 'emploi' | 'commerce';
  nodeNumber: number;
  name: string;
  shortDescription: string;
  longDescription: string;
  iconName: string;
  accentColor: 'gold' | 'green';
  subSections: SubSection[];
  metrics: { label: string; value: string };
}

export const AFRICANOVA_POLES: Pole[] = [
  {
    id: 'immobilier',
    nodeNumber: 1,
    name: 'Immobilier',
    shortDescription: 'Acquisitions, locations et investissements locatifs à haut rendement certifiés par IA.',
    longDescription: 'Plateforme immobilière panafricaine connectant acheteurs, investisseurs et agences agréées à travers 34 pays.',
    iconName: 'Home',
    accentColor: 'gold',
    metrics: { label: 'Biens Référencés', value: '18 400+' },
    subSections: [
      {
        id: 'annonces',
        title: 'Annonces (achat / location)',
        description: 'Villas d\'architecte, appartements de standing, terrains titrés et espaces commerciaux dans toutes les métropoles africaines.',
        badge: 'Disponibles',
        actionText: 'Explorer les annonces',
      },
      {
        id: 'investissement',
        title: 'Investissement immobilier',
        description: 'Opportunités clés en main avec analyse prédictive du rendement brut (8% à 14%), diagnostics énergétiques et valorisation IA.',
        badge: 'Rendement élevé',
        actionText: 'Calculer la rentabilité',
      },
      {
        id: 'partenaire-agence',
        title: 'Devenir partenaire agence',
        description: 'Rejoignez le réseau certifié AFRICANOVA Real Estate : visibilité diaspora, mandat digitalisé et outils d\'estimation IA.',
        badge: 'Pro Network',
        actionText: 'Postuler comme agence',
      },
    ],
  },
  {
    id: 'finance',
    nodeNumber: 2,
    name: 'Finance',
    shortDescription: 'Financements structurés, prêts bancaires partenaires et simulateurs de crédit panafricains.',
    longDescription: 'Passerelle financière reliant porteurs de projets, diaspora et institutions bancaires régionales (UEMOA, CEMAC, EAC, SADC).',
    iconName: 'Landmark',
    accentColor: 'green',
    metrics: { label: 'Financements Facilités', value: '185M $' },
    subSections: [
      {
        id: 'opportunites-financement',
        title: 'Opportunités de financement',
        description: 'Fonds d\'accélération, co-investissement diaspora, syndications de prêts participatifs pour projets à fort impact.',
        badge: 'Ouvert',
        actionText: 'Voir les levées en cours',
      },
      {
        id: 'partenaires-financiers',
        title: 'Prêts & partenaires financiers',
        description: 'Accords-cadres avec les banques leaders (Ecobank, Bank of Africa, UBA, Attijariwafa) à taux négociés pour investisseurs.',
        badge: 'Partenaires Agréés',
        actionText: 'Consulter les banques',
      },
      {
        id: 'simulateur-financement',
        title: 'Simulateur de financement',
        description: 'Modélisez instantanément votre mensualité de crédit, apport personnel, taux d\'endettement et retour sur investissement net.',
        badge: 'Outil Gratuit',
        actionText: 'Lancer le simulateur',
      },
    ],
  },
  {
    id: 'formation',
    nodeNumber: 3,
    name: 'Formation',
    shortDescription: 'Masterclasses certifiantes, académies professionnelles et développement des compétences d\'avenir.',
    longDescription: 'Institut de formation hybride dédié aux métiers de la tech, de la finance, du management immobilier et du commerce international.',
    iconName: 'GraduationCap',
    accentColor: 'gold',
    metrics: { label: 'Diplômés Certifiés', value: '34 200+' },
    subSections: [
      {
        id: 'catalogue-formations',
        title: 'Catalogue de formations',
        description: 'Cursus immersifs en ligne et masterclasses hybrides : Immobilier & Urbanisme, Data & IA, Fintech, Agro-business.',
        badge: '2026 Inscriptions',
        actionText: 'Consulter le catalogue',
      },
      {
        id: 'certifications-pro',
        title: 'Certifications professionnelles',
        description: 'Diplômes et accréditations reconnus par les fédérations professionnelles africaines et internationales.',
        badge: 'Accréditation',
        actionText: 'Voir les certifications',
      },
      {
        id: 'formateurs-partenaires',
        title: 'Formateurs partenaires',
        description: 'Partagez votre expertise auprès de milliers d\'apprenants panafricains et intégrez le corps professoral AFRICANOVA.',
        badge: 'Intervenants',
        actionText: 'Devenir formateur',
      },
    ],
  },
  {
    id: 'business',
    nodeNumber: 4,
    name: 'Business & Entrepreneuriat',
    shortDescription: 'Annuaire d\'entreprises vérifiées, mise en relation investisseurs et ressources juridiques.',
    longDescription: 'L\'écosystème entrepreneurial continental pour propulser les champions africains de demain et faciliter les partenariats B2B.',
    iconName: 'Briefcase',
    accentColor: 'green',
    metrics: { label: 'Entreprises Membres', value: '8 600+' },
    subSections: [
      {
        id: 'annuaire-entreprises',
        title: 'Annuaire d\'entreprises',
        description: 'Base de données qualifiée des PME, startups et groupes industriels opérant dans les 54 pays de la ZLECAf.',
        badge: 'Vérifié KYC',
        actionText: 'Explorer l\'annuaire',
      },
      {
        id: 'mise-en-relation-investisseurs',
        title: 'Mise en relation investisseurs',
        description: 'Présentation directe de votre pitch deck aux business angels, fonds de capital-risque et fonds souverains du continent.',
        badge: 'Dealflow',
        actionText: 'Soumettre un dossier',
      },
      {
        id: 'ressources-guides',
        title: 'Ressources & guides',
        description: 'Modèles de contrats OHADA, guides d\'implantation fiscale, fiches pays ZLECAf et veille réglementaire stratégique.',
        badge: 'Documentation',
        actionText: 'Télécharger les guides',
      },
    ],
  },
  {
    id: 'emploi',
    nodeNumber: 5,
    name: 'Emploi',
    shortDescription: 'Offres d\'emploi stratégiques, vivier de talents panafricain et espace dédié aux recruteurs.',
    longDescription: 'Plateforme de recrutement haut de gamme valorisant les compétences locales et les talents de la diaspora africaine mondiale.',
    iconName: 'Users',
    accentColor: 'gold',
    metrics: { label: 'Talents Connectés', value: '110 000+' },
    subSections: [
      {
        id: 'offres-emploi',
        title: 'Offres d\'emploi',
        description: 'Postes en CDI, CDD et missions exécutives chez les leaders africains et multinationales basées sur le continent.',
        badge: '1 250+ Postes',
        actionText: 'Parcourir les offres',
      },
      {
        id: 'depot-cv',
        title: 'Dépôt de CV',
        description: 'Créez votre profil de compétences certifié et bénéficiez du matching algorithmique avec les recruteurs partenaires.',
        badge: 'Matching IA',
        actionText: 'Déposer mon CV',
      },
      {
        id: 'espace-recruteurs',
        title: 'Espace recruteurs',
        description: 'Diffusez vos offres, gérez vos pipelines de candidatures et accédez au plus grand vivier de talents qualifiés d\'Afrique.',
        badge: 'Portail RH',
        actionText: 'Publier un poste',
      },
    ],
  },
  {
    id: 'commerce',
    nodeNumber: 6,
    name: 'Commerce',
    shortDescription: 'Marketplace B2B/B2C, réseau de vendeurs certifiés et corridors logistiques panafricains.',
    longDescription: 'Place de marché digitale favorisant les échanges intra-africains avec paiements sécurisés et intégration logistique.',
    iconName: 'ShoppingBag',
    accentColor: 'green',
    metrics: { label: 'Transactions Mensuelles', value: '45 000+' },
    subSections: [
      {
        id: 'marketplace-produits',
        title: 'Marketplace produits',
        description: 'Produits manufacturés, agro-alimentaire transformé, équipements technologiques et artisanat d\'art de haute qualité.',
        badge: 'ZLECAf Ready',
        actionText: 'Visiter la marketplace',
      },
      {
        id: 'vendeurs-partenaires',
        title: 'Vendeurs partenaires',
        description: 'Ouvrez votre boutique en ligne certifiée, encaissez en devises locales ou internationales avec séquestre sécurisé.',
        badge: 'Escrow Garanti',
        actionText: 'Ouvrir ma boutique',
      },
      {
        id: 'livraison-logistique',
        title: 'Livraison & logistique',
        description: 'Partenariats avec les transporteurs terrestres, maritimes et aériens majeurs pour un dédouanement et une livraison fluide.',
        badge: 'Suivi Direct',
        actionText: 'Solutions logistiques',
      },
    ],
  },
];

export const KEY_STATISTICS = [
  {
    id: 'users',
    value: '250 000+',
    label: 'Utilisateurs & Membres',
    subtext: 'À travers le continent & la diaspora',
    color: 'text-an-gold-gradient',
  },
  {
    id: 'opportunities',
    value: '48 500+',
    label: 'Opportunités Publiées',
    subtext: 'Annonces, deals, offres et formations',
    color: 'text-[#F5D67A]',
  },
  {
    id: 'countries',
    value: '34',
    label: 'Pays Africains Couverts',
    subtext: 'Hubs à Abidjan, Dakar, Kigali, Lagos, Nairobi, Casablanca',
    color: 'text-emerald-400',
  },
  {
    id: 'volume',
    value: '185M $',
    label: 'Volume d\'Investissements',
    subtext: 'Transactions sécurisées et projets financés',
    color: 'text-an-gold-gradient',
  },
];

export const FEATURED_OPPORTUNITIES = [
  {
    id: 'opp-1',
    poleId: 'immobilier',
    title: 'Villa Kinshasa Prestige — Vue Fleuve',
    category: 'Immobilier de Prestige',
    location: 'Gombe, Kinshasa, RDC',
    price: '450 000 $',
    badge: 'Score Investisseur: 9.4 / 10',
    accent: 'gold',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80',
    detail: 'Villa neuve contemporaine 5 chambres, piscine à débordement, rendement locatif prévisionnel 11.2%/an.',
  },
  {
    id: 'opp-2',
    poleId: 'finance',
    title: 'Fonds d\'Expansion Agritech Sahel — Série A',
    category: 'Opportunité de Financement',
    location: 'Dakar & Bamako',
    price: 'Ticket min. : 25 000 $',
    badge: 'Rendement Cible: 16% TRI',
    accent: 'green',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80',
    detail: 'Accompagnement de 12 000 petits exploitants maraîchers connectés à l\'irrigation solaire intelligente.',
  },
  {
    id: 'opp-3',
    poleId: 'formation',
    title: 'Masterclass Exécutive : Montage Financier Immobilier',
    category: 'Certification Professionnelle',
    location: 'Abidjan & En ligne (Hybride)',
    price: '1 200 $ (Prise en charge disponible)',
    badge: 'Certification Reconnue',
    accent: 'gold',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80',
    detail: 'Programme intensif de 6 semaines dirigé par d\'anciens directeurs de fonds d\'investissement ouest-africains.',
  },
  {
    id: 'opp-4',
    poleId: 'emploi',
    title: 'Directeur Général Filiale / Infrastructure Urbaine',
    category: 'Offre d\'Emploi Stratégique',
    location: 'Kigali, Rwanda',
    price: 'Package attractif + Bonus performance',
    badge: 'Recrutement Exclusif',
    accent: 'green',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80',
    detail: 'Leadership d\'un consortium panafricain pour le déploiement d\'éco-quartiers connectés en Afrique de l\'Est.',
  },
  {
    id: 'opp-5',
    poleId: 'business',
    title: 'Partenariat Commercial ZLECAf : Distribution Agro-alimentaire',
    category: 'Mise en Relation B2B',
    location: 'Côte d\'Ivoire -> Nigéria / Ghana',
    price: 'Contrat pluriannuel',
    badge: 'Accord Cadre ZLECAf',
    accent: 'gold',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80',
    detail: 'Recherche de distributeurs agréés pour des produits certifiés bio à forte valeur ajoutée régionale.',
  },
  {
    id: 'opp-6',
    poleId: 'commerce',
    title: 'Lot Gros : Systèmes d\'Énergie Solaire Hybrides 10kW',
    category: 'Marketplace B2B',
    location: 'Casablanca & Douala',
    price: '4 800 $ / unité (Gros)',
    badge: 'Garantie 10 ans constructeur',
    accent: 'green',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80',
    detail: 'Onduleurs et batteries lithium dernière génération conformes aux normes CE/IEC avec livraison sous douane.',
  },
];

export const TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Amina Diop',
    role: 'Investisseuse Diasporique (Paris / Dakar)',
    poleName: 'Immobilier & Finance',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80',
    quote: '« Grâce à AFRICANOVA, j\'ai sécurisé un duplex à Dakar et obtenu un prêt bancaire partenaire sans quitter Paris. La transparence des audits et l\'accompagnement juridique OHADA m\'ont donné une sérénité totale. »',
    outcome: 'Acquisition finalisée en 45 jours',
  },
  {
    id: 't-2',
    name: 'Jean-Marc Kouassi',
    role: 'Fondateur AgriTech (Abidjan)',
    poleName: 'Business & Finance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    quote: '« Notre projet de transformation du cacao cherchait 150 000 $ pour financer de nouvelles machines. En 3 semaines sur AFRICANOVA, nous avons été mis en relation avec deux business angels de la région qui ont bouclé le tour. »',
    outcome: '150 000 $ levés via la plateforme',
  },
  {
    id: 't-3',
    name: 'Dr. Sarah Mwangi',
    role: 'Directrice des Opérations (Nairobi / Kigali)',
    poleName: 'Emploi & Formation',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
    quote: '« Après avoir suivi la certification en Management de Projets Complexes sur AFRICANOVA, j\'ai postulé à une offre de direction chez un opérateur logistique panafricain. Mon profil a été sélectionné en priorité. »',
    outcome: 'Poste de direction générale obtenu',
  },
];

export const PARTNER_CATEGORIES = [
  {
    id: 'agences',
    title: 'Agences Immobilières & Promoteurs',
    description: 'Diffusez votre portefeuille de biens auprès de milliers d\'acquéreurs locaux et de la diaspora.',
    advantages: ['Portail dédié de gestion des mandats', 'Estimation algorithmique IA', 'Accès direct aux acquéreurs solvables'],
    icon: 'Building2',
  },
  {
    id: 'financiers',
    title: 'Banques & Institutions Financières',
    description: 'Proposez vos solutions de crédit immobilier et d\'investissement à une clientèle qualifiée et vérifiée KYC.',
    advantages: ['Dossiers pré-qualifiés avec scoring', 'Partenariats de co-financement', 'Visibilité panafricaine'],
    icon: 'ShieldCheck',
  },
  {
    id: 'formateurs',
    title: 'Formateurs & Écoles Partenaires',
    description: 'Monétisez vos programmes et certifiez les cadres et entrepreneurs de tout le continent.',
    advantages: ['Plateforme e-learning haute performance', 'Gestion automatisée des attestations', 'Audience panafricaine'],
    icon: 'Award',
  },
  {
    id: 'recruteurs',
    title: 'Recruteurs & Dirigeants d\'Entreprises',
    description: 'Identifiez et recrutez les profils d\'excellence dont votre entreprise a besoin pour grandir en Afrique.',
    advantages: ['Matching algorithmique ciblé', 'Vérification préalable des diplômes', 'Vivier diaspora bilingue'],
    icon: 'UserCheck',
  },
  {
    id: 'vendeurs',
    title: 'Vendeurs & Opérateurs Logistiques',
    description: 'Intégrez la Marketplace AFRICANOVA pour distribuer vos produits dans tout l\'espace ZLECAf.',
    advantages: ['Paiement sécurisé par séquestre bancaire', 'Corridors logistiques intégrés', 'Gestion multi-devises'],
    icon: 'Truck',
  },
];
