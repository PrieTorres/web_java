"use client";

import { responsiveDotSize } from '@/styles/helper';
import { ButtonHTMLAttributes } from 'react';
import styled, { DefaultTheme, css } from 'styled-components';

interface ContainerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export const Container = styled.button<ContainerProps>`
  ${({ theme, selected }) => css`
      ${responsiveDotSize(theme, "medium")}
      border-radius: 50%;
      transition: background .5s ease;
      background: ${selected ? theme.colors.yellow : ""};
  `}
`;