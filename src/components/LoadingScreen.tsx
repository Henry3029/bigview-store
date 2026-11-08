import Image from 'next/image';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 !bg-[#D4AF37] flex flex-col items-center justify-center transition-opacity duration-300">
      {/* Tightened container with close items stack */}
      <div className="text-center space-y-0 flex flex-col items-center animate-in fade-in zoom-in duration-300">
        
        {/* Clean Logo Container (Close to text) */}
        <div className="flex items-center justify-center -my-2">
          <Image 
            src="/6592-removebg-preview.png" 
            alt="BIGVIEW Logo" 
            width={288} 
            height={288} 
            className="object-contain w-[288px] h-[288px] drop-shadow-md"
            priority
          />
        </div>

      </div>
    </div>
  );
}
