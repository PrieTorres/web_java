"use client";
import styled, { css, DefaultTheme } from "styled-components";
import { AlertType } from "@/context/AlertContext";

const typeColor = (theme: DefaultTheme, type: AlertType) => {
  switch (type) {
    case "success":
      return theme.colors.successfulGreen;
    case "info":
      return theme.colors.lightBlue;
    default:
      return theme.colors.dangerColor;
  }
};

export const Container = styled.div<{ "data-type": AlertType }>`
  ${({ theme, "data-type": type }: { theme: DefaultTheme; "data-type": AlertType }) => css`
    position: fixed;
    bottom: ${theme.spacings.small};
    left: 50%;
    transform: translateX(-50%);
    background: ${typeColor(theme, type)};
    color: ${theme.colors.secondaryColor};
    padding: ${theme.spacings.small} ${theme.spacings.medium};
    border-radius: ${theme.radius.big};
    box-shadow: 0 2px 8px ${theme.colors.shadowColor};
    z-index: 1000;
  `}
`;
