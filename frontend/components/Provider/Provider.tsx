"use client";
import { createContext, ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import { ThemeProvider } from "styled-components";
import { theme, themeLight } from "@/styles/theme";
import { GlobalStyles } from "@/styles/globalStyles";
import StyledComponentsRegistry from '@/lib/registry';
import useI18n from '@/hooks/useI18n';
import { PageProvider } from '@/context/PageContext';
import { AlertProvider } from '@/context/AlertContext';
import { DefaultTheme } from 'styled-components';

interface ThemeContextType {
  isLight: boolean;
  changeTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

export const Provider = ({ children }: { children: ReactNode }): ReactElement => {
  useI18n();
  // const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<DefaultTheme>(theme);

  const [isLight, setIsLight] = useState<boolean>(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem("IsLight");
    if (savedTheme) {
      setIsLight(JSON.parse(savedTheme));
    }
  }, []);
  useEffect(() => {
    setCurrentTheme(isLight ? themeLight : theme);
  }, [isLight]);


  const changeTheme = () => {
    const newTheme = !isLight;

    setIsLight(newTheme);
    localStorage.setItem("IsLight", JSON.stringify(newTheme));
  };

  return (
    <StyledComponentsRegistry>
      <ThemeContext.Provider value={{ isLight, changeTheme }}>
        <ThemeProvider theme={currentTheme}>
          <GlobalStyles />
          <PageProvider>
            <AlertProvider>
              {children}
            </AlertProvider>
          </PageProvider>
        </ThemeProvider>
      </ThemeContext.Provider>
    </StyledComponentsRegistry>
  );
};