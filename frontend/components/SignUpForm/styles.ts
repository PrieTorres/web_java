import styled, { DefaultTheme, css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }: { theme: DefaultTheme; }) => css`
    & svg {
      top: 0.2rem
    }

    height: ${theme.height.sectionHeight};

    & button {
      color: ${theme.colors.mainBg};
      padding: 8px;
      margin: 5px;
      border-radius: 4px;
      gap: 5px;
    }

    & input {
      padding: 8px;
      padding-left: 3rem;
      border-radius: 8px;
      color: ${theme.colors.mainColor};
    }

    & > div {
      background: ${theme.colors.mainBg};
    }

    & form > button,
    & .input{
      color: ${theme.colors.mainBg};
    }

    & .input {
      width: 100%;
      margin-bottom: 10px;
      padding: 8px;
    }

    & form > button {
      width: 200px;
      padding: 8px;
      margin: 0 auto;
    }

    & form {
      display: flex;
      flex-direction: column;
      align-items: center;
    } 

    & label {
      font-weight: 500;
      margin-bottom: 4px;
      width: 100%;
      text-align: left;
    }

   
  `}
`;

export const StrengthWrapper = styled.div`
  width: 100%;
  min-width: 200px;
  height: 0.5rem;
  background: ${({ theme }: { theme: DefaultTheme }) => theme.colors.lightGray};
  border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.radius.small};
  margin-top: 0.25rem;
`;

export const StrengthBar = styled.div<{ strength: number }>`
  height: 100%;
  width: ${({ strength }) => `${(strength / 5) * 100}%`};
  border-radius: inherit;
  transition: width 0.3s ease;
  background-color: ${({ strength, theme }) =>
    strength <= 2
      ? theme.colors.dangerColor
      : strength === 3
        ? theme.colors.yellow
        : theme.colors.successfulGreen};
`;