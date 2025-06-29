import styled, { DefaultTheme, css } from 'styled-components';

export const Form = styled.form`
  ${({ theme }: { theme: DefaultTheme }) => css`
    width: 100%;
    margin-bottom: ${theme.spacings.small};
    background: ${theme.colors.secondaryBg};
    padding: ${theme.spacings.small};
    border-radius: ${theme.radius.big};
    box-shadow: 0 2px 8px ${theme.colors.shadowColor};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacings.xsmall};

    & button {
      align-self: flex-start;
      padding: ${theme.spacings.xsmall} ${theme.spacings.small};
      border-radius: ${theme.radius.small};
      background: ${theme.colors.orange};
      color: ${theme.colors.secondaryColor};
      cursor: pointer;
      border: none;
    }
  `}
`;

export const Input = styled.input`
  ${({ theme }: { theme: DefaultTheme }) => css`
    padding: ${theme.spacings.xsmall};
    border-radius: ${theme.radius.small};
    border: 1px solid ${theme.colors.borderColor};
    background: ${theme.colors.mainBg};
    color: ${theme.colors.secondaryColor};
    width: 100%;
  `}
`;

export const Select = styled.select`
  ${({ theme }: { theme: DefaultTheme }) => css`
    padding: ${theme.spacings.xsmall};
    border-radius: ${theme.radius.small};
    border: 1px solid ${theme.colors.borderColor};
    background: ${theme.colors.mainBg};
    color: ${theme.colors.secondaryColor};
    width: 100%;
  `}
`;
