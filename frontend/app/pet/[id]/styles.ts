import styled, { DefaultTheme, css } from 'styled-components';
import { responsiveFontSize } from '@/styles/helper';

export const Container = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacings.small};

    & h1 {
      ${responsiveFontSize(theme, 'xlarge')};
    }

    & .image-wrapper {
      width: 100%;
      max-width: 400px;
    }

    & .tags {
      display: flex;
      flex-wrap: wrap;
      gap: ${theme.spacings.xsmall};
    }

    & .back-button {
      margin-top: ${theme.spacings.medium};
      padding: ${theme.spacings.xsmall} ${theme.spacings.small};
      border-radius: ${theme.radius.small};
      background: ${theme.colors.secondaryBgDarker};
      color: ${theme.colors.secondaryColor};
      cursor: pointer;
      transition: ${theme.transitions.default};
    }

    & .back-button:hover {
      background: ${theme.colors.secondaryBg};
    }
  `}
`;
