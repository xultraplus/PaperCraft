import React, { useMemo } from 'react';
import { PaperConfig, PaperSize } from '../types';
import { PAPER_DIMENSIONS } from '../constants';

interface PaperCanvasProps {
  config: PaperConfig;
  pageNumber?: number;
}

const PaperCanvas: React.FC<PaperCanvasProps> = ({ config, pageNumber = 1 }) => {
  let dimensions = PAPER_DIMENSIONS[config.size as Exclude<PaperSize, 'custom'>];
  
  if (config.size === 'custom' && config.customDimensions) {
     dimensions = config.customDimensions;
  }
  
  // Fallback if dimensions missing
  if (!dimensions) dimensions = PAPER_DIMENSIONS['A4'];
  
  const width = config.orientation === 'portrait' ? dimensions.width : dimensions.height;
  const height = config.orientation === 'portrait' ? dimensions.height : dimensions.width;

  // Calculate inner content area
  const contentWidth = width - config.margins.left - config.margins.right;
  const contentHeight = height - config.margins.top - config.margins.bottom;
  const startX = config.margins.left;
  const startY = config.margins.top;

  // Helper for line dash array
  const getDashArray = () => {
    switch (config.lineStyle) {
      case 'dashed': return '4,4';
      case 'dotted': return '1,4';
      default: return 'none';
    }
  };
  
  const dashArray = getDashArray();

  // Background Pattern Logic
  const bgPatternId = `bg-pattern-${config.id}`;
  const BgPatternDef = useMemo(() => {
    if (!config.background || config.background.pattern === 'none') return null;

    const s = 5; // Fixed 5mm spacing for background texture
    const c = config.background.patternColor;
    const o = config.background.patternOpacity;

    switch (config.background.pattern) {
        case 'grid':
            return (
                 <pattern id={bgPatternId} x="0" y="0" width={`${s}mm`} height={`${s}mm`} patternUnits="userSpaceOnUse">
                    <path d={`M ${s} 0 L 0 0 0 ${s}`} fill="none" stroke={c} strokeWidth="0.2" strokeOpacity={o} />
                 </pattern>
            );
        case 'dots':
            return (
                 <pattern id={bgPatternId} x="0" y="0" width={`${s}mm`} height={`${s}mm`} patternUnits="userSpaceOnUse">
                    <circle cx={`${s/2}mm`} cy={`${s/2}mm`} r="0.5" fill={c} fillOpacity={o} />
                 </pattern>
            );
        case 'lines':
             return (
                <pattern id={bgPatternId} x="0" y="0" width="100%" height={`${s}mm`} patternUnits="userSpaceOnUse">
                    <line x1="0" y1={`${s}mm`} x2="100%" y2={`${s}mm`} stroke={c} strokeWidth="0.2" strokeOpacity={o} />
                </pattern>
             );
        default: return null;
    }
  }, [config.background, bgPatternId]);

  // Main Pattern Generation Logic
  const patternId = `pattern-${config.pattern}-${config.id}-${config.spacing}-${config.lineStyle}`;
  
  const PatternDef = useMemo(() => {
    const s = config.spacing;
    const color = config.strokeColor;
    const strokeWidth = config.strokeWidth;
    const opacity = config.opacity;

    switch (config.pattern) {
      case 'lined':
      case 'cornell': // Cornell uses lined pattern for main body usually
        return (
          <pattern id={patternId} x="0" y="0" width="100%" height={`${s}mm`} patternUnits="userSpaceOnUse">
             <line x1="0" y1={`${s}mm`} x2="100%" y2={`${s}mm`} stroke={color} strokeWidth={strokeWidth} strokeOpacity={opacity} strokeDasharray={dashArray} />
          </pattern>
        );

      case 'vertical_lined':
        return (
          <pattern id={patternId} x="0" y="0" width={`${s}mm`} height="100%" patternUnits="userSpaceOnUse">
             <line x1={`${s}mm`} y1="0" x2={`${s}mm`} y2="100%" stroke={color} strokeWidth={strokeWidth} strokeOpacity={opacity} strokeDasharray={dashArray} />
          </pattern>
        );
      
      case 'grid':
      case 'arithmetic_paper':
        return (
          <pattern id={patternId} x="0" y="0" width={`${s}mm`} height={`${s}mm`} patternUnits="userSpaceOnUse">
            <path d={`M ${s} 0 L 0 0 0 ${s}`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeOpacity={opacity} strokeDasharray={dashArray} />
          </pattern>
        );

      case 'dot':
        const r = Math.max(0.5, strokeWidth / 2); 
        return (
          <pattern id={patternId} x="0" y="0" width={`${s}mm`} height={`${s}mm`} patternUnits="userSpaceOnUse">
            <circle cx={`${s/2}mm`} cy={`${s/2}mm`} r={r} fill={color} fillOpacity={opacity} />
          </pattern>
        );

      case 'cross':
        const crossSize = 1; 
        return (
          <pattern id={patternId} x="0" y="0" width={`${s}mm`} height={`${s}mm`} patternUnits="userSpaceOnUse">
             <line x1={`${s/2 - crossSize}mm`} y1={`${s/2}mm`} x2={`${s/2 + crossSize}mm`} y2={`${s/2}mm`} stroke={color} strokeWidth={strokeWidth} strokeOpacity={opacity} />
             <line x1={`${s/2}mm`} y1={`${s/2 - crossSize}mm`} x2={`${s/2}mm`} y2={`${s/2 + crossSize}mm`} stroke={color} strokeWidth={strokeWidth} strokeOpacity={opacity} />
          </pattern>
        );

      case 'isometric':
        const h = s * Math.sqrt(3) / 2;
        return (
          <pattern id={patternId} x="0" y="0" width={`${s}mm`} height={`${2 * h}mm`} patternUnits="userSpaceOnUse">
             <circle cx="0" cy="0" r={Math.max(0.5, strokeWidth / 2)} fill={color} fillOpacity={opacity} />
             <circle cx={`${s/2}mm`} cy={`${h}mm`} r={Math.max(0.5, strokeWidth / 2)} fill={color} fillOpacity={opacity} />
             <circle cx={`${s}mm`} cy="0" r={Math.max(0.5, strokeWidth / 2)} fill={color} fillOpacity={opacity} />
             <circle cx="0" cy={`${2*h}mm`} r={Math.max(0.5, strokeWidth / 2)} fill={color} fillOpacity={opacity} />
             <circle cx={`${s}mm`} cy={`${2*h}mm`} r={Math.max(0.5, strokeWidth / 2)} fill={color} fillOpacity={opacity} />
          </pattern>
        );

      case 'hexagonal':
         const hexW = s; // width of hexagon
         const hexS = hexW / Math.sqrt(3); // side length
         return (
            <pattern id={patternId} x="0" y="0" width={`${hexW}mm`} height={`${3 * hexS}mm`} patternUnits="userSpaceOnUse">
               <path d={`M ${hexW/2} 0 L ${hexW} ${hexS/2} L ${hexW} ${1.5*hexS} L ${hexW/2} ${2*hexS} L 0 ${1.5*hexS} L 0 ${hexS/2} Z`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeOpacity={opacity} />
               <path d={`M ${hexW/2} ${3*hexS} L ${hexW} ${2.5*hexS} L ${hexW} ${1.5*hexS} M 0 ${1.5*hexS} L 0 ${2.5*hexS} L ${hexW/2} ${3*hexS}`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeOpacity={opacity} />
            </pattern>
         );
      
      case 'pinyin':
      case 'english_paper':
        const pHeight = s;
        const gap = pHeight / 3;
        return (
           <pattern id={patternId} x="0" y="0" width="100%" height={`${s}mm`} patternUnits="userSpaceOnUse">
               {/* Line 1 (Top) */}
               <line x1="0" y1="0" x2="100%" y2="0" stroke={color} strokeWidth={strokeWidth} strokeOpacity={opacity} />
               {/* Line 2 (Mid 1) */}
               <line x1="0" y1={`${gap}mm`} x2="100%" y2={`${gap}mm`} stroke={color} strokeWidth={strokeWidth * 0.8} strokeOpacity={opacity} strokeDasharray="2,2" />
               {/* Line 3 (Mid 2) */}
               <line x1="0" y1={`${2*gap}mm`} x2="100%" y2={`${2*gap}mm`} stroke={color} strokeWidth={strokeWidth * 0.8} strokeOpacity={opacity} strokeDasharray="2,2" />
               {/* Line 4 (Bottom) */}
               <line x1="0" y1={`${s}mm`} x2="100%" y2={`${s}mm`} stroke={color} strokeWidth={strokeWidth} strokeOpacity={opacity} />
           </pattern>
        );

      case 'seyes':
        const seyesGap = s / 4;
        return (
          <pattern id={patternId} x="0" y="0" width={`${s}mm`} height={`${s}mm`} patternUnits="userSpaceOnUse">
             {/* Faint Horizontal Lines */}
             <line x1="0" y1={`${seyesGap}mm`} x2={`${s}mm`} y2={`${seyesGap}mm`} stroke={color} strokeWidth={0.2} strokeOpacity={0.4} />
             <line x1="0" y1={`${2*seyesGap}mm`} x2={`${s}mm`} y2={`${2*seyesGap}mm`} stroke={color} strokeWidth={0.2} strokeOpacity={0.4} />
             <line x1="0" y1={`${3*seyesGap}mm`} x2={`${s}mm`} y2={`${3*seyesGap}mm`} stroke={color} strokeWidth={0.2} strokeOpacity={0.4} />
             {/* Major Grid Lines */}
             <path d={`M ${s} 0 L 0 0 0 ${s}`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeOpacity={opacity} />
          </pattern>
        );

      case 'music':
        const staffSpace = 2; // 2mm between staff lines
        return (
            <pattern id={patternId} x="0" y="0" width="100%" height={`${s}mm`} patternUnits="userSpaceOnUse">
                {[0, 1, 2, 3, 4].map(i => (
                    <line key={i} x1="0" y1={`${i * staffSpace}mm`} x2="100%" y2={`${i * staffSpace}mm`} stroke={color} strokeWidth={strokeWidth} strokeOpacity={opacity} />
                ))}
            </pattern>
        );

      case 'guitar_tab':
        const tabSpace = 2.5;
        return (
            <pattern id={patternId} x="0" y="0" width="100%" height={`${s}mm`} patternUnits="userSpaceOnUse">
                {[0, 1, 2, 3, 4, 5].map(i => (
                    <line key={i} x1="0" y1={`${i * tabSpace}mm`} x2="100%" y2={`${i * tabSpace}mm`} stroke={color} strokeWidth={strokeWidth} strokeOpacity={opacity} />
                ))}
            </pattern>
        );

      case 'storyboard':
          const boxH = s - 10; // 10mm gap
          const boxW = boxH * 1.77; 
          return (
             <pattern id={patternId} x="0" y="0" width={`${boxW + 10}mm`} height={`${s}mm`} patternUnits="userSpaceOnUse">
                 <rect x="0" y="0" width={`${boxW}mm`} height={`${boxH}mm`} fill="none" stroke={color} strokeWidth={strokeWidth} />
             </pattern>
          );

      case 'tianzi':
      case 'mizige':
      case 'huigongge':
      case 'jiugongge':
      case 'hardpen_huigongge':
        return (
           <pattern id={patternId} x="0" y="0" width={`${s}mm`} height={`${s}mm`} patternUnits="userSpaceOnUse">
               {/* Outer Box */}
               <rect x="0" y="0" width={`${s}mm`} height={`${s}mm`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeOpacity={opacity} />
               
               {config.pattern === 'tianzi' && (
                   <>
                     <line x1="0" y1={`${s/2}mm`} x2={`${s}mm`} y2={`${s/2}mm`} stroke={color} strokeWidth={strokeWidth * 0.5} strokeDasharray="2,2" strokeOpacity={opacity * 0.7} />
                     <line x1={`${s/2}mm`} y1="0" x2={`${s/2}mm`} y2={`${s}mm`} stroke={color} strokeWidth={strokeWidth * 0.5} strokeDasharray="2,2" strokeOpacity={opacity * 0.7} />
                   </>
               )}
               {config.pattern === 'mizige' && (
                   <>
                     <line x1="0" y1={`${s/2}mm`} x2={`${s}mm`} y2={`${s/2}mm`} stroke={color} strokeWidth={strokeWidth * 0.5} strokeDasharray="2,2" strokeOpacity={opacity * 0.7} />
                     <line x1={`${s/2}mm`} y1="0" x2={`${s/2}mm`} y2={`${s}mm`} stroke={color} strokeWidth={strokeWidth * 0.5} strokeDasharray="2,2" strokeOpacity={opacity * 0.7} />
                     <line x1="0" y1="0" x2={`${s}mm`} y2={`${s}mm`} stroke={color} strokeWidth={strokeWidth * 0.5} strokeDasharray="2,2" strokeOpacity={opacity * 0.7} />
                     <line x1={`${s}mm`} y1="0" x2="0" y2={`${s}mm`} stroke={color} strokeWidth={strokeWidth * 0.5} strokeDasharray="2,2" strokeOpacity={opacity * 0.7} />
                   </>
               )}
               {config.pattern === 'jiugongge' && (
                   <>
                      <line x1={`${s/3}mm`} y1="0" x2={`${s/3}mm`} y2={`${s}mm`} stroke={color} strokeWidth={strokeWidth * 0.5} strokeOpacity={opacity * 0.7} />
                      <line x1={`${2*s/3}mm`} y1="0" x2={`${2*s/3}mm`} y2={`${s}mm`} stroke={color} strokeWidth={strokeWidth * 0.5} strokeOpacity={opacity * 0.7} />
                      <line x1="0" y1={`${s/3}mm`} x2={`${s}mm`} y2={`${s/3}mm`} stroke={color} strokeWidth={strokeWidth * 0.5} strokeOpacity={opacity * 0.7} />
                      <line x1="0" y1={`${2*s/3}mm`} x2={`${s}mm`} y2={`${2*s/3}mm`} stroke={color} strokeWidth={strokeWidth * 0.5} strokeOpacity={opacity * 0.7} />
                   </>
               )}
               {(config.pattern === 'huigongge' || config.pattern === 'hardpen_huigongge') && (
                   <rect x={`${s/4}mm`} y={`${s/4}mm`} width={`${s/2}mm`} height={`${s/2}mm`} fill="none" stroke={color} strokeWidth={strokeWidth * 0.5} strokeOpacity={opacity * 0.7} />
               )}
           </pattern>
        );
      
      case 'pinyin_tianzi':
        const pyH = s * 0.35;
        const bxH = s * 0.65;
        const boxSize = bxH;
        return (
            <pattern id={patternId} x="0" y="0" width={`${boxSize}mm`} height={`${s}mm`} patternUnits="userSpaceOnUse">
                 {/* Pinyin Lines */}
                 <line x1="0" y1={`${pyH * 0.2}mm`} x2="100%" y2={`${pyH * 0.2}mm`} stroke={color} strokeWidth={strokeWidth * 0.5} />
                 <line x1="0" y1={`${pyH * 0.5}mm`} x2="100%" y2={`${pyH * 0.5}mm`} stroke={color} strokeWidth={strokeWidth * 0.5} strokeDasharray="2,2" />
                 <line x1="0" y1={`${pyH * 0.8}mm`} x2="100%" y2={`${pyH * 0.8}mm`} stroke={color} strokeWidth={strokeWidth * 0.5} strokeDasharray="2,2" />
                 <line x1="0" y1={`${pyH}mm`} x2="100%" y2={`${pyH}mm`} stroke={color} strokeWidth={strokeWidth * 0.5} />

                 {/* Tianzi Box */}
                 <rect x="0" y={`${pyH}mm`} width={`${boxSize}mm`} height={`${boxSize}mm`} fill="none" stroke={color} strokeWidth={strokeWidth} />
                 <line x1="0" y1={`${pyH + boxSize/2}mm`} x2={`${boxSize}mm`} y2={`${pyH + boxSize/2}mm`} stroke={color} strokeWidth={strokeWidth * 0.5} strokeDasharray="2,2" strokeOpacity={opacity * 0.7} />
                 <line x1={`${boxSize/2}mm`} y1={`${pyH}mm`} x2={`${boxSize/2}mm`} y2={`${pyH + boxSize}mm`} stroke={color} strokeWidth={strokeWidth * 0.5} strokeDasharray="2,2" strokeOpacity={opacity * 0.7} />
            </pattern>
        );

      case 'composition_paper':
         const compBox = s * 0.9;
         return (
             <pattern id={patternId} x="0" y="0" width={`${s}mm`} height={`${s}mm`} patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width={`${compBox}mm`} height={`${compBox}mm`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeOpacity={opacity} />
             </pattern>
         );

      default:
        return null;
    }
  }, [config.pattern, config.spacing, config.strokeColor, config.strokeWidth, config.opacity, config.lineStyle, patternId, dashArray]);

  return (
    <div 
      className="shadow-2xl mx-auto print-container box-border print:shadow-none print:mb-0 print:break-after-page"
      style={{
        width: `${width}mm`,
        height: `${height}mm`,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: config.background?.color || 'white'
      }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {BgPatternDef}
          {PatternDef}
        </defs>

        {/* Paper Background Color */}
        <rect x="0" y="0" width="100%" height="100%" fill={config.background?.color || 'white'} />

        {/* Background Texture Pattern */}
        {config.background?.pattern && config.background.pattern !== 'none' && (
            <rect x="0" y="0" width="100%" height="100%" fill={`url(#${bgPatternId})`} />
        )}

        {/* Cornell Layout - Special Case: Draw the structure lines manually, then fill content */}
        {config.pattern === 'cornell' && (
           <>
              {/* Cue Column Line (approx 30% from left or fixed mm, usually ~63mm) */}
              <line 
                x1={`${startX + 60}mm`} y1={`${startY}mm`} 
                x2={`${startX + 60}mm`} y2={`${height - config.margins.bottom}mm`} 
                stroke={config.strokeColor} strokeWidth={2} strokeOpacity={config.opacity} 
              />
              {/* Summary Section Line (approx 50mm from bottom) */}
              <line 
                x1={`${startX}mm`} y1={`${height - config.margins.bottom - 50}mm`} 
                x2={`${width - config.margins.right}mm`} y2={`${height - config.margins.bottom - 50}mm`} 
                stroke={config.strokeColor} strokeWidth={2} strokeOpacity={config.opacity} 
              />
              {/* Header Line (Optional, maybe 25mm from top) */}
              <line 
                x1={`${startX}mm`} y1={`${startY + 25}mm`} 
                x2={`${width - config.margins.right}mm`} y2={`${startY + 25}mm`} 
                stroke={config.strokeColor} strokeWidth={2} strokeOpacity={config.opacity} 
              />
           </>
        )}

        {/* Main Pattern Fill Area */}
        {config.pattern !== 'blank' && (
           <rect 
           x={`${startX}mm`} 
           y={`${startY}mm`} 
           width={`${contentWidth}mm`} 
           height={`${contentHeight}mm`} 
           fill={`url(#${patternId})`} 
         />
        )}

        {/* Optional Margin Box Border */}
        {config.showMarginBox && (
          <rect
            x={`${startX}mm`} 
            y={`${startY}mm`} 
            width={`${contentWidth}mm`} 
            height={`${contentHeight}mm`}
            fill="none"
            stroke="#ef4444"
            strokeWidth="0.5"
            strokeDasharray="4"
          />
        )}

        {/* Watermark */}
        {config.watermark?.enabled && (
           <text
             x="50%"
             y="50%"
             textAnchor="middle"
             dominantBaseline="middle"
             fill={config.watermark.color}
             fillOpacity={config.watermark.opacity}
             fontSize={config.watermark.fontSize}
             transform={`rotate(${config.watermark.rotation}, ${width/2}, ${height/2})`}
             style={{ pointerEvents: 'none', userSelect: 'none' }}
           >
             {config.watermark.text}
           </text>
        )}

        {/* Page Number */}
        {config.pages?.showNumbers && (
           <text
             x={`${width / 2}mm`}
             y={`${height - 10}mm`} // approx 10mm from bottom
             textAnchor="middle"
             fontSize="12"
             fill="#64748b"
             fontFamily="sans-serif"
           >
             {config.pages.startNumber + pageNumber - 1}
           </text>
        )}
      </svg>
    </div>
  );
};

export default PaperCanvas;