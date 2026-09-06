import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoImg from './assets/images/immoai_africa_logo_1785755217391.jpg';
import { 
  Search, 
  MapPin, 
  Home, 
  Sparkles, 
  Plus, 
  Menu, 
  X, 
  ArrowRight,
  Building2,
  Gem,
  Compass,
  MessageSquare,
  Mic,
  MicOff,
  LogOut,
  User as UserIcon,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  Map as MapIcon,
  LayoutGrid,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sliders,
  Bed,
  Bath,
  Calendar,
  Eye,
  Check,
  Waves,
  Dumbbell,
  Layout,
  Trash2,
  Heart,
  RotateCcw,
  Bookmark,
  ArrowUpDown,
  AlertTriangle,
  Target,
  Users,
  Phone,
  Sun,
  Moon,
  Minus,
  Bell,
  BellOff,
  BellRing,
  CheckCircle2,
  Clock,
  Upload,
  Image as ImageIcon,
  FileText,
  Download,
  Leaf
} from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, useAdvancedMarkerRef, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { GoogleGenAI } from "@google/genai";
import { 
  collection, 
  query, 
  where,
  orderBy,
  onSnapshot, 
  doc, 
  getDoc,
  getDocFromCache,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  addDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { db, auth, signInWithGoogle, signOut, handleFirestoreError, OperationType } from './lib/firebase';
import { processTransaction } from './services/transactionService';
import type { Transaction, TransactionType } from './services/transactionService';
import { initializeWallet, subscribeToWallet } from './services/walletService';
import type { Wallet } from './services/walletService';
import { analyzeProperty, askAi, getLocationAdvice, chatWithAiAgent } from './services/aiService';
import { Property, ChatMessage, SavedFilter } from './types';
import PropertyDetailsPage from './components/PropertyDetailsPage';
import PropertyComparisonOverlay from './components/PropertyComparisonOverlay';
import AiAssistantWidget from './components/AiAssistantWidget';
import PropertyGallery from './components/PropertyGallery';
import EnergyRatingBadge from './components/EnergyRatingBadge';
import InvestmentScoreBadge from './components/InvestmentScoreBadge';
import ImmoAILogo from './components/ImmoAILogo';
import BrandHeroShowcase from './components/BrandHeroShowcase';
// @ts-ignore
import villaBg from './assets/images/immo_ai_home_bg_1779467248979.png';

const TOP_INVESTORS = [
  {
    id: "inv1",
    name: "Dr. Aliko Dangote",
    firm: "West Africa Capital",
    focus: "Villas & Luxury Commercial",
    region: "Nigeria, Ghana",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
    verified: true
  },
  {
    id: "inv2",
    name: "Fatima Kyari",
    firm: "Sahel Ventures",
    focus: "Residential Land & Apartments",
    region: "Senegal, Ivory Coast",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
    verified: true
  },
  {
    id: "inv3",
    name: "Thomas Ndlovu",
    firm: "Southern Star Real Estate",
    focus: "Waterfront Properties",
    region: "South Africa, Mozambique",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
    verified: true
  }
];

const INITIAL_PROPERTIES: Omit<Property, 'id'>[] = [
  {
    title: "Villa Kinshasa Prestige",
    location: "Gombe, Kinshasa, RDC",
    price: 450000,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&q=80"
    ],
    category: "Villa",
    beds: 5,
    baths: 4,
    sqm: 350,
    description: "Une villa luxueuse située au cœur du quartier résidentiel de la Gombe avec piscine et jardin.",
    ownerId: "system",
    status: "available",
    coordinates: { lat: -4.42, lng: 15.28 },
    aiEstimate: {
      price_estimate: 465000,
      condition: "Excellent",
      investment_score: 8.5
    },
    yearBuilt: 2022,
    condition: "Excellent",
    energyRating: "A+",
    energyKwh: 35,
    amenities: ["Pool", "Gym", "Balcony"],
    viewType: "Garden",
  },
  {
    title: "Maison Zanzibar Ocean View",
    location: "Nungwi, Zanzibar, Tanzania",
    price: 280000,
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80"
    ],
    category: "Villa",
    beds: 3,
    baths: 3,
    sqm: 220,
    description: "Propriété exceptionnelle avec vue imprenable sur l'océan Indien et accès privé à la plage.",
    ownerId: "system",
    status: "available",
    coordinates: { lat: -5.73, lng: 39.29 },
    aiEstimate: {
      price_estimate: 295000,
      condition: "Good",
      investment_score: 7.9
    },
    yearBuilt: 2020,
    condition: "Excellent",
    energyRating: "A",
    energyKwh: 48,
    amenities: ["Pool", "Balcony"],
    viewType: "Ocean",
  },
  {
    title: "Appartement Kigali Sky",
    location: "Kiyovu, Kigali, Rwanda",
    price: 90000,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80"
    ],
    category: "Apartment",
    beds: 2,
    baths: 1,
    sqm: 110,
    description: "Appartement moderne au design épuré, idéal pour les jeunes professionnels à Kigali.",
    ownerId: "system",
    status: "available",
    coordinates: { lat: -1.95, lng: 30.06 },
    aiEstimate: {
      price_estimate: 85000,
      condition: "Good",
      investment_score: 8.2
    },
    yearBuilt: 2021,
    condition: "New",
    energyRating: "A+",
    energyKwh: 32,
    amenities: ["Gym", "Balcony"],
    viewType: "City",
  },
  {
    title: "Domaine de Lagos Lagoon",
    location: "Victoria Island, Lagos, Nigeria",
    price: 650000,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80"
    ],
    category: "Villa",
    beds: 6,
    baths: 6,
    sqm: 500,
    description: "Résidence de prestige au bord de la lagune de Lagos, offrant un luxe inégalé.",
    ownerId: "system",
    status: "available",
    coordinates: { lat: 6.43, lng: 3.42 },
    aiEstimate: {
      price_estimate: 670000,
      condition: "Mint",
      investment_score: 9.1
    },
    yearBuilt: 2023,
    condition: "Excellent",
    energyRating: "A+",
    energyKwh: 28,
    amenities: ["Pool", "Gym", "Balcony"],
    viewType: "Ocean",
  },
  {
    title: "Appartement Loft Cape Town",
    location: "V&A Waterfront, Cape Town, South Africa",
    price: 350000,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80"
    ],
    category: "Apartment",
    beds: 1,
    baths: 1,
    sqm: 85,
    description: "Loft industriel chic avec vue panoramique sur la Montagne de la Table.",
    ownerId: "system",
    status: "available",
    coordinates: { lat: -33.91, lng: 18.42 },
    aiEstimate: {
      price_estimate: 365000,
      condition: "Renovated",
      investment_score: 8.8
    },
    yearBuilt: 2019,
    condition: "Good",
    energyRating: "B+",
    energyKwh: 65,
    amenities: ["Balcony"],
    viewType: "City",
  },
  {
    title: "Terrain Résidentiel Dakar",
    location: "Almadies, Dakar, Sénégal",
    price: 200000,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80"
    ],
    category: "Land",
    beds: 0,
    baths: 0,
    sqm: 1000,
    description: "Terrain constructible rare dans le quartier prisé des Almadies, idéal pour villa de luxe.",
    ownerId: "system",
    status: "available",
    coordinates: { lat: 14.75, lng: -17.51 },
    aiEstimate: {
      price_estimate: 215000,
      condition: "Prime Land",
      investment_score: 8.4
    },
    energyRating: "A+",
    energyKwh: 0
  },
  {
    title: "Penthouse Royal Almadies",
    location: "Almadies Ocean, Dakar, Sénégal",
    price: 520000,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80"
    ],
    category: "Apartment",
    beds: 4,
    baths: 4,
    sqm: 320,
    description: "Superbe penthouse vue panoramique sur l'Océan Atlantique. Propriété récemment vendue.",
    ownerId: "system",
    status: "sold",
    coordinates: { lat: 14.74, lng: -17.52 },
    aiEstimate: {
      price_estimate: 540000,
      condition: "Excellent",
      investment_score: 9.3
    },
    yearBuilt: 2023,
    condition: "Excellent",
    energyRating: "A+",
    energyKwh: 30,
    amenities: ["Pool", "Gym", "Balcony"],
    viewType: "Ocean"
  },
  {
    title: "Villa Contemporaine Lubumbashi",
    location: "Golf, Lubumbashi, RDC",
    price: 380000,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80"
    ],
    category: "Villa",
    beds: 4,
    baths: 3,
    sqm: 290,
    description: "Villa d'architecte moderne située dans le quartier résidentiel du Golf. Vendue.",
    ownerId: "system",
    status: "sold",
    coordinates: { lat: -11.66, lng: 27.48 },
    aiEstimate: {
      price_estimate: 395000,
      condition: "New",
      investment_score: 8.7
    },
    yearBuilt: 2022,
    condition: "New",
    energyRating: "A",
    energyKwh: 42,
    amenities: ["Pool", "Garden"],
    viewType: "Garden"
  }
];

// Grid Container and Property Card Stagger Variants
const propertyGridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const propertyCardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    y: 10,
    transition: {
      duration: 0.25
    }
  }
};

// Map Marker Component
function MapMarker({ property }: { property: Property; key?: string }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={property.coordinates}
        onClick={() => setOpen(true)}
      >
        <div className="group relative">
          <div className="bg-brand text-white p-2 rounded-xl shadow-xl shadow-brand/30 ring-2 ring-white/20 transform group-hover:scale-110 transition-all cursor-pointer">
            <Home size={16} />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-brand" />
        </div>
      </AdvancedMarker>
      {open && (
        <InfoWindow anchor={marker} onCloseClick={() => setOpen(false)}>
          <div className="p-1 min-w-[200px] text-dark-bg">
            <img src={property.image} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
            <h5 className="font-bold text-sm leading-tight mb-1">{property.title}</h5>
            <p className="text-brand font-bold text-sm">
              ${property.price.toLocaleString()}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2 items-center">
              <span className="text-[10px] font-bold bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">{property.category}</span>
              <span className="text-[10px] font-bold bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">{property.location.split(',')[0]}</span>
              <EnergyRatingBadge 
                rating={property.energyRating} 
                condition={property.condition} 
                energyKwh={property.energyKwh}
                variant="inline"
              />
              {property.aiEstimate && (
                <InvestmentScoreBadge
                  score={property.aiEstimate.investment_score}
                  variant="inline"
                />
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

// Map Zoom Controls Component
function MapZoomControls() {
  const map = useMap();

  const handleZoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom();
      if (typeof currentZoom === 'number') {
        map.setZoom(currentZoom + 1);
      }
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom();
      if (typeof currentZoom === 'number') {
        map.setZoom(currentZoom - 1);
      }
    }
  };

  return (
    <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 bg-black/70 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-2xl">
      <button
        type="button"
        onClick={handleZoomIn}
        className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-brand hover:text-black rounded-xl text-white transition-all duration-300 cursor-pointer border border-white/5 shadow-md active:scale-95"
        title="Zoom In"
      >
        <Plus size={18} />
      </button>
      <button
        type="button"
        onClick={handleZoomOut}
        className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-brand hover:text-black rounded-xl text-white transition-all duration-300 cursor-pointer border border-white/5 shadow-md active:scale-95"
        title="Zoom Out"
      >
        <Minus size={18} />
      </button>
    </div>
  );
}

import AssistantLanding from './components/AssistantLanding';
import { PdfExportModal } from './components/PdfExportModal';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showPdfExportModal, setShowPdfExportModal] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [guestChatMessages, setGuestChatMessages] = useState<ChatMessage[]>([]);
  const activeChatMessages = currentUser ? chatMessages : guestChatMessages;
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [comparedProperties, setComparedProperties] = useState<Property[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showInvestorsList, setShowInvestorsList] = useState(false);
  const [showManifesto, setShowManifesto] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [userWallet, setUserWallet] = useState<Wallet | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isMapView, setIsMapView] = useState(false);
  const [lang, setLang] = useState<'fr' | 'en' | 'sw'>('fr');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'dark';
  });
  const [accentColor, setAccentColor] = useState<'gold-black' | 'gold' | 'black' | 'emerald' | 'sapphire'>(() => {
    const saved = localStorage.getItem('accentColor');
    return (saved as any) || 'gold-black';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
    document.documentElement.setAttribute('data-accent', accentColor);
  }, [accentColor]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);
  const [userPriceSubs, setUserPriceSubs] = useState<string[]>([]);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [isSavingFilter, setIsSavingFilter] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
    }
  }, []);

  const toggleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      let recognitionLang = 'fr-FR';
      if (lang === 'en') {
        recognitionLang = 'en-US';
      } else if (lang === 'sw') {
        recognitionLang = 'sw-KE';
      }
      recognition.lang = recognitionLang;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setAiQuery(transcript);
          if (!isAiMode) {
            setFilterLocation(transcript);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert(lang === 'fr' 
            ? "L'accès au micro a été refusé ou n'est pas autorisé par le navigateur. Veuillez autoriser le micro dans les paramètres de votre navigateur." 
            : "Microphone access was denied or not allowed by the browser. Please allow microphone permissions in your browser settings.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (startErr) {
        console.warn("Error starting speech recognition:", startErr);
        setIsListening(false);
        alert(lang === 'fr'
          ? "Impossible d'activer le microphone. Vérifiez les autorisations de votre navigateur."
          : "Could not activate microphone. Please check your browser permissions.");
      }
    } catch (e) {
      console.warn("Speech recognition error caught:", e);
      setIsListening(false);
    }
  };

  const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
  const hasValidKey = Boolean(API_KEY) && API_KEY !== '';

  // New Property Form State
  const [newProperty, setNewProperty] = useState({
    title: '',
    location: '',
    price: 0,
    category: 'Villa' as Property['category'],
    beds: 1,
    baths: 1,
    sqm: 100,
    description: '',
    image: '',
    images: [] as string[],
    status: 'available' as Property['status']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewAiEstimate, setPreviewAiEstimate] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const AGENTS = [
    {
      id: 1,
      name: "Jean-Pierre Mavula",
      role: lang === 'fr' ? "Agent Senior - Kinshasa" : "Senior Agent - Kinshasa",
      specialty: lang === 'fr' ? "Résidentiel de Luxe" : "Luxury Residential",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80",
      phone: "+243 81 000 0000",
      email: "jp.mavula@immoai.com"
    },
    {
      id: 2,
      name: "Sarah Mwanga",
      role: lang === 'fr' ? "Analyste Investissement" : "Investment Analyst",
      specialty: lang === 'fr' ? "Commercial & Industriel" : "Commercial & Industrial",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
      phone: "+243 82 111 1111",
      email: "s.mwanga@immoai.com"
    },
    {
      id: 3,
      name: "Didier Kabila",
      role: lang === 'fr' ? "Expert Foncier" : "Land Expert",
      specialty: lang === 'fr' ? "Terrains & Terres" : "Plots & Lands",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80",
      phone: "+243 89 222 2222",
      email: "d.kabila@immoai.com"
    }
  ];

  // Filter States
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterPriceRange, setFilterPriceRange] = useState<[number, number]>([0, 10000000]);
  const [filterBeds, setFilterBeds] = useState<number>(0);
  const [filterBaths, setFilterBaths] = useState<number>(0);
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [filterYearBuilt, setFilterYearBuilt] = useState<number>(1900);
  const [filterCondition, setFilterCondition] = useState<string>('All');
  const [filterAmenities, setFilterAmenities] = useState<string[]>([]);
  const [filterViewType, setFilterViewType] = useState<string>('All');
  const [filterEnergyRating, setFilterEnergyRating] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [isApplyingFilter, setIsApplyingFilter] = useState(false);

  const translations = {
    fr: {
      explore: "Explorer",
      investors: "Investisseurs",
      marketing: "Marketing",
      services: "Services",
      connect: "Se connecter",
      logout: "Se déconnecter",
      heroTitle: "L'Immobilier Africain,",
      heroTitleAccent: "Réinventé par l'IA.",
      heroDesc: "L'immobilier intelligent propulsé par l'IA pour construire une Afrique moderne, connectée et prospère — par Ingénieur Israël Carlito.",
      startExploring: "Commencer l'Exploration",
      investOpportunity: "Opportunité d'Investissement",
      investTitle: "Rejoignez la Révolution Immobilière en",
      investTitleAccent: "Afrique.",
      investDesc: "ImmoAI Africa transforme le marché immobilier subsaharien. Nous combinons la puissance de l'IA générative avec une expertise locale pour offrir des rendements sans précédent.",
      pitchDeck: "Consulter le Pitch Deck",
      adminPhase: "Phase Alpha v1.2",
      pwaAndroid: "Pour installer sur Android : Cliquez sur les 3 points (⋮) de votre navigateur, puis 'Installer l'application'.",
      installApp: "Installer l'App (Android)",
      watchPitch: "Voir le Pitch Vidéo",
      founderTitle: "Ingénieur Israël Carlito",
      founderName: "Israel Carlito Lubaya",
      addProperty: "Publier une annonce",
      propertyTitle: "Titre de la propriété",
      propertyLocation: "Localisation (Ville, Pays)",
      priceLabel: "Prix (ex: $450,000)",
      description: "Description",
      category: "Catégorie",
      sqmLabel: "Superficie (m²)",
      imageUrl: "URL de l'image",
// Add to the translations object inside App component (actually it is outside, let me check)
// Wait, translations is inside App component. I'll add keys for gallery
      submit: "Publier l'annonce",
      addImages: "Ajouter des images",
      imageUrlPlaceholder: "Lien de l'image (ex: Unsplash)",
      imageRequired: "Au moins une image est requise.",
      noImages: "Aucune image ajoutée.",
      allCategories: "Toutes Catégories",
      minPrice: "Prix Min",
      maxPrice: "Prix Max",
      beds: "Chambres",
      baths: "Salles de bain",
      yearBuilt: "Année de construction",
      condition: "Condition",
      amenities: "Commodités",
      viewType: "Type de Vue",
      pool: "Piscine",
      gym: "Salle de sport",
      balcony: "Balcon",
      garden: "Jardin",
      city: "Ville",
      ocean: "Océan",
      mountain: "Montagne",
      new: "Neuf",
      excellent: "Excellent",
      good: "Bon",
      needsWork: "À rénover",
      energyRatingLabel: "Classe Énergie (DPE)",
      allEnergyRatings: "Toutes les classes",
      topEcoRatings: "🌿 Classes A+ & A (Top Éco)",
      filterProperties: "Filtrer les propriétés",
      noResults: "Aucune propriété ne correspond à vos critères.",
      resultsFound: "résultats trouvés.",
      viewMap: "Voir la Carte",
      viewList: "Voir la Liste",
      wallet: "Portefeuille",
      totalVolume: "Volume Total",
      commissionEarned: "Commissions",
      netProfit: "Profit Net",
      myTransactions: "Mes Transactions",
      testTransaction: "Simuler une transaction",
      transactionSuccessful: "Transaction réussie !",
      compare: "Comparer",
      addToCompare: "Ajouter au comparateur",
      comparisonLimit: "Maximum 3 propriétés.",
      compareNow: "Comparer maintenant",
      clearCompare: "Vider",
      specifications: "Spécifications",
      manifesto: "Manifeste",
      visionTitle: "Notre Vision",
      investorDeck: "Dossier Investisseur",
      solutionTitle: "Notre Solution",
      marketTitle: "Notre Marché",
      objectivesTitle: "Nos Objectifs",
      fundingNeed: "Besoin de Financement",
      problemTitle: "Le Problème",
      techTitle: "Technologie IA",
      businessModel: "Modèle Economique",
      expansionTitle: "Expansion",
      teamTitle: "L'Équipe",
      investorDirectory: "Annuaire des Investisseurs",
      verifiedInvestor: "Investisseur Vérifié",
      contactInvestor: "Contacter l'investisseur",
      investmentFocus: "Focus d'Investissement",
      viewDetails: "Voir détails",
      favorites: "Favoris",
      noFavorites: "Vous n'avez pas encore de propriétés favorites.",
      favoriteAdded: "Propriété ajoutée aux favoris !",
      favoriteRemoved: "Propriété retirée des favoris.",
      aiEstimateBtn: "Estimation par IA",
      aiEstimating: "Analyse en cours...",
      aiPriceEstimate: "Estimation du prix",
      aiInvestmentScore: "Score d'investissement",
      aiCondition: "Condition estimée",
      aiAnalysisResult: "Analyse Predictiv AI",
      aiMarketTrend: "Tendance du Marché",
      aiRiskFactors: "Facteurs de Risque",
      aiInvestmentReasoning: "Conseil d'Investissement",
      ourAgents: "Nos Experts Agents",
      agentsSubtitle: "Rencontrez nos professionnels dédiés à votre réussite immobilière.",
      contactAgent: "Contacter l'expert",
      yourFavorites: "Vos Coups de Cœur",
      favoritesSubtitle: "Retrouvez les propriétés que vous avez sauvegardées pour plus tard.",
      normalSearch: "Recherche Standard",
      aiAgentMode: "Assistant AI",
      aiPrompt: "Décrivez votre projet ou ville de rêve...",
      standardPrompt: "Rechercher par ville ou nom...",
      analyze: "Analyser",
      sortBy: "Trier par",
      newest: "Plus récent",
      priceLow: "Prix: Croissant",
      priceHigh: "Prix: Décroissant",
      location: "Localisation"
    },
    en: {
      explore: "Explore",
      analyze: "Analyze",
      sortBy: "Sort by",
      newest: "Newest",
      priceLow: "Price: Low to High",
      priceHigh: "Price: High to Low",
      location: "Location",
      normalSearch: "Normal Search",
      aiAgentMode: "AI Agent",
      aiPrompt: "Describe your project or dream city...",
      standardPrompt: "Search by city or name...",
      investors: "Investors",
      marketing: "Marketing",
      services: "Services",
      connect: "Connect",
      logout: "Log Out",
      heroTitle: "African Real Estate,",
      heroTitleAccent: "Reimagined by AI.",
      heroDesc: "Discover, invest, and manage exceptional properties in Africa using the power of generative artificial intelligence.",
      startExploring: "Start Exploring",
      investOpportunity: "Investment Opportunity",
      investTitle: "Join the Real Estate Revolution in",
      investTitleAccent: "Africa.",
      investDesc: "ImmoAI Africa transforms the sub-Saharan real estate market. We combine generative AI power with local expertise to deliver unprecedented returns.",
      pitchDeck: "View Pitch Deck",
      adminPhase: "Alpha Phase v1.2",
      pwaAndroid: "To install on Android: Click on the 3 dots (⋮) in your browser, then 'Install Application'.",
      installApp: "Install App (Android)",
      watchPitch: "Watch Video Pitch",
      founderTitle: "Web Development Engineer",
      founderName: "Israel Carlito Lubaya",
      addProperty: "Post a Listing",
      propertyTitle: "Property Title",
      propertyLocation: "Location (City, Country)",
      priceLabel: "Price (e.g., $450,000)",
      description: "Description",
      category: "Category",
      sqmLabel: "Area (sqm)",
      imageUrl: "Image URL",
      submit: "Post Listing",
      addImages: "Add Images",
      imageUrlPlaceholder: "Image URL (e.g. Unsplash)",
      imageRequired: "At least one image is required.",
      noImages: "No images added.",
      allCategories: "All Categories",
      minPrice: "Min Price",
      maxPrice: "Max Price",
      beds: "Bedrooms",
      baths: "Bathrooms",
      yearBuilt: "Year Built",
      condition: "Condition",
      amenities: "Amenities",
      viewType: "View Type",
      pool: "Pool",
      gym: "Gym",
      balcony: "Balcony",
      garden: "Garden",
      city: "City",
      ocean: "Ocean",
      mountain: "Mountain",
      new: "New",
      excellent: "Excellent",
      good: "Good",
      needsWork: "Needs Work",
      energyRatingLabel: "Energy Rating (DPE)",
      allEnergyRatings: "All Energy Ratings",
      topEcoRatings: "🌿 Grades A+ & A (Top Eco)",
      filterProperties: "Filter Properties",
      viewMap: "View Map",
      viewList: "View List",
      wallet: "Wallet",
      totalVolume: "Total Volume",
      commissionEarned: "Commissions",
      netProfit: "Net Profit",
      myTransactions: "My Transactions",
      testTransaction: "Simulate Transaction",
      transactionSuccessful: "Transaction successful!",
      investorDirectory: "Investor Directory",
      verifiedInvestor: "Verified Investor",
      contactInvestor: "Contact Investor",
      investmentFocus: "Investment Focus",
      manifesto: "Manifesto",
      visionTitle: "Our Vision",
      investorDeck: "Investor Deck",
      solutionTitle: "Our Solution",
      marketTitle: "Our Market",
      objectivesTitle: "Our Objectives",
      fundingNeed: "Funding Need",
      problemTitle: "The Problem",
      techTitle: "AI Technology",
      businessModel: "Business Model",
      expansionTitle: "Expansion",
      teamTitle: "The Team",
      noResults: "No properties match your criteria.",
      resultsFound: "results found.",
      viewDetails: "View details",
      favorites: "Favorites",
      noFavorites: "You haven't saved any properties yet.",
      favoriteAdded: "Property added to favorites!",
      favoriteRemoved: "Property removed from favorites.",
      aiEstimateBtn: "AI Estimation",
      aiEstimating: "Analyzing...",
      aiPriceEstimate: "Price Estimate",
      aiInvestmentScore: "Investment Score",
      aiCondition: "Estimated Condition",
      aiAnalysisResult: "Predictive AI Analysis",
      aiMarketTrend: "Market Trend",
      aiRiskFactors: "Risk Factors",
      aiInvestmentReasoning: "Investment Advice",
      ourAgents: "Our Expert Agents",
      agentsSubtitle: "Meet our professionals dedicated to your real estate success.",
      contactAgent: "Contact Expert",
      yourFavorites: "Your Selected Favorites",
      favoritesSubtitle: "Find the properties you've saved for later."
    },
    sw: {
      explore: "Gundua",
      investors: "Wawekezaji",
      marketing: "Masoko",
      services: "Huduma",
      connect: "Ingia",
      logout: "Ondoka",
      heroTitle: "Mali ya Afrika,",
      heroTitleAccent: "Imeimarishwa na AI.",
      heroDesc: "Gundua, wekeza na dhibiti mali za kipekee nchini Afrika kwa nguvu ya akili bandia.",
      startExploring: "Anza Kugundua",
      investOpportunity: "Fursa ya Uwekezaji",
      investTitle: "Jiunge na Mapinduzi ya Majengo nchini",
      investTitleAccent: "Afrika.",
      investDesc: "ImmoAI Africa inabadilisha soko la majengo Kusini mwa Jangwa la Sahara. Tunachanganya nguvu ya AI na utaalamu wa ndani ili kutoa faida kubwa zaidi.",
      pitchDeck: "Tazama Pitch Deck",
      adminPhase: "Awamu ya Alpha v1.2",
      pwaAndroid: "Ili kusanikisha kwenye Android: Bonyeza dots 3 (⋮) kwenye kivinjari chako, kisha 'Weka Programu'.",
      installApp: "Weka App (Android)",
      watchPitch: "Tazama Pitch ya Video",
      founderTitle: "Mhandisi wa Maendeleo ya Wavuti",
      founderName: "Israel Carlito Lubaya",
      addProperty: "Weka Tangazo",
      propertyTitle: "Kichwa cha Mali",
      propertyLocation: "Mahali (Mji, Nchi)",
      priceLabel: "Bei (mfano: $450,000)",
      description: "Maelezo",
      category: "Kategoria",
      sqmLabel: "Eneo (sqm)",
      imageUrl: "Video ya Image",
      submit: "Weka Tangazo",
      addImages: "Ongeza Picha",
      imageUrlPlaceholder: "Kiungo cha Picha (mfano: Unsplash)",
      imageRequired: "Picha angalau moja inahitajika.",
      noImages: "Hakuna picha zilizoongezwa.",
      allCategories: "Zote",
      minPrice: "Bei ya Chini",
      maxPrice: "Bei ya Juu",
      beds: "Vyumba",
      baths: "Vyoo",
      yearBuilt: "Mwaka ulioundwa",
      energyRatingLabel: "Kiwango cha Nishati (DPE)",
      allEnergyRatings: "Viwango Vyote",
      topEcoRatings: "🌿 Madaraja A+ na A (Ufanisi wa Juu)",
      filterProperties: "Chuja Mali",
      viewMap: "Tazama Ramani",
      viewList: "Tazama Orodha",
      investorDirectory: "Saraka ya Wawekezaji",
      verifiedInvestor: "Mwekezaji Aliyethibitishwa",
      contactInvestor: "Wasiliana na Mwekezaji",
      investmentFocus: "Lengo la Uwekezaji",
      noResults: "Hakuna mali inayolingana na vigezo vyako.",
      resultsFound: "matokeo yamepatikana.",
      viewDetails: "Angalia maelezo",
      favorites: "Vipendwa",
      noFavorites: "Bado haujaweka mali yoyote kwenye vipendwa.",
      favoriteAdded: "Mali imeongezwa kwenye vipendwa!",
      favoriteRemoved: "Mali imeondolewa kwenye vipendwa.",
      aiEstimateBtn: "Makadirio ya AI",
      aiEstimating: "Inachambua...",
      aiPriceEstimate: "Makadirio ya Bei",
      aiInvestmentScore: "Alama ya Uwekezaji",
      aiCondition: "Hali Inayokadiriwa",
      aiAnalysisResult: "Uchambuzi wa Predictive AI",
      aiMarketTrend: "Mwenendo wa Soko",
      aiRiskFactors: "Sababu za Hatari",
      aiInvestmentReasoning: "Ushauri wa Uwekezaji",
      ourAgents: "Wakala Wetu Wataalam",
      agentsSubtitle: "Kutana na wataalamu wetu waliojitolea kwa mafanikio yako ya mali isiyohamishika.",
      contactAgent: "Wasiliana na Mtaalam",
      yourFavorites: "Vipendwa Vyako",
      favoritesSubtitle: "Pata mali ulizohifadhi kwa ajili ya baadaye.",
      normalSearch: "Utafutaji wa Kawaida",
      aiAgentMode: "Msaidizi wa AI",
      aiPrompt: "Eleza mradi wako au mji wa ndoto...",
      standardPrompt: "Tafuta kwa mji au jina...",
      analyze: "Chambua",
      sortBy: "Panga kwa",
      newest: "Mpya zaidi",
      priceLow: "Bei: Chini hadi Juu",
      priceHigh: "Bei: Juu hadi Chini",
      location: "Eneo"
    }
  };

  const t = (key: keyof typeof translations['fr']) => translations[lang][key];

  // Connection Test & Auth Listener
  useEffect(() => {
    let unsubProfile: (() => void) | null = null;
    let unsubFavorites: (() => void) | null = null;
    let unsubPriceSubs: (() => void) | null = null;
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDoc = doc(db, 'users', user.uid);
          
          // Subscribe to favorites
          if (unsubFavorites) unsubFavorites();
          const favoritesColl = collection(db, 'users', user.uid, 'favorites');
          unsubFavorites = onSnapshot(favoritesColl, (snap) => {
            setUserFavorites(snap.docs.map(d => d.id));
          });

          // Subscribe to price subscriptions
          if (unsubPriceSubs) unsubPriceSubs();
          const priceSubsColl = collection(db, 'users', user.uid, 'priceSubscriptions');
          unsubPriceSubs = onSnapshot(priceSubsColl, (snap) => {
            setUserPriceSubs(snap.docs.map(d => d.id));
          }, (error) => {
            console.error("Price subscription listener error:", error);
          });

          // Subscribe to profile changes
          if (unsubProfile) unsubProfile();
          unsubProfile = onSnapshot(userDoc, (snap) => {
            if (snap.exists()) {
              setUserProfile({ id: snap.id, ...snap.data() });
            }
          }, (error) => {
            if (error.code !== 'permission-denied') {
              console.error("Profile subscription error:", error);
            }
          });

          // Check if user exists
          let userSnap = null;
          let isOffline = false;
          try {
            userSnap = await getDoc(userDoc);
          } catch (err: any) {
            console.warn("getDoc failed, checking cache or local fallback due to outline/offline state:", err);
            isOffline = err.message?.includes('offline') || err.code === 'unavailable';
            if (isOffline) {
              try {
                userSnap = await getDocFromCache(userDoc);
              } catch (cacheErr) {
                console.warn("Could not retrieve user profile from cache:", cacheErr);
              }
            } else {
              throw err;
            }
          }
          
          if (userSnap && userSnap.exists()) {
            setUserProfile({ id: userSnap.id, ...userSnap.data() });
            
            if (!isOffline) {
              try {
                // Update existing user profile
                await updateDoc(userDoc, {
                  name: user.displayName || "Anonyme",
                  photoURL: user.photoURL || "",
                  lastLogin: serverTimestamp()
                });
              } catch (updateErr) {
                console.warn("Could not update user login time on the server:", updateErr);
              }
            }
          } else {
            // Document does not exist or we couldn't get it
            const defaultProfile = {
              name: user.displayName || "Anonyme",
              email: user.email || "",
              role: "client",
              wallet: 0,
              photoURL: user.photoURL || "",
            };
            
            setUserProfile({ id: user.uid, ...defaultProfile });
            
            if (!isOffline) {
              try {
                await setDoc(userDoc, {
                  ...defaultProfile,
                  createdAt: serverTimestamp()
                });
              } catch (createErr) {
                console.warn("Could not create user profile on the server:", createErr);
              }
            }
          }
          
          // Initialiser le portefeuille si nécessaire
          try {
            await initializeWallet(user.uid);
          } catch (walletErr) {
            console.warn("Wallet initialization skipped or handled locally:", walletErr);
          }
        } catch (e) {
          console.error("Auth status change processing error:", e);
        }
      } else {
        setUserProfile(null);
        setUserFavorites([]);
        setUserPriceSubs([]);
        if (unsubProfile) {
          unsubProfile();
          unsubProfile = null;
        }
        if (unsubFavorites) {
          unsubFavorites();
          unsubFavorites = null;
        }
        if (unsubPriceSubs) {
          unsubPriceSubs();
          unsubPriceSubs = null;
        }
      }
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      unsubscribeAuth();
      if (unsubProfile) unsubProfile();
      if (unsubFavorites) unsubFavorites();
      if (unsubPriceSubs) unsubPriceSubs();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch Properties
  useEffect(() => {
    const q = collection(db, 'properties');
    const unsubscribeProperties = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];
      
      setProperties(data);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'properties');
    });

    return () => unsubscribeProperties();
  }, []);

  // Fetch Transactions
  useEffect(() => {
    if (!currentUser) {
      setUserTransactions([]);
      return;
    }

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      setUserTransactions(txs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "transactions");
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Fetch Wallet
  useEffect(() => {
    if (!currentUser) {
      setUserWallet(null);
      return;
    }

    const unsubscribe = subscribeToWallet(currentUser.uid, (wallet) => {
      setUserWallet(wallet);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Fetch Chat History
  useEffect(() => {
    if (!currentUser) {
      setChatMessages([]);
      return;
    }

    const q = query(
      collection(db, "users", currentUser.uid, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      setChatMessages(msgs);
    }, (error) => {
      // Missing permissions is expected if rules haven't propagated
      if (error.code !== 'permission-denied') {
        console.error("Chat history sync error:", error);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Fetch Saved Filters
  useEffect(() => {
    if (!currentUser) {
      setSavedFilters([]);
      return;
    }

    const q = query(
      collection(db, "users", currentUser.uid, "savedFilters"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const filters = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SavedFilter[];
      setSavedFilters(filters);
    }, (error) => {
      if (error.code !== 'permission-denied') {
        console.error("Saved filters sync error:", error);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Filtering Logic
  useEffect(() => {
    let result = properties;

    if (showSavedOnly) {
      result = result.filter(p => userFavorites.includes(p.id));
    }

    if (filterCategory !== 'All') {
      result = result.filter(p => p.category === filterCategory);
    }

    result = result.filter(p => 
      p.price >= filterPriceRange[0] && 
      p.price <= filterPriceRange[1]
    );

    if (filterBeds > 0) {
      result = result.filter(p => p.beds >= filterBeds);
    }

    if (filterBaths > 0) {
      result = result.filter(p => p.baths >= filterBaths);
    }

    if (filterLocation) {
      const loc = filterLocation.toLowerCase();
      result = result.filter(p => 
        p.location.toLowerCase().includes(loc) || 
        p.title.toLowerCase().includes(loc)
      );
    }

    if (filterYearBuilt > 1900) {
      result = result.filter(p => (p.yearBuilt || 0) >= filterYearBuilt);
    }

    if (filterCondition !== 'All') {
      result = result.filter(p => p.condition === filterCondition);
    }

    if (filterViewType !== 'All') {
      result = result.filter(p => p.viewType === filterViewType);
    }

    if (filterAmenities.length > 0) {
      result = result.filter(p => 
        filterAmenities.every(amenity => (p.amenities || []).includes(amenity))
      );
    }

    if (filterEnergyRating !== 'All') {
      result = result.filter(p => {
        const rating = p.energyRating || (p.condition === 'New' ? 'A+' : p.condition === 'Excellent' ? 'A' : p.condition === 'Good' ? 'B+' : 'B');
        if (filterEnergyRating === 'A-top') {
          return rating === 'A+' || rating === 'A';
        }
        return rating === filterEnergyRating;
      });
    }

    // Sorting logic
    result = [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      }
      return 0;
    });

    setFilteredProperties(result);
  }, [properties, filterCategory, filterPriceRange, filterBeds, filterBaths, filterLocation, filterYearBuilt, filterCondition, filterAmenities, filterViewType, filterEnergyRating, showSavedOnly, userFavorites, sortBy]);

  const toggleFavorite = async (propertyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      signInWithGoogle();
      return;
    }

    const favoriteDoc = doc(db, 'users', currentUser.uid, 'favorites', propertyId);
    try {
      if (userFavorites.includes(propertyId)) {
        await deleteDoc(favoriteDoc);
        // Toast-like notification could be added here
      } else {
        await setDoc(favoriteDoc, {
          propertyId,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const togglePriceSubscription = async (propertyId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentUser) {
      signInWithGoogle();
      return;
    }

    const priceSubDoc = doc(db, 'users', currentUser.uid, 'priceSubscriptions', propertyId);
    try {
      if (userPriceSubs.includes(propertyId)) {
        await deleteDoc(priceSubDoc);
      } else {
        await setDoc(priceSubDoc, {
          userId: currentUser.uid,
          propertyId,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}/priceSubscriptions/${propertyId}`);
    }
  };

  const toggleCompare = (property: Property, e: React.MouseEvent) => {
    e.stopPropagation();
    if (comparedProperties.find(p => p.id === property.id)) {
      setComparedProperties(comparedProperties.filter(p => p.id !== property.id));
    } else {
      if (comparedProperties.length >= 3) {
        alert(lang === 'fr' ? "Maximum 3 propriétés." : "Maximum 3 properties.");
        return;
      }
      setComparedProperties([...comparedProperties, property]);
    }
  };

  const seedDatabase = async () => {
    if (!currentUser) {
      alert("Veuillez vous connecter pour publier.");
      return;
    }
    try {
      for (const prop of INITIAL_PROPERTIES) {
        await addDoc(collection(db, 'properties'), {
          ...prop,
          ownerId: currentUser.uid,
          createdAt: serverTimestamp()
        });
      }
      alert("Catalogue initial ajouté avec succès !");
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'properties');
    }
  };

  const handleContactAgent = () => {
    if (!currentUser) {
      signInWithGoogle();
      return;
    }
    alert(lang === 'fr' 
      ? "Demande de contact envoyée à l'agent ! Celui-ci vous recontactera sous 24h." 
      : "Contact request sent to the agent! They will get back to you within 24 hours.");
  };

  const handleGetAiEstimate = async () => {
    if (!newProperty.title || !newProperty.location || !newProperty.description) {
      alert(lang === 'fr' ? "Veuillez remplir le titre, la localisation et la description pour l'analyse IA." : "Please fill in title, location, and description for AI analysis.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const estimate = await analyzeProperty({
        title: newProperty.title,
        description: newProperty.description,
        category: newProperty.category,
        sqm: newProperty.sqm,
        location: newProperty.location
      });
      setPreviewAiEstimate(estimate);
      // Wait for re-render then scroll
      setTimeout(() => {
        document.getElementById('ai-estimate-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch (err) {
      console.error("AI Estimation failed:", err);
      alert(lang === 'fr' ? "L'analyse IA a échoué. Veuillez vérifier vos informations." : "AI analysis failed. Please check your information.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePropertySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      const confirmLogin = window.confirm(lang === 'fr' ? "Veuillez vous connecter pour publier une annonce." : "Please sign in to post a listing.");
      if (confirmLogin) signInWithGoogle();
      return;
    }

    setIsSubmitting(true);
    try {
      // Use preview if available, otherwise analyze
      let aiEstimate = previewAiEstimate;
      if (!aiEstimate) {
        try {
          aiEstimate = await analyzeProperty({
            title: newProperty.title,
            description: newProperty.description,
            category: newProperty.category,
            sqm: newProperty.sqm,
            location: newProperty.location
          });
        } catch (aiErr) {
          console.error("AI Analysis failed, listing anyway", aiErr);
        }
      }

      // Default coordinates for demo purposes if not provided (near Kinshasa center)
      const defaultCoords = { lat: -4.32 + (Math.random() * 0.1), lng: 15.31 + (Math.random() * 0.1) };
      
      await addDoc(collection(db, 'properties'), {
        ...newProperty,
        image: newProperty.images[0] || '', // Use first image as main thumbnail
        coordinates: defaultCoords,
        ownerId: currentUser.uid,
        aiEstimate: aiEstimate,
        createdAt: serverTimestamp()
      });
      
      setShowListingModal(false);
      setPreviewAiEstimate(null);
      setNewProperty({
        title: '',
        location: '',
        price: 0,
        category: 'Villa',
        beds: 1,
        baths: 1,
        sqm: 100,
        description: '',
        image: '',
        images: [],
        status: 'available'
      });
      alert(lang === 'fr' ? "Annonce publiée !" : lang === 'en' ? "Listing posted!" : "Tangazo limewekwa!");
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'properties');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiSearch = async (e?: FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToUse = customQuery || aiQuery;
    if (!queryToUse.trim()) return;

    const userQuery = queryToUse.trim();
    if (!customQuery) {
      setAiQuery("");
    }
    setIsAskingAi(true);

    const isGuest = !currentUser;

    try {
      if (!isGuest) {
        // Save User Message to Firestore
        const messageCol = collection(db, 'users', currentUser.uid, 'messages');
        await addDoc(messageCol, {
          userId: currentUser.uid,
          role: 'user',
          content: userQuery,
          createdAt: serverTimestamp()
        });

        const lowerQuery = userQuery.toLowerCase();
        if (lowerQuery.includes('investisseur') || lowerQuery.includes('investor') || lowerQuery.includes('investir')) {
          await addDoc(messageCol, {
            userId: currentUser.uid,
            role: 'assistant',
            content: lang === 'fr' 
              ? "Nous avons un répertoire d'investisseurs qualifiés intéressés par le marché africain. Vous pouvez consulter notre liste de partenaires certifiés ci-dessous ou accéder à l'opportunité de Seed Round."
              : "We have a directory of qualified investors interested in the African market. You can view our certified partner list below or access the Seed Round opportunity.",
            createdAt: serverTimestamp()
          });
          setShowInvestorsList(true);
          setIsAskingAi(false);
          return;
        }

        // Format messages with history for context-rich conversation
        const msgHistory = chatMessages.map(m => ({ role: m.role, content: m.content }));
        msgHistory.push({ role: 'user', content: userQuery });

        const text = await chatWithAiAgent(msgHistory, properties, lang);

        const recommendationsMatch = text.match(/---RECOMMANDATIONS---\s*\[(.*?)\]/);
        let recommendations: string[] = [];
        
        if (recommendationsMatch) {
          recommendations = recommendationsMatch[1].split(',')
            .map(id => id.trim().replace(/['"]/g, ''))
            .filter(id => id !== "");
            
          if (recommendations.length > 0) {
            setFilteredProperties(properties.filter(p => recommendations.includes(p.id)));
          }
        }

        const cleanText = text.replace(/---RECOMMANDATIONS---[\s\S]*?---FIN---/, "").trim();
        
        // Save Assistant Response to Firestore
        await addDoc(messageCol, {
          userId: currentUser.uid,
          role: 'assistant',
          content: cleanText,
          createdAt: serverTimestamp(),
          recommendations: recommendations.length > 0 ? recommendations : null
        });
      } else {
        // Guest mode - store locally in state
        const newUserMessage: ChatMessage = {
          id: 'local-u-' + Date.now(),
          userId: 'guest',
          role: 'user',
          content: userQuery,
          createdAt: new Date()
        };
        const updatedGuestMsgs = [...guestChatMessages, newUserMessage];
        setGuestChatMessages(updatedGuestMsgs);

        const lowerQuery = userQuery.toLowerCase();
        if (lowerQuery.includes('investisseur') || lowerQuery.includes('investor') || lowerQuery.includes('investir')) {
          const newAssistantMessage: ChatMessage = {
            id: 'local-a-' + Date.now(),
            userId: 'guest',
            role: 'assistant',
            content: lang === 'fr' 
              ? "Nous avons un répertoire d'investisseurs qualifiés intéressés par le marché africain. Vous pouvez consulter notre liste de partenaires certifiés ci-dessous ou accéder à l'opportunité de Seed Round."
              : "We have a directory of qualified investors interested in the African market. You can view our certified partner list below or access the Seed Round opportunity.",
            createdAt: new Date()
          };
          setGuestChatMessages([...updatedGuestMsgs, newAssistantMessage]);
          setShowInvestorsList(true);
          setIsAskingAi(false);
          return;
        }

        const msgHistory = updatedGuestMsgs.map(m => ({ role: m.role, content: m.content }));
        const text = await chatWithAiAgent(msgHistory, properties, lang);

        const recommendationsMatch = text.match(/---RECOMMANDATIONS---\s*\[(.*?)\]/);
        let recommendations: string[] = [];
        
        if (recommendationsMatch) {
          recommendations = recommendationsMatch[1].split(',')
            .map(id => id.trim().replace(/['"]/g, ''))
            .filter(id => id !== "");
            
          if (recommendations.length > 0) {
            setFilteredProperties(properties.filter(p => recommendations.includes(p.id)));
          }
        }

        const cleanText = text.replace(/---RECOMMANDATIONS---[\s\S]*?---FIN---/, "").trim();
        
        const newAssistantMessage: ChatMessage = {
          id: 'local-a-' + Date.now(),
          userId: 'guest',
          role: 'assistant',
          content: cleanText,
          createdAt: new Date(),
          recommendations: recommendations.length > 0 ? recommendations : null
        };
        setGuestChatMessages([...updatedGuestMsgs, newAssistantMessage]);
      }

    } catch (error) {
      console.error("AI Search Error:", error);
      alert("Désolé, j'ai rencontré une erreur technique. Veuillez réessayer.");
    } finally {
      setIsAskingAi(false);
    }
  };

  const resetSearch = () => {
    setFilteredProperties(properties);
    setAiQuery("");
  };

  const clearChatHistory = async () => {
    if (!currentUser) {
      setGuestChatMessages([]);
      return;
    }
    if (!window.confirm(lang === 'fr' ? 'Effacer tout l\'historique ?' : 'Clear all chat history?')) return;
    
    try {
      const q = query(collection(db, 'users', currentUser.uid, 'messages'));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      setChatMessages([]);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const handleSaveFilter = async () => {
    if (!currentUser) {
      signInWithGoogle();
      return;
    }

    const name = window.prompt(lang === 'fr' ? "Nom de cette recherche :" : "Name for this search:");
    if (!name) return;

    setIsSavingFilter(true);
    try {
      const filterData: Omit<SavedFilter, 'id'> = {
        userId: currentUser.uid,
        name,
        category: filterCategory,
        priceRange: filterPriceRange,
        beds: filterBeds,
        baths: filterBaths,
        location: filterLocation,
        yearBuilt: filterYearBuilt,
        condition: filterCondition,
        amenities: filterAmenities,
        viewType: filterViewType,
        energyRating: filterEnergyRating,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'users', currentUser.uid, 'savedFilters'), filterData);
    } catch (error) {
      console.error("Error saving filter:", error);
    } finally {
      setIsSavingFilter(false);
    }
  };

  const applySavedFilter = (filter: SavedFilter) => {
    setFilterCategory(filter.category);
    setFilterPriceRange(filter.priceRange);
    setFilterBeds(filter.beds);
    setFilterBaths(filter.baths);
    setFilterLocation(filter.location);
    setFilterYearBuilt(filter.yearBuilt);
    setFilterCondition(filter.condition);
    setFilterAmenities(filter.amenities);
    setFilterViewType(filter.viewType);
    setFilterEnergyRating(filter.energyRating || 'All');
    setShowSavedOnly(false);
  };

  const deleteSavedFilter = async (e: React.MouseEvent, filterId: string) => {
    e.stopPropagation();
    if (!currentUser || !filterId) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'savedFilters', filterId));
    } catch (error) {
      console.error("Error deleting filter:", error);
    }
  };

  const resetFilters = () => {
    setFilterCategory('All');
    setFilterPriceRange([0, 10000000]);
    setFilterBeds(0);
    setFilterBaths(0);
    setFilterLocation('');
    setFilterYearBuilt(1900);
    setFilterCondition('All');
    setFilterAmenities([]);
    setFilterViewType('All');
    setFilterEnergyRating('All');
    setSortBy('newest');
    setShowSavedOnly(false);
  };

  const handleEnterApp = (language: 'fr' | 'en' | 'sw') => {
    setLang(language);
    setShowLanding(false);
    window.scrollTo(0, 0);
  };

  return (
    <AnimatePresence mode="wait">
      {showLanding ? (
        <AssistantLanding 
          onEnter={handleEnterApp} 
          favoritesCount={userFavorites.length}
          onOpenFavorites={() => {
            setShowLanding(false);
            setShowSavedOnly(true);
          }}
        />
      ) : selectedProperty ? (
        <PropertyDetailsPage 
          key="details"
          property={selectedProperty} 
          onBack={() => setSelectedProperty(null)}
          onContactAgent={handleContactAgent}
          onToggleFavorite={toggleFavorite}
          isFavorite={userFavorites.includes(selectedProperty.id)}
          lang={lang}
          t={t}
          onTogglePriceSubscription={togglePriceSubscription}
          isPriceSubscribed={userPriceSubs.includes(selectedProperty.id)}
        />
      ) : (
        <motion.div 
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen font-sans selection:bg-brand selection:text-white bg-dark-bg text-text-primary"
        >
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between ${
          isScrolled ? 'bg-dark-nav backdrop-blur-md shadow-lg border-b border-border-subtle' : 'bg-transparent'
        }`}
      >
        <div 
          className="flex items-center gap-4 group cursor-pointer" 
          onClick={() => {
            setShowLanding(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="Retourner au portail panafricain AFRICANOVA"
        >
          <ImmoAILogo size="md" showSlogan={false} />
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
          <button 
            onClick={() => setShowLanding(true)}
            className="text-[#F5D67A] font-bold hover:text-white transition-colors flex items-center gap-1 cursor-pointer bg-white/[0.04] px-3 py-1.5 rounded-lg border border-[#D4AF37]/30"
          >
            <span>← Accueil AFRICANOVA</span>
          </button>
          <a href="#properties" className="hover:text-brand transition-colors">{t('explore')}</a>
          <button 
            onClick={() => setShowManifesto(true)}
            className="hover:text-brand transition-colors"
          >
            {t('manifesto')}
          </button>
          <button 
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`hover:text-brand transition-colors flex items-center gap-2 relative ${showSavedOnly ? 'text-brand' : ''}`}
          >
            <div className="relative">
              <Heart size={16} fill={showSavedOnly ? "currentColor" : "none"} className={showSavedOnly ? 'animate-pulse' : ''} />
              {userFavorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  {userFavorites.length}
                </span>
              )}
            </div>
            {t('favorites')}
          </button>
          <button 
            onClick={() => setShowWalletModal(true)}
            className="hover:text-brand transition-colors"
          >
            {t('wallet')}
          </button>
          <button 
            onClick={() => setShowPdfExportModal(true)}
            className="hover:text-white text-brand font-bold bg-brand/10 border border-brand/30 px-3 py-1 rounded-full hover:bg-brand flex items-center gap-1.5 transition-all shadow-md text-xs"
            title="Exporter Rapport PDF"
          >
            <FileText size={13} />
            <span>PDF</span>
          </button>
          <button 
            onClick={() => setShowInvestorsList(true)}
            className="hover:text-brand transition-colors"
          >
            {t('investorDirectory')}
          </button>
          <a href="#investors" className="hover:text-brand transition-colors">{t('investors')}</a>
          <a href="#ads" className="hover:text-brand transition-colors">{t('marketing')}</a>
          <a href="#" className="hover:text-brand transition-colors">{t('services')}</a>
        </div>

        <div className="flex items-center gap-3">
          {/* Accent Color Palette Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-full shadow-md" title={lang === 'fr' ? 'Palette Couleurs (Or & Black, Or, Noir, etc.)' : 'Color Palette (Gold & Black, Gold, Black, etc.)'}>
            {/* Or & Black Prestige */}
            <button
              onClick={() => setAccentColor('gold-black')}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer relative overflow-hidden border border-amber-400/40 ${
                accentColor === 'gold-black' 
                  ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black scale-110 shadow-lg shadow-amber-400/50' 
                  : 'opacity-75 hover:opacity-100'
              }`}
              title={lang === 'fr' ? 'Or & Black (Prestige)' : 'Gold & Black (Prestige)'}
            >
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full bg-amber-400" />
                <div className="w-1/2 h-full bg-black border-l border-amber-400/30" />
              </div>
              {accentColor === 'gold-black' && <span className="relative z-10 w-1.5 h-1.5 bg-white rounded-full shadow" />}
            </button>

            {/* Or Royal */}
            <button
              onClick={() => setAccentColor('gold')}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                accentColor === 'gold' 
                  ? 'bg-amber-400 ring-2 ring-amber-300 ring-offset-2 ring-offset-black scale-110 shadow-lg shadow-amber-400/50' 
                  : 'bg-amber-600/70 hover:bg-amber-400 opacity-70 hover:opacity-100'
              }`}
              title={lang === 'fr' ? 'Or Royal' : 'Royal Gold'}
            >
              {accentColor === 'gold' && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
            </button>

            {/* Noir Onyx (Black) */}
            <button
              onClick={() => setAccentColor('black')}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer bg-black border border-amber-400/50 ${
                accentColor === 'black' 
                  ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black scale-110 shadow-lg shadow-black/80' 
                  : 'opacity-70 hover:opacity-100'
              }`}
              title={lang === 'fr' ? 'Black Onyx' : 'Onyx Black'}
            >
              {accentColor === 'black' && <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />}
            </button>

            {/* Vert Émeraude */}
            <button
              onClick={() => setAccentColor('emerald')}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                accentColor === 'emerald' 
                  ? 'bg-emerald-500 ring-2 ring-emerald-400 ring-offset-2 ring-offset-black scale-110 shadow-lg shadow-emerald-500/50' 
                  : 'bg-emerald-700/60 hover:bg-emerald-500 opacity-70 hover:opacity-100'
              }`}
              title={lang === 'fr' ? 'Vert Émeraude' : 'Emerald Green'}
            >
              {accentColor === 'emerald' && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
            </button>

            {/* Saphir Océan */}
            <button
              onClick={() => setAccentColor('sapphire')}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                accentColor === 'sapphire' 
                  ? 'bg-blue-500 ring-2 ring-blue-400 ring-offset-2 ring-offset-black scale-110 shadow-lg shadow-blue-500/50' 
                  : 'bg-blue-700/60 hover:bg-blue-500 opacity-70 hover:opacity-100'
              }`}
              title={lang === 'fr' ? 'Saphir Océan' : 'Sapphire Blue'}
            >
              {accentColor === 'sapphire' && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
            </button>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-brand hover:border-brand/40 transition-all shadow-lg cursor-pointer"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Language Toggle */}
          <button 
            onClick={() => {
              const order: ('fr' | 'en' | 'sw')[] = ['fr', 'en', 'sw'];
              const next = order[(order.indexOf(lang) + 1) % order.length];
              setLang(next);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 hover:text-white transition-all"
          >
            <span className={lang === 'fr' ? 'text-brand' : ''}>FR</span>
            <div className="w-[1px] h-3 bg-white/10" />
            <span className={lang === 'en' ? 'text-brand' : ''}>EN</span>
            <div className="w-[1px] h-3 bg-white/10" />
            <span className={lang === 'sw' ? 'text-brand' : ''}>SW</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowListingModal(true)}
                className="hidden sm:flex items-center gap-2 bg-[#1A1A1A] text-gray-400 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-brand hover:text-white transition-all duration-300"
              >
                <Plus size={18} />
                <span>{t('addProperty')}</span>
              </button>
              <div className="relative group">
                <div className="w-10 h-10 rounded-full border-2 border-brand overflow-hidden cursor-pointer shadow-lg shadow-brand/10">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-elevated flex items-center justify-center text-brand">
                      <UserIcon size={20} />
                    </div>
                  )}
                </div>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-surface-elevated border border-border-subtle rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all p-2 z-[60]">
                    <div className="px-4 py-2 border-b border-border-subtle mb-1">
                      <p className="text-xs font-bold text-text-primary truncate">{userProfile?.name || currentUser.displayName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold bg-brand/20 text-brand px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {userProfile?.role || 'Client'}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500">
                        ${(userProfile?.wallet || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <LogOut size={16} />
                    Se déconnecter
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => signInWithGoogle()}
              className="px-6 py-2.5 bg-brand text-white rounded-full text-sm font-bold shadow-lg shadow-brand/20 hover:bg-brand-dark transition-all"
            >
              {t('connect')}
            </button>
          )}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 md:hidden text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-dark-nav border-b border-white/5 p-6 md:hidden flex flex-col gap-6"
            >
            <a href="#properties" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-brand transition-colors">{t('explore')}</a>
            <button 
              onClick={() => { setShowManifesto(true); setIsMobileMenuOpen(false); }}
              className="text-left text-lg font-medium hover:text-brand transition-colors"
            >
              {t('manifesto')}
            </button>
            <button 
              onClick={() => { setShowSavedOnly(!showSavedOnly); setIsMobileMenuOpen(false); }}
              className={`text-left text-lg font-medium hover:text-brand transition-colors flex items-center justify-between ${showSavedOnly ? 'text-brand' : ''}`}
            >
              <div className="flex items-center gap-2">
                <Heart size={20} fill={showSavedOnly ? "currentColor" : "none"} className={showSavedOnly ? 'animate-pulse' : ''} />
                {t('favorites')}
              </div>
              {userFavorites.length > 0 && (
                <span className="bg-brand text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {userFavorites.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => { setShowInvestorsList(true); setIsMobileMenuOpen(false); }}
              className="text-left text-lg font-medium hover:text-brand transition-colors"
            >
              {t('investorDirectory')}
            </button>
            <a href="#investors" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-brand transition-colors">{t('investors')}</a>
              <a href="#ads" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium hover:text-brand transition-colors">{t('marketing')}</a>
              <a href="#" className="text-lg font-medium hover:text-brand transition-colors">{t('services')}</a>
              
              {/* Mobile Palette & Theme Selector */}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {lang === 'fr' ? 'Couleurs du thème' : 'Theme Colors'}
                  </span>
                  <div className="flex items-center gap-2">
                    {/* Or & Black */}
                    <button
                      onClick={() => setAccentColor('gold-black')}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all relative overflow-hidden border border-amber-400/40 ${
                        accentColor === 'gold-black' ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black scale-110' : 'opacity-70'
                      }`}
                      title="Or & Black (Prestige)"
                    >
                      <div className="absolute inset-0 flex">
                        <div className="w-1/2 h-full bg-amber-400" />
                        <div className="w-1/2 h-full bg-black border-l border-amber-400/30" />
                      </div>
                      {accentColor === 'gold-black' && <span className="relative z-10 w-1.5 h-1.5 bg-white rounded-full" />}
                    </button>
                    {/* Or Royal */}
                    <button
                      onClick={() => setAccentColor('gold')}
                      className={`w-7 h-7 rounded-full flex items-center justify-center bg-amber-400 transition-all ${
                        accentColor === 'gold' ? 'ring-2 ring-amber-300 ring-offset-2 ring-offset-black scale-110' : 'opacity-70'
                      }`}
                      title="Or Royal"
                    >
                      {accentColor === 'gold' && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
                    </button>
                    {/* Black Onyx */}
                    <button
                      onClick={() => setAccentColor('black')}
                      className={`w-7 h-7 rounded-full flex items-center justify-center bg-black border border-amber-400/60 transition-all ${
                        accentColor === 'black' ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black scale-110' : 'opacity-70'
                      }`}
                      title="Black Onyx"
                    >
                      {accentColor === 'black' && <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />}
                    </button>
                    {/* Emerald */}
                    <button
                      onClick={() => setAccentColor('emerald')}
                      className={`w-7 h-7 rounded-full flex items-center justify-center bg-emerald-500 transition-all ${
                        accentColor === 'emerald' ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-black scale-110' : 'opacity-70'
                      }`}
                      title="Vert Émeraude"
                    >
                      {accentColor === 'emerald' && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </button>
                    {/* Sapphire */}
                    <button
                      onClick={() => setAccentColor('sapphire')}
                      className={`w-7 h-7 rounded-full flex items-center justify-center bg-blue-500 transition-all ${
                        accentColor === 'sapphire' ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-black scale-110' : 'opacity-70'
                      }`}
                      title="Saphir Océan"
                    >
                      {accentColor === 'sapphire' && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-4">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    // Open PWA install if possible or just show info
                    alert(t('pwaAndroid'));
                  }}
                  className="w-full bg-white/5 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  <Compass size={18} />
                  {t('installApp')}
                </button>
                {currentUser ? (
                  <button onClick={() => signOut()} className="text-red-400 font-bold">{t('logout')}</button>
                ) : (
                  <button onClick={() => signInWithGoogle()} className="bg-brand text-white py-3 rounded-2xl font-bold">{t('connect')}</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-28 pb-20 px-6 md:px-20 overflow-hidden bg-black text-white">
        {/* Background Image */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <img 
            src={villaBg} 
            alt="ImmoAI Africa Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-105"
          />
        </div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40 -z-15 pointer-events-none" />

        {/* Animated Glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 animate-pulse -z-10 pointer-events-none" />

        <div className="w-full max-w-5xl relative z-10 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 flex items-center gap-2"
          >
            <span className="px-4 py-1.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[10px] font-black tracking-widest uppercase inline-block font-sans shadow-lg shadow-amber-400/10">
              SMART REAL ESTATE, STRONGER AFRICA
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-4 tracking-tight"
          >
            <span className="text-amber-400 drop-shadow-[0_2px_20px_rgba(245,158,11,0.4)]">Immo</span>
            <span className="text-emerald-400 drop-shadow-[0_2px_20px_rgba(16,185,129,0.5)]">AI</span>
            <span className="text-white font-light text-4xl md:text-6xl lg:text-7xl ml-3">Africa</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-2xl text-gray-200 leading-relaxed mb-8 max-w-3xl font-normal"
          >
            {lang === 'fr' 
              ? "L'immobilier intelligent propulsé par l'IA pour connecter acheteurs, vendeurs, investisseurs et bâtir une Afrique moderne." 
              : lang === 'sw' 
              ? "Jukwaa la kisasa la uwekezaji wa nyumba linalotumia AI na uvumbuzi kuunganisha Afrika nzima."
              : "Smart AI-powered real estate platform connecting buyers, sellers, and investors across Africa."
            }
            <span className="block mt-2 text-xs md:text-sm font-black text-amber-400 uppercase tracking-widest">
              — Conçu par Ingénieur Israël Carlito
            </span>
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-4xl bg-surface p-2 rounded-[32px] shadow-2xl border border-white/5 relative z-40"
          >
            <form onSubmit={(e) => {
              if (isAiMode) {
                handleAiSearch(e);
              } else {
                e.preventDefault();
                setShowFiltersDropdown(false);
              }
            }} className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
              <div className="flex-1 flex items-center px-6 gap-3 border-b md:border-b-0 md:border-r border-white/10 py-4">
                <Search className="text-gray-500" size={20} />
                <input 
                  type="text" 
                  placeholder={isAiMode ? t('aiPrompt') : t('standardPrompt')}
                  className="w-full bg-transparent outline-none text-white placeholder:text-gray-500 font-medium text-lg pr-2"
                  value={aiQuery}
                  onChange={(e) => {
                    setAiQuery(e.target.value);
                    if (!isAiMode) setFilterLocation(e.target.value);
                  }}
                />
                
                {/* Voice Search Button */}
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={toggleVoiceSearch}
                    className={`relative p-2 rounded-xl transition-all duration-300 group cursor-pointer shrink-0 ${
                      isListening 
                        ? 'bg-red-500/10 text-red-500 border border-red-500/30' 
                        : 'text-gray-400 hover:text-brand hover:bg-white/5 border border-transparent'
                    }`}
                    title={lang === 'fr' ? 'Recherche vocale' : lang === 'en' ? 'Voice Search' : 'Utafutaji kwa sauti'}
                  >
                    {isListening ? (
                      <>
                        <span className="absolute inset-0 rounded-xl bg-red-500/20 animate-ping" />
                        <MicOff size={18} />
                      </>
                    ) : (
                      <Mic size={18} />
                    )}
                  </button>
                )}
              </div>
              
              <div className="flex items-center px-2 gap-1 bg-white/5 mx-2 rounded-2xl p-1">
                <button 
                  type="button"
                  onClick={() => setIsAiMode(false)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    !isAiMode ? 'bg-white shadow-xl text-dark-bg' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {t('normalSearch')}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsAiMode(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isAiMode ? 'bg-brand shadow-xl text-white' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <Sparkles size={12} className={isAiMode ? "animate-pulse" : ""} />
                  {t('aiAgentMode')}
                </button>
              </div>

              <div className="flex items-center px-4 gap-2">
                <div className="relative">
                  <motion.button 
                    type="button"
                    animate={isApplyingFilter ? { scale: [1, 0.9, 1.1, 1] } : { scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all duration-300 ${
                      showFiltersDropdown ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <Sliders size={18} />
                    <span className="font-bold text-sm hidden lg:inline">{lang === 'fr' ? 'Filtres' : 'Filters'}</span>
                    {showFiltersDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </motion.button>

                  {/* Desktop Dropdown */}
                  <AnimatePresence>
                    {showFiltersDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-4 w-[320px] md:w-[480px] bg-surface-elevated border border-white/10 rounded-3xl shadow-2xl p-8 z-50 backdrop-blur-xl"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Category */}
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
                              {lang === 'fr' ? 'Type de Bien' : 'Property Type'}
                            </label>
                            <select 
                              value={filterCategory}
                              onChange={(e) => setFilterCategory(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-brand/50"
                            >
                              <option value="All" className="bg-dark-nav">Toutes catégories</option>
                              <option value="Villa" className="bg-dark-nav">Villa</option>
                              <option value="Appartement" className="bg-dark-nav">Appartement</option>
                              <option value="Terrain" className="bg-dark-nav">Terrain</option>
                              <option value="Bureau" className="bg-dark-nav">Bureau</option>
                            </select>
                          </div>

                          {/* Price Range */}
                          <div className="col-span-full">
                            <div className="flex justify-between items-center mb-4">
                               <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
                                {lang === 'fr' ? 'Budget Max' : 'Max Budget'}
                              </label>
                              <span className="text-brand font-bold text-sm">${filterPriceRange[1].toLocaleString()}</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="10000000" 
                              step="50000"
                              value={filterPriceRange[1]}
                              onChange={(e) => setFilterPriceRange([0, parseInt(e.target.value)])}
                              className="w-full accent-brand h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                            />
                          </div>

                          {/* Beds */}
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
                              {lang === 'fr' ? 'Chambres Min' : 'Min Bedrooms'}
                            </label>
                            <div className="flex items-center gap-3">
                               <button 
                                type="button"
                                onClick={() => setFilterBeds(Math.max(0, filterBeds - 1))}
                                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"
                               >-</button>
                               <span className="flex-1 text-center font-bold text-lg">{filterBeds}+</span>
                               <button 
                                type="button"
                                onClick={() => setFilterBeds(filterBeds + 1)}
                                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"
                               >+</button>
                            </div>
                          </div>

                          {/* Baths */}
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
                              {lang === 'fr' ? 'Salles de bain' : 'Bathrooms'}
                            </label>
                            <div className="flex items-center gap-3">
                               <button 
                                type="button"
                                onClick={() => setFilterBaths(Math.max(0, filterBaths - 1))}
                                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"
                               >-</button>
                               <span className="flex-1 text-center font-bold text-lg">{filterBaths}+</span>
                               <button 
                                type="button"
                                onClick={() => setFilterBaths(filterBaths + 1)}
                                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10"
                               >+</button>
                            </div>
                          </div>

                          {/* Year Built */}
                          <div className="col-span-full">
                            <div className="flex justify-between items-center mb-4">
                              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500">
                                {t('yearBuilt')}
                              </label>
                              <span className="text-brand font-bold text-sm">{filterYearBuilt === 1900 ? (lang === 'fr' ? 'Tous' : 'Any') : filterYearBuilt}</span>
                            </div>
                            <input 
                              type="range" 
                              min="1900" 
                              max="2024" 
                              step="1"
                              value={filterYearBuilt}
                              onChange={(e) => setFilterYearBuilt(parseInt(e.target.value))}
                              className="w-full accent-brand h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                            />
                          </div>

                          {/* Condition */}
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
                              {t('condition')}
                            </label>
                            <select 
                              value={filterCondition}
                              onChange={(e) => setFilterCondition(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-brand/50"
                            >
                              <option value="All" className="bg-dark-nav">{lang === 'fr' ? 'Toutes' : 'All'}</option>
                              <option value="New" className="bg-dark-nav">{t('new')}</option>
                              <option value="Excellent" className="bg-dark-nav">{t('excellent')}</option>
                              <option value="Good" className="bg-dark-nav">{t('good')}</option>
                              <option value="Needs Work" className="bg-dark-nav">{t('needsWork')}</option>
                            </select>
                          </div>

                          {/* View Type */}
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
                              {t('viewType')}
                            </label>
                            <select 
                              value={filterViewType}
                              onChange={(e) => setFilterViewType(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-brand/50"
                            >
                              <option value="All" className="bg-dark-nav">{lang === 'fr' ? 'Toutes' : 'All'}</option>
                              <option value="Ocean" className="bg-dark-nav">{t('ocean')}</option>
                              <option value="City" className="bg-dark-nav">{t('city')}</option>
                              <option value="Mountain" className="bg-dark-nav">{t('mountain')}</option>
                              <option value="Garden" className="bg-dark-nav">{t('garden')}</option>
                            </select>
                          </div>

                          {/* Amenities */}
                          <div className="col-span-full">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
                              {t('amenities')}
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { id: 'Pool', icon: <Waves size={14} /> },
                                { id: 'Gym', icon: <Dumbbell size={14} /> },
                                { id: 'Balcony', icon: <Layout size={14} /> }
                              ].map((amenity) => (
                                <button
                                  key={amenity.id}
                                  type="button"
                                  onClick={() => {
                                    if (filterAmenities.includes(amenity.id)) {
                                      setFilterAmenities(filterAmenities.filter(a => a !== amenity.id));
                                    } else {
                                      setFilterAmenities([...filterAmenities, amenity.id]);
                                    }
                                  }}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                                    filterAmenities.includes(amenity.id)
                                      ? 'bg-brand/20 border-brand text-brand'
                                      : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                                  }`}
                                >
                                  {filterAmenities.includes(amenity.id) ? <Check size={14} /> : amenity.icon}
                                  {t(amenity.id.toLowerCase() as any)}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                           <button 
                            type="button"
                            onClick={() => {
                              setFilterCategory('All');
                              setFilterPriceRange([0, 10000000]);
                              setFilterBeds(0);
                              setFilterBaths(0);
                              setFilterLocation('');
                              setFilterYearBuilt(1900);
                              setFilterCondition('All');
                              setFilterAmenities([]);
                              setFilterViewType('All');
                              setAiQuery('');
                            }}
                            className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 font-bold hover:text-white transition-colors"
                           >
                            Réinitialiser
                           </button>
                           <button 
                            type="button"
                            onClick={() => {
                              setIsApplyingFilter(true);
                              setShowFiltersDropdown(false);
                              setTimeout(() => {
                                setIsApplyingFilter(false);
                              }, 600);
                            }}
                            className="flex-1 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-all"
                           >
                            {lang === 'fr' ? 'Appliquer' : 'Apply'}
                           </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  type="submit"
                  disabled={isAskingAi}
                  className="bg-brand text-white p-4 rounded-2xl font-bold hover:bg-brand-dark transition-all duration-300 shadow-lg shadow-brand/30 flex items-center justify-center min-w-[60px] md:min-w-[140px]"
                >
                  {isAskingAi ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <div className="flex items-center gap-2">
                      {isAiMode ? <Sparkles size={20} className="animate-pulse" /> : <Search size={20} />}
                      <span className="hidden md:inline uppercase tracking-widest text-sm font-black">
                        {isAiMode ? t('analyze') : t('explore')}
                      </span>
                    </div>
                  )}
                </button>
              </div>
            </form>

            {!isAiMode && (
              <div className="mt-4 flex flex-wrap gap-2 px-4">
                {[
                  { id: 'Pool', icon: <Waves size={14} /> },
                  { id: 'Gym', icon: <Dumbbell size={14} /> },
                  { id: 'Balcony', icon: <Layout size={14} /> }
                ].map((amenity) => (
                  <button
                    key={amenity.id}
                    onClick={() => {
                      if (filterAmenities.includes(amenity.id)) {
                        setFilterAmenities(filterAmenities.filter(a => a !== amenity.id));
                      } else {
                        setFilterAmenities([...filterAmenities, amenity.id]);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                      filterAmenities.includes(amenity.id)
                        ? 'bg-brand border-brand text-white shadow-lg shadow-brand/20'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {filterAmenities.includes(amenity.id) ? <Check size={14} /> : amenity.icon}
                    {t(amenity.id.toLowerCase() as any)}
                  </button>
                ))}
                
                {filterAmenities.length > 0 && (
                  <button 
                    onClick={() => setFilterAmenities([])}
                    className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white px-2 mt-1"
                  >
                    {lang === 'fr' ? 'Effacer' : 'Clear'}
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* Quick Location Suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2 mt-8 mb-10"
          >
            <span className="text-[10px] text-gray-500 uppercase font-black mr-2 self-center">{lang === 'fr' ? 'Insights Location :' : 'Location Insights:'}</span>
            {['Gombe, Kinshasa', 'Kiyovu, Kigali', 'Plateau, Abidjan', 'Almadies, Dakar'].map(loc => (
              <button
                key={loc}
                onClick={() => {
                  const q = lang === 'fr' ? `Analyse moi le quartier de ${loc}` : `Analyze the neighborhood of ${loc}`;
                  setAiQuery(q);
                }}
                className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[11px] text-gray-400 hover:text-white hover:bg-brand/10 hover:border-brand/30 transition-all font-bold"
              >
                {loc}
              </button>
            ))}
          </motion.div>

          {/* Action flow buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-14"
          >
            <button 
              onClick={() => {
                const el = document.getElementById('featured-properties') || document.querySelector('section[id*="properties"]');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
                }
              }}
              className="px-8 py-4 bg-brand hover:bg-brand-dark text-white font-bold rounded-2xl shadow-2xl shadow-brand/25 transition duration-300 text-sm cursor-pointer"
            >
              Explorer
            </button>

            <button 
              onClick={() => {
                const el = document.getElementById('ads') || document.querySelector('section[id*="market"]');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' });
                }
              }}
              className="px-8 py-4 border border-white/40 hover:bg-white/10 hover:border-white text-white transition rounded-2xl font-semibold text-sm"
            >
              Investir
            </button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl"
          >
            <div className="backdrop-blur-md bg-white/5 p-5 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 hover:border-brand/35 transition-all duration-300">
              <span className="text-3xl mb-3">🏠</span>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-300">Propriétés IA</p>
            </div>

            <div className="backdrop-blur-md bg-white/5 p-5 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 hover:border-brand/35 transition-all duration-300">
              <span className="text-3xl mb-3">📊</span>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-300">Analyses prédictives</p>
            </div>

            <div className="backdrop-blur-md bg-white/5 p-5 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 hover:border-brand/35 transition-all duration-300">
              <span className="text-3xl mb-3">🤖</span>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-300">Assistant intelligent</p>
            </div>

            <div className="backdrop-blur-md bg-white/5 p-5 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 hover:border-brand/35 transition-all duration-300">
              <span className="text-3xl mb-3">🌍</span>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-300">Afrique connectée</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Official ImmoAI Africa Visual Poster & Value Pillars Showcase */}
      <BrandHeroShowcase 
        lang={lang} 
        onExplore={() => {
          const el = document.getElementById('properties');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenAi={() => {
          window.dispatchEvent(new CustomEvent('open-ai-widget'));
        }}
      />

      {/* AI Response Message History */}
      <AnimatePresence>
        {activeChatMessages.length > 0 && (
          <div className="max-w-4xl mx-auto px-6 mb-12 space-y-8">
            <div className="flex items-center justify-between px-6">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Conversation History</h3>
              <button 
                onClick={clearChatHistory}
                className="flex items-center gap-2 text-[10px] font-black text-gray-500 hover:text-brand uppercase tracking-widest transition-colors"
              >
                <Trash2 size={12} />
                {lang === 'fr' ? 'Effacer l\'historique' : 'Clear History'}
              </button>
            </div>
            
            {activeChatMessages.map((msg, idx) => (
              <motion.div
                key={msg.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.role === 'user' ? (
                  <div className="max-w-[80%] bg-surface-elevated border border-white/10 p-6 rounded-[32px] rounded-tr-none text-white shadow-xl">
                    <p className="text-sm font-medium">{msg.content}</p>
                  </div>
                ) : (
                  <div className="bg-surface-elevated border border-white/5 p-8 md:p-12 rounded-[50px] shadow-2xl relative group overflow-hidden backdrop-blur-3xl w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.05] via-transparent to-brand-accent/[0.05] pointer-events-none" />
                    <div className="flex flex-col md:flex-row gap-8 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0 border border-white/10 shadow-2xl">
                         <Sparkles className="text-brand" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400 leading-relaxed text-sm font-medium">
                          {msg.content.split('\n').map((line, i) => {
                            if (!line.trim()) return null;
                            const isTitle = line.match(/^\d\./) || line.includes(':');
                            if (isTitle) {
                              return (
                                <div key={i} className="col-span-full mt-4 first:mt-0">
                                  <h4 className="text-white font-bold text-base flex items-center gap-3 mb-3 uppercase tracking-tight">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                                    {line.replace(/^\d\.\s*/, '')}
                                  </h4>
                                </div>
                              );
                            }
                            return (
                              <div key={i} className="flex gap-3 items-start group/line">
                                <Plus size={12} className="text-brand shrink-0 mt-1 opacity-40 group-hover/line:opacity-100 transition-opacity" />
                                <p className="opacity-70 group-hover/line:opacity-100 transition-opacity">{line}</p>
                              </div>
                            );
                          })}
                        </div>
                        
                        {msg.recommendations && msg.recommendations.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-white/5">
                            <button 
                              onClick={() => {
                                setFilteredProperties(properties.filter(p => msg.recommendations?.includes(p.id)));
                                document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand/10 text-[10px] text-brand font-black uppercase tracking-[0.2em] border border-brand/20 hover:bg-brand hover:text-white transition-all"
                            >
                              <LayoutGrid size={14} />
                              {lang === 'fr' ? 'Voir Recommandations' : 'View Recommendations'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            
            {isAskingAi && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex flex-col items-start"
              >
                <div className="bg-surface-elevated border border-white/5 p-8 rounded-[40px] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand animate-pulse">
                    <Sparkles size={20} />
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-brand rounded-full animate-bounce" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Brand Pillars Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Pillar 1: Premium AI Real Estate */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 bg-brand/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 transition-all duration-700 group-hover:scale-105">
                <defs>
                  <linearGradient id="premiumGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4A017" />
                    <stop offset="100%" stopColor="#8B6914" />
                  </linearGradient>
                </defs>
                <path d="M20 45 L50 15 L80 45 L80 85 L20 85 Z" fill="none" stroke="url(#premiumGold)" strokeWidth="1.5" />
                <path d="M40 35 H60 V55 H40 Z" fill="url(#premiumGold)" opacity="0.1" />
                <path d="M50 35 V55 M40 45 H60" stroke="url(#premiumGold)" strokeWidth="0.5" />
                <circle cx="10" cy="55" r="1" fill="url(#premiumGold)" />
                <circle cx="10" cy="75" r="1" fill="url(#premiumGold)" />
                <circle cx="90" cy="55" r="1" fill="url(#premiumGold)" />
                <circle cx="90" cy="75" r="1" fill="url(#premiumGold)" />
                <path d="M15 55 H10 M15 75 H10 M85 55 H90 M85 75 H90" stroke="url(#premiumGold)" strokeWidth="0.5" />
              </svg>
            </div>
            <h4 className="font-display font-black text-xl text-white mb-3 uppercase tracking-tighter transition-colors group-hover:text-brand">IMMOBILIER PREMIUM</h4>
            <div className="w-8 h-[1px] bg-brand/30 mb-5 mx-auto group-hover:w-16 transition-all duration-700" />
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] leading-relaxed max-w-[200px]">
              ARCHITECTURE FUTURISTE & LOGEMENTS CONNECTÉS
            </p>
          </motion.div>

          {/* Pillar 2: AI Tech & Intelligence */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 bg-brand/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="w-full h-full relative z-10 flex items-center justify-center">
                <div className="relative">
                  <span className="text-6xl font-display font-black text-white selection:bg-transparent">IA</span>
                  <div className="absolute -top-4 -left-4 w-12 h-12 border border-brand/20 rounded-full animate-spin-slow" />
                  <div className="absolute -bottom-2 -right-4 w-8 h-8 border border-white/10 rounded-full animate-reverse-spin" />
                </div>
              </div>
            </div>
            <h4 className="font-display font-black text-xl text-white mb-3 uppercase tracking-tighter transition-colors group-hover:text-brand">INTELLIGENCE ARTIFICIELLE</h4>
            <div className="w-8 h-[1px] bg-brand/30 mb-5 mx-auto group-hover:w-16 transition-all duration-700" />
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] leading-relaxed max-w-[200px]">
              DATA ANALYSIS & ALGORITHMES PRÉDICTIFS
            </p>
          </motion.div>

          {/* Pillar 3: Africa & Global Growth */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 bg-brand/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 transition-all duration-700 group-hover:scale-105">
                <path 
                  d="M30 25 Q40 20 60 25 Q75 30 75 50 Q75 65 55 85 Q45 90 35 75 Q25 65 25 50 Q25 35 30 25" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="1" 
                  className="opacity-10"
                />
                <g transform="translate(45, 45)">
                  <rect x="0" y="20" width="3" height="15" fill="url(#premiumGold)" />
                  <rect x="8" y="10" width="3" height="25" fill="url(#premiumGold)" />
                  <rect x="16" y="0" width="3" height="35" fill="url(#premiumGold)" />
                  <path d="M0 20 L20 -2" fill="none" stroke="#E63946" strokeWidth="1.5" />
                </g>
              </svg>
            </div>
            <h4 className="font-display font-black text-xl text-white mb-3 uppercase tracking-tighter transition-colors group-hover:text-brand">CROISSANCE AFRIQUE</h4>
            <div className="w-8 h-[1px] bg-brand/30 mb-5 mx-auto group-hover:w-16 transition-all duration-700" />
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] leading-relaxed max-w-[200px]">
              INVESTISSEMENT DIASPORA & DÉVELOPPEMENT LOCAL
            </p>
          </motion.div>
        </div>
      </section>

      {/* Favorites Section - Dedicated */}
      {!showSavedOnly && userFavorites.length > 0 && (
        <section id="favorites-showcase" className="max-w-7xl mx-auto px-6 py-20 bg-dark-bg/50 border-y border-border-subtle mb-16 overflow-hidden">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand border border-brand/20">
                <Heart size={24} fill="currentColor" className="animate-pulse" />
              </div>
              <div>
                <h3 className="font-display text-4xl font-black text-text-primary uppercase tracking-tighter">
                  {t('yourFavorites')}
                </h3>
                <p className="text-gray-500 text-sm font-medium">{t('favoritesSubtitle')}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setShowSavedOnly(true);
                document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-brand text-[10px] font-black uppercase tracking-[0.2em] hover:underline"
            >
              {lang === 'fr' ? 'Voir tout' : 'View All'}
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar -mx-6 px-6">
            {properties.filter(p => userFavorites.includes(p.id)).map((house) => (
              <motion.div
                key={`fav-${house.id}`}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedProperty(house)}
                className="min-w-[320px] md:min-w-[400px] group bg-surface-elevated rounded-[40px] overflow-hidden border border-border-subtle hover:border-brand/40 transition-all duration-500 cursor-pointer shadow-xl relative"
              >
                <div className="relative h-64 overflow-hidden">
                   <img src={house.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={house.title} />
                   <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent" />
                   <div className="absolute top-4 right-4">
                      <div className="bg-brand text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
                        {house.category}
                      </div>
                   </div>
                   <div className="absolute bottom-4 left-6">
                      <p className="text-white text-xl font-display font-black tracking-tighter">${house.price.toLocaleString()}</p>
                   </div>
                </div>
                <div className="p-8">
                  <h4 className="font-display font-black text-xl text-text-primary uppercase tracking-tighter truncate group-hover:text-brand transition-colors">
                    {house.title}
                  </h4>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1 opacity-60 flex items-center gap-2">
                    <MapPin size={10} className="text-brand" />
                    {house.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Property Section */}
      <section id="properties" className="max-w-7xl mx-auto px-6 pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-display text-3xl font-bold text-white uppercase tracking-tight">
                {showSavedOnly ? t('favorites') : (lang === 'fr' ? 'Nos Propriétés' : lang === 'en' ? 'Our Properties' : 'Mali Yetu')}
              </h3>
              {showSavedOnly && (
                <button 
                  onClick={() => setShowSavedOnly(false)}
                  className="p-1 px-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-gray-500 hover:text-white transition-all"
                >
                  {lang === 'fr' ? 'Voir tout' : 'View All'}
                </button>
              )}
            </div>
            <p className="text-gray-500">
              {showSavedOnly 
                ? (lang === 'fr' ? `Vous avez ${userFavorites.length} favoris sauvegardés.` : `You have ${userFavorites.length} saved favorites.`)
                : filteredProperties.length === properties.length 
                  ? (lang === 'fr' ? "Dernières opportunités exclusives." : lang === 'en' ? "Latest exclusive opportunities." : "Fursa za hivi karibuni za kipekee.") 
                  : `${filteredProperties.length} ${t('resultsFound') || (lang === 'fr' ? 'résultats trouvés.' : lang === 'en' ? 'results found.' : 'matokeo yamepatikana.')}`}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* PDF Report Button */}
            <button
              onClick={() => setShowPdfExportModal(true)}
              className="flex items-center gap-2 bg-brand/10 border border-brand/30 text-brand hover:bg-brand hover:text-white px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-brand/10 cursor-pointer"
              title="Exporter le rapport PDF"
            >
              <FileText size={15} />
              <span>{lang === 'fr' ? 'Rapport PDF' : lang === 'en' ? 'PDF Report' : 'Ripoti ya PDF'}</span>
            </button>
            {/* Sort Toggle */}
            <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-2xl px-4 py-2 hover:border-brand/40 transition-colors">
              <ArrowUpDown size={14} className="text-brand" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none">{t('sortBy')}</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white outline-none appearance-none cursor-pointer pr-4"
                >
                  <option value="newest" className="bg-dark-bg">{t('newest')}</option>
                  <option value="price-asc" className="bg-dark-bg">{t('priceLow')}</option>
                  <option value="price-desc" className="bg-dark-bg">{t('priceHigh')}</option>
                </select>
              </div>
            </div>

            {/* View Toggle */}
            <div className="bg-surface border border-white/10 rounded-2xl p-1 flex">
              <button 
                onClick={() => setIsMapView(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  !isMapView ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-gray-500 hover:text-white'
                }`}
              >
                <LayoutGrid size={16} />
                <span className="hidden sm:inline">{t('viewList')}</span>
              </button>
              <button 
                onClick={() => setIsMapView(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isMapView ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-gray-500 hover:text-white'
                }`}
              >
                <MapIcon size={16} />
                <span className="hidden sm:inline">{t('viewMap')}</span>
              </button>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl p-1.5 flex gap-1 overflow-x-auto no-scrollbar">
              {['All', 'Villa', 'Apartment', 'Land'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    filterCategory === cat ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {cat === 'All' ? t('allCategories') : cat}
                </button>
              ))}
            </div>

            <button 
              onClick={handleSaveFilter}
              disabled={isSavingFilter}
              className="p-3 bg-brand/10 border border-brand/20 rounded-2xl text-brand hover:bg-brand hover:text-white transition-all disabled:opacity-50"
              title={lang === 'fr' ? "Sauvegarder cette recherche" : "Save this search"}
            >
              <Bookmark size={18} />
            </button>

            <button 
              onClick={resetFilters}
              className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-colors"
              title="Clear Filters"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          {/* Saved Searches List */}
          {savedFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">
                {lang === 'fr' ? 'Recherches Sauvegardées :' : 'Saved Searches:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {savedFilters.map((filter) => (
                  <div 
                    key={filter.id}
                    className="flex items-center gap-1 group"
                  >
                    <button
                      onClick={() => applySavedFilter(filter)}
                      className="px-3 py-1.5 rounded-full bg-surface-elevated border border-white/10 text-[10px] font-bold text-gray-400 hover:text-white hover:border-brand/40 transition-all flex items-center gap-2"
                    >
                      <Bookmark size={10} className="text-brand" />
                      {filter.name}
                    </button>
                    <button 
                      onClick={(e) => deleteSavedFilter(e, filter.id!)}
                      className="p-1 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Extended Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-16 bg-white/5 p-6 rounded-[40px] border border-white/5 shadow-2xl backdrop-blur-sm">
          <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{lang === 'fr' ? 'Gamme de Prix' : 'Price Range'}</label>
                {(filterPriceRange[0] !== 0 || filterPriceRange[1] !== 10000000) && (
                  <button onClick={() => setFilterPriceRange([0, 10000000])} className="text-brand hover:text-white transition-colors">
                    <RotateCcw size={10} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-brand font-bold bg-brand/10 px-3 py-1 rounded-full border border-brand/20">
                ${filterPriceRange[0].toLocaleString()} - ${filterPriceRange[1].toLocaleString()}
              </div>
            </div>
            
            <div className="range-slider-container px-2 pt-2">
              <div className="range-slider-track">
                <div 
                  className="range-slider-progress" 
                  style={{ 
                    left: `${(filterPriceRange[0] / 10000000) * 100}%`, 
                    width: `${((filterPriceRange[1] - filterPriceRange[0]) / 10000000) * 100}%` 
                  }} 
                />
              </div>
              <input 
                type="range"
                min="0"
                max="10000000"
                step="50000"
                value={filterPriceRange[0]}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), filterPriceRange[1] - 50000);
                  setFilterPriceRange([val, filterPriceRange[1]]);
                }}
                className="range-slider-input"
              />
              <input 
                type="range"
                min="0"
                max="10000000"
                step="50000"
                value={filterPriceRange[1]}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), filterPriceRange[0] + 50000);
                  setFilterPriceRange([filterPriceRange[0], val]);
                }}
                className="range-slider-input"
              />
            </div>
          </div>
          <div className="space-y-2 sm:col-span-1 lg:col-span-1 xl:col-span-1">
            <div className="flex items-center justify-between px-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('location')}</label>
              {filterLocation && (
                <button onClick={() => setFilterLocation('')} className="text-brand hover:text-white transition-colors">
                  <RotateCcw size={10} />
                </button>
              )}
            </div>
            <div className="relative">
              <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text"
                placeholder={t('propertyLocation')}
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full bg-surface-elevated border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-brand"
              />
            </div>
          </div>
          <div className="space-y-2 sm:col-span-1 lg:col-span-1 xl:col-span-1">
            <div className="flex items-center justify-between px-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('beds')}</label>
              {filterBeds > 0 && (
                <button onClick={() => setFilterBeds(0)} className="text-brand hover:text-white transition-colors">
                  <RotateCcw size={10} />
                </button>
              )}
            </div>
            <select 
              value={filterBeds}
              onChange={(e) => setFilterBeds(Number(e.target.value))}
              className="w-full bg-surface-elevated border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-brand appearance-none"
            >
              {[0, 1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n === 0 ? t('allCategories') : `${n}+`}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 sm:col-span-1 lg:col-span-1 xl:col-span-1">
            <div className="flex items-center justify-between px-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('baths')}</label>
              {filterBaths > 0 && (
                <button onClick={() => setFilterBaths(0)} className="text-brand hover:text-white transition-colors">
                  <RotateCcw size={10} />
                </button>
              )}
            </div>
            <select 
              value={filterBaths}
              onChange={(e) => setFilterBaths(Number(e.target.value))}
              className="w-full bg-surface-elevated border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-brand appearance-none"
            >
              {[0, 1, 2, 3, 4].map(n => (
                <option key={n} value={n}>{n === 0 ? t('allCategories') : `${n}+`}</option>
              ))}
            </select>
          </div>

          {/* Energy Rating Dropdown */}
          <div className="space-y-2 sm:col-span-1 lg:col-span-1 xl:col-span-1">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1.5">
                <Leaf size={12} className="text-emerald-400" />
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {t('energyRatingLabel') || (lang === 'fr' ? 'DPE Énergie' : 'Energy Rating')}
                </label>
              </div>
              {filterEnergyRating !== 'All' && (
                <button 
                  onClick={() => setFilterEnergyRating('All')} 
                  className="text-brand hover:text-white transition-colors flex items-center gap-0.5 text-[9px]"
                  title="Réinitialiser le filtre énergie"
                >
                  <RotateCcw size={10} />
                </button>
              )}
            </div>
            <div className="relative">
              <select 
                value={filterEnergyRating}
                onChange={(e) => setFilterEnergyRating(e.target.value)}
                className={`w-full bg-surface-elevated border rounded-xl px-3.5 py-2 pr-8 text-sm text-white outline-none focus:border-brand appearance-none cursor-pointer transition-all ${
                  filterEnergyRating !== 'All' 
                    ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)] text-emerald-300 font-bold' 
                    : 'border-white/10'
                }`}
              >
                <option value="All" className="bg-dark-bg text-white">{t('allEnergyRatings') || (lang === 'fr' ? 'Toutes les classes' : 'All Energy Ratings')}</option>
                <option value="A-top" className="bg-dark-bg text-emerald-400 font-bold">{t('topEcoRatings') || (lang === 'fr' ? '🌿 Classes A+ & A (Top Éco)' : '🌿 Grades A+ & A (Top Eco)')}</option>
                <option value="A+" className="bg-dark-bg text-emerald-300">⚡ {lang === 'fr' ? 'Classe A+ (Ultra Éco)' : 'Grade A+ (Ultra Eco)'}</option>
                <option value="A" className="bg-dark-bg text-emerald-300">🌱 {lang === 'fr' ? 'Classe A (Haute Efficacité)' : 'Grade A (High Efficiency)'}</option>
                <option value="B+" className="bg-dark-bg text-teal-300">✨ {lang === 'fr' ? 'Classe B+ (Très Bon)' : 'Grade B+ (Very Good)'}</option>
                <option value="B" className="bg-dark-bg text-teal-300">🔋 {lang === 'fr' ? 'Classe B (Bon)' : 'Grade B (Good)'}</option>
                <option value="C" className="bg-dark-bg text-amber-300">🏢 {lang === 'fr' ? 'Classe C (Standard)' : 'Grade C (Standard)'}</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Prominent View Mode Switch */}
        <div className="mb-10 p-1.5 bg-white/5 border border-white/10 rounded-3xl max-w-sm mx-auto flex items-center shadow-2xl relative overflow-hidden backdrop-blur-md">
          <button
            onClick={() => setIsMapView(false)}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all duration-300 relative z-10 cursor-pointer ${
              !isMapView ? 'text-black font-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutGrid size={14} />
            <span>{lang === 'fr' ? 'Vue Grille' : lang === 'en' ? 'Grid View' : 'Orodha ya Bidhaa'}</span>
            {!isMapView && (
              <motion.div
                layoutId="activeViewMode"
                className="absolute inset-0 bg-brand rounded-2xl -z-10 shadow-[0_4px_16px_rgba(234,179,8,0.3)]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setIsMapView(true)}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all duration-300 relative z-10 cursor-pointer ${
              isMapView ? 'text-black font-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            <MapIcon size={14} />
            <span>{lang === 'fr' ? 'Vue Carte' : lang === 'en' ? 'Map View' : 'Ramani ya GPS'}</span>
            {isMapView && (
              <motion.div
                layoutId="activeViewMode"
                className="absolute inset-0 bg-brand rounded-2xl -z-10 shadow-[0_4px_16px_rgba(234,179,8,0.3)]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-surface rounded-[32px] h-[500px] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <>
          <AnimatePresence mode="wait">
            {filteredProperties.length === 0 ? (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-500 mb-6">
                  {showSavedOnly ? <Heart size={32} /> : <Search size={32} />}
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  {showSavedOnly ? t('noFavorites') : t('noResults')}
                </h4>
                <button 
                  onClick={() => {
                    if (showSavedOnly) {
                      setShowSavedOnly(false);
                    } else {
                      resetFilters();
                      resetSearch();
                    }
                  }}
                  className="text-brand font-bold hover:underline"
                >
                  {showSavedOnly 
                    ? (lang === 'fr' ? 'Parcourir le catalogue' : lang === 'en' ? 'Browse catalog' : 'Vinjari orodha')
                    : (lang === 'fr' ? 'Réinitialiser les filtres' : lang === 'en' ? 'Reset filters' : 'Anza upya vichujio')
                  }
                </button>
              </motion.div>
            ) : isMapView ? (
              <motion.div 
                key="map-view"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="h-[600px] w-full rounded-[40px] overflow-hidden border border-white/10 shadow-2xl relative mb-16"
              >
                {!hasValidKey ? (
                  <div className="absolute inset-0 bg-surface-elevated flex flex-col items-center justify-center text-center p-8">
                    <MapIcon size={48} className="text-brand mb-4 opacity-50" />
                    <h4 className="text-xl font-bold mb-4">API Key Required for GPS Maps</h4>
                    <p className="text-gray-400 max-w-md mb-6 text-sm">
                      Please add <strong>GOOGLE_MAPS_PLATFORM_KEY</strong> to your environment variables in Settings.
                    </p>
                    <div className="p-4 bg-white/5 rounded-2xl text-xs text-left font-mono">
                      1. Open Settings -&gt; Secrets<br/>
                      2. Add GOOGLE_MAPS_PLATFORM_KEY<br/>
                      3. Paste your Google Cloud API Key
                    </div>
                  </div>
                ) : (
                  <APIProvider apiKey={API_KEY} version="weekly">
                    <Map
                      defaultCenter={{ lat: -1.95, lng: 30.06 }} // Center on Kigali (Africa center-ish)
                      defaultZoom={4}
                      mapId="IMMOAI_DARK_MAP"
                      style={{ width: '100%', height: '100%' }}
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      gestureHandling={'greedy'}
                      disableDefaultUI={true}
                    >
                      {filteredProperties.map(property => (
                        <MapMarker key={property.id} property={property} />
                      ))}
                    </Map>
                    <MapZoomControls />
                  </APIProvider>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key={`grid-${filterCategory}-${sortBy}-${filterBeds}-${filterBaths}-${filterLocation}-${showSavedOnly}-${filterPriceRange.join(',')}`}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={propertyGridContainerVariants}
              >
                <AnimatePresence mode="popLayout">
                  {filteredProperties.map((house) => (
                    <motion.div
                      layout
                      key={house.id}
                      variants={propertyCardVariants}
                      onClick={() => setSelectedProperty(house)}
                      className="group bg-surface-elevated rounded-[40px] overflow-hidden border border-white/5 hover:border-brand/40 transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-[0_20px_50px_rgba(212,160,23,0.1)]"
                    >
                      <PropertyGallery
                        images={house.images && house.images.length > 0 ? house.images : [house.image]}
                        title={house.title}
                        showThumbnails={false}
                        aspectRatio="h-80"
                        lang={lang}
                        badges={
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-4 py-1.5 bg-black/50 backdrop-blur-md text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/10 shadow-lg">
                                {house.category}
                              </span>
                              <EnergyRatingBadge 
                                rating={house.energyRating} 
                                condition={house.condition} 
                                energyKwh={house.energyKwh}
                                variant="pill"
                                lang={lang}
                              />
                            </div>
                            {house.aiEstimate && (
                              <InvestmentScoreBadge
                                score={house.aiEstimate.investment_score}
                                variant="pill"
                                lang={lang}
                              />
                            )}
                          </div>
                        }
                        overlayControls={
                          <div className="flex flex-col gap-2">
                            <button 
                              onClick={(e) => toggleFavorite(house.id, e)}
                              className={`w-12 h-12 rounded-2xl backdrop-blur-md transition-all border flex items-center justify-center ${
                                userFavorites.includes(house.id)
                                  ? 'bg-brand border-brand text-white'
                                  : 'bg-black/40 border-white/10 text-white hover:bg-brand hover:border-brand'
                              }`}
                            >
                              <Heart size={18} fill={userFavorites.includes(house.id) ? "currentColor" : "none"} className={userFavorites.includes(house.id) ? "animate-pulse" : ""} />
                            </button>

                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePriceSubscription(house.id, e);
                              }}
                              title={
                                userPriceSubs.includes(house.id)
                                  ? (lang === 'fr' ? "Désactiver les alertes de baisse de prix" : "Disable price drop alerts")
                                  : (lang === 'fr' ? "Activer les alertes de baisse de prix" : "Enable price drop alerts")
                              }
                              className={`w-12 h-12 rounded-2xl backdrop-blur-md transition-all border flex items-center justify-center ${
                                userPriceSubs.includes(house.id)
                                  ? 'bg-amber-500 border-amber-500 text-black'
                                  : 'bg-black/40 border-white/10 text-white hover:bg-amber-500 hover:border-amber-500 hover:text-black'
                              }`}
                            >
                              {userPriceSubs.includes(house.id) ? (
                                <Bell size={18} className="animate-pulse" />
                              ) : (
                                <BellOff size={18} />
                              )}
                            </button>
                          </div>
                        }
                        bottomLeftContent={
                          <div className="text-white">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">{house.location.split(',')[1] || 'Kinshasa'}</p>
                            <p className="text-2xl font-display font-black tracking-tighter">${house.price.toLocaleString()}</p>
                          </div>
                        }
                        bottomRightControls={
                          <button 
                            onClick={(e) => toggleCompare(house, e)}
                            className={`w-12 h-12 rounded-full backdrop-blur-md transition-all border flex items-center justify-center ${
                              comparedProperties.find(p => p.id === house.id)
                                ? 'bg-brand border-brand text-white'
                                : 'bg-black/40 border-white/10 text-white hover:bg-brand hover:border-brand'
                            }`}
                          >
                            <TrendingUp size={18} />
                          </button>
                        }
                      />

                      <div className="p-10">
                        <h4 className="font-display font-black text-2xl mb-4 text-white uppercase tracking-tighter leading-tight group-hover:text-brand transition-colors">
                          {house.title}
                        </h4>
                        
                        <p className="text-gray-500 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">
                          {house.description}
                        </p>

                        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
                           <div className="flex flex-col items-center border-r border-white/5">
                              <Building2 size={16} className="text-brand mb-2 opacity-50" />
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">{house.beds} BHK</span>
                           </div>
                           <div className="flex flex-col items-center border-r border-white/5">
                              <Compass size={16} className="text-brand mb-2 opacity-50" />
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">{house.sqm} m²</span>
                           </div>
                           <EnergyRatingBadge 
                             rating={house.energyRating} 
                             condition={house.condition} 
                             energyKwh={house.energyKwh}
                             variant="metric"
                             lang={lang}
                           />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
          </>
        )}
      </section>

      {/* Stats/Credibility Section */}
      <section className="bg-dark-nav py-24 px-6 overflow-hidden relative border-y border-border-subtle">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-brand/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <h4 className="font-display text-4xl font-bold text-text-primary">500+</h4>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Partenaires locaux</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-display text-4xl font-bold text-text-primary">12,4k</h4>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Biens vendus</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-display text-4xl font-bold text-text-primary">98%</h4>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Satisfaction client</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-display text-4xl font-bold text-brand">94%</h4>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Précision des Estimations IA</p>
          </div>
        </div>
      </section>

      {/* Our Agents Section */}
      <section id="agents" className="max-w-7xl mx-auto px-6 py-32 bg-dark-bg">
        <div className="flex flex-col items-center text-center mb-20">
           <div className="w-16 h-16 bg-brand/10 rounded-3xl flex items-center justify-center text-brand mb-6 shadow-xl shadow-brand/5 border border-brand/20">
              <Users size={28} />
           </div>
           <h3 className="font-display text-5xl font-black text-text-primary mb-4 uppercase tracking-tighter">
             {t('ourAgents')}
           </h3>
           <p className="text-gray-500 max-w-xl font-medium">
             {t('agentsSubtitle')}
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {AGENTS.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-surface-elevated rounded-[48px] overflow-hidden border border-border-subtle hover:border-brand/30 transition-all duration-500 shadow-2xl relative"
            >
              <div className="p-10 pb-0">
                <div className="relative aspect-square rounded-[36px] overflow-hidden border-4 border-border-subtle bg-dark-bg group-hover:border-brand/20 transition-all duration-500">
                  <img 
                    src={agent.image} 
                    alt={agent.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-60" />
                </div>
              </div>

              <div className="p-10 space-y-6">
                <div>
                  <h4 className="text-2xl font-display font-black text-text-primary mb-1 group-hover:text-brand transition-colors uppercase tracking-tight">
                    {agent.name}
                  </h4>
                  <p className="text-brand text-[10px] font-black uppercase tracking-[0.3em]">{agent.role}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-border-subtle group-hover:bg-brand/10 transition-colors">
                    <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white">
                      <Target size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Spécialité</p>
                      <p className="text-text-primary text-xs font-bold">{agent.specialty}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-border-subtle group-hover:bg-brand/10 transition-colors">
                    <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Contact</p>
                      <p className="text-text-primary text-xs font-bold">{agent.phone}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => window.location.href = `mailto:${agent.email}`}
                  className="w-full bg-brand text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-brand-dark hover:scale-[1.02] active:scale-95 shadow-xl shadow-brand/20"
                >
                  {t('contactAgent')}
                </button>
              </div>

              <div className="absolute top-12 right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-10 h-10 bg-brand/20 backdrop-blur-xl border border-brand/30 rounded-full flex items-center justify-center text-brand">
                  <Check size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEW: Marketing & Ad Templates Section */}
      <section id="ads" className="max-w-7xl mx-auto px-6 py-32 bg-dark-bg">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-brand text-xs font-bold uppercase tracking-widest mb-4">Marketing & Design</span>
          <h3 className="font-display text-4xl font-bold text-white mb-4">Templates de Publicité</h3>
          <p className="text-gray-400 max-w-xl">Designs optimisés pour vos campagnes sur les réseaux sociaux et le Play Store.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Ad Template 1: Luxury Lifestyle */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="relative aspect-[4/5] rounded-[40px] overflow-hidden group shadow-2xl shadow-brand/5 border border-white/5"
          >
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80" 
              alt="Luxury Living Africa"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
            <div className="absolute bottom-12 left-10 right-10">
              <h4 className="font-display text-3xl font-bold text-white mb-4">"Investissez dans l'avenir avec l'IA."</h4>
              <p className="text-gray-300 text-sm mb-6">Découvrez le luxe comme jamais auparavant en Afrique subsaharienne.</p>
              <div className="flex items-center gap-4">
                <div className="bg-brand text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">ImmoAI Exclusive</div>
                <div className="text-white/50 text-[10px] font-bold uppercase">Publicité Sponsorisée</div>
              </div>
            </div>
            <div className="absolute top-8 left-8">
              <div className="w-12 h-12 bg-brand rounded-2xl flex items-center justify-center text-white rotate-12 shadow-lg shadow-brand/50">
                <Home size={24} />
              </div>
            </div>
          </motion.div>

          {/* Ad Template 2: Professional Trusted */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="relative aspect-[4/5] rounded-[40px] overflow-hidden group shadow-2xl shadow-brand/5 border border-white/5"
          >
            <img 
              src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80" 
              alt="African Real Estate Professional"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
            <div className="absolute bottom-12 left-10 right-10">
              <h4 className="font-display text-3xl font-bold text-brand mb-4">Trouvez. Négociez. Réussissez.</h4>
              <p className="text-gray-300 text-sm mb-6">L'expertise locale combinée à l'intelligence artificielle pour vos investissements en Afrique.</p>
              <button className="bg-white text-dark-bg px-8 py-3 rounded-2xl font-bold text-sm hover:bg-brand hover:text-white transition-all shadow-xl">
                Télécharger l'App
              </button>
            </div>
            <div className="absolute top-8 right-8 flex flex-col items-end">
              <div className="bg-brand/20 backdrop-blur-md border border-brand/30 px-4 py-2 rounded-xl">
                <span className="text-brand text-xs font-bold">SMART MATCHING IA</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NEW: Investor Relations Section */}
      <section id="investors" className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-brand text-xs font-bold uppercase tracking-widest mb-4 inline-block">{t('investOpportunity')}</span>
            <h2 className="font-display text-5xl font-bold text-white mb-8 leading-tight">
              {t('investTitle')} <span className="text-brand">{t('investTitleAccent')}</span>
            </h2>
            <p className="text-gray-400 text-lg mb-12">
              {t('investDesc')}
            </p>
            
            <div className="space-y-8">
              {[
                {
                  icon: TrendingUp,
                  title: "Croissance Exponentielle",
                  desc: "Le marché immobilier africain devrait atteindre 15 000 milliards $ d'ici 2025."
                },
                {
                  icon: PieChart,
                  title: "Rendements Optimisés",
                  desc: "Nos algorithmes d'IA prédisent les zones à forte valorisation avec 94% de précision."
                },
                {
                  icon: ShieldCheck,
                  title: "Sécurité & Transparence",
                  desc: "Utilisation de la blockchain et du cloud pour sécuriser chaque transaction foncière."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-12 h-12 shrink-0 bg-brand/10 rounded-xl flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">{item.title}</h4>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-6 mt-12">
              <button 
                onClick={() => setShowInvestorModal(true)}
                className="group flex items-center gap-3 text-white font-bold text-lg hover:text-brand transition-colors"
              >
                {t('pitchDeck')} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              
              <button 
                onClick={() => setShowVideoModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shadow-lg shadow-brand/20">
                  <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5" />
                </div>
                {t('watchPitch')}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-brand/20 blur-[100px] rounded-full" />
            <div className="relative bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-8">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Performances Projetées</span>
                <div className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full uppercase">Alpha Phase v1.2</div>
              </div>
              
              <div className="space-y-6">
                {[
                  { label: "Utilisateurs actifs", value: "+250%", color: "bg-brand" },
                  { label: "Volume de transactions", value: "+180%", color: "bg-white" },
                  { label: "Précision de l'IA", value: "98.2%", color: "bg-brand" }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-400">{stat.label}</span>
                      <span className="text-sm font-bold text-white">{stat.value}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: stat.value.includes('%') ? stat.value.split('+')[1] || stat.value : '98%' }}
                        transition={{ duration: 1.5, delay: i * 0.2 }}
                        className={`h-full ${stat.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-brand rounded-3xl text-white">
                <p className="text-sm font-medium opacity-80 mb-1">Objectif de Levée</p>
                <h4 className="text-3xl font-bold font-display">2.5M €</h4>
                <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase font-bold opacity-60">Période</p>
                    <p className="text-sm font-bold">Q3 2026 - Seed Round</p>
                  </div>
            <button 
              onClick={() => setShowInvestorModal(true)}
              className="bg-white text-brand px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-transform"
            >
              Investir
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Investor Modal */}
<AnimatePresence>
  {showInvestorModal && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowInvestorModal(false)}
        className="absolute inset-0 bg-dark-bg/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-surface-elevated border border-white/10 rounded-[40px] p-10 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8">
          <button onClick={() => setShowInvestorModal(false)} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand/20">
            <TrendingUp size={28} />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-white">Accès Investisseur</h3>
            <p className="text-sm text-gray-500">Seed Round - Q3 2026</p>
          </div>
        </div>

        <p className="text-gray-400 mb-8 leading-relaxed">
          Merci de votre intérêt pour <strong>ImmoAI Africa</strong>. L'accès aux documents financiers et au pitch deck est réservé aux investisseurs qualifiés.
        </p>

        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          alert("Votre demande a été envoyée. Notre département relation investisseurs vous contactera sous 48h.");
          setShowInvestorModal(false);
        }}>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Nom complet / Société</label>
            <input 
              type="text" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-brand transition-colors" 
              placeholder="Ex: Investment Group Africa"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Email Professionnel</label>
            <input 
              type="email" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-brand transition-colors" 
              placeholder="votre@email.com"
            />
          </div>
          <button className="w-full bg-brand text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Demander l'accès confidentiel
          </button>
        </form>
      </motion.div>
    </div>
  )}
</AnimatePresence>

{/* Video Presentation Modal */}
<AnimatePresence>
  {showVideoModal && (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowVideoModal(false)}
        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-5xl aspect-video bg-black rounded-[40px] overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="absolute top-6 right-6 z-10">
          <button 
            onClick={() => setShowVideoModal(false)}
            className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Video Player */}
        <div className="absolute inset-0 flex flex-col">
          <video 
            autoPlay 
            controls 
            className="w-full h-full object-cover"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-a-laptop-in-a-skyscrapers-office-42171-large.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-brand overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80" 
                  alt="Founder" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">{t('founderName')}</h4>
                <p className="text-brand text-xs font-bold uppercase tracking-widest">{t('founderTitle')}</p>
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>

{/* Floating Comparison Bar */}
<AnimatePresence>
  {comparedProperties.length > 0 && (
    <motion.div 
      initial={{ y: 100, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 100, opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-2xl px-4 pointer-events-auto"
    >
      <motion.div 
        key={`bar-content-${comparedProperties.length}`}
        initial={{ scale: 0.95 }}
        animate={{ 
          scale: [1, 1.06, 0.98, 1],
          y: [0, -6, 2, 0],
          borderColor: ["rgba(255,255,255,0.1)", "rgba(230,57,70,0.6)", "rgba(255,255,255,0.1)"]
        }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
        className="bg-surface-elevated/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between"
      >
        <div className="flex items-center gap-4 pl-2">
          <div className="flex -space-x-4">
            <AnimatePresence mode="popLayout">
              {comparedProperties.map((p) => (
                <motion.div 
                  key={p.id} 
                  initial={{ scale: 0, opacity: 0, x: -20, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, x: 0, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, x: -20 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="w-12 h-12 rounded-2xl border-[3px] border-surface-elevated overflow-hidden bg-brand shadow-lg relative shrink-0"
                >
                  <img src={p.image} className="w-full h-full object-cover" alt={p.title} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div>
            <motion.p 
              key={`text-count-${comparedProperties.length}`}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.3 }}
              className="text-white font-bold text-sm flex items-center gap-2"
            >
              <span>{comparedProperties.length} {lang === 'fr' ? 'À Comparer' : 'To Compare'}</span>
              <span className="w-2 h-2 rounded-full bg-brand animate-ping inline-block" />
            </motion.p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setComparedProperties([])}
            className="px-4 py-3 text-xs font-bold text-gray-500 hover:text-white uppercase transition-colors"
          >
            {lang === 'fr' ? 'Vider' : 'Clear'}
          </button>
          <button 
            type="button"
            onClick={() => setShowComparisonModal(true)}
            className="bg-brand text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-brand/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>{lang === 'fr' ? 'Comparer' : 'Compare'}</span>
            <motion.span
              key={`badge-${comparedProperties.length}`}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.3 }}
              className="bg-white/20 text-white text-[10px] font-mono px-2 py-0.5 rounded-full"
            >
              {comparedProperties.length}
            </motion.span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

{/* Investor Directory Modal */}
<AnimatePresence>
  {showInvestorsList && (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowInvestorsList(false)}
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-surface rounded-[40px] shadow-2xl border border-white/10 overflow-hidden max-h-[85vh] flex flex-col"
      >
        <div className="p-8 lg:p-12 border-b border-white/5 flex items-center justify-between sticky top-0 bg-surface z-10">
          <div>
            <h2 className="font-display text-4xl font-bold text-white uppercase tracking-tight">{t('investorDirectory')}</h2>
            <p className="text-brand text-xs font-bold uppercase tracking-widest mt-1">Partenaires Certifiés ImmoAI</p>
          </div>
          <button 
            onClick={() => setShowInvestorsList(false)}
            className="p-4 bg-white/5 rounded-full text-white hover:bg-brand transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 lg:p-12 overflow-y-auto no-scrollbar flex-1 space-y-8">
          {TOP_INVESTORS.map((inv) => (
            <div key={inv.id} className="group bg-white/5 border border-white/10 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 hover:border-brand/30 transition-all">
              <div className="relative w-32 h-32 shrink-0">
                <img src={inv.image} className="w-full h-full object-cover rounded-3xl" alt="" />
                {inv.verified && (
                  <div className="absolute -top-2 -right-2 bg-brand text-white p-2 rounded-xl shadow-lg ring-4 ring-surface">
                    <ShieldCheck size={16} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                  <h4 className="font-display text-2xl font-bold text-white">{inv.name}</h4>
                  <span className="text-[10px] bg-brand/20 text-brand font-bold px-3 py-1 rounded-full uppercase self-center md:self-auto tracking-widest">
                    {inv.verified ? t('verifiedInvestor') : ''}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">{t('investmentFocus')}</p>
                    <p className="text-white font-medium">{inv.focus}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Régions Clés</p>
                    <p className="text-white font-medium">{inv.region}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <button 
                    onClick={() => alert(`Demande de contact envoyée à ${inv.name}`)}
                    className="bg-brand text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-brand/20 hover:scale-105 transition-all"
                  >
                    {t('contactInvestor')}
                  </button>
                  <p className="text-xs text-gray-500 font-medium italic">Firme: {inv.firm}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="p-12 border-2 border-dashed border-white/10 rounded-[40px] text-center">
            <h4 className="text-white font-bold mb-2">Vous êtes un investisseur ?</h4>
            <p className="text-gray-500 text-sm mb-6">Rejoignez notre réseau de partenaires certifiés et accédez aux meilleures opportunités d'Afrique.</p>
            <button 
              onClick={() => { setShowInvestorsList(false); setShowInvestorModal(true); }}
              className="px-8 py-3 border border-white/20 rounded-2xl text-white font-bold hover:bg-white/5 transition-all"
            >
              Faire une demande d'accréditation
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>

{/* Wallet & Transaction Modal */}
<AnimatePresence>
  {showWalletModal && (
    <div className="fixed inset-0 z-[250] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowWalletModal(false)}
        className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl h-[85vh] bg-dark-bg rounded-[40px] shadow-2xl border border-white/10 overflow-hidden flex flex-col"
      >
        <div className="p-8 lg:p-12 border-b border-white/5 flex items-center justify-between bg-dark-bg z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand/20 rounded-2xl flex items-center justify-center text-brand">
              <PieChart size={24} />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-white uppercase tracking-tighter">{t('wallet')}</h2>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">ImmoAI Financial Insights</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPdfExportModal(true)}
              className="bg-brand text-white px-5 py-2.5 rounded-2xl font-bold text-xs hover:bg-brand-dark transition-all flex items-center gap-2 shadow-lg shadow-brand/20 cursor-pointer"
            >
              <Download size={16} />
              <span>{lang === 'fr' ? 'Télécharger PDF' : lang === 'en' ? 'Download PDF' : 'Pakua PDF'}</span>
            </button>
            <button 
              onClick={() => setShowWalletModal(false)}
              className="p-4 bg-white/5 rounded-full text-white hover:bg-brand transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 lg:p-12 overflow-y-auto no-scrollbar flex-1 space-y-12">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-brand/10 p-8 rounded-[40px] border border-brand/20 group hover:border-brand/40 transition-all">
              <p className="text-brand text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Solde Actuel</p>
              <h4 className="text-4xl font-display font-bold text-brand">
                {userWallet ? `$${userWallet.balance.toLocaleString()}` : "$0"}
              </h4>
            </div>
            <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 group hover:border-brand/30 transition-all">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{t('totalVolume')}</p>
              <h4 className="text-4xl font-display font-bold text-white">
                ${userTransactions.reduce((acc, tx) => acc + tx.amount, 0).toLocaleString()}
              </h4>
            </div>
            <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 group hover:border-brand/30 transition-all">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{t('commissionEarned')}</p>
              <h4 className="text-4xl font-display font-bold text-white">
                ${userTransactions.reduce((acc, tx) => acc + tx.commission, 0).toLocaleString()}
              </h4>
            </div>
            <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 group hover:border-green-500/30 transition-all">
              <p className="text-green-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{t('netProfit')}</p>
              <h4 className="text-4xl font-display font-bold text-green-500">
                ${userTransactions.reduce((acc, tx) => acc + tx.net, 0).toLocaleString()}
              </h4>
            </div>
          </div>

          {/* Transactions List */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white uppercase tracking-widest">{t('myTransactions')}</h3>
              <button 
                onClick={async () => {
                  if (!currentUser) return alert('Connectez-vous pour tester');
                  const types: TransactionType[] = ['property_purchase', 'rent', 'payment'];
                  const randomType = types[Math.floor(Math.random() * types.length)];
                  const randomAmount = Math.floor(Math.random() * 50000) + 1000;
                  await processTransaction(currentUser.uid, randomAmount, randomType);
                }}
                className="bg-white/5 border border-white/20 text-white px-6 py-3 rounded-2xl font-bold text-xs hover:bg-brand transition-all flex items-center gap-2"
              >
                <Zap size={14} /> {t('testTransaction')}
              </button>
            </div>

            <div className="space-y-4">
              {userTransactions.length === 0 ? (
                <div className="p-20 text-center border-2 border-dashed border-white/10 rounded-[40px]">
                  <p className="text-gray-500 font-medium">Aucune transaction enregistrée pour le moment.</p>
                </div>
              ) : (
                userTransactions.map((tx) => (
                  <div key={tx.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/[0.07] transition-all">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        tx.type === 'property_purchase' ? 'bg-brand/20 text-brand' :
                        tx.type === 'rent' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {tx.type === 'property_purchase' ? <TrendingUp size={24}/> : <PieChart size={24}/>}
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg uppercase tracking-tight">{tx.type.replace('_', ' ')}</p>
                        <p className="text-gray-500 text-[10px] font-bold uppercase">{new Date(tx.createdAt?.seconds * 1000).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-12 text-center md:text-right">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Montant</p>
                        <p className="text-white font-bold">${tx.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-brand uppercase font-bold mb-1">Com. ImmoAI</p>
                        <p className="text-brand font-bold">-${tx.commission.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-green-500 uppercase font-bold mb-1">Net Réçu</p>
                        <p className="text-green-500 font-bold">${tx.net.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>

{/* Bento Manifesto Modal */}
<AnimatePresence>
  {showManifesto && (
    <div className="fixed inset-0 z-[250] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowManifesto(false)}
        className="absolute inset-0 bg-black/98 backdrop-blur-3xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-7xl h-[90vh] bg-dark-bg rounded-[40px] shadow-2xl border border-white/10 overflow-hidden flex flex-col"
      >
        <div className="p-8 lg:p-10 border-b border-white/5 flex items-center justify-between bg-dark-bg z-10">
          <div>
            <h2 className="font-display text-3xl font-bold text-white uppercase tracking-tighter">Manifeste <span className="text-brand">ImmoAI Africa</span></h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">L'intelligence au service de l'investissement</p>
          </div>
          <button 
            onClick={() => setShowManifesto(false)}
            className="p-4 bg-white/5 rounded-full text-white hover:bg-brand transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 lg:p-10 overflow-y-auto no-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* 01 Vision */}
            <div className="md:col-span-2 bg-white/5 rounded-[40px] p-8 border border-white/10 relative overflow-hidden group">
              <div className="text-brand/30 text-6xl font-display font-bold absolute top-4 right-8 group-hover:scale-110 transition-transform">01</div>
              <h3 className="text-xl font-bold uppercase mb-4 tracking-widest">{t('visionTitle')}</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Révolutionner l'accès à la propriété en Afrique grâce à la transparence radicale et l'intelligence prédictive.
              </p>
            </div>

            {/* 02 Le Problème */}
            <div className="md:col-span-2 bg-[#1A1A1A] rounded-[40px] p-8 border border-red-500/10 relative overflow-hidden group">
              <div className="text-red-500/20 text-6xl font-display font-bold absolute top-4 right-8">02</div>
              <h3 className="text-xl font-bold uppercase mb-4 tracking-widest text-[#FF4B4B]">{t('problemTitle')}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Le marché immobilier africain souffre d'un manque de données fiables, d'une opacité des prix et de processus transactionnels manuels et risqués.
              </p>
              <div className="flex gap-4">
                <span className="text-[10px] bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20 uppercase font-bold">Opacité</span>
                <span className="text-[10px] bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20 uppercase font-bold">Lenteur</span>
                <span className="text-[10px] bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20 uppercase font-bold">Incertitude</span>
              </div>
            </div>

            {/* 03 Solution & Tech */}
            <div className="md:col-span-3 bg-brand rounded-[40px] p-8 relative overflow-hidden group">
              <div className="text-white/30 text-6xl font-display font-bold absolute top-4 right-8">03</div>
              <h3 className="text-xl font-bold uppercase mb-4 tracking-widest text-white">{t('solutionTitle')}</h3>
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-1">
                  <p className="text-white text-xl font-medium leading-relaxed mb-6">
                    L'Ecosystème ImmoAI : Une plateforme omnicanale pilotée par le moteur Gemini de Google.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                      <p className="text-white font-bold text-lg">Predictive Pricing</p>
                      <p className="text-white/60 text-[10px] uppercase">Valuation par IA</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                      <p className="text-white font-bold text-lg">Smart Matching</p>
                      <p className="text-white/60 text-[10px] uppercase">Client-Property Fit</p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-56 h-64 bg-dark-bg/40 rounded-3xl p-6 border border-white/20 shadow-2xl relative group-hover:scale-105 transition-transform">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="w-full h-2 bg-brand/40 rounded-full animate-pulse" />
                    <div className="w-2/3 h-2 bg-brand/40 rounded-full animate-pulse delay-75" />
                    <div className="w-full h-2 bg-brand/40 rounded-full animate-pulse delay-150" />
                    <div className="mt-8 flex justify-center">
                      <Sparkles className="text-white animate-spin-slow" size={48} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 04 Business Model */}
            <div className="md:col-span-1 bg-surface rounded-[40px] p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold uppercase mb-4 tracking-widest">{t('businessModel')}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-gray-500 text-xs uppercase font-bold">Comm. Vente</span>
                    <span className="text-brand font-bold">2.5% - 5%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-gray-500 text-xs uppercase font-bold">Publier</span>
                    <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">Gratuit</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs uppercase font-bold">IA API</span>
                    <span className="text-brand font-bold">Data Lic.</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Objectif Revenus An 1</p>
                <p className="text-3xl font-display font-bold text-white">$1.2M</p>
              </div>
            </div>

            {/* 05 Marché & Expansion */}
            <div className="md:col-span-2 grid grid-cols-2 gap-6">
              <div className="bg-[#121212] rounded-[40px] p-8 border border-white/10 relative overflow-hidden">
                <h3 className="text-[10px] font-bold uppercase text-gray-500 mb-6 tracking-widest">{t('marketTitle')}</h3>
                <p className="text-3xl font-display font-bold text-brand">$80B</p>
                <p className="text-[10px] text-white uppercase font-bold mt-1">TAM Marché Africain</p>
              </div>
              <div className="bg-brand/10 rounded-[40px] p-8 border border-brand/20 relative overflow-hidden">
                <h3 className="text-[10px] font-bold uppercase text-brand mb-6 tracking-widest">{t('expansionTitle')}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-bold text-white px-2 py-1 bg-white/10 rounded-md">RDC</span>
                  <span className="text-[10px] font-bold text-white px-2 py-1 bg-white/10 rounded-md">CIV</span>
                  <span className="text-[10px] font-bold text-white px-2 py-1 bg-white/10 rounded-md">SEN</span>
                  <span className="text-[10px] font-bold text-white px-2 py-1 bg-white/10 rounded-md">NGA</span>
                </div>
              </div>
            </div>

            {/* 06 Equipe */}
            <div className="md:col-span-2 bg-white/5 rounded-[40px] p-8 border border-white/10">
              <h3 className="text-xl font-bold uppercase mb-6 tracking-widest">{t('teamTitle')}</h3>
              <div className="flex gap-6 overflow-x-auto no-scrollbar">
                {[
                  { name: "Israel Carlito", role: "CEO & Founder", icon: <UserIcon size={16}/> },
                  { name: "Tech Lead", role: "Exp. AI & Cloud", icon: <Zap size={16}/> },
                  { name: "Real Estate VP", role: "Exp. Marché Local", icon: <PieChart size={16}/> }
                ].map((m, i) => (
                  <div key={i} className="shrink-0 space-y-3">
                    <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center text-brand border border-white/5">
                      {m.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white truncate">{m.name}</p>
                      <p className="text-[8px] uppercase text-gray-500">{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 07 Financement */}
            <div className="md:col-span-4 bg-brand rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden h-48">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent)]" />
              <div>
                <h3 className="text-2xl font-bold uppercase mb-2 tracking-tighter text-white">{t('fundingNeed')}</h3>
                <p className="text-white/80 font-medium max-w-md">Nous levons pour industrialiser notre technologie et capturer les marchés du Top 5 africain.</p>
              </div>
              <div className="text-center md:text-right mt-6 md:mt-0">
                <p className="text-6xl font-display font-bold text-white">$500,000</p>
                <p className="text-xs text-white/60 font-bold uppercase tracking-widest mt-1">Seed Round Allocation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand">
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-white font-bold">Intéressé par l'investissement ?</p>
              <p className="text-gray-500 text-xs">Echangez directement avec les fondateurs.</p>
            </div>
          </div>
          <button 
            onClick={() => alert('Contact request sent')}
            className="w-full md:w-auto bg-brand text-white px-12 py-4 rounded-3xl font-bold text-lg shadow-2xl shadow-brand/20 hover:scale-105 active:scale-95 transition-all"
          >
            Nous Contacter
          </button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>

{/* Comparison Table Modal */}
<AnimatePresence>
  {showComparisonModal && (
    <PropertyComparisonOverlay
      isOpen={showComparisonModal}
      onClose={() => setShowComparisonModal(false)}
      comparedProperties={comparedProperties}
      onRemove={(id, e) => {
        if (e) e.stopPropagation();
        setComparedProperties(comparedProperties.filter(p => p.id !== id));
      }}
      onSelect={(p) => {
        setSelectedProperty(p);
        setShowComparisonModal(false);
      }}
      lang={lang}
    />
  )}
</AnimatePresence>

{/* Property Listing Modal */}
<AnimatePresence>
  {showListingModal && (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowListingModal(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-surface rounded-[40px] p-10 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto"
      >
        <button 
          onClick={() => setShowListingModal(false)}
          className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h3 className="font-display text-3xl font-bold text-white mb-8">
          {t('addProperty')} <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 uppercase tracking-widest animate-pulse">{lang === 'fr' ? 'Gratuit' : 'Free'}</span>
        </h3>

        <form onSubmit={handlePropertySubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('propertyTitle')}</label>
              <input 
                required
                type="text"
                value={newProperty.title}
                onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                className="w-full bg-surface-elevated border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('propertyLocation')}</label>
              <input 
                required
                type="text"
                value={newProperty.location}
                onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                className="w-full bg-surface-elevated border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('priceLabel')}</label>
              <input 
                required
                type="number"
                placeholder="450000"
                value={newProperty.price === 0 ? '' : newProperty.price}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setNewProperty({...newProperty, price: val});
                }}
                className="w-full bg-surface-elevated border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('category')}</label>
              <select 
                value={newProperty.category}
                onChange={(e) => setNewProperty({...newProperty, category: e.target.value as any})}
                className="w-full bg-surface-elevated border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand appearance-none"
              >
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Land">Land</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <button 
              type="button"
              onClick={handleGetAiEstimate}
              disabled={isAnalyzing}
              className="h-[58px] bg-brand/10 border border-brand/30 text-brand rounded-2xl flex items-center justify-center gap-2 hover:bg-brand hover:text-white transition-all font-bold uppercase text-xs shadow-lg shadow-brand/10 disabled:opacity-50"
            >
              <Sparkles size={16} className={isAnalyzing ? "animate-pulse" : ""} />
              {isAnalyzing ? t('aiEstimating') : t('aiEstimateBtn')}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('beds')}</label>
              <input 
                type="number"
                min="0"
                value={newProperty.beds}
                onChange={(e) => setNewProperty({...newProperty, beds: parseInt(e.target.value) || 0})}
                className="w-full bg-surface-elevated border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('baths')}</label>
              <input 
                type="number"
                min="0"
                value={newProperty.baths}
                onChange={(e) => setNewProperty({...newProperty, baths: parseInt(e.target.value) || 0})}
                className="w-full bg-surface-elevated border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('sqmLabel')}</label>
              <input 
                type="number"
                min="1"
                value={newProperty.sqm}
                onChange={(e) => setNewProperty({...newProperty, sqm: parseInt(e.target.value) || 0})}
                className="w-full bg-surface-elevated border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
            <select 
              value={newProperty.status}
              onChange={(e) => setNewProperty({...newProperty, status: e.target.value as any})}
              className="w-full bg-surface-elevated border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand appearance-none"
            >
              <option value="available">{lang === 'fr' ? 'Disponible' : lang === 'en' ? 'Available' : 'Inapatikana'}</option>
              <option value="sold">{lang === 'fr' ? 'Vendu' : lang === 'en' ? 'Sold' : 'Imeuzwa'}</option>
              <option value="rented">{lang === 'fr' ? 'Loué' : lang === 'en' ? 'Rented' : 'Imepantishwa'}</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('addImages')}</label>
              <span className="text-[10px] text-gray-400 font-bold uppercase">{newProperty.images.length} Images</span>
            </div>
            
            {/* Added Images Preview Grid */}
            {newProperty.images.length > 0 && (
              <div className="flex flex-wrap gap-3 p-3 bg-white/5 border border-white/5 rounded-2xl">
                {newProperty.images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 group shadow-lg">
                    <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                    <button 
                      type="button"
                      onClick={() => {
                        const updated = [...newProperty.images];
                        updated.splice(i, 1);
                        setNewProperty({...newProperty, images: updated});
                      }}
                      className="absolute inset-0 bg-red-500/85 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Interactive Upload Zone & URL entry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* File Dropzone */}
              <div 
                className="border-2 border-dashed border-white/15 hover:border-brand/50 rounded-2xl p-6 transition-all bg-white/5 hover:bg-white/10 cursor-pointer flex flex-col items-center justify-center gap-2 group"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = e.dataTransfer.files;
                  if (files && files.length > 0) {
                    Array.from(files).forEach((fileObj: any) => {
                      if (fileObj.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (reader.result && typeof reader.result === 'string') {
                            const r = reader.result;
                            setNewProperty(prev => {
                              const isDuplicate = prev.images.includes(r);
                              return { ...prev, images: isDuplicate ? prev.images : [...prev.images, r] };
                            });
                          }
                        };
                        reader.readAsDataURL(fileObj);
                      }
                    });
                  }
                }}
                onClick={() => {
                  const fileInput = document.getElementById('local-file-upload') as HTMLInputElement;
                  if (fileInput) fileInput.click();
                }}
              >
                <input 
                  id="local-file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      Array.from(files).forEach((fileObj: any) => {
                        if (fileObj.type.startsWith('image/')) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (reader.result && typeof reader.result === 'string') {
                              const r = reader.result;
                              setNewProperty(prev => {
                                const isDuplicate = prev.images.includes(r);
                                return { ...prev, images: isDuplicate ? prev.images : [...prev.images, r] };
                              });
                            }
                          };
                          reader.readAsDataURL(fileObj);
                        }
                      });
                    }
                  }}
                />
                <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload size={18} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-white uppercase tracking-wider">
                    {lang === 'fr' ? 'Fichiers Locaux' : lang === 'en' ? 'Local Files' : 'Faili za Kienyeji'}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {lang === 'fr' ? 'Glissez ou cliquez pour charger' : lang === 'en' ? 'Drag & drop or click' : 'Buruta au bonyeza kupakia'}
                  </p>
                </div>
              </div>

              {/* URL input and info */}
              <div className="flex flex-col justify-between p-6 rounded-2xl border border-white/5 bg-white/5 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white uppercase tracking-wider">
                    {lang === 'fr' ? 'Par Lien Internet' : lang === 'en' ? 'By Web URL' : 'Kwa kiungo'}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {lang === 'fr' ? 'Collez un lien d\'image directement' : lang === 'en' ? 'Paste an image URL directly' : 'Weka anwani ya picha hapa'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="url"
                    placeholder={t('imageUrlPlaceholder')}
                    className="flex-1 bg-surface-elevated border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-brand"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value;
                        if (val && !newProperty.images.includes(val)) {
                          setNewProperty({...newProperty, images: [...newProperty.images, val]});
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                  <button 
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      const val = input.value;
                      if (val && !newProperty.images.includes(val)) {
                        setNewProperty({...newProperty, images: [...newProperty.images, val]});
                        input.value = '';
                      }
                    }}
                    className="px-3 bg-white/5 border border-white/10 rounded-xl text-brand hover:bg-brand hover:text-white transition-all flex items-center justify-center"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Curated Pre-selected suggestions Grid */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block px-1">
                {lang === 'fr' ? "Suggestions d'images d'Afrique" : lang === 'en' ? "African Estate Suggested Gallery" : "Picha Zilizopendekezwa"}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80", label: "Villa Kin", tag: "Villa" },
                  { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80", label: "Modern", tag: "Villa" },
                  { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80", label: "Waterfront", tag: "Villa" },
                  { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80", label: "Chic Apt", tag: "Appartement" },
                  { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80", label: "Penthouse", tag: "Appartement" },
                  { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80", label: "Studio", tag: "Appartement" },
                  { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80", label: "Terrain", tag: "Terrain" },
                  { url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80", label: "Bord de Mer", tag: "Terrain" }
                ].map((preset, index) => {
                  const isAdded = newProperty.images.includes(preset.url);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (isAdded) {
                          setNewProperty({
                            ...newProperty,
                            images: newProperty.images.filter(x => x !== preset.url)
                          });
                        } else {
                          setNewProperty({
                            ...newProperty,
                            images: [...newProperty.images, preset.url]
                          });
                        }
                      }}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden group border-2 transition-all cursor-pointer ${
                        isAdded ? 'border-brand ring-2 ring-brand/20 scale-95' : 'border-white/5 hover:border-brand/40 hover:scale-[1.03]'
                      }`}
                    >
                      <img 
                        src={preset.url} 
                        alt={preset.label} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30 flex flex-col justify-between p-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <span className="text-[7.5px] font-extrabold uppercase bg-black/50 px-1 py-0.5 rounded-md self-start text-white/90">
                          {preset.tag}
                        </span>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[8.5px] text-white/95 truncate block max-w-[65%] font-medium">
                            {preset.label}
                          </span>
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${isAdded ? 'bg-brand text-black' : 'bg-black/60 text-white'}`}>
                            {isAdded ? <Check size={10} className="stroke-[3]" /> : <Plus size={10} />}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {newProperty.images.length === 0 && (
              <p className="text-[10px] text-red-400 font-bold uppercase px-1">{t('imageRequired')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('description')}</label>
            <textarea 
              required
              rows={4}
              value={newProperty.description}
              onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
              className="w-full bg-surface-elevated border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand resize-none"
            />
          </div>

          {/* AI Estimation Section */}
          <div id="ai-estimate-section" className="bg-brand/5 border border-brand/20 rounded-[32px] p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                  <Sparkles size={20} className={isAnalyzing ? "animate-pulse" : ""} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-tight">{t('aiAnalysisResult')}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Powered by Gemini Pro</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={handleGetAiEstimate}
                disabled={isAnalyzing}
                className="px-4 py-2 bg-brand text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-dark transition-all disabled:opacity-50"
              >
                {isAnalyzing ? t('aiEstimating') : t('aiEstimateBtn')}
              </button>
            </div>

            {previewAiEstimate && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{t('aiPriceEstimate')}</span>
                    <p className="text-white font-black text-lg">${previewAiEstimate.price_estimate?.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{t('aiInvestmentScore')}</span>
                    <div className="flex items-center gap-2">
                      <InvestmentScoreBadge 
                        score={previewAiEstimate.investment_score} 
                        variant="inline" 
                        lang={lang} 
                      />
                      <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden max-w-[40px]">
                        <div className="h-full bg-brand" style={{ width: `${previewAiEstimate.investment_score * 10}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{t('aiCondition')}</span>
                    <p className="text-white font-bold text-sm">{previewAiEstimate.condition}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp size={12} className="text-brand" />
                      {t('aiMarketTrend')}
                    </h5>
                    <p className="text-white/80 text-xs leading-relaxed font-medium bg-white/5 p-4 rounded-xl border border-white/5">
                      {previewAiEstimate.market_trend}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <AlertTriangle size={12} className="text-brand" />
                      {t('aiRiskFactors')}
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {previewAiEstimate.risk_factors?.map((risk: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-400 font-bold">
                          {risk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Target size={12} className="text-brand" />
                      {t('aiInvestmentReasoning')}
                    </h5>
                    <p className="text-brand/90 text-xs leading-relaxed font-bold bg-brand/5 p-4 rounded-xl border border-brand/10">
                      {previewAiEstimate.investment_reasoning}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand text-white py-5 rounded-2xl font-bold text-lg hover:bg-brand-dark transition-all shadow-xl shadow-brand/20 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus size={20} />
                {t('submit')}
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )}
</AnimatePresence>

      {/* Footer */}
      <footer className="bg-dark-bg pt-20 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between mb-16 gap-12">
            <div className="max-w-md space-y-4">
              <div className="mb-4">
                <ImmoAILogo size="lg" showSubtitle={true} showSlogan={true} />
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                {lang === 'fr' 
                  ? "Plateforme immobilière intelligente propulsée par la technologie et l'innovation pour connecter acheteurs, vendeurs, investisseurs et agents à travers l'Afrique."
                  : lang === 'sw'
                  ? "Jukwaa la kisasa la uwekezaji wa nyumba linalotumia teknolojia na uvumbuzi kuwaunganisha wanunuzi, wauzaji, wawekezaji na mawakala kote Afrika."
                  : "Intelligent real estate platform powered by technology and innovation to connect buyers, sellers, investors and agents across Africa."
                }
              </p>
              <div className="flex items-center gap-4 text-xs text-amber-400 font-mono pt-2">
                <span className="font-bold">www.immoaiafrica.com</span>
                <span className="text-gray-600">|</span>
                <span className="text-emerald-400 font-sans font-bold">Smart Real Estate, Stronger Africa</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
              <div className="space-y-4">
                <h5 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Plateforme</h5>
                <ul className="space-y-3 text-sm text-gray-500 font-medium">
                  <li><a href="#" className="hover:text-brand transition-colors">Explorer</a></li>
                  <li><a href="#" className="hover:text-brand transition-colors">Villes</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Compagnie</h5>
                <ul className="space-y-3 text-sm text-gray-500 font-medium">
                  <li><a href="#" className="hover:text-brand transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-brand transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-brand transition-colors">Soutien</a></li>
                </ul>
              </div>
              <div className="hidden md:block space-y-4">
                <h5 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Légal</h5>
                <ul className="space-y-3 text-sm text-gray-500 font-medium">
                  <li><a href="#" className="hover:text-brand transition-colors">Confidentialité</a></li>
                  <li><a href="#" className="hover:text-brand transition-colors">Termes</a></li>
                  <li><a href="#" className="hover:text-brand transition-colors">Cookies</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <p className="text-gray-600 text-[10px] uppercase tracking-widest">
                © 2026 ImmoAI Africa. <span className="text-white">ImmoAI.com</span> — Déployé sur Vercel & Firebase.
              </p>
              <p className="text-brand font-black text-[9px] uppercase tracking-[0.3em] mt-2">
                Ingénieur Israël Carlito — Architecte & Concepteur ImmoAI Africa
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 grayscale opacity-30 hover:opacity-100 transition-all">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center p-1">
                  <div className="bg-black w-full h-full clip-triangle" />
                </div>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Next-Gen Architecture</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <PdfExportModal
        isOpen={showPdfExportModal}
        onClose={() => setShowPdfExportModal(false)}
        currentUser={currentUser}
        userWallet={userWallet}
        savedProperties={properties.filter(p => userFavorites.includes(p.id))}
        transactions={userTransactions}
        lang={lang}
      />

      <AiAssistantWidget 
        chatMessages={activeChatMessages}
        clearChatHistory={clearChatHistory}
        lang={lang}
        properties={properties}
        setFilteredProperties={setFilteredProperties}
        onSendMessage={async (text) => {
          await handleAiSearch(undefined, text);
        }}
        isAskingAi={isAskingAi}
      />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
