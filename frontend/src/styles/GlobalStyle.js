import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background};
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: 600;
    line-height: 1.2;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.75rem;
  }

  h3 {
    font-size: 1.5rem;
  }

  h4 {
    font-size: 1.25rem;
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  input, textarea {
    font-family: inherit;
    font-size: inherit;
  }

  ul, ol {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding-left: ${({ theme }) => theme.spacing.lg};
  }

  /* Custom scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
    
    &:hover {
      background: #666;
    }
  }

  /* Utility classes */
  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .text-left {
    text-align: left;
  }

  .mt-1 { margin-top: ${({ theme }) => theme.spacing.sm}; }
  .mt-2 { margin-top: ${({ theme }) => theme.spacing.md}; }
  .mt-3 { margin-top: ${({ theme }) => theme.spacing.lg}; }
  .mt-4 { margin-top: ${({ theme }) => theme.spacing.xl}; }

  .mb-1 { margin-bottom: ${({ theme }) => theme.spacing.sm}; }
  .mb-2 { margin-bottom: ${({ theme }) => theme.spacing.md}; }
  .mb-3 { margin-bottom: ${({ theme }) => theme.spacing.lg}; }
  .mb-4 { margin-bottom: ${({ theme }) => theme.spacing.xl}; }

  .mx-1 { margin-left: ${({ theme }) => theme.spacing.sm}; margin-right: ${({ theme }) => theme.spacing.sm}; }
  .mx-2 { margin-left: ${({ theme }) => theme.spacing.md}; margin-right: ${({ theme }) => theme.spacing.md}; }
  .mx-3 { margin-left: ${({ theme }) => theme.spacing.lg}; margin-right: ${({ theme }) => theme.spacing.lg}; }
  .mx-4 { margin-left: ${({ theme }) => theme.spacing.xl}; margin-right: ${({ theme }) => theme.spacing.xl}; }

  .my-1 { margin-top: ${({ theme }) => theme.spacing.sm}; margin-bottom: ${({ theme }) => theme.spacing.sm}; }
  .my-2 { margin-top: ${({ theme }) => theme.spacing.md}; margin-bottom: ${({ theme }) => theme.spacing.md}; }
  .my-3 { margin-top: ${({ theme }) => theme.spacing.lg}; margin-bottom: ${({ theme }) => theme.spacing.lg}; }
  .my-4 { margin-top: ${({ theme }) => theme.spacing.xl}; margin-bottom: ${({ theme }) => theme.spacing.xl}; }
`;

export default GlobalStyle; 