"use client";
import styled, { DefaultTheme, css } from "styled-components";

export const Container = styled.span`
  ${({ theme }: { theme: DefaultTheme }) => css`
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacings.xxsmall};
    padding: 0 ${theme.spacings.xsmall};
    background: ${theme.colors.secondaryBgDarker};
    border-radius: ${theme.radius.small};
    font-size: ${theme.font.size.medium_device_small};

    & button {
      background: none;
      border: none;
      cursor: pointer;
      color: inherit;
      font-size: ${theme.font.size.medium_device_small};
      line-height: 1;
    }
  `}
`;
