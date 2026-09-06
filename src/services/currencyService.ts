import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 
  | 'XOF' 
  | 'XAF' 
  | 'USD' 
  | 'EUR' 
  | 'NGN' 
  | 'KES' 
  | 'ZAR' 
  | 'GHS' 
  | 'MAD' 
  | 'RWF' 
  | 'CDF' 
  | 'TZS';

export interface CurrencyMeta {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  countries: string;
  region: 'Ouest' | 'Centre' | 'Est' | 'Sud' | 'Nord' | 'Global';
  rateToUSD: number; // How many units of this currency per 1 USD
  decimals: number;
}

/**
 * The 12 Priority Currencies covering 80% of Africa & Diaspora
 */
export const AFRICANOVA_CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  XOF: {
    code: 'XOF',
    name: 'Franc CFA Ouest (BCEAO)',
    symbol: '₣',
    flag: '🇸🇳',
    countries: 'Sénégal, Côte d\'Ivoire, Mali, Bénin, Togo, Burkina Faso, Niger, Guinée-Bissau',
    region: 'Ouest',
    rateToUSD: 605.5,
    decimals: 0,
  },
  XAF: {
    code: 'XAF',
    name: 'Franc CFA Centre (BEAC)',
    symbol: '₣',
    flag: '🇨🇲',
    countries: 'Cameroun, Gabon, Congo, Tchad, Guinée Équatoriale, RCA',
    region: 'Centre',
    rateToUSD: 605.5,
    decimals: 0,
  },
  USD: {
    code: 'USD',
    name: 'Dollar US',
    symbol: '$',
    flag: '🇺🇸',
    countries: 'International, Arbitrage & Diaspora mondiale',
    region: 'Global',
    rateToUSD: 1.0,
    decimals: 0,
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    countries: 'Diaspora Europe (France, Belgique, Allemagne...)',
    region: 'Global',
    rateToUSD: 0.92,
    decimals: 0,
  },
  NGN: {
    code: 'NGN',
    name: 'Naira Nigérian',
    symbol: '₦',
    flag: '🇳🇬',
    countries: 'Nigéria (Lagos, Abuja, Kano...)',
    region: 'Ouest',
    rateToUSD: 1610,
    decimals: 0,
  },
  KES: {
    code: 'KES',
    name: 'Shilling Kenyan',
    symbol: 'KSh',
    flag: '🇰🇪',
    countries: 'Kenya (Nairobi, Mombasa...)',
    region: 'Est',
    rateToUSD: 129.5,
    decimals: 0,
  },
  ZAR: {
    code: 'ZAR',
    name: 'Rand Sud-Africain',
    symbol: 'R',
    flag: '🇿🇦',
    countries: 'Afrique du Sud (Johannesburg, Cape Town...)',
    region: 'Sud',
    rateToUSD: 18.15,
    decimals: 2,
  },
  GHS: {
    code: 'GHS',
    name: 'Cedi Ghanéen',
    symbol: 'GH₵',
    flag: '🇬🇭',
    countries: 'Ghana (Accra, Kumasi...)',
    region: 'Ouest',
    rateToUSD: 15.6,
    decimals: 2,
  },
  MAD: {
    code: 'MAD',
    name: 'Dirham Marocain',
    symbol: 'DH',
    flag: '🇲🇦',
    countries: 'Maroc (Casablanca, Rabat, Tanger...)',
    region: 'Nord',
    rateToUSD: 9.88,
    decimals: 2,
  },
  RWF: {
    code: 'RWF',
    name: 'Franc Rwandais',
    symbol: 'FRw',
    flag: '🇷🇼',
    countries: 'Rwanda (Kigali...)',
    region: 'Est',
    rateToUSD: 1385,
    decimals: 0,
  },
  CDF: {
    code: 'CDF',
    name: 'Franc Congolais',
    symbol: 'FC',
    flag: '🇨🇩',
    countries: 'RD Congo (Kinshasa, Lubumbashi, Goma...)',
    region: 'Centre',
    rateToUSD: 2850,
    decimals: 0,
  },
  TZS: {
    code: 'TZS',
    name: 'Shilling Tanzanien',
    symbol: 'TSh',
    flag: '🇹🇿',
    countries: 'Tanzanie, Zanzibar (Dar es Salaam, Stone Town...)',
    region: 'Est',
    rateToUSD: 2620,
    decimals: 0,
  },
};

export const CURRENCY_LIST = Object.values(AFRICANOVA_CURRENCIES);

/**
 * Converts an amount from one currency to another using USD as base bridge.
 */
export function convertCurrency(
  amount: number,
  from: CurrencyCode | string,
  to: CurrencyCode | string
): number {
  const fromMeta = AFRICANOVA_CURRENCIES[from as CurrencyCode] || AFRICANOVA_CURRENCIES.USD;
  const toMeta = AFRICANOVA_CURRENCIES[to as CurrencyCode] || AFRICANOVA_CURRENCIES.USD;

  if (fromMeta.code === toMeta.code) return amount;

  // Convert to USD first, then to target currency
  const amountInUSD = amount / fromMeta.rateToUSD;
  const targetAmount = amountInUSD * toMeta.rateToUSD;

  return targetAmount;
}

/**
 * Format a number with thousands spaces, e.g. 1 000 000
 */
export function formatNumberWithSpaces(value: number, decimals = 0): string {
  if (isNaN(value)) return '0';
  const rounded = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  const parts = rounded.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
}

/**
 * Formats an amount with its currency symbol and proper abbreviation.
 */
export function formatPrice(
  amount: number,
  currencyCode: CurrencyCode | string,
  options?: { compact?: boolean; showCode?: boolean }
): string {
  const meta = AFRICANOVA_CURRENCIES[currencyCode as CurrencyCode] || AFRICANOVA_CURRENCIES.USD;
  const compact = options?.compact;
  const showCode = options?.showCode ?? true;

  if (compact) {
    if (amount >= 1_000_000_000) {
      return `${(amount / 1_000_000_000).toFixed(1)} Mrd ${meta.code}`;
    }
    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(1)} M ${meta.code}`;
    }
    if (amount >= 10_000) {
      return `${(amount / 1_000).toFixed(0)} k ${meta.code}`;
    }
  }

  const formattedNum = formatNumberWithSpaces(amount, meta.decimals);

  // Symbol placement convention
  if (meta.code === 'USD') {
    return showCode ? `${formattedNum} $ (USD)` : `${formattedNum} $`;
  }
  if (meta.code === 'EUR') {
    return showCode ? `${formattedNum} € (EUR)` : `${formattedNum} €`;
  }
  return showCode 
    ? `${formattedNum} ${meta.symbol} (${meta.code})` 
    : `${formattedNum} ${meta.symbol}`;
}

/**
 * Parses user string to extract numeric amount and potential currency code
 */
export function parseCurrencyQuery(query: string): {
  amount?: number;
  fromCurrency?: CurrencyCode;
  toCurrency?: CurrencyCode;
} {
  const q = query.toLowerCase();

  // Look for numbers (with support for "millions", "m", "k")
  let amount: number | undefined;
  const numberMatch = q.match(/(\d+[\s\d]*([.,]\d+)?)/);
  if (numberMatch) {
    let cleanNum = numberMatch[1].replace(/\s+/g, '').replace(',', '.');
    let parsed = parseFloat(cleanNum);
    if (q.includes('million') || q.includes('millions') || q.includes(' m ')) {
      parsed = parsed * 1_000_000;
    } else if (q.includes('milliard') || q.includes('milliards')) {
      parsed = parsed * 1_000_000_000;
    } else if (q.includes('mille') || q.includes(' k ')) {
      parsed = parsed * 1_000;
    }
    amount = parsed;
  }

  // Detect fromCurrency
  let fromCurrency: CurrencyCode | undefined;
  if (q.includes('fcfa') || q.includes('cfa') || q.includes('xof')) {
    fromCurrency = 'XOF';
  } else if (q.includes('xaf')) {
    fromCurrency = 'XAF';
  } else if (q.includes('dollar') || q.includes('usd') || q.includes('$')) {
    fromCurrency = 'USD';
  } else if (q.includes('euro') || q.includes('eur') || q.includes('€')) {
    fromCurrency = 'EUR';
  } else if (q.includes('naira') || q.includes('ngn') || q.includes('₦')) {
    fromCurrency = 'NGN';
  } else if (q.includes('shilling') || q.includes('kes')) {
    fromCurrency = 'KES';
  } else if (q.includes('rand') || q.includes('zar')) {
    fromCurrency = 'ZAR';
  } else if (q.includes('cedi') || q.includes('ghs')) {
    fromCurrency = 'GHS';
  } else if (q.includes('dirham') || q.includes('mad')) {
    fromCurrency = 'MAD';
  } else if (q.includes('rwf') || q.includes('franc rwandais')) {
    fromCurrency = 'RWF';
  } else if (q.includes('cdf') || q.includes('franc congolais')) {
    fromCurrency = 'CDF';
  } else if (q.includes('tzs') || q.includes('tanzanie')) {
    fromCurrency = 'TZS';
  }

  // Detect toCurrency
  let toCurrency: CurrencyCode | undefined;
  const afterEnMatch = q.split(/\ben\b|\bto\b|\bvers\b/);
  if (afterEnMatch.length > 1) {
    const targetPart = afterEnMatch[1];
    if (targetPart.includes('shilling') || targetPart.includes('kes') || targetPart.includes('kenya')) {
      toCurrency = 'KES';
    } else if (targetPart.includes('tanzanien') || targetPart.includes('tzs') || targetPart.includes('zanzibar')) {
      toCurrency = 'TZS';
    } else if (targetPart.includes('naira') || targetPart.includes('ngn') || targetPart.includes('nigeria')) {
      toCurrency = 'NGN';
    } else if (targetPart.includes('cfa') || targetPart.includes('fcfa') || targetPart.includes('xof')) {
      toCurrency = 'XOF';
    } else if (targetPart.includes('xaf')) {
      toCurrency = 'XAF';
    } else if (targetPart.includes('dollar') || targetPart.includes('usd')) {
      toCurrency = 'USD';
    } else if (targetPart.includes('euro') || targetPart.includes('eur')) {
      toCurrency = 'EUR';
    } else if (targetPart.includes('rand') || targetPart.includes('zar')) {
      toCurrency = 'ZAR';
    } else if (targetPart.includes('cedi') || targetPart.includes('ghs')) {
      toCurrency = 'GHS';
    } else if (targetPart.includes('dirham') || targetPart.includes('mad')) {
      toCurrency = 'MAD';
    } else if (targetPart.includes('rwf') || targetPart.includes('rwanda')) {
      toCurrency = 'RWF';
    } else if (targetPart.includes('cdf') || targetPart.includes('congo')) {
      toCurrency = 'CDF';
    }
  }

  return { amount, fromCurrency, toCurrency };
}

/**
 * Parses a price string (e.g. "180 000 $", "2 500 000 FCFA", "3 500 $/mois")
 * and converts it to the target currency.
 */
export function formatPriceString(
  priceStr: string,
  targetCurrency: CurrencyCode
): string {
  if (!priceStr) return priceStr;
  
  // Non-convertible terms (e.g. "Gratuit", "Sur devis", "Inclus")
  if (/gratuit|sur devis|inclus|négociable|nous consulter/i.test(priceStr)) {
    return priceStr;
  }

  // Detect suffixes like "/ mois", "/ an", "/ sem", "/ conteneur", etc.
  let suffix = '';
  const suffixMatch = priceStr.match(/(\/\s*[a-zA-Zà-ÿ]+.*)$/);
  if (suffixMatch) {
    suffix = ' ' + suffixMatch[1].trim();
  }

  // Detect source currency
  let sourceCurrency: CurrencyCode = 'USD';
  if (/fcfa|cfa|xof/i.test(priceStr)) {
    sourceCurrency = 'XOF';
  } else if (/xaf/i.test(priceStr)) {
    sourceCurrency = 'XAF';
  } else if (/\$|usd|dollar/i.test(priceStr)) {
    sourceCurrency = 'USD';
  } else if (/€|eur|euro/i.test(priceStr)) {
    sourceCurrency = 'EUR';
  } else if (/₦|ngn|naira/i.test(priceStr)) {
    sourceCurrency = 'NGN';
  } else if (/ksh|kes|shilling/i.test(priceStr)) {
    sourceCurrency = 'KES';
  } else if (/zar|rand/i.test(priceStr)) {
    sourceCurrency = 'ZAR';
  } else if (/ghs|cedi/i.test(priceStr)) {
    sourceCurrency = 'GHS';
  } else if (/mad|dirham/i.test(priceStr)) {
    sourceCurrency = 'MAD';
  }

  // Extract number
  const numMatch = priceStr.match(/([\d\s]+([.,]\d+)?)/);
  if (!numMatch) return priceStr;

  const rawNum = parseFloat(numMatch[1].replace(/\s+/g, '').replace(',', '.'));
  if (isNaN(rawNum)) return priceStr;

  const converted = convertCurrency(rawNum, sourceCurrency, targetCurrency);
  return `${formatPrice(converted, targetCurrency)}${suffix}`;
}

/**
 * Currency Context for React
 */
interface CurrencyContextType {
  currentCurrency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  convert: (amount: number, from: CurrencyCode | string, to?: CurrencyCode | string) => number;
  formatFromUSD: (amountInUSD: number, options?: { compact?: boolean; showCode?: boolean }) => string;
  formatDirect: (amount: number, currencyCode: CurrencyCode, options?: { compact?: boolean; showCode?: boolean }) => string;
  formatPriceString: (priceStr: string) => string;
  meta: CurrencyMeta;
  allCurrencies: CurrencyMeta[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>(() => {
    // Try localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('africanova_currency');
      if (saved && saved in AFRICANOVA_CURRENCIES) {
        return saved as CurrencyCode;
      }
    }
    return 'USD';
  });

  const setCurrency = (code: CurrencyCode) => {
    setCurrentCurrency(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('africanova_currency', code);
    }
  };

  const convert = (amount: number, from: CurrencyCode | string, to?: CurrencyCode | string): number => {
    const target = (to as CurrencyCode) || currentCurrency;
    return convertCurrency(amount, from, target);
  };

  const formatFromUSD = (amountInUSD: number, options?: { compact?: boolean; showCode?: boolean }): string => {
    const converted = convertCurrency(amountInUSD, 'USD', currentCurrency);
    return formatPrice(converted, currentCurrency, options);
  };

  const formatDirect = (amount: number, currencyCode: CurrencyCode, options?: { compact?: boolean; showCode?: boolean }): string => {
    return formatPrice(amount, currencyCode, options);
  };

  const formatPriceStr = (priceStr: string): string => {
    return formatPriceString(priceStr, currentCurrency);
  };

  const meta = AFRICANOVA_CURRENCIES[currentCurrency];

  return React.createElement(
    CurrencyContext.Provider,
    {
      value: {
        currentCurrency,
        setCurrency,
        convert,
        formatFromUSD,
        formatDirect,
        formatPriceString: formatPriceStr,
        meta,
        allCurrencies: CURRENCY_LIST,
      },
    },
    children
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
