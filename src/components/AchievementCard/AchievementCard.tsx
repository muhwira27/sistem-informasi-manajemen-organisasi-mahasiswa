import { IonAccordion, IonAccordionGroup, IonBreadcrumb, IonBreadcrumbs, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonImg, IonItem, IonLabel, IonRow } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getAllData, getDataById } from '../../firebase/firestoreService';
import { Timestamp } from 'firebase/firestore';

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

const AchievementCard: React.FC = () => {
  const { id } = useParams<Params>();
  const [title, setTitle] = useState('');
  const [achievementList, setAchievementList] = useState<GroupedAchievements[]>([]);

  useEffect(() => {
    fetcData();
  }, [id])

  const fetcData = async () => {
    const organization = await getDataById(id, `organizations`);
    const dataAchiev = await getAllData(`/organizations/${id}/achievements`);

    setAchievementList(groupAchievementsByYear(dataAchiev));
    setTitle(organization?.name);
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

  const getLogoURL = (logoURL: string) => {
    if (logoURL) {
      const parts = logoURL.split("/");
      const idLogoUrl = parts[5];
      return `https://drive.google.com/uc?export=view&id=${idLogoUrl}`;
    }
  };

  return (
    <>
      <IonBreadcrumbs mode='ios'>
        <IonBreadcrumb routerLink="/organizations" routerDirection='back'>Organization List</IonBreadcrumb>
        <IonBreadcrumb routerLink={`/organizations/${id}`} routerDirection='back'>{title}</IonBreadcrumb>
        <IonBreadcrumb routerLink={`/organizations/${id}/achievement`}>Achievement</IonBreadcrumb>
      </IonBreadcrumbs>

      <div className='line'></div>

      <div className='achievements-segment ion-padding'>
        {achievementList.map((achievement, index) =>
          <IonAccordionGroup multiple={true} key={index}>
            <IonAccordion className='list-achievement' value={achievement.year}>
              <IonItem className='achievement-year' slot='header'>
                <IonLabel>{achievement.year}</IonLabel>
              </IonItem>
              <div className='container-achievements ion-padding' slot="content">
                {achievement.achievement_list.map((content, index) => (
                  <React.Fragment key={`achievement-${achievement.year}-${index}`}>
                    <IonCard className='achievement-card'>
                      <IonImg className='achievement-img' src={getLogoURL(content.image_url)} alt={'achievement image'} />
                      <IonCardHeader className='achievement-info'>
                        <div className='achievement-header'>
                          <IonCardTitle className='achievement-title'>{content.title}</IonCardTitle>
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
      </div >
    </>
  );
};

export default AchievementCard;
