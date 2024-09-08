import { IonCardSubtitle, IonImg } from '@ionic/react';
import React from 'react';
import './SocmedItem.css';

type SocmedItemProps = {
  iconName: string,
  text: string
};

const SocmedItem: React.FC<SocmedItemProps> = ({ iconName, text }) => {
  return (
    <div className='container-socmed-item'>
      <IonImg
        className='socmed-item-icon'
        src={`/src/assets/icons/${iconName}.svg`}
        alt={iconName}
      />
      <IonCardSubtitle className='socmed-item-text'>{text}</IonCardSubtitle>
    </div>
  );
};

export default SocmedItem;
