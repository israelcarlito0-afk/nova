import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Trash2, 
  House, 
  ArrowLeftRight 
} from 'lucide-react';
import { ChatMessage, Property } from '../types';

interface AiAssistantWidgetProps {
  chatMessages: ChatMessage[];
  clearChatHistory: () => void;
  lang: string;
  properties: Property[];
  setFilteredProperties: (props: Property[]) => void;
  onSendMessage: (text: string) => Promise<void>;
  isAskingAi: boolean;
}

export default function AiAssistantWidget({
  chatMessages,
  clearChatHistory,
  lang,
  properties,
  setFilteredProperties,
  onSendMessage,
  isAskingAi
}: AiAssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAskingAi, isOpen]);

  // Voice Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === 'fr' ? 'fr-FR' : 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert(lang === 'fr' 
            ? "L'accès au microphone est bloqué ou non autorisé par le navigateur. Veuillez autoriser le micro dans les paramètres de votre navigateur." 
            : "Microphone access is blocked or not allowed. Please grant microphone permission in your browser settings.");
        }
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue((prev) => (prev ? prev + ' ' + transcript : transcript));
        }
      };

      recognitionRef.current = rec;
    }
  }, [lang]);

  // Read aloud last message from assistant
  useEffect(() => {
    if (chatMessages.length > 0 && !isMuted) {
      const lastMsg = chatMessages[chatMessages.length - 1];
      if (lastMsg.role === 'assistant') {
        speakResponse(lastMsg.content);
      }
    }
  }, [chatMessages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(lang === 'fr' 
        ? "Reconnaissance vocale non supportée par votre navigateur actuel." 
        : "Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("Error stopping recognition:", e);
      }
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Error starting recognition:", e);
        setIsListening(false);
        alert(lang === 'fr'
          ? "Impossible d'activer le microphone. Vérifiez les autorisations de votre navigateur."
          : "Could not activate microphone. Please check your browser permissions.");
      }
    }
  };

  const speakResponse = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop active speech

    // Remove markdown formatting / IDs to read cleanly
    const cleanText = text
      .replace(/---RECOMMANDATIONS---[\s\S]*?---FIN---/, '')
      .replace(/[*#]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'fr' ? 'fr-FR' : 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.lang.startsWith(lang === 'fr' ? 'fr' : 'en'));
    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const stopActiveSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    setInputValue('');
    stopActiveSpeech();
    
    // Send to parent hook/handler
    await onSendMessage(text);
  };

  const handleRecommendClick = (recIds: string[]) => {
    if (recIds && recIds.length > 0) {
      const matched = properties.filter((p) => recIds.includes(p.id));
      setFilteredProperties(matched);
      const section = document.getElementById('featured-properties') || document.querySelector('section[id*="properties"]');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 px-5 py-4 bg-brand hover:bg-yellow-400 text-black font-black uppercase text-xs tracking-wider rounded-full shadow-[0_8px_32px_rgba(234,179,8,0.3)] border border-brand/50 cursor-pointer"
            >
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black/40 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-black"></span>
              </span>
              <span>{lang === 'fr' ? 'Parler à l\'Agent' : 'Speak to Agent'}</span>
              <MessageSquare size={16} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat window panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 80 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 80 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full sm:w-[440px] h-[580px] bg-dark-bg/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 relative">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center animate-pulse">
                    <Sparkles className="text-brand" size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-white">Agent ImmoAI</h4>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                      {isListening ? (
                        <span className="text-brand animate-pulse">● {lang === 'fr' ? 'À l\'écoute...' : 'Listening...'}</span>
                      ) : (
                        <span>{lang === 'fr' ? 'Agent de Recherche IA' : 'AI Search Advisor'}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mute toggle */}
                  <button
                    onClick={() => {
                      if (!isMuted) stopActiveSpeech();
                      setIsMuted(!isMuted);
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition"
                    title={isMuted ? 'Unmute voice responses' : 'Mute voice responses'}
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>

                  {/* Clean History */}
                  {chatMessages.length > 0 && (
                    <button
                      onClick={clearChatHistory}
                      className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-brand transition"
                      title="Clear History"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  {/* Close widget */}
                  <button
                    onClick={() => {
                      stopActiveSpeech();
                      setIsOpen(false);
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/5">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-6">
                    <span className="text-4xl mb-3">🤖</span>
                    <h5 className="text-sm font-bold text-white mb-2">
                      {lang === 'fr' ? 'Besoin d\'aide pour votre investissement ?' : 'Need help looking for property?'}
                    </h5>
                    <p className="text-xs text-gray-400">
                      {lang === 'fr' 
                        ? 'Écrivez ou dites ce que vous recherchez (ex: "Je veux acheter un appartement à Kigali de 2 chambres avec une belle vue").' 
                        : 'Write or simply tell me what you want (e.g., "I want a luxury 5 bedroom villa in Kinshasa with pool").'}
                    </p>
                  </div>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl line-clamp-none ${
                          msg.role === 'user'
                            ? 'bg-brand/10 border border-brand/20 text-white rounded-tr-none'
                            : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none'
                        }`}
                      >
                        <p className="text-xs font-semibold leading-relaxed whitespace-pre-line">
                          {msg.content.replace(/---RECOMMANDATIONS---[\s\S]*?---FIN---/, '').trim()}
                        </p>

                        {/* Interactive recommendations shortcut inside widget */}
                        {msg.recommendations && msg.recommendations.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-1.5">
                            <span className="text-[10px] uppercase font-black tracking-widest text-brand">
                              {lang === 'fr' ? 'Biens trouvés :' : 'Matching properties :'}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {properties
                                .filter((p) => msg.recommendations?.includes(p.id))
                                .map((p) => (
                                  <button
                                    key={p.id}
                                    onClick={() => handleRecommendClick([p.id])}
                                    className="px-2.5 py-1 bg-brand text-black font-bold text-[10px] rounded-lg hover:bg-yellow-400 transition flex items-center gap-1 shrink-0"
                                  >
                                    <House size={10} />
                                    <span>{p.title} (${p.price.toLocaleString()})</span>
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* Loading typing bubble */}
                {isAskingAi && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form Footer */}
              <form onSubmit={handleSend} className="p-3 bg-white/5 border-t border-white/10 flex gap-2 items-center">
                {/* Micro Input toggle for Speaking */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-3 rounded-xl transition cursor-pointer flex items-center justify-center ${
                    isListening 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' 
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                  title={isListening ? 'Stop Listening' : 'Speak to AI'}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>

                <input
                  type="text"
                  placeholder={
                    isListening 
                      ? (lang === 'fr' ? 'Parlez maintenant...' : 'Speak now...') 
                      : (lang === 'fr' ? 'Posez votre question...' : 'Inquire here...')
                  }
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none placeholder:text-gray-500 text-xs font-semibold focus:border-brand/40"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isAskingAi}
                />

                <button
                  type="submit"
                  disabled={isAskingAi || !inputValue.trim()}
                  className="p-3 rounded-xl bg-brand text-black hover:bg-yellow-400 disabled:opacity-40 disabled:hover:bg-brand transition flex items-center justify-center cursor-pointer"
                >
                  <Send size={15} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
