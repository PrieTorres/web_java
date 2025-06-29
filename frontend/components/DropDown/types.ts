import { MouseEventHandler, ReactNode } from 'react';

export interface CustomStyling {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  height?: number;
  clientHeight?: number;
  width?: number;
  background?: string;
  padding?: string;
}

export type AllCSSProperties = Partial<Record<keyof CSSStyleDeclaration, string | number>>;

export type Styling = CustomStyling & AllCSSProperties;

export interface DropItemProps {
  onClick: MouseEventHandler<HTMLDivElement>;
  children: ReactNode;
}

export interface DropDownListProps {
  dropDownId: string;
  toggleId: string;
  items: Array<DropItemProps>;
  height?: number;
  isOpen: boolean;
  toggleFunction: () => void;
  offset?: Styling;
}

export interface DropDownProps {
  children: ReactNode;
  dropDownId: string;
  toggleId: string;
  items: Array<DropItemProps>;
  height?: number;
  style?: Styling;
}
