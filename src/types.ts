export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export type Color = {
  id: string;
  hex: string;
  rgb: string;
  hsl: string;
  locked: boolean;
  name?: string;
};

export type Palette = {
  id: string;
  colors: Color[];
  createdAt: number;
  name?: string;
};

export type PaletteType = 
  | 'random' 
  | 'primary-accent'
  | 'analogous' 
  | 'monochromatic' 
  | 'complementary' 
  | 'triadic' 
  | 'tetradic' 
  | 'split-complementary';

export type ColorShade = {
  hex: string;
  tint: number;
};