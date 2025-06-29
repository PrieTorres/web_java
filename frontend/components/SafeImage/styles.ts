import styled, { DefaultTheme, css } from 'styled-components';

interface ContainerProps {
  theme: DefaultTheme;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export const Container = styled.div`
  ${({ style }: ContainerProps) => css`
    width: ${style?.width ? `${style?.width}px` : 'fit-content'};
    height: ${style?.height ? `${style?.height}px` : '100%'};
    display: flex;
    align-items: center;

    > img {
      height: 100%;
      object-fit: contain;
      width: 100%;
      max-width: 100%;
    }
  `}
`;
