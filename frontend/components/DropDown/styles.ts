"use client";
import styled, { DefaultTheme, css } from 'styled-components';

interface ContainerProps {
  height?: number;
  theme: DefaultTheme;
}

export const Container = styled.div<ContainerProps>`
  ${({ theme, height }) => css`
    background: inherit;
    width: 100%;
    height: 100%;
    padding: 0px ${theme.spacings.small};
    display: flex;
    align-items: center;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    margin: 0px 5px;
    box-shadow: 0px 0px 8px 0px ${theme.colors.shadowColor} inset;

    & button {
      display: flex;
      gap: 4px;
      width: 100%;
      justify-content: space-between;
      border: none;
      background: inherit;
    }

    & button,
    & > div,
    & ul {
      width: 100%;
      background: inherit;
      text-align: left;
    }

    & ul,
    & li,
    & ol {
      list-style: none;
    }

    & ul {
      padding: ${theme.spacings.small}
    }

    & > button, & > div > ul li, & > div > ul li *  {
      height: ${height ? `${height}px` : theme.height.dropDownDefaultHeight};
      box-sizing: border-box;
      width: 100%;
      background: inherit;
      text-align: left;
    }

    & > div > ul li {
      cursor: pointer;
    }
  `}
`;