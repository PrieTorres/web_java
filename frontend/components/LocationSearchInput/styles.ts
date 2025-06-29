import styled, { DefaultTheme, css } from 'styled-components';

export const Wrapper = styled.div`
  ${() => css`
    position: relative;
    width: 100%;
  `}
`;

export const Input = styled.input`
  ${({ theme }: { theme: DefaultTheme }) => css`
    width: 100%;
    padding: ${theme.spacings.xsmall};
    border-radius: ${theme.radius.small};
    border: 1px solid ${theme.colors.borderColor};
    background: ${theme.colors.mainBg};
    color: ${theme.colors.secondaryColor};
  `}
`;

export const List = styled.ul`
  ${({ theme }: { theme: DefaultTheme }) => css`
    position: absolute;
    z-index: 10;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: ${theme.colors.secondaryBg};
    border-radius: ${theme.radius.small};
    box-shadow: 0 2px 6px ${theme.colors.shadowColor};
    max-height: 200px;
    overflow-y: auto;
    list-style: none;
    padding: 0;
    margin: 0;

    & li {
      padding: ${theme.spacings.xsmall};
      cursor: pointer;
    }

    & li:hover {
      background: ${theme.colors.hoverBg};
    }
  `}
`;
