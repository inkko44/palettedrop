// Generate a primary color with variants and an accent color
export const generatePrimaryAccentPalette = (): string[] => {
  // Generate primary color
  const primary = generateRandomColor({
    saturationRange: [60, 80],
    lightnessRange: [45, 55]
  });

  // Get primary color HSL
  const { r, g, b } = hexToRgb(primary);
  const { h, s, l } = rgbToHsl(r, g, b);

  // Generate dark variant (30% darker)
  const darkRgb = hslToRgb(h, Math.min(s + 10, 100), Math.max(l - 30, 15));
  const dark = rgbToHex(darkRgb.r, darkRgb.g, darkRgb.b);

  // Generate accent dark variant
  const accentHue = (h + 180) % 360;
  const accentDarkRgb = hslToRgb(
    accentHue,
    Math.min(s + 10, 100),
    Math.max(l - 30, 15)
  );
  const accentDark = rgbToHex(accentDarkRgb.r, accentDarkRgb.g, accentDarkRgb.b);

  // Generate primary color
  const primaryRgb = hslToRgb(h, s, l);
  const primaryColor = rgbToHex(primaryRgb.r, primaryRgb.g, primaryRgb.b);

  // Generate light variant (60% lighter)
  const lightRgb = hslToRgb(h, Math.max(s - 10, 0), Math.min(l + 40, 95));
  const light = rgbToHex(lightRgb.r, lightRgb.g, lightRgb.b);

  // Return colors in order: dark to light
  return [dark, accentDark, primaryColor, light];
};

// Generate a range of shades for a given color
export const generateShades = (color: string, count: number): { hex: string; tint: number }[] => {
  const { r, g, b } = hexToRgb(color);
  const { h, s, l } = rgbToHsl(r, g, b);
  
  const shades: { hex: string; tint: number }[] = [];
  const step = 100 / (count - 1);
  
  for (let i = 0; i < count; i++) {
    const tint = i * step;
    const lightness = Math.min(Math.max(tint, 0), 100);
    const rgb = hslToRgb(h, s, lightness);
    shades.push({
      hex: rgbToHex(rgb.r, rgb.g, rgb.b),
      tint: tint
    });
  }
  
  return shades;
};

// Get appropriate text color (black or white) based on background color
export const getTextColor = (backgroundColor: string): string => {
  const { r, g, b } = hexToRgb(backgroundColor);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

// Convert hex color to RGB
export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Convert RGB to hex color
export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// Convert RGB to HSL
export const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

// Convert HSL to RGB
export const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4))
  };
};

// Generate a random color within specified HSL ranges
export const generateRandomColor = ({
  hueRange = [0, 360],
  saturationRange = [0, 100],
  lightnessRange = [0, 100]
}: {
  hueRange?: [number, number];
  saturationRange?: [number, number];
  lightnessRange?: [number, number];
} = {}): string => {
  const h = Math.floor(Math.random() * (hueRange[1] - hueRange[0])) + hueRange[0];
  const s = Math.floor(Math.random() * (saturationRange[1] - saturationRange[0])) + saturationRange[0];
  const l = Math.floor(Math.random() * (lightnessRange[1] - lightnessRange[0])) + lightnessRange[0];
  
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
};

// Create a Color object from a hex string
export const createColorObject = (hex: string, locked: boolean = false): Color => {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  
  return {
    id: crypto.randomUUID(),
    hex,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
    locked,
    name: generateColorName(hex)
  };
};

// Generate color name
export const generateColorName = (hex: string): string => {
  const { r, g, b } = hexToRgb(hex);
  const hsl = rgbToHsl(r, g, b);
  
  if (hsl.s < 10) {
    if (hsl.l < 20) return 'Black';
    if (hsl.l > 80) return 'White';
    return 'Gray';
  }
  
  const hue = hsl.h;
  if (hue < 30) return 'Red';
  if (hue < 60) return 'Orange';
  if (hue < 90) return 'Yellow';
  if (hue < 150) return 'Green';
  if (hue < 210) return 'Cyan';
  if (hue < 270) return 'Blue';
  if (hue < 330) return 'Purple';
  return 'Red';
};

// Generate a palette based on type and parameters
export const generatePalette = (
  type: PaletteType,
  baseColor?: string,
  count: number = 5
): string[] => {
  switch (type) {
    case 'primary-accent':
      return generatePrimaryAccentPalette();
    default:
      return Array.from({ length: count }, () => generateRandomColor());
  }
};