import styled, { DefaultTheme, css } from 'styled-components';
    
export const Container = styled.div`
  ${({ }: { theme: DefaultTheme }) => css`
    display: flex;
    justify-content: space-between;
  `}
`;