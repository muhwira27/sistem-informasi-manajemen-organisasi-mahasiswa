import {
  IonBadge,
  IonBreadcrumb,
  IonBreadcrumbs,
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonImg,
  IonLabel,
  IonRouterLink,
  IonRow,
  IonText
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { getAllData, getDataById } from '../../firebase/firestoreService';
import { useParams } from 'react-router';
import './GalleryCard.css';

type Params = {
  id: string;
};

interface Album {
  id: string;
  name: string;
  image_urls: string[];
}

const GalleryCard: React.FC = () => {
  const { id } = useParams<Params>();
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [isAlbumOpen, setIsAlbumOpen] = useState(false);
  const [indexAlbum, setIndexAlbum] = useState(-1);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetcData();
  }, [id])

  const fetcData = async () => {
    const organization = await getDataById(id, `organizations`);
    const album = await getAllData(`/organizations/${id}/gallery`);

    setAlbumList(album);
    setTitle(organization?.name);
  };

  const toggleAlbumOpen = (idx: number) => {
    console.log(albumList[idx])
    setIndexAlbum(idx);
    setIsAlbumOpen(!isAlbumOpen);
  };

  const getLogoURL = (logoURL: string) => {
    const parts = logoURL.split("/");
    const idLogoUrl = parts[5];
    return `https://drive.google.com/uc?export=view&id=${idLogoUrl}`;
  };

  return (
    <>
      <IonBreadcrumbs mode='ios'>
        <IonBreadcrumb routerLink="/organizations">Organization List</IonBreadcrumb>
        <IonBreadcrumb routerLink={`/organizations/${id}`}>{title}</IonBreadcrumb>
        <IonBreadcrumb routerLink={`/organizations/${id}/gallery`}>Gallery</IonBreadcrumb>
      </IonBreadcrumbs>

      <div className='gallery-line'></div>

      <div className='album-segment ion-padding'>
        {!isAlbumOpen ?
          <>
            <div className='album-header'>
              <IonText>Album</IonText>
            </div>
            <div className='album-card-container'>
              {albumList.map((album, index) => (
                <IonCard key={index} className="album-card" onClick={() => toggleAlbumOpen(index)}>
                  <IonCardContent className="album-content">
                    <div className='image-info-container'>
                      <div className="album-images-container">
                        {album.image_urls?.slice(0, 4).map((photo, photoIndex) => (
                          <IonImg key={photoIndex} src={getLogoURL(photo)} alt={`image${index + 1}`} className="album-images"></IonImg>
                        ))}
                      </div>
                      <div className='album-info'>
                        <IonRouterLink>
                          <div className="album-title">
                            <IonLabel title={album.name}>{album.name}</IonLabel>
                          </div>
                        </IonRouterLink>
                        <IonBadge className="album-badge" slot="end">{album.image_urls?.length} Foto</IonBadge>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </div>
          </>
          :
          <>
            <div className='album-header'>
              <div className='album-title-container'>
                <IonText>Album {albumList[indexAlbum]?.name}</IonText>
              </div>
            </div>
            <IonGrid>
              <IonRow>
                {albumList[indexAlbum].image_urls?.map((photo, index) =>
                  <IonCol sizeXs='12' sizeSm='6' sizeMd='4' sizeXl='3' key={index}>
                    <IonImg src={getLogoURL(photo)} alt={`image${index + 1}`} className="images"></IonImg>
                  </IonCol>
                )}
              </IonRow>
            </IonGrid>
            <div className='container-button'>
              <IonButton onClick={() => toggleAlbumOpen(-1)} className='back-button'>
                back
              </IonButton>
            </div>
          </>
        }
      </div >
    </>
  );
};

export default GalleryCard;
