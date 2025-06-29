"use client";
import styled, { DefaultTheme, css } from 'styled-components';
import { responsiveFontSize } from '../../styles/helper';

export const Container = styled.footer`
  ${({ theme }: { theme: DefaultTheme }) => css`
      min-height: ${theme.height.footerHeight};
      background: ${theme.colors.mainBg};
      color: ${theme.colors.secondaryColor};
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      padding: ${theme.spacings.medium};
      gap: ${theme.spacings.medium};
      margin-top: 30px;
      ${responsiveFontSize(theme, "small")}

      @media ${theme.media.lteSmall}{
        justify-content: center;
        ${responsiveFontSize(theme, "medium")}
      }
  `}
`;