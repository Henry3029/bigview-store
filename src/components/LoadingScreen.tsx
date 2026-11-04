import Image from 'next/image';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Secure Portal Loading..." }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-[#14120B] flex flex-col items-center justify-center text-skin-base transition-opacity duration-300">
      <div className="text-center space-y-6 flex flex-col items-center animate-in fade-in zoom-in duration-300">
        
        {/* Brand Name */}
        <h1 className="text-4xl font-black uppercase font-sans text-skin-base tracking-normal">
          BIGVIEW
        </h1>
        
        {/* Clean Logo Container (Transparent Background) */}
<div className="flex items-center justify-center">
  <Image 
    src="/6592-removebg-preview.png" 
    alt="BIGVIEW Logo" 
    width={96} 
    height={96} 
    className="object-contain w-24 h-24 drop-shadow-md"
    priority
  />
</div>


        {/* Subtle sub-indicator */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
          <p className="text-xs text-skin-muted font-medium tracking-wide">{message}</p>
        </div>

      </div>
    </div>
  );
}
