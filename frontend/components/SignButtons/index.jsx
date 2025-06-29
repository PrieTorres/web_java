"use client";
import { Container } from './styles';
import { useContext } from "react";
import { auth } from '@/lib/firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { PageContext } from '@/context/PageContext';
import defaultIcon from "@/public/assets/img/default_user_photo.png";
import { useRouter } from 'next/navigation';
import { SafeImage } from '../SafeImage';
import { DropDown } from '../DropDown';
import { useTheme } from 'styled-components';


export const SignButtons = () => {
  const { updateSessionId, updateToken, updateUser, userId, user } = useContext(PageContext);
  const router = useRouter();
  const theme = useTheme();


  function handleSignOut() {
    firebaseSignOut(auth);
    if (typeof updateSessionId === 'function') {
      updateSessionId("");
    }
    if (typeof updateToken === 'function') {
      updateToken("");
    }
    if (typeof updateUser === 'function') {
      updateUser(null);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('sessionId');
    }
    router.push('/login');
  }

  function handleSignIn() {
    router.push('/signIn');
  }

  if (!userId) {
    return (
      <Container>
        <button
          type='button'
          onClick={handleSignIn}
          style={{
            background: theme.colors.blueGray,
            color: theme.colors.white,
            padding: '0.8rem 1.6rem',
            borderRadius: theme.radius.default,
          }}
        >
          Sign in
        </button>
      </Container>
    );
  }

  const dropItems = [
    {
      onClick: () => router.push('/myPets'),
      children: 'My Profile'
    },
    {
      onClick: handleSignOut,
      children: 'Sign Out'
    }
  ];

  return (
    <Container>
      <DropDown
        items={dropItems}
        dropDownId='user-menu'
        toggleId='toggle-user-menu'
        style={{ background: theme.colors.mainBg }}
      >
        <SafeImage
          src={user?.photoURL ?? defaultIcon}
          width={37}
          height={37}
          className='rounded-full cursor-pointer'
          alt='profile'
        />
      </DropDown>
    </Container>
  );
};