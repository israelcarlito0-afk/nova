import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, ImageIcon } from 'lucide-react';

export interface PropertyGalleryProps {
  images: string[];
  title?: string;
  category?: string;
  status?: string;
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  onImageClick?: (index: number) => void;
  showThumbnails?: boolean;
  aspectRatio?: string;
  className?: string;
  lang?: string;
  badges?: React.ReactNode;
  overlayControls?: React.ReactNode;
  bottomLeftContent?: React.ReactNode;
  bottomRightControls?: React.ReactNode;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({
  images = [],
  title = '',
  category,
  status,
  currentIndex: externalIndex,
  onIndexChange,
  onImageClick,
  showThumbnails = true,
  aspectRatio = 'aspect-[16/9]',
  className = '',
  lang = 'fr',
  badges,
  overlayControls,
  bottomLeftContent,
  bottomRightControls,
}) => {
  const [internalIndex, setInternalIndex] = useState(0);

  const galleryImages = images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80'];
  const isControlled = externalIndex !== undefined;
  const activeIndex = isControlled ? externalIndex : internalIndex;

  const setActiveIndex = (newIndex: number) => {
    if (!isControlled) {
      setInternalIndex(newIndex);
    }
    if (onIndexChange) {
      onIndexChange(newIndex);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (activeIndex - 1 + galleryImages.length) % galleryImages.length;
    setActiveIndex(nextIdx);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (activeIndex + 1) % galleryImages.length;
    setActiveIndex(nextIdx);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image Viewport */}
      <div 
        onClick={() => onImageClick && onImageClick(activeIndex)}
        className={`relative ${aspectRatio} rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group/gallery select-none ${
          onImageClick ? 'cursor-zoom-in' : ''
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.img 
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            src={galleryImages[activeIndex]} 
            alt={title || `Property photo ${activeIndex + 1}`}
            className="w-full h-full object-cover group-hover/gallery:scale-[1.03] transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Badges / Category / Status */}
        {badges ? (
          <div className="absolute top-6 left-6 z-10">{badges}</div>
        ) : (category || status) ? (
          <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
            {category && (
              <span className="px-4 py-2 bg-brand text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl">
                {category}
              </span>
            )}
            {status && (
              <span className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl border backdrop-blur-md ${
                status === 'available' ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-red-500/20 border-red-500/40 text-red-400'
              }`}>
                {status}
              </span>
            )}
          </div>
        ) : null}

        {/* External Overlay Controls (e.g. Heart / Bell / Share) */}
        {overlayControls && (
          <div className="absolute top-6 right-6 z-10">
            {overlayControls}
          </div>
        )}

        {/* NAVIGATION BUTTONS WITH BACKDROP BLUR EFFECT */}
        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label={lang === 'fr' ? 'Photo précédente' : 'Previous image'}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:border-brand/60 shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 opacity-90 group-hover/gallery:opacity-100"
            >
              <ChevronLeft size={22} className="stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label={lang === 'fr' ? 'Photo suivante' : 'Next image'}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:border-brand/60 shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 opacity-90 group-hover/gallery:opacity-100"
            >
              <ChevronRight size={22} className="stroke-[2.5]" />
            </button>
          </>
        )}

        {/* Bottom Left Content (e.g. Price / Location on property cards) */}
        {bottomLeftContent && (
          <div className="absolute bottom-6 left-6 z-20">
            {bottomLeftContent}
          </div>
        )}

        {/* NUMBERED INDICATOR (1/3) INSTEAD OF DOTS & Bottom Right Controls */}
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
          {bottomRightControls}
          {galleryImages.length > 0 && (
            <div className="px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white shadow-xl flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider">
              <ImageIcon size={13} className="text-brand mr-0.5" />
              <span className="text-brand text-sm">{activeIndex + 1}</span>
              <span className="text-gray-400 font-normal text-xs">/</span>
              <span className="text-gray-300">{galleryImages.length}</span>
            </div>
          )}
        </div>

        {/* Click to Zoom Hover Overlay */}
        {onImageClick && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <div className="bg-brand text-white px-5 py-2.5 rounded-2xl shadow-2xl transform scale-90 group-hover/gallery:scale-100 transition-all duration-300 flex items-center gap-2">
              <Maximize2 size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">
                {lang === 'fr' ? 'Agrandir la photo' : lang === 'en' ? 'Click to zoom' : 'Bonyeza kukuza'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Bar */}
      {showThumbnails && galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {galleryImages.map((img, i) => (
            <button 
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative min-w-[100px] sm:min-w-[120px] aspect-video rounded-2xl overflow-hidden border transition-all ${
                activeIndex === i 
                  ? 'border-brand shadow-lg shadow-brand/20 scale-105 ring-2 ring-brand/30' 
                  : 'border-white/10 opacity-50 hover:opacity-100'
              }`}
            >
              <img 
                src={img} 
                alt="" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
              <div className={`absolute inset-0 transition-colors ${activeIndex === i ? 'bg-transparent' : 'bg-black/30'}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
