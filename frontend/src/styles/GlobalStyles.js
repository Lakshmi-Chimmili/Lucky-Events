import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    background-color: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.body};
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    background-image: 
      radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 85% 85%, rgba(236, 72, 153, 0.06) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 50%);
    background-attachment: fixed;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    color: ${({ theme }) => theme.colors.white};
    line-height: 1.25;
    font-weight: 700;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: ${({ theme }) => theme.transitions.fast};
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #090d16;
  }

  ::-webkit-scrollbar-thumb {
    background: #1e293b;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #334155;
  }

  /* Selection highlight */
  ::selection {
    background: rgba(99, 102, 241, 0.35);
    color: #ffffff;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @keyframes pulseGlow {
    0%, 100% {
      box-shadow: 0 0 20px -5px rgba(99, 102, 241, 0.4);
    }
    50% {
      box-shadow: 0 0 35px 2px rgba(99, 102, 241, 0.7);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;
