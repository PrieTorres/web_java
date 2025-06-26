import styled, { DefaultTheme, css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    padding: ${theme.spacings.medium};
    display: flex;
    justify-content: center;

    & form {
      width: 100%;
      max-width: 600px;
      display: flex;
      flex-direction: column;
      gap: ${theme.spacings.xsmall};
    }

    & .input {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }

    & .submit {
      padding: 8px;
      border-radius: 4px;
      background: ${theme.colors.mainColor ?? '#000'};
      color: ${theme.colors.mainBg};
    }
  `}
`;