import { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from './authContext';
import { IonContent, IonPage, useIonToast } from '@ionic/react';
import Header from '../components/Header';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { currentUser, loading, justLoggedOut } = useContext(AuthContext);
  const [present] = useIonToast();

  if (loading) {
    return <IonPage>
      <Header title='' />
      <IonContent>
      </IonContent>
    </IonPage>
  }

  if (!currentUser && !loading && !justLoggedOut) {
    present({
      message: 'Anda harus login terlebih dahulu.',
      duration: 3000,
      position: 'top',
      color: 'danger'
    });
  }

  if (!currentUser && !justLoggedOut) {
    return <Redirect to='/login' />;
  }

  return children;
}

export default RequireAuth;
