import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const isMobile = width < 768;
export const isTablet = width >= 768 && width < 1024;
export const isDesktop = width >= 1024;

export const scale = (size: number) => {
  const scaleFactor = width / 375; 
  return Math.round(size * scaleFactor);
};
export const fontSize = (baseSize: number) => {
  return scale(baseSize);
};

export const responsive = {
  padding: {
    small: isMobile ? 16 : 20,
    medium: isMobile ? 20 : 24,
    large: isMobile ? 24 : 32,
  },
  fontSize: {
    small: isMobile ? 12 : 14,
    medium: isMobile ? 14 : 16,
    large: isMobile ? 16 : 18,
    xlarge: isMobile ? 20 : 24,
  },
  spacing: {
    small: isMobile ? 8 : 12,
    medium: isMobile ? 12 : 16,
    large: isMobile ? 16 : 24,
  }
};