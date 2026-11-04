// File location: ./src/app/loading.tsx
import Image from 'next/image';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-skin-base flex flex-col items-center justify-center text-skin-base transition-opacity duration-300">
      <div className="text-center space-y-6 flex flex-col items-center animate-in fade-in zoom-in duration-300">
        
        {/* Brand Name */}
        <h1 className="text-4xl font-black uppercase font-sans text-[#D4AF37] tracking-wider">
          BIGVIEW
        </h1>
        
        {/* Centered Logo Below Brand Name */}
        <div className="w-16 h-16 rounded-full overflow-hidden border border-[#D4AF37]/40 shadow-xl bg-skin-card flex items-center justify-center">
          <Image 
            src="/6592-removebg-preview.png" 
            alt="BIGVIEW Logo" 
            width={64} 
            height={64} 
            className="object-cover w-full h-full"
            priority
          />
        </div>

        {/* Subtle sub-indicator */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
          <p className="text-xs text-skin-muted font-medium tracking-wide">Loading BIGVIEW Store...</p>
        </div>

      </div>
    </div>
  );
}
