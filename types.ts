export type PaperSize = 'A3' | 'A4' | 'A5' | 'B4' | 'B5' | 'Letter' | 'Legal' | 'Tabloid' | 'Executive' | 'custom';
export type Orientation = 'portrait' | 'landscape';
export type PatternType = 
  | 'blank' | 'lined' | 'vertical_lined' | 'grid' | 'dot' 
  | 'isometric' | 'hexagonal' | 'cross' | 'cornell' | 'seyes'
  | 'music' | 'guitar_tab' | 'storyboard'
  | 'pinyin' | 'pinyin_tianzi' | 'composition_paper' | 'arithmetic_paper' 
  | 'english_paper' | 'mizige' | 'huigongge' | 'jiugongge' | 'tianzi' | 'hardpen_huigongge'
  | 'children_drawing';

export type BackgroundPatternType = 'none' | 'grid' | 'dots' | 'lines';
export type LineStyle = 'solid' | 'dashed' | 'dotted';

export interface Margins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface BackgroundConfig {
  color: string;
  pattern: BackgroundPatternType;
  patternColor: string;
  patternOpacity: number;
}

export interface WatermarkConfig {
  enabled: boolean;
  text: string;
  color: string;
  opacity: number;
  fontSize: number;
  rotation: number;
}

export interface PageConfig {
  count: number;
  showNumbers: boolean;
  startNumber: number;
}

export interface PaperDimension {
  width: number; // mm
  height: number; // mm
}

export interface PaperConfig {
  id: string; // unique id for templates
  name: string;
  size: PaperSize;
  customDimensions?: PaperDimension; // For custom size
  orientation: Orientation;
  margins: Margins;
  pattern: PatternType;
  spacing: number; // mm
  strokeWidth: number; // px
  strokeColor: string; // hex
  lineStyle: LineStyle;
  opacity: number; // 0-1
  showMarginBox: boolean;
  background: BackgroundConfig;
  watermark: WatermarkConfig;
  pages: PageConfig;
  theme?: string;
}