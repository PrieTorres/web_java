import styled, { DefaultTheme, css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }: { theme: DefaultTheme; }) => css`
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${theme.colors.secondaryBg};
  `}x
`;

export const Input = styled.input`
  border: 1px solid #ccc;
  padding: 12px;
  width: 100%;
  border-radius: 6px;
  margin-bottom: 10px;
`;