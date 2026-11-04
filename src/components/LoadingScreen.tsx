import Image from 'next/image';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Secure Portal Loading..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 !bg-[#EAB308] flex flex-col items-center justify-center transition-opacity duration-300">
      {/* Tightened container with close items stack */}
      <div className="text-center space-y-0 flex flex-col items-center animate-in fade-in zoom-in duration-300">
        
        {/* Brand Name */}
        <h1 className="text-3xl font-bold uppercase font-sans text-black tracking-normal drop-shadow-sm mb-1">
          BIGVIEW
        </h1>
        
        {/* Clean Logo Container (Close to text) */}
        <div className="flex items-center justify-center -my-2">
          <Image 
            src="/6592-removebg-preview.png" 
            alt="BIGVIEW Logo" 
            width={208} 
            height={208} 
            className="object-contain w-52 h-52 drop-shadow-md"
            priority
          />
        </div>

        {/* Subtle sub-indicator */}
        <div className="flex items-center justify-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full bg-black animate-ping" />
          <p className="text-xs text-black/80 font-semibold tracking-wide">{message}</p>
        </div>

      </div>
    </div>
  );
}
