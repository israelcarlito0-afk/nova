import { Transaction } from './services/transactionService';

export interface InvestmentMilestone {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  description: string;
  category: 'listing' | 'analysis' | 'due_diligence' | 'acquisition' | 'closing' | 'yield';
  details?: string[];
  metrics?: { label: string; value: string }[];
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  beds: number;
  baths: number;
  sqm: number;
  description: string;
  ownerId: string;
  status: 'available' | 'sold' | 'rented';
  coordinates: { lat: number; lng: number };
  createdAt?: any;
  yearBuilt?: number;
  condition?: 'New' | 'Excellent' | 'Good' | 'Needs Work';
  amenities?: string[];
  viewType?: 'Ocean' | 'City' | 'Mountain' | 'Garden';
  energyRating?: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'E' | string;
  energyKwh?: number;
  investmentMilestones?: InvestmentMilestone[];
  aiEstimate?: {
    price_estimate: number;
    condition: string;
    investment_score: number;
    market_trend?: string;
    risk_factors?: string[];
    investment_reasoning?: string;
  };
}

export interface ChatMessage {
  id?: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: any;
  recommendations?: string[];
}

export interface SavedFilter {
  id?: string;
  userId: string;
  name: string;
  category: string;
  priceRange: [number, number];
  beds: number;
  baths: number;
  location: string;
  yearBuilt: number;
  condition: string;
  amenities: string[];
  viewType: string;
  energyRating?: string;
  createdAt: any;
}

export interface WaitlistEntry {
  id?: string;
  userId?: string | null;
  userEmail: string;
  propertyId: string;
  propertyTitle?: string;
  createdAt: any;
}
