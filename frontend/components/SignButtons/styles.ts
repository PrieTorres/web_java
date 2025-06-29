import styled, { DefaultTheme, css } from 'styled-components';
    
export const Container = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    display: flex;
    justify-content: space-between;
    background: ${theme.colors.mainBg};
    padding: ${theme.spacings.xsmall};
    border-radius: ${theme.radius.small};
  `}
`;