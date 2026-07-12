export default function PatternArt({ patternType, garmentType, className = "" }: { patternType: string, garmentType?: string, className?: string }) {
  if (!patternType || patternType === 'none') {
    return <div className={`w-full h-full bg-black opacity-10 ${className}`}></div>;
  }

  const garmentPaths: Record<string, string> = {
    hoodie: "M 120 40 C 160 10, 240 10, 280 40 L 280 120 L 360 200 L 360 260 L 320 260 L 320 360 L 80 360 L 80 260 L 40 260 L 40 200 L 120 120 Z",
    jacket: "M 140 40 C 200 40, 200 40, 260 40 L 340 120 L 380 240 L 340 240 L 320 360 L 80 360 L 60 240 L 20 240 L 60 120 Z",
    tee: "M 120 40 C 160 80, 240 80, 280 40 L 380 120 L 340 180 L 300 140 L 300 360 L 100 360 L 100 140 L 60 180 L 20 120 Z",
    pants: "M 120 40 L 280 40 L 320 160 L 240 360 L 220 360 L 200 160 L 180 360 L 160 360 L 80 160 Z",
    cap: "M 80 200 C 80 80, 320 80, 320 200 L 380 240 L 360 280 L 300 240 L 100 240 Z",
    tote: "M 120 40 L 160 40 L 160 120 L 240 120 L 240 40 L 280 40 L 280 120 L 320 120 L 340 360 L 60 360 L 80 120 L 120 120 Z"
  };

  const hasGarment = garmentType && garmentPaths[garmentType];
  const activePattern = ['zardozi','brocade','kalka','jewel'].includes(patternType) ? patternType : 'fallback';

  return (
    <svg className={`w-full h-full ${className}`} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Royal Patterns */}
        <pattern id="zardozi" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="#111" />
          <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" fill="none" stroke="#d4af37" strokeWidth="3" />
          <circle cx="50" cy="50" r="10" fill="#d4af37" />
          <circle cx="50" cy="50" r="5" fill="#111" />
        </pattern>

        <pattern id="brocade" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill="#800020" /> {/* Burgundy */}
          <path d="M20 60 C 20 20, 60 20, 60 60 C 60 100, 100 100, 100 60" fill="none" stroke="#d4af37" strokeWidth="6" />
          <path d="M0 60 C 0 100, 40 100, 40 60" fill="none" stroke="#d4af37" strokeWidth="4" opacity="0.7"/>
          <circle cx="60" cy="60" r="15" fill="#004b49" stroke="#d4af37" strokeWidth="3"/>
          <circle cx="60" cy="60" r="5" fill="#d4af37" />
        </pattern>

        <pattern id="kalka" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="#004b49" /> {/* Emerald */}
          <path d="M30 70 C 10 70, 10 30, 40 30 C 60 30, 80 10, 80 40 C 80 70, 50 70, 30 70 Z" fill="none" stroke="#d4af37" strokeWidth="4" />
          <path d="M40 60 C 25 60, 25 40, 45 40 C 55 40, 65 25, 65 45 C 65 60, 50 60, 40 60 Z" fill="#d4af37" />
        </pattern>

        <pattern id="jewel" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="#0a0a2a" /> {/* Deep Sapphire */}
          <path d="M40 10 L70 40 L40 70 L10 40 Z" fill="none" stroke="#800020" strokeWidth="8" />
          <path d="M40 20 L60 40 L40 60 L20 40 Z" fill="#d4af37" />
          <circle cx="40" cy="40" r="5" fill="#fff" opacity="0.8" />
        </pattern>
        
        {/* Fallback pattern */}
        <pattern id="fallback" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#f4f4f0" />
          <line x1="0" y1="40" x2="40" y2="0" stroke="#000" strokeWidth="2" opacity="0.1" />
        </pattern>
      </defs>
      
      {/* Background fill */}
      <rect width="100%" height="100%" fill="#f4f4f0" />
      
      {/* Pattern rendered inside the garment mask */}
      {hasGarment ? (
        <g>
          {/* Shadow/outline behind */}
          <path d={garmentPaths[garmentType!]} fill="#000" transform="translate(10, 10)" />
          {/* Main filled garment */}
          <path d={garmentPaths[garmentType!]} fill={`url(#${activePattern})`} stroke="#000" strokeWidth="6" />
          
          {/* Placeholder text flag */}
          <rect x="75" y="360" width="250" height="30" fill="#000" />
          <text x="200" y="380" textAnchor="middle" fill="#fce762" fontSize="14" fontWeight="black" letterSpacing="2" className="uppercase">
             - Generated Photo Pending -
          </text>
        </g>
      ) : (
        <rect width="100%" height="100%" fill={`url(#${activePattern})`} />
      )}
    </svg>
  );
}
