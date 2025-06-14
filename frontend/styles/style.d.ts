import "styled-components";
import { theme } from "./theme";

export type CustomTheme = typeof theme;

declare module "styled-components" {
  export type DefaultTheme = CustomTheme
}