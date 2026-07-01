import { useEffect, useState } from 'react';
import LogoImg from '../assets/logo.png';

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Stage 1: Wait for initial loading
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    // Stage 2: Remove from DOM after transition
    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-700 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative">
        {/* Subtle background pulse with new tech colors */}
        <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl animate-pulse scale-150"></div>
        <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-3xl animate-pulse [animation-delay:0.5s] scale-125"></div>
        
        {/* Logo Container */}
        <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-1000">
          <div className="w-24 h-24 md:w-32 md:h-32 mb-6 transform transition-transform duration-1000 hover:scale-110">
            <img 
              src={LogoImg} 
              alt="ProFixer Logo" 
              className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(79,70,229,0.3)]"
            />
          </div>
          
          <div className="flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              ProFixer
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-[0_0_15px_#4f46e5]"></span>
              <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.2s] shadow-[0_0_15px_#8b5cf6]"></span>
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s] shadow-[0_0_15px_#4f46e5]"></span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Premium tagline at bottom */}
      <div className={`absolute bottom-12 transition-all duration-1000 delay-300 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-500 tracking-[0.3em] text-[10px] uppercase ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        The Future of Professional Fixing
      </div>
    </div>
  );
}
