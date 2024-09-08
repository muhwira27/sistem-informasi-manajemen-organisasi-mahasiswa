import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  IonAvatar,
  IonCard,
  IonCardTitle,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonRouter,
} from '@ionic/react';
import {
  chevronDownOutline,
  chevronUpOutline,
  personOutline,
  logOutOutline
} from 'ionicons/icons';
import { AuthContext } from '../../context/authContext';
import { getDataById } from '../../firebase/firestoreService';
import './Header.css';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);
  const [showIonLoading, dismissIonLoading] = useIonLoading();
  const { signOut, currentUser } = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const router = useIonRouter();
  const subMenuRef = useRef<HTMLIonCardElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (subMenuRef.current && !subMenuRef.current.contains(event.target as Node)) {
        setIsSubMenuVisible(false);
      }
    };

    // Add click event listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Clean up the listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [subMenuRef]);

  useEffect(() => {
    setUserName('')
    if (currentUser && currentUser.uid) {
      getDataById(currentUser.uid, 'users').then(user => {
        setUserName(user?.name);
      });
    }
  }, [currentUser]);


  const toggleSubMenuVisibility = () => {
    setIsSubMenuVisible(!isSubMenuVisible);
  };

  const handleLogout = () => {
    showIonLoading('Loading');
    setTimeout(() => {
      dismissIonLoading();
      signOut();
      router.push('/login', 'none');
    }, 1000)
    toggleSubMenuVisibility();
  }

  return (
    <IonHeader>
      <IonToolbar>
        <div className='title-container'>
          <IonMenuButton></IonMenuButton>
          <IonTitle>{props.title}</IonTitle>
        </div>
        <IonCard slot='end' onClick={toggleSubMenuVisibility}>
          <IonAvatar>
            <img alt="Profile Picture" src="src/assets/images/profile-picture.png" />
          </IonAvatar>
          <IonCardTitle className='username'>{userName}</IonCardTitle>
          {!isSubMenuVisible ?
            <IonIcon icon={chevronDownOutline} color='light' onClick={toggleSubMenuVisibility}></IonIcon>
            : <IonIcon icon={chevronUpOutline} color='light' onClick={toggleSubMenuVisibility}></IonIcon>
          }
        </IonCard>
      </IonToolbar>
      {isSubMenuVisible &&
        <IonCard className='submenu' ref={subMenuRef}>
          <IonItem
            routerLink="/profile"
            routerDirection='none'
            onClick={toggleSubMenuVisibility}
          >
            <IonIcon icon={personOutline}></IonIcon>
            <IonLabel><h2>Profile</h2></IonLabel>
          </IonItem>
          <IonItem
            className='logout'
            onClick={handleLogout}
          >
            <IonIcon icon={logOutOutline}></IonIcon>
            <IonLabel><h2>Log Out</h2></IonLabel>
          </IonItem>
        </IonCard>
      }
    </IonHeader >
  );
};

export default Header;
