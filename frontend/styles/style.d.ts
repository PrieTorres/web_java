/* eslint-disable @typescript-eslint/no-empty-object-type */
import "styled-components";

export interface CustomTheme {
  colors: typeof import("./COLORS").Colors & {
    mainBg?: string;
    mainColor?: string;
    secondaryBg?: string;
    secondaryBgDarker?: string;
    secondaryColor?: string;
    borderColor?: string;
  };
  font: {
    family: {
      default: string;
      secondary: string;
    };
    size: Record<string, string>;
  };
  media: Record<string, string>;
  height: Record<string, string>;
  width: Record<string, string>;
  dotSize: Record<string, string>;
  spacings: Record<string, string>;
  shadow: Record<string, string>;
  gradient: Record<string, string>;
  radius: Record<string, string>;
  transitions: Record<string, string>;
}


declare module "styled-components" {
  export interface DefaultTheme extends CustomTheme {}
}