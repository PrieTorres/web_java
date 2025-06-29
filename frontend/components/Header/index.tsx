"use client"
import {  ReactElement } from 'react';
import { Container } from './styles';
import { Menu } from '../Menu';
import { SignButtons } from '../SingButtons';
import { MainLogo } from '../MainLogo';
import { useThemeContext } from '../Provider/Provider';



export const Header = (): ReactElement => {
  const { isLight, changeTheme } = useThemeContext();
 
  return (
      <Container className='flex '>
        <MainLogo />
        <div className="hidden sm:block">
          <Menu />
        </div>
        <div className='text-[1.5rem] flex gap-4 '>
          <SignButtons  />
          <button onClick={changeTheme} className="p-2 rounded bg-gray-200 dark:bg-gray-700">
            {isLight ? "Dark 🌑" : "Light ☀"}
          </button>
        </div>
        <div className="block sm:hidden" style={{ width: "100%" }}>
          <Menu />
        </div>

      </Container>
  );
};
