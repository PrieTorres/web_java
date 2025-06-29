"use client";
import { createContext, ReactElement, ReactNode, useContext, useEffect, useState } from 'react';
import { ThemeProvider } from "styled-components";
import { themeDark, themeLight } from "@/styles/theme";
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
  const [currentTheme, setCurrentTheme] = useState<DefaultTheme>(themeDark);

  const [isLight, setIsLight] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("IsLight");
    if (savedTheme !== null) {
      setIsLight(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    setCurrentTheme(isLight ? themeLight : themeDark);
    const root = document.documentElement;
    if (isLight) {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
    localStorage.setItem("IsLight", JSON.stringify(isLight));
  }, [isLight]);


  const changeTheme = () => {
    setIsLight((prev) => !prev);
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