import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err) {
    console.error('signInWithPopup failed, trying redirect', err);
    await signInWithRedirect(auth, provider);
    const redirect = await getRedirectResult(auth);
    if (!redirect) {
      throw err;
    }
    return redirect.user;
  }
}

export default app;
