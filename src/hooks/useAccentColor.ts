import { useState, useEffect } from 'react';

export type AccentColor = 'gold-black' | 'gold' | 'black' | 'emerald' | 'sapphire';

export function useAccentColor(): { accentColor: AccentColor; isGoldTheme: boolean } {
  const getInitial = (): AccentColor => {
    if (typeof window === 'undefined') return 'gold-black';
    const attr = document.documentElement.getAttribute('data-accent') as AccentColor;
    if (attr) return attr;
    const saved = localStorage.getItem('accentColor') as AccentColor;
    return (saved as AccentColor) || 'gold-black';
  };

  const [accentColor, setAccentColor] = useState<AccentColor>(getInitial);

  useEffect(() => {
    const handleUpdate = () => {
      const current = document.documentElement.getAttribute('data-accent') as AccentColor;
      if (current && current !== accentColor) {
        setAccentColor(current);
      }
    };

    handleUpdate();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-accent') {
          handleUpdate();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-accent']
    });

    window.addEventListener('storage', handleUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleUpdate);
    };
  }, [accentColor]);

  const isGoldTheme = accentColor === 'gold-black' || accentColor === 'gold';

  return { accentColor, isGoldTheme };
}
