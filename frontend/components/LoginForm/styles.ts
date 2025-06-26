import styled, { DefaultTheme, css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }: { theme: DefaultTheme; }) => css`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${theme.colors.mainBg};

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

  `}
`;

export const Input = styled.input`
  border: 1px solid #ccc;
  padding: 12px;
  width: 100%;
  border-radius: 6px;
  margin-bottom: 10px;
`;