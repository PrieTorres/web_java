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