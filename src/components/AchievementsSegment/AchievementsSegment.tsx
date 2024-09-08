import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonCard, IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonText
} from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { deleteData, getAllData, getDataById } from '../../firebase/firestoreService';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { readCookieItems } from '../../utils/cookieFunctions';
import { addCircle, createOutline, trashOutline } from 'ionicons/icons';
import { Timestamp } from 'firebase/firestore';
import AchievementForm from '../AchievementForm/AchievementForm';
import DeleteConfirm from '../DeleteConfirm/DeleteConfirm';
import './AchievementsSegment.css';

type Params = {
  id: string;
};

interface Achievement {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date: Timestamp;
}

interface GroupedAchievements {
  year: string;
  achievement_list: Achievement[];
}

const AchievementsSegment: React.FC = () => {
  const { id } = useParams<Params>();
  const { currentUser } = useContext(AuthContext);
  const [achievementList, setAchievementList] = useState<GroupedAchievements[]>([]);
  const [achievementToEdit, setAchievementToEdit] = useState<Achievement | null>(null);
  const [achievementToDelete, setAchievementToDelete] = useState<Achievement | null>(null)
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(true);
  const [isDelete, setIsDelete] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (shouldRefetch) {
      fetchAchievements();
      setShouldRefetch(false);
    }
  }, [id, currentUser, shouldRefetch])

  useEffect(() => {
    verifyAdminStatus();
  }, [id, currentUser])

  useEffect(() => {
    return () => {
      setAchievementList([]);
      setShouldRefetch(true)
      setIsAdmin(false);
    };
  }, [id]);

  const verifyAdminStatus = async () => {
    const user = readCookieItems('user');
    if (user) {
      const userData = await getDataById(user.uid, 'users');
      const organization = userData?.organizations?.find((org: Record<string, string>) =>
        org.id === id
      );
      const role = organization ? organization.role : null;
      const adminRole = [
        'Ketua Umum',
        'Sekretaris',
      ]
      setIsAdmin(adminRole.includes(role));
    } else {
      setIsAdmin(false);
    }
  };


  const groupAchievementsByYear = (achievements: Achievement[]): GroupedAchievements[] => {
    const groupedAchievements = achievements.reduce((acc, achievement) => {
      // Converts Timestamp to Date, then gets the year
      const year = achievement?.date?.toDate().getFullYear().toString();

      const existingGroup = acc.find(group => group.year === year);

      if (existingGroup) {
        existingGroup.achievement_list.push(achievement);
      } else {
        acc.push({
          year: year,
          achievement_list: [achievement]
        });
      }

      return acc;
    }, [] as GroupedAchievements[]);

    return groupedAchievements.sort((a, b) => parseInt(b.year) - parseInt(a.year));
  };

  const fetchAchievements = async () => {
    const data = await getAllData(`/organizations/${id}/achievements`);

    setAchievementList(groupAchievementsByYear(data));
  };

  const handleAddAchievement = () => {
    setIsFormOpen(true);
    setAchievementToEdit(null);
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setIsFormOpen(true);
    setAchievementToEdit(achievement);
  }

  const handleDelete = async () => {
    try {
      if (achievementToDelete) {
        await deleteData(achievementToDelete.id, `/organizations/${id}/achievements`);
        await deleteData(achievementToDelete.id, 'achievement_list');

        await onAchievementChange();
      }
    } catch (error) {
      console.log('Error deleting achievement: ', error)
    }
  };

  const onDelete = (achievement: Achievement) => {
    setAchievementToDelete(achievement);
    setTitle(achievement.title);
    setIsDelete(true);
  }

  const onAchievementChange = async () => {
    setShouldRefetch(true);
  };

  const getLogoURL = (logoURL: string) => {
    if (logoURL) {
      const parts = logoURL.split("/");
      const idLogoUrl = parts[5];
      return `https://drive.google.com/uc?export=view&id=${idLogoUrl}`;
    }
  };

  return (
    <div className='achievements-segment ion-padding'>
      {isAdmin &&
        <IonButton className='add-achievement' color={'medium'} onClick={handleAddAchievement}>
          <IonIcon icon={addCircle}></IonIcon>
          &nbsp; Add &nbsp;
          <IonText className='add-achievement-text'>Achievement</IonText>
        </IonButton>
      }
      {achievementList.map((achievement, index) =>
        <IonAccordionGroup multiple={true} key={index}>
          <IonAccordion className='list-achievement' value={achievement.year}>
            <IonItem className='achievement-year' slot='header'>
              <IonLabel>{achievement.year}</IonLabel>
            </IonItem>
            <div className='ion-padding' slot="content">
              {achievement.achievement_list.map((content, index) => (
                <React.Fragment key={`achievement-${achievement.year}-${index}`}>
                  <IonCard className='achievement-card'>
                    <IonImg className='achievement-img' src={getLogoURL(content.image_url)} alt={'achievement image'} />
                    <IonCardHeader className='achievement-info'>
                      <div className='achievement-header'>
                        <IonCardTitle className='achievement-title'>{content.title}</IonCardTitle>
                        {isAdmin &&
                          <div className='actions-btn-achievement'>
                            <IonIcon
                              className='edit-achievement'
                              icon={createOutline}
                              onClick={() => handleEditAchievement(content)}
                            ></IonIcon>
                            <IonIcon
                              className='delete-achievement'
                              icon={trashOutline}
                              onClick={() => onDelete(content)}
                            ></IonIcon>
                          </div>
                        }
                      </div>
                      <IonCardSubtitle className='achievement-desc'>{content.description}</IonCardSubtitle>
                    </IonCardHeader >
                  </IonCard >
                  {index !== achievement.achievement_list.length - 1 && <div className='achieve-line'></div>}
                </React.Fragment >
              ))}
            </div >
          </IonAccordion >
        </IonAccordionGroup >
      )}

      <AchievementForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAchievementAdded={onAchievementChange}
        organizationId={id}
        editAchievement={achievementToEdit}
      />

      <DeleteConfirm
        segment='Achievement'
        title={title}
        isOpen={isDelete}
        onClose={() => setIsDelete(false)}
        handleDelete={handleDelete}
      />
    </div >
  );
};

export default AchievementsSegment;
