import { PaperConfig, PaperDimension, PaperSize } from './types';

export const PAPER_DIMENSIONS: Record<Exclude<PaperSize, 'custom'>, PaperDimension> = {
  A3: { width: 297, height: 420 },
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  B4: { width: 250, height: 353 },
  B5: { width: 176, height: 250 },
  Letter: { width: 215.9, height: 279.4 },
  Legal: { width: 215.9, height: 355.6 },
  Tabloid: { width: 279.4, height: 431.8 },
  Executive: { width: 184.1, height: 266.7 },
};

export const THEME_PRESETS: Record<string, { strokeColor: string; bgColor: string; patternColor: string }> = {
  default: { strokeColor: '#94a3b8', bgColor: '#ffffff', patternColor: '#e2e8f0' },
  night: { strokeColor: '#475569', bgColor: '#1e293b', patternColor: '#334155' },
  sepia: { strokeColor: '#5c5346', bgColor: '#fbf0d9', patternColor: '#e6dec8' },
  vintage: { strokeColor: '#857F72', bgColor: '#F4F1EA', patternColor: '#D3CEC4' }, // Aged paper
  pastel: { strokeColor: '#bcece0', bgColor: '#fff5f7', patternColor: '#fce7f3' }, // Soft pink/mint
  classic: { strokeColor: '#000000', bgColor: '#ffffff', patternColor: '#d1d5db' }, // Black on white
  minimalist: { strokeColor: '#e2e8f0', bgColor: '#ffffff', patternColor: '#f1f5f9' }, // Very subtle
  ocean: { strokeColor: '#38bdf8', bgColor: '#f0f9ff', patternColor: '#bae6fd' },
  forest: { strokeColor: '#4ade80', bgColor: '#f0fdf4', patternColor: '#bbf7d0' },
  sunset: { strokeColor: '#fb923c', bgColor: '#fff7ed', patternColor: '#fed7aa' },
  tech: { strokeColor: '#22d3ee', bgColor: '#0f172a', patternColor: '#1e293b' }, // Dark mode cyan
  elegant: { strokeColor: '#78716c', bgColor: '#fafaf9', patternColor: '#e7e5e4' }, // Stone
  creative: { strokeColor: '#a855f7', bgColor: '#faf5ff', patternColor: '#e9d5ff' }, // Purple
};

export const DEFAULT_CONFIG: PaperConfig = {
  id: 'default',
  name: 'Default Lined',
  size: 'A4',
  customDimensions: { width: 210, height: 297 },
  orientation: 'portrait',
  margins: { top: 20, bottom: 20, left: 20, right: 20 },
  pattern: 'lined',
  spacing: 10,
  strokeWidth: 1,
  strokeColor: THEME_PRESETS.default.strokeColor,
  lineStyle: 'solid',
  opacity: 1,
  showMarginBox: false,
  background: {
    color: THEME_PRESETS.default.bgColor,
    pattern: 'none',
    patternColor: THEME_PRESETS.default.patternColor,
    patternOpacity: 0.5,
  },
  watermark: {
    enabled: false,
    text: 'PaperCraft',
    color: '#cbd5e1',
    opacity: 0.2,
    fontSize: 48,
    rotation: -45,
  },
  pages: {
    count: 1,
    showNumbers: false,
    startNumber: 1,
  },
  theme: 'default'
};

export const TEMPLATES: PaperConfig[] = [
  // Basic
  {
    ...DEFAULT_CONFIG,
    id: 'lined-basic',
    name: 'College Ruled',
    pattern: 'lined',
    spacing: 7.1,
    size: 'Letter',
  },
  {
    ...DEFAULT_CONFIG,
    id: 'vertical-lined',
    name: 'Vertical Lined',
    pattern: 'vertical_lined',
    spacing: 10,
  },
  {
    ...DEFAULT_CONFIG,
    id: 'cornell',
    name: 'Cornell Notes',
    pattern: 'cornell',
    spacing: 7.1,
    strokeColor: '#cbd5e1',
  },
  {
    ...DEFAULT_CONFIG,
    id: 'grid-5mm',
    name: '5mm Graph Paper',
    pattern: 'grid',
    spacing: 5,
    strokeColor: '#cbd5e1',
  },
  {
    ...DEFAULT_CONFIG,
    id: 'dot-grid-5mm',
    name: '5mm Dot Grid',
    pattern: 'dot',
    spacing: 5,
    strokeColor: '#64748b',
    strokeWidth: 2,
  },
  {
    ...DEFAULT_CONFIG,
    id: 'isometric',
    name: 'Isometric Dot',
    pattern: 'isometric',
    spacing: 10,
  },
  {
    ...DEFAULT_CONFIG,
    id: 'hexagonal',
    name: 'Hexagonal',
    pattern: 'hexagonal',
    spacing: 10,
    strokeColor: '#e2e8f0',
  },
  {
    ...DEFAULT_CONFIG,
    id: 'cross-grid',
    name: 'Cross Grid',
    pattern: 'cross',
    spacing: 10,
    strokeWidth: 1,
  },
  
  // Specialized
  {
    ...DEFAULT_CONFIG,
    id: 'seyes',
    name: 'Seyes (French)',
    pattern: 'seyes',
    spacing: 8, // Major line spacing
    strokeColor: '#e2e8f0',
  },
  {
    ...DEFAULT_CONFIG,
    id: 'music-staff',
    name: 'Music Staff',
    pattern: 'music',
    spacing: 20, // Distance between staves
    strokeColor: '#000000',
  },
   {
    ...DEFAULT_CONFIG,
    id: 'guitar-tab',
    name: 'Guitar Tab',
    pattern: 'guitar_tab',
    spacing: 20, // Distance between tabs
    strokeColor: '#000000',
  },
  {
    ...DEFAULT_CONFIG,
    id: 'english-paper',
    name: 'English Practice',
    pattern: 'english_paper',
    spacing: 12,
    strokeColor: '#000000',
  },

  // Chinese Practice
  {
    ...DEFAULT_CONFIG,
    id: 'pinyin-practice',
    name: 'Chinese Pinyin',
    pattern: 'pinyin',
    spacing: 16,
    strokeColor: '#ef4444', 
    strokeWidth: 0.5,
  },
  {
    ...DEFAULT_CONFIG,
    id: 'tianzi',
    name: 'Tianzi',
    pattern: 'tianzi',
    spacing: 16, // Box size
    strokeColor: '#ef4444',
  },
  {
    ...DEFAULT_CONFIG,
    id: 'pinyin-tianzi',
    name: 'Pinyin Tianzi',
    pattern: 'pinyin_tianzi',
    spacing: 24, // Combined height approx
    strokeColor: '#ef4444',
  },
  {
    ...DEFAULT_CONFIG,
    id: 'mizige',
    name: 'Mizige',
    pattern: 'mizige',
    spacing: 16,
    strokeColor: '#ef4444',
  },
  {
    ...DEFAULT_CONFIG,
    id: 'huigongge',
    name: 'Huigongge',
    pattern: 'huigongge',
    spacing: 16,
    strokeColor: '#ef4444',
  },
  {
    ...DEFAULT_CONFIG,
    id: 'jiugongge',
    name: 'Jiugongge',
    pattern: 'jiugongge',
    spacing: 18,
    strokeColor: '#ef4444',
  },
  {
    ...DEFAULT_CONFIG,
    id: 'composition',
    name: 'Composition',
    pattern: 'composition_paper',
    spacing: 12,
    strokeColor: '#ef4444',
  },
  {
    ...DEFAULT_CONFIG,
    id: 'arithmetic',
    name: 'Arithmetic',
    pattern: 'arithmetic_paper',
    spacing: 10,
    strokeColor: '#000000',
  },
  {
    ...DEFAULT_CONFIG,
    id: 'hardpen-huigongge',
    name: 'Hardpen Huigongge',
    pattern: 'hardpen_huigongge',
    spacing: 16,
    strokeColor: '#ef4444',
  },
];

export const MM_TO_PX = 3.7795275591;