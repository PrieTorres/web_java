import styled, { DefaultTheme, css } from 'styled-components';

interface ContainerProps {
  theme: DefaultTheme;
  width?: number;
  height?: number;
}

export const Container = styled.div`
  ${({ width, height }: ContainerProps) => css`
    width: ${width ? `${width}px` : 'fit-content'};
    height: ${height ? `${height}px` : '100%'};
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
