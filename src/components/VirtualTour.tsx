import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  ArrowRight,
  Eye,
  Sparkles,
  RefreshCw,
  HelpCircle,
  Globe
} from 'lucide-react';
import Spherical360Viewer from './Spherical360Viewer';

interface TourHotspot {
  id: string;
  x: number; // Percentage relative to the image wide-width (0 to 100)
  y: number; // Percentage relative to container height (0 to 100)
  label: string;
  labelFr: string;
  labelSw: string;
  targetSpotId?: string; // If this hotspot navigates to another view
  info?: string;
  infoFr?: string;
  infoSw?: string;
}

interface TourSpot {
  id: string;
  name: string;
  nameFr: string;
  nameSw: string;
  image: string;
  hotspots: TourHotspot[];
  initialHeading: number; // Degree angle alignment for initial pan
}

interface VirtualTourProps {
  propertyId: string;
  propertyTitle: string;
  lang: 'fr' | 'en' | 'sw';
}

// Sound synthesizer using Web Audio API for highly realistic, offline-safe ambient soundscapes
class VirtualAmbientSound {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private gainNode: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private noiseNode: AudioWorkletNode | ScriptProcessorNode | null = null;

  public toggle(forceState?: boolean) {
    const target = forceState !== undefined ? forceState : !this.isPlaying;
    if (target === this.isPlaying) return this.isPlaying;

    if (target) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);

        // Generate pink-ish low ocean white noise
        const bufferSize = 4 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Pink filter simulation approximation
          output[i] = (lastOut * 0.992 + white * 0.008);
          lastOut = output[i];
          // Volume envelope
          output[i] *= 0.12; 
        }

        const source = this.ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, this.ctx.currentTime);

        // Low frequency oscillator (LFO) to simulate wave rolling
        this.lfo = this.ctx.createOscillator();
        this.lfo.type = 'sine';
        this.lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // Wave every ~8 seconds

        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(220, this.ctx.currentTime); // LFO amplitude modulation range

        this.lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        source.connect(filter);
        filter.connect(this.gainNode);

        // Gentle volume sweep to prevent click on start
        this.gainNode.gain.linearRampToValueAtTime(0.8, this.ctx.currentTime + 1.2);

        source.start(0);
        this.lfo.start(0);
        this.isPlaying = true;
      } catch (e) {
        console.warn('Web Audio API not supported or interaction blocked:', e);
        this.isPlaying = false;
      }
    } else {
      this.cleanup();
    }
    return this.isPlaying;
  }

  public cleanup() {
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
        setTimeout(() => {
          if (this.ctx && this.ctx.state !== 'closed') {
            this.ctx.close();
          }
        }, 400);
      } catch (e) {
        console.warn(e);
      }
    }
    this.isPlaying = false;
    this.ctx = null;
    this.gainNode = null;
    this.lfo = null;
  }
}

// Interactive 2D floor plans definitions mapped to active toured spots
const SPOT_MAP_COORDS: Record<string, Record<string, { x: number; y: number; label: string; labelFr: string; labelSw: string }>> = {
  kinshasa: {
    living: { x: 30, y: 70, label: "Salon", labelFr: "Grand Salon", labelSw: "Sebule" },
    pool: { x: 70, y: 75, label: "Pool", labelFr: "Piscine", labelSw: "Bwawa" },
    bedroom: { x: 30, y: 30, label: "Bedroom", labelFr: "Suite Royale", labelSw: "Chumba" },
    kitchen: { x: 70, y: 30, label: "Kitchen", labelFr: "Cuisine", labelSw: "Jiko" }
  },
  zanzibar: {
    deck: { x: 72, y: 50, label: "Deck", labelFr: "Terrasse", labelSw: "Ukumbi" },
    bungalow: { x: 28, y: 50, label: "Suite", labelFr: "Chambre", labelSw: "Chumba" }
  },
  kigali: {
    "loft-living": { x: 28, y: 50, label: "Lounge", labelFr: "Salon Loft", labelSw: "Saluni" },
    "sky-view": { x: 72, y: 50, label: "Terrace", labelFr: "Terrasse de Kigali", labelSw: "Terras" }
  }
};

// Custom defined Tours mapping Property ID keywords
const PROPERTY_TOURS: Record<string, TourSpot[]> = {
  // 1. Villa Kinshasa Prestige
  "kinshasa": [
    {
      id: "living",
      name: "Grand Salon",
      nameFr: "Grand Salon Principal",
      nameSw: "Sebule Kuu ya Kifahari",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=80",
      initialHeading: 45,
      hotspots: [
        {
          id: "marble-floor",
          x: 22,
          y: 78,
          label: "Premium heated marble flooring",
          labelFr: "Marbre Nero de Carrare chauffant",
          labelSw: "Sakafu ya marumaru yenye joto",
          info: "A premium heated black marble slab flows throughout the living space, providing elegant thermal comfort with low energy consumption.",
          infoFr: "Un marbre noir veiné d'or d'une qualité suprême, équipé d'un chauffage au sol hydraulique intelligent ultra-silencieux.",
          infoSw: "Sakafu ya marumaru nyeusi ya kifahari yenye mfumo wa kisasa wa joto chini ya sakafu."
        },
        {
          id: "sound-system",
          x: 48,
          y: 35,
          label: "Built-in Devialet Acoustics",
          labelFr: "Home Cinéma Devialet 7.2",
          labelSw: "Mfumo wa Sauti wa Devialet",
          info: "Seventeen invisible acoustic panels powered by premium Devialet amplifications deliver studio-grade spatial audio across the room.",
          infoFr: "Système sonore spatial d'exception intégré dans les corniches murales pour une immersion acoustique absolue de qualité studio.",
          infoSw: "Mfumo wa spika zilizofichwa za Devialet zinazotoa sauti ya kipekee katika chumba kizima."
        },
        {
          id: "to-pool",
          x: 72,
          y: 52,
          label: "Exit to Infinity Pool Deck",
          labelFr: "Vers la Piscine à débordement",
          labelSw: "Nenda kwenye Bwawa la Kuogelea",
          targetSpotId: "pool"
        }
      ]
    },
    {
      id: "pool",
      name: "Infinity Pool / Garden",
      nameFr: "Piscine & Jardin suspendu",
      nameSw: "Bwawa la Kuogelea / Bustani",
      image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2400&q=80",
      initialHeading: 180,
      hotspots: [
        {
          id: "pool-heating",
          x: 35,
          y: 65,
          label: "Heated salt water filtration",
          labelFr: "Piscine chauffée au sel & filtration UV",
          labelSw: "Bwawa la maji ya chumvi na joto",
          info: "The 15-meter infinity pool uses a modern ecological copper-silver ionization filter, always tempered to an optimal 28°C year-round.",
          infoFr: "Piscine olympique à débordement perpétuel, chauffée par pompe à chaleur solaire intelligente et exempte de produits chlorés.",
          infoSw: "Bwawa la kuogelea la mita 15 lenye mfumo wa kisasa wa joto na usafishaji wa maji ikolojia."
        },
        {
          id: "to-living",
          x: 18,
          y: 48,
          label: "Slide Door to Great Salon",
          labelFr: "Entrer dans le Salon Principal",
          labelSw: "Rudi Sebule Kuu",
          targetSpotId: "living"
        },
        {
          id: "to-bedroom",
          x: 58,
          y: 40,
          label: "Ascend to Master Bedroom Suite",
          labelFr: "Monter vers la Suite Royale",
          labelSw: "Nenda Kwenye Chumba cha Kulala",
          targetSpotId: "bedroom"
        }
      ]
    },
    {
      id: "bedroom",
      name: "Master Bedroom",
      nameFr: "Suite Parentale Impériale",
      nameSw: "Chumba Kuu cha Kulala",
      image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=2400&q=80",
      initialHeading: 270,
      hotspots: [
        {
          id: "bed-design",
          x: 38,
          y: 58,
          label: "Sartorial King Bed Architecture",
          labelFr: "Lit flottant à lévitation magnétique",
          labelSw: "Kitanda cha Kifahari cha King-size",
          info: "A bespoke floating platform bed framed by top-grain Italian leather, with dimmable perimeter warm lighting and customizable back support.",
          infoFr: "Lit suspendu d'architecte avec matelas ergonomique biodynamique, créant une apesanteur physique pour des nuits réparatrices.",
          infoSw: "Kitanda cha kisasa kilichotengenezwa kwa ngozi ya Kiitaliano na taa za kuvutia pembeni."
        },
        {
          id: "bath-link",
          x: 82,
          y: 50,
          label: "Descend to Panoramic Kitchen",
          labelFr: "Descendre vers la Cuisine Haute-Couture",
          labelSw: "Nenda jikoni kwa ngazi",
          targetSpotId: "kitchen"
        },
        {
          id: "from-bedroom-to-living",
          x: 15,
          y: 48,
          label: "Return to Grand Salon",
          labelFr: "Redescendre au Salon",
          labelSw: "Rudi Sebuleni",
          targetSpotId: "living"
        }
      ]
    },
    {
      id: "kitchen",
      name: "Royal Kitchen",
      nameFr: "Cuisine Culinaire d'Exception",
      nameSw: "Jiko la Kifalme",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=80",
      initialHeading: 120,
      hotspots: [
        {
          id: "miele-tech",
          x: 42,
          y: 46,
          label: "Miele Smart Chef Appliances",
          labelFr: "Équipements Gaggenau & Miele Connect",
          labelSw: "Vifaa vya Kisasa vya Miele",
          info: "Concealed multi-touch smart ovens, custom dual zone wine coolers, and dynamic induction hubs seamlessly managed by voice or tablet control.",
          infoFr: "Cuisine signature équipée de fours combinés vapeur Gaggenau, cave de vieillissement intégrée et hottes d'aspiration invisibles ultra-silencieuses.",
          infoSw: "Vifaa vya kisasa kabisa vya jikoni ikiwemo tanuri ya kidijitali na jokofu la divai."
        },
        {
          id: "to-pool-from-kitchen",
          x: 75,
          y: 48,
          label: "Step Outside to Pool Access",
          labelFr: "Accéder directement à la Terrasse",
          labelSw: "Nenda kwenye bwawa la kuogelea",
          targetSpotId: "pool"
        }
      ]
    }
  ],

  // 2. Maison Zanzibar Ocean View
  "zanzibar": [
    {
      id: "deck",
      name: "Panoramic Beachfront Deck",
      nameFr: "Pont d'Observation en Teck",
      nameSw: "Ukumbi wa Kando ya Bahari",
      image: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=2400&q=80",
      initialHeading: 0,
      hotspots: [
        {
          id: "beach-access",
          x: 35,
          y: 75,
          label: "Private beach walkway",
          labelFr: "Accès privatif au lagon de sable blanc",
          labelSw: "Njia ya kipekee kuelekea pwani",
          info: "A secure direct access walkway connects your deck to the turquoise, crystal-clear coastal waters of Zanzibar's finest beach.",
          infoFr: "Accès direct et privé aux plages de sable corallien d'une finesse incomparable, sécurisé et bordé de palmiers sauvages.",
          infoSw: "Njia salama na fupi inayokupeleka moja kwa moja kwenye maji ya bluu ya Zanzibar."
        },
        {
          id: "to-bungalow",
          x: 75,
          y: 55,
          label: "Step into the Ocean Suite bedroom",
          labelFr: "Entrer dans la Suite Suite Tropicale",
          labelSw: "Ingia kwenye chumba cha kitropiki",
          targetSpotId: "bungalow"
        }
      ]
    },
    {
      id: "bungalow",
      name: "Coastal Breeze Suite",
      nameFr: "Pavillon de Nuit Tropical",
      nameSw: "Chumba cha Upepo wa Pwani",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2400&q=80",
      initialHeading: 90,
      hotspots: [
        {
          id: "thatch-detail",
          x: 50,
          y: 25,
          label: "Natural coconut palm insulation",
          labelFr: "Plafond ventilé traditionnel en bois de cocotier",
          labelSw: "Kesi ya paa ya kiasili",
          info: "Hand-woven palms and endemic organic woods ensure continuous natural thermal convection, eliminating standard AC dependency.",
          infoFr: "Charpente traditionnelle en lattes de palme et de bambou offrant une fraîcheur naturelle incomparable par courants de convection croisés.",
          infoSw: "Paa nzuri ya asili inayowezesha upepo kuingia kwa urahisi na kuzuia joto bila mashine."
        },
        {
          id: "to-deck",
          x: 25,
          y: 50,
          label: "Walk Out to Panoramic Sundeck",
          labelFr: "Retourner à la terrasse sur l'océan",
          labelSw: "Nenda kwenye ukumbi wa nje",
          targetSpotId: "deck"
        }
      ]
    }
  ],

  // 3. Appartement Kigali Sky (or Apartment layout standard)
  "kigali": [
    {
      id: "loft-living",
      name: "Industrial Chic Sky Lounge",
      nameFr: "Lounge Industriel Suspendu",
      nameSw: "Saluni ya Angani ya Kisasa",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2400&q=80",
      initialHeading: 0,
      hotspots: [
        {
          id: "smart-glaze",
          x: 48,
          y: 35,
          label: "Smart solar-protection smart glazing",
          labelFr: "Baie vitrée athermique à filtre UV",
          labelSw: "Kioo kinachozuia joto kali la jua",
          info: "Low-emissivity structural glass limits greenhouse effect by 92% while maximizing natural light over Kigali's valleys.",
          infoFr: "Châssis panoramique blindé filtrant les rayons thermiques d'un soleil d'altitude tout en inondant le loft de clarté limpide.",
          infoSw: "Kioo bora kilichoundwa kuzuia mionzi ya jua isiyo na afya na kuhifadhi mazingira tulivu jikoni na sebuleni."
        },
        {
          id: "to-balcony",
          x: 75,
          y: 48,
          label: "Walk Out to Skyline Outlook",
          labelFr: "Accéder au Balcon Suspendu",
          labelSw: "Nenda kwenye jukwaa la nje",
          targetSpotId: "sky-view"
        }
      ]
    },
    {
      id: "sky-view",
      name: "Highest Altitude Terrace",
      nameFr: "Terrasse Observatoire de Kigali",
      nameSw: "Terras ya Maoni ya Jiji",
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2400&q=80",
      initialHeading: 180,
      hotspots: [
        {
          id: "smart-automation",
          x: 22,
          y: 55,
          label: "Full Smart Home Hub integration",
          labelFr: "Capteurs de climatisation passive intégrés",
          labelSw: "Mfumo kamili wa kidijitali wa nyumbani",
          info: "The entire apartment acts as a smart node adjusting airflow, window tints and solar blinds automatically in response to temperature metrics.",
          infoFr: "Capteurs d'ambiances reliés en réseau domotique permettant de configurer la luminosité, l'air et la musique d'ambiance en une commande tactile.",
          infoSw: "Mfumo mkuu wa kudhibiti joto, mwanga, na muziki kupitia simu yako popote ulipo."
        },
        {
          id: "to-living-loft",
          x: 65,
          y: 50,
          label: "Go back into the Loft Living Space",
          labelFr: "Rentrer dans la Suite Espace loft",
          labelSw: "Rudi ndani kwenye ghorofa ya kisasa",
          targetSpotId: "loft-living"
        }
      ]
    }
  ]
};

export default function VirtualTour({ propertyId, propertyTitle, lang }: VirtualTourProps) {
  // Determine relevant tour spots, falling back to Kigali/Sky tour if no specific matching found
  const propertyKey = propertyId.toLowerCase();
  let spots: TourSpot[] = PROPERTY_TOURS["kigali"]; // Fallback standard
  let tourKey = "kigali";
  
  if (propertyKey.includes("kinshasa") || propertyKey.includes("prestige")) {
    spots = PROPERTY_TOURS["kinshasa"];
    tourKey = "kinshasa";
  } else if (propertyKey.includes("zanzibar") || propertyKey.includes("ocean") || propertyKey.includes("lagos") || propertyKey.includes("lagoon")) {
    spots = PROPERTY_TOURS["zanzibar"];
    tourKey = "zanzibar";
  } else if (propertyKey.includes("kigali") || propertyKey.includes("loft") || propertyKey.includes("town")) {
    spots = PROPERTY_TOURS["kigali"];
    tourKey = "kigali";
  }

  const [activeSpotId, setActiveSpotId] = useState<string>(spots[0]?.id || "living");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [panOffset, setPanOffset] = useState(0); // in pixels
  const [isDragging, setIsDragging] = useState(false);
  const [activeInfoHotspot, setActiveInfoHotspot] = useState<TourHotspot | null>(null);
  const [viewMode, setViewMode] = useState<'panorama' | 'spherical360'>('panorama');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{ x: number; offset: number }>({ x: 0, offset: 0 });
  const audioServiceRef = useRef<VirtualAmbientSound | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const activeSpot = spots.find(s => s.id === activeSpotId) || spots[0];
  const PAN_IMAGE_WIDTH = 2400; // Fixed widescreen resolution virtual image width
  const CONTAINER_HEIGHT = 480;

  // Translation dictionaries
  const dict = {
    fr: {
      title: "Visite Virtuelle Interactive 3D",
      subtitle: `Explorez la propriété ${propertyTitle} en immersion à 360°`,
      help: "Glissez pour faire pivoter",
      soundActive: "Ambiance Sonore",
      soundMute: "Son Muet",
      autoRotate: "Rotation Auto",
      spotSelect: "Changer de pièce :",
      backToDetail: "Quitter le mode plein écran",
      exploreNav: "Points d'intérêt",
      exit: "Fermer la visite d'immersion",
      instructions: "Cliquez et glissez avec votre souris ou votre doigt pour explorer le panorama. Cliquez sur les marqueurs dorés pour inspecter les équipements ou vous déplacer.",
    },
    en: {
      title: "Interactive Virtual 3D Tour",
      subtitle: `Explore ${propertyTitle} in 360° immersive landscape`,
      help: "Drag to look around",
      soundActive: "Soundscape On",
      soundMute: "Ambient Off",
      autoRotate: "Auto-Rotate",
      spotSelect: "Select Viewpoint:",
      backToDetail: "Minimize Screen",
      exploreNav: "Hotspots",
      exit: "Close tour view",
      instructions: "Click and drag with your mouse or finger to pan the view. Click the glowing gold markers to inspect premium features or travel between rooms.",
    },
    sw: {
      title: "Ziara ya Mtandaoni ya 3D",
      subtitle: `Kagua jumba la ${propertyTitle} katika hali ya 360° ya kina`,
      help: "Buruta ili kutazama kila upande",
      soundActive: "Sauti za Mazingira",
      soundMute: "Sauti Kimya",
      autoRotate: "Mzunguko Otomatiki",
      spotSelect: "Chagua Chumba:",
      backToDetail: "Funga skrini nzima",
      exploreNav: "Maeneo maalum",
      exit: "Funga ziara ya kuogelea",
      instructions: "Bofya na uburute kwa panya au kidole chako ili kuzungusha picha. Bofya alama zenye kumeta kuchunguza vifaa au kubadilisha vyumba."
    }
  };

  const t = dict[lang] || dict['fr'];

  // Initialize Audio service lazily
  if (!audioServiceRef.current) {
    audioServiceRef.current = new VirtualAmbientSound();
  }

  // Handle Resize and Dynamic Width boundaries
  const [containerWidth, setContainerWidth] = useState(800);
  const scrollMax = Math.max(0, PAN_IMAGE_WIDTH - containerWidth);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
      
      // Update heading panning initial degree
      if (activeSpot) {
        const initialPanRatio = activeSpot.initialHeading / 360; 
        const targetOffset = -(scrollMax * initialPanRatio);
        setPanOffset(targetOffset);
      }
    }

    if (containerRef.current && 'ResizeObserver' in window) {
      const observer = new ResizeObserver((entries) => {
        if (entries[0]) {
          const width = entries[0].contentRect.width;
          setContainerWidth(width);
        }
      });
      observer.observe(containerRef.current);
      resizeObserverRef.current = observer;
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (audioServiceRef.current) {
        audioServiceRef.current.cleanup();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeSpotId]);

  // Handle Soundscape active toggle
  const handleToggleSound = () => {
    if (audioServiceRef.current) {
      const state = audioServiceRef.current.toggle();
      setIsPlayingSound(state);
    }
  };

  // Auto rotation tick logic
  useEffect(() => {
    let lastTime = performance.now();
    const animate = (time: number) => {
      if (isRotating && !isDragging) {
        const deltaTime = time - lastTime;
        // Adjust scroll offset slowly to create continuous rotation loop
        setPanOffset((prev) => {
          let next = prev - 0.02 * deltaTime; // Speed multiplier
          if (next < -scrollMax) {
            next = 0; // Wrap around seamless
          }
          return next;
        });
      }
      lastTime = time;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (isRotating && !isDragging) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRotating, isDragging, scrollMax]);

  // Drag listeners
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setIsRotating(false); // Stop auto rotate while interacting
    dragStartRef.current = {
      x: e.clientX,
      offset: panOffset
    };
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    let nextOffset = dragStartRef.current.offset + deltaX * 1.5; // Drag sensitivity
    
    // Bounds check
    if (nextOffset > 0) nextOffset = 0;
    if (nextOffset < -scrollMax) nextOffset = -scrollMax;
    
    setPanOffset(nextOffset);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch listener supports for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    setIsDragging(true);
    setIsRotating(false);
    dragStartRef.current = {
      x: touch.clientX,
      offset: panOffset
    };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    if (!touch) return;
    const deltaX = touch.clientX - dragStartRef.current.x;
    let nextOffset = dragStartRef.current.offset + deltaX * 1.8;
    
    // Bounds check
    if (nextOffset > 0) nextOffset = 0;
    if (nextOffset < -scrollMax) nextOffset = -scrollMax;
    
    setPanOffset(nextOffset);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const panLeft = () => {
    setIsRotating(false);
    setPanOffset((prev) => Math.min(0, prev + 250));
  };

  const panRight = () => {
    setIsRotating(false);
    setPanOffset((prev) => Math.max(-scrollMax, prev - 250));
  };

  // Convert panOffset to compass orientation (0 to 360 degree angle)
  const getCompassDegree = () => {
    if (scrollMax === 0) return 0;
    const scrollRatio = Math.abs(panOffset) / scrollMax;
    return Math.round(scrollRatio * 360);
  };

  const getCompassDirectionName = (deg: number) => {
    if (deg >= 337.5 || deg < 22.5) return "N";
    if (deg >= 22.5 && deg < 67.5) return "NE";
    if (deg >= 67.5 && deg < 112.5) return "E";
    if (deg >= 112.5 && deg < 157.5) return "SE";
    if (deg >= 157.5 && deg < 202.5) return "S";
    if (deg >= 202.5 && deg < 247.5) return "SO";
    if (deg >= 247.5 && deg < 292.5) return "O";
    return "NO";
  };

  const headingDegree = getCompassDegree();
  const headingDirection = getCompassDirectionName(headingDegree);

  // Transition helper to travel into another viewpoint
  const travelToSpot = (spotId: string) => {
    setActiveInfoHotspot(null);
    setActiveSpotId(spotId);
  };

  // Toggle full immersive mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div id="virtual-tour-root" className={`relative rounded-3xl ${isFullscreen ? 'fixed inset-0 z-[1000] bg-dark-bg p-6' : 'w-full mb-12 border border-brand/20 bg-dark-nav/50 overflow-hidden'}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent pointer-events-none" />
      
      {/* Header Info Panel */}
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-widest mb-1">
            <Sparkles size={14} className="animate-pulse text-yellow-500" />
            {t.exploreNav} • Experience 360° VR
          </div>
          <h3 className="text-2xl font-display font-black text-text-primary uppercase tracking-tight">
            {t.title}
          </h3>
          <p className="text-gray-400 text-xs font-light mt-1">
            {t.subtitle}
          </p>
        </div>

        {/* Feature Dashboard controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher Pill */}
          <div className="flex items-center gap-1 bg-black/60 border border-white/10 p-1 rounded-2xl">
            <button
              onClick={() => setViewMode('panorama')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'panorama'
                  ? 'bg-brand text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Panorama
            </button>
            <button
              onClick={() => setViewMode('spherical360')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'spherical360'
                  ? 'bg-brand text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Globe size={14} className="animate-spin duration-3000" />
              <span>Sphérique 360°</span>
            </button>
          </div>

          {/* Ambient trigger */}
          <button 
            onClick={handleToggleSound}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
              isPlayingSound 
                ? 'bg-green-500/20 text-green-400 border-green-500/40' 
                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
            }`}
            title="Ambient Wave Soundscape Generator"
          >
            {isPlayingSound ? <Volume2 size={16} className="animate-bounce" /> : <VolumeX size={16} />}
            <span>{isPlayingSound ? t.soundActive : t.soundMute}</span>
          </button>

          {/* Auto rotate switch */}
          <button 
            onClick={() => setIsRotating(!isRotating)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
              isRotating 
                ? 'bg-brand/20 text-brand border-brand/40' 
                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
            }`}
          >
            {isRotating ? <Play size={14} className="animate-spin duration-1000" /> : <Pause size={14} />}
            <span>{t.autoRotate}</span>
          </button>

          {/* Screen expansion */}
          <button 
            onClick={toggleFullscreen}
            className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 rounded-2xl transition-all"
            title="Toggle Cinematic Fullscreen Modes"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>

      {/* Main Content Area: Spherical 360 Viewer or Panoramic Arena stage */}
      {viewMode === 'spherical360' ? (
        <div className="p-4 bg-black/90">
          <Spherical360Viewer 
            initialImageUrl={activeSpot.image} 
            propertyTitle={propertyTitle} 
            lang={lang} 
            onClose={() => setViewMode('panorama')}
          />
        </div>
      ) : (
        /* Panoramic Arena stage */
        <div 
          ref={arenaRef}
          className="relative overflow-hidden w-full bg-black/90 group/arena" 
          style={{ height: `${CONTAINER_HEIGHT}px` }}
        >
        
        {/* Dynamic Compass Indicator overlay */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-white shadow-xl pointer-events-none">
          <div className="relative w-8 h-8 flex items-center justify-center rounded-full bg-brand/10 border border-brand/20">
            <Compass 
              size={18} 
              className="text-brand transition-transform duration-300"
              style={{ transform: `rotate(${headingDegree}deg)` }}
            />
          </div>
          <div>
            <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest leading-none">Perspective</div>
            <div className="text-sm font-mono font-bold">{headingDirection} • {headingDegree}°</div>
          </div>
        </div>

        {/* Floating guidance hint banner */}
        <div className="absolute top-6 right-6 z-20 hidden md:flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5 text-xs text-gray-400 pointer-events-none group-hover/arena:opacity-0 transition-opacity duration-300">
          <Eye size={12} className="text-brand" />
          <span>{t.help}</span>
        </div>

        {/* Moving Inner Panorama and Hotspots Box Container */}
        <div 
          ref={containerRef}
          className="relative w-full h-full select-none overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Panoramic wide background wrapped */}
          <div 
            ref={imageWrapperRef}
            className="absolute top-0 bottom-0 flex transition-transform ease-out pointer-events-none"
            style={{ 
              width: `${PAN_IMAGE_WIDTH}px`,
              transform: `translateX(${panOffset}px)`,
              transitionDuration: isDragging ? '0ms' : '150ms' // smooth dragging with minor dampening friction
            }}
          >
            {/* The Actual Panorama View */}
            <div className="relative w-full h-full">
              <img 
                src={activeSpot.image} 
                alt={activeSpot.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none pointer-events-none"
                style={{ width: `${PAN_IMAGE_WIDTH}px` }}
              />
              
              {/* Absolutes positions hotspots within the panoramic dimension framework */}
              {activeSpot.hotspots?.map((hotspot) => {
                const isNav = !!hotspot.targetSpotId;
                
                return (
                  <button
                    key={hotspot.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isNav && hotspot.targetSpotId) {
                        travelToSpot(hotspot.targetSpotId);
                      } else {
                        setActiveInfoHotspot(hotspot);
                      }
                    }}
                    className={`absolute pointer-events-auto group/marker z-10 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
                      isNav ? 'w-14 h-14' : 'w-11 h-11'
                    }`}
                    style={{ 
                      left: `${hotspot.x}%`, 
                      top: `${hotspot.y}%` 
                    }}
                  >
                    {/* Ring Pulse outer glowing circles */}
                    <div className={`absolute inset-0 rounded-full animate-ping opacity-60 ${
                      isNav ? 'bg-brand/30' : 'bg-yellow-500/20'
                    }`} style={{ animationDuration: '3s' }} />

                    {/* Stable Core Circle border */}
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-2xl group-hover/marker:scale-125 ${
                      isNav 
                        ? 'bg-brand text-white border-brand-light group-hover:bg-white group-hover:text-black' 
                        : 'bg-black/80 text-yellow-500 border-yellow-500/30 group-hover:bg-yellow-500 group-hover:text-black group-hover:border-yellow-400'
                    }`}>
                      {isNav ? <ArrowRight size={14} className="group-hover/marker:translate-x-0.5 transition-transform" /> : <Info size={14} />}
                    </div>

                    {/* Glowing Label Tooltip always visible */}
                    <span className="absolute top-full mt-2.5 px-3 py-1.5 whitespace-nowrap bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-wider text-text-primary uppercase pointer-events-none shadow-md group-hover/marker:bg-brand group-hover/marker:border-brand transition-all">
                      {lang === 'fr' ? hotspot.labelFr || hotspot.label : lang === 'sw' ? hotspot.labelSw || hotspot.label : hotspot.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Manual Arrow navigation overrides */}
        <button 
          onClick={panLeft}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-3xl bg-black/50 backdrop-blur-md border border-white/10 hover:border-brand/40 text-gray-400 hover:text-white transition-all hover:scale-105 active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={panRight}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-3xl bg-black/50 backdrop-blur-md border border-white/10 hover:border-brand/40 text-gray-400 hover:text-white transition-all hover:scale-105 active:scale-95"
        >
          <ChevronRight size={24} />
        </button>

        {/* Spot detailed info block overlay */}
        <AnimatePresence>
          {activeInfoHotspot && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="absolute bottom-6 left-6 right-6 md:left-8 md:right-auto md:max-w-md z-30 bg-surface-elevated/95 backdrop-blur-lg border border-brand/30 rounded-3xl p-6 shadow-2xl flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand text-[10px] font-black uppercase tracking-widest">
                  <Sparkles size={12} className="text-yellow-500" />
                  Garanties Premium
                </div>
                <button 
                  onClick={() => setActiveInfoHotspot(null)}
                  className="text-xs text-gray-500 hover:text-white font-bold uppercase"
                >
                  [ Fermer ]
                </button>
              </div>
              <h4 className="text-xl font-display font-black text-white uppercase tracking-tight">
                {lang === 'fr' ? activeInfoHotspot.labelFr || activeInfoHotspot.label : lang === 'sw' ? activeInfoHotspot.labelSw || activeInfoHotspot.label : activeInfoHotspot.label}
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                {lang === 'fr' ? activeInfoHotspot.infoFr || activeInfoHotspot.info : lang === 'sw' ? activeInfoHotspot.infoSw || activeInfoHotspot.info : activeInfoHotspot.info}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Draggable Mini-Map Indicator */}
        <motion.div
          drag
          dragConstraints={arenaRef}
          dragMomentum={false}
          dragElastic={0.1}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute bottom-6 right-6 z-40 w-64 bg-black/85 backdrop-blur-md border border-brand/35 rounded-2xl shadow-2xl p-4 cursor-grab active:cursor-grabbing select-none"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* HUD Header bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
            <div className="flex items-center gap-1.5 text-brand text-[10px] font-black uppercase tracking-wider">
              <Compass size={12} className="animate-pulse text-yellow-500" />
              <span>{lang === 'fr' ? "Plan au Sol 2D" : lang === 'sw' ? "Ramani ya 2D" : "2D Floor Plan"}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{lang === 'fr' ? "INTERACTIF" : "LIVE MAP"}</span>
            </div>
          </div>

          {/* Floorplan graphics blueprint stage */}
          <div className="relative h-28 w-full bg-black/40 border border-white/5 rounded-xl flex items-center justify-center p-2 overflow-hidden">
             {/* Grid pattern texture */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:12px_12px]" />
             
             {/* 2D architectural partition blueprint walls */}
             {tourKey === 'kinshasa' && (
               <svg className="w-full h-full text-white/5" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
                 <rect x="5" y="10" width="90" height="80" rx="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                 {/* Quad dividers block */}
                 <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="1" />
                 <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
                 {/* door curves representation */}
                 <path d="M 50,30 A 20,20 0 0,1 70,50" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
                 <path d="M 50,70 A 20,20 0 0,0 30,50" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
               </svg>
             )}
             {tourKey === 'zanzibar' && (
               <svg className="w-full h-full text-white/5" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
                 <rect x="5" y="20" width="90" height="60" rx="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                 <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="1.2" />
                 {/* door sliding arc representation */}
                 <path d="M 50,35 A 15,15 0 0,1 65,50" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
               </svg>
             )}
             {tourKey === 'kigali' && (
               <svg className="w-full h-full text-white/5" viewBox="0 0 100 100" fill="none" preserveAspectRatio="none">
                 <rect x="5" y="15" width="90" height="70" rx="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                 <line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="1" />
                 <path d="M 50,40 A 10,10 0 0,1 60,50" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
               </svg>
             )}

             {/* Room clickable pointers overlay */}
             {(() => {
               const coords = SPOT_MAP_COORDS[tourKey] || SPOT_MAP_COORDS["kigali"];
               return Object.entries(coords).map(([id, room]) => {
                 const isActive = id === activeSpotId;
                 return (
                   <button
                     key={id}
                     onClick={(e) => {
                       e.stopPropagation();
                       travelToSpot(id);
                     }}
                     className="absolute -translate-x-1/2 -translate-y-1/2 group/room cursor-pointer p-1 rounded-full z-15"
                     style={{ left: `${room.x}%`, top: `${room.y}%` }}
                   >
                     {isActive ? (
                       <div className="relative flex items-center justify-center">
                         {/* Dynamic Vision radar cone with 60 degree cover range */}
                         <svg 
                           className="absolute w-20 h-20 text-brand/35 fill-brand/10 transition-transform duration-100 pointer-events-none"
                           viewBox="0 0 100 100"
                           style={{ transform: `rotate(${headingDegree - 90}deg)` }}
                         >
                           <path d="M 50,50 L 25,6 M 50,50 L 75,6 A 35,35 0 0,0 25,6 Z" />
                         </svg>
                         <div className="w-3.5 h-3.5 rounded-full bg-brand/35 animate-ping absolute" />
                         <div className="w-2.5 h-2.5 rounded-full bg-brand border border-white shadow-lg shadow-brand/50 z-20" />
                       </div>
                     ) : (
                       <div className="w-2 h-2 rounded-full bg-gray-500/80 border border-white/20 group-hover/room:bg-brand group-hover/room:scale-125 transition-all duration-200" />
                     )}

                     {/* Interactive floating descriptive label */}
                     <span className={`absolute top-full mt-1.5 -translate-x-1/2 left-1/2 whitespace-nowrap text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded transition-all duration-200 ${
                       isActive 
                         ? 'text-brand-light bg-brand/20 border border-brand/45' 
                         : 'text-gray-400 bg-black/60 border border-white/5 opacity-80 group-hover/room:opacity-100 group-hover/room:text-white group-hover/room:bg-brand/30'
                     }`}>
                       {lang === 'fr' ? room.labelFr : lang === 'sw' ? room.labelSw : room.label}
                     </span>
                   </button>
                 );
               });
             })()}
          </div>
        </motion.div>
      </div>
      )}

      {/* Navigation selector footer */}
      <div className="p-6 md:p-8 bg-dark-nav/60 border-t border-white/5 relative z-10">
        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-4">
          {t.spotSelect}
        </p>
        <div className="flex flex-wrap gap-4">
          {spots.map((spot) => {
            const isActive = spot.id === activeSpotId;
            return (
              <button
                key={spot.id}
                onClick={() => travelToSpot(spot.id)}
                className={`relative flex items-center gap-4 px-5 py-3 rounded-2xl border text-sm font-bold uppercase tracking-wider transition-all ${
                  isActive 
                    ? 'bg-brand/10 text-brand border-brand shadow-lg shadow-brand/10' 
                    : 'bg-white/5 text-gray-400 border-white/5 hover:text-white hover:bg-white/10 hover:border-white/10'
                }`}
              >
                {/* Thumb icon small glow */}
                <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-brand animate-ping' : 'bg-gray-600'}`} />
                <span>{lang === 'fr' ? spot.nameFr : lang === 'sw' ? spot.nameSw : spot.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive help guide text block */}
        <div className="mt-6 flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-400">
          <HelpCircle size={16} className="text-brand shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t.instructions}
          </p>
        </div>

        {isFullscreen && (
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
            <button
              onClick={toggleFullscreen}
              className="px-6 py-4 bg-white/15 text-white rounded-2xl font-bold uppercase text-xs hover:bg-white/20 transition-all tracking-wider"
            >
              {t.backToDetail}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
