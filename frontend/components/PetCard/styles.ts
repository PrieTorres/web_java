import styled, { DefaultTheme, css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    background: ${theme.colors.secondaryBg};
    color: ${theme.colors.mainColor};
    border-radius: ${theme.radius.default};
    overflow: hidden;
    width: 300px;
    box-shadow: ${theme.shadow.greyInsetShadow};
    display: flex;
    flex-direction: column;
  `}
`;

export const ImageWrapper = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    width: 100%;
    height: 200px;
    background: ${theme.colors.lightGrey};
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`;

export const Content = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    padding: ${theme.spacings.small};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacings.xsmall};

    & h3 {
      margin: 0;
    }

    & .tipo {
      font-size: 1.4rem;
      color: ${theme.colors.lightBlue};
    }

    & .descricao {
      font-size: 1.4rem;
    }

    & .tag {
      background: ${theme.colors.darkGrey};
      padding: 2px 6px;
      border-radius: ${theme.radius.small};
      font-size: 1.2rem;
    }
  `}
`;

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;
