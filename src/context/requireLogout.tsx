import { useContext, useEffect } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { AuthContext } from './authContext';
import { useIonRouter, useIonToast } from '@ionic/react';

function RequireLogout({ children }: { children: JSX.Element }) {
  const { currentUser, justLoggedOut } = useContext(AuthContext);
  const [present] = useIonToast();
  const location = useLocation();
  const router = useIonRouter();

  useEffect(() => {
    if (currentUser && location.pathname === '/login' && !justLoggedOut) {
      present({
        message: 'Anda harus logout terlebih dahulu.',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      console.log(currentUser, justLoggedOut, location)
      router.push('/dashboard');
      return;
    }
  }, [currentUser, justLoggedOut, location, present]);

  if (currentUser && location.pathname === '/login' && !justLoggedOut) {
    return <Redirect to='/dashboard' />;
  }

  return children;
}

export default RequireLogout;
