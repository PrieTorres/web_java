/* eslint-disable @typescript-eslint/no-empty-object-type */
import "styled-components";
import { theme } from "./theme";

export type CustomTheme = typeof theme;
interface DefaultTheme extends CustomTheme {}
declare module "styled-components" {
  export interface DefaultTheme extends CustomTheme {}
}