import styled, { DefaultTheme, css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }: { theme: DefaultTheme }) => css`
    min-height: ${theme.height.sectionHeight};
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${theme.spacings.large};

    & form {
      width: 100%;
      max-width: 600px;
      background: ${theme.colors.secondaryBg};
      padding: ${theme.spacings.large};
      border-radius: ${theme.radius.big};
      box-shadow: 0 2px 8px ${theme.colors.shadowColor};
      display: flex;
      flex-direction: column;
      gap: ${theme.spacings.small};
    }

    & h1 {
      margin-bottom: ${theme.spacings.small};
      text-align: center;
    }

    & .input {
      padding: ${theme.spacings.xsmall};
      border-radius: ${theme.radius.small};
      border: 1px solid ${theme.colors.borderColor};
      background: ${theme.colors.mainBg};
      color: ${theme.colors.secondaryColor};
    }

    & .image-wrapper {
      display: flex;
      justify-content: center;
    }

    & .preview {
      max-width: 100%;
      max-height: 200px;
      border-radius: ${theme.radius.small};
    }

    & .tag-input-wrapper {
      display: flex;
      flex-direction: column;
      gap: ${theme.spacings.xsmall};
    }

    & .tags {
      display: flex;
      flex-wrap: wrap;
      gap: ${theme.spacings.xsmall};
    }

    & .submit {
      padding: ${theme.spacings.small};
      border-radius: ${theme.radius.small};
      background: ${theme.colors.orange};
      color: ${theme.colors.secondaryColor};
      font-weight: bold;
      cursor: pointer;
      transition: ${theme.transitions.default};
    }

    & .submit:hover {
      background: ${theme.colors.midBrown};
    }

    & .nav {
      padding: ${theme.spacings.xsmall};
      border-radius: ${theme.radius.small};
      background: ${theme.colors.secondaryBgDarker};
      color: ${theme.colors.secondaryColor};
      cursor: pointer;
      transition: ${theme.transitions.default};
    }

    & .nav:hover {
      background: ${theme.colors.secondaryBg};
    }

    & .actions {
      display: flex;
      justify-content: space-between;
      gap: ${theme.spacings.small};
    }
  `}
`;