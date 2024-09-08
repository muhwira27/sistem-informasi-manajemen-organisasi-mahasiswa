import { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { logout, onAuthStateChange } from '../firebase/authService';
import { createCookieItem, clearCookies } from '../utils/cookieFunctions';

interface Props {
  children?: ReactNode
}

export const AuthContext = createContext({
  currentUser: {} as User | null,
  setCurrentUser: (_user: User) => { },
  signOut: () => { },
  loading: {} as Boolean,
  justLoggedOut: false,
  setJustLoggedOut: (_loggedOut: boolean) => { },
});

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setCurrentUser(user);
        createCookieItem('user', { uid: user.uid });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [setCurrentUser]);


  const signOut = async () => {
    setJustLoggedOut(true);
    setCurrentUser(null);
    clearCookies('user');
    await logout();
  }


  const value = {
    currentUser,
    setCurrentUser,
    signOut,
    loading,
    justLoggedOut,
    setJustLoggedOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
