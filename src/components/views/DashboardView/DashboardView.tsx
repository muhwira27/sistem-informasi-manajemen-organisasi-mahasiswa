import React from 'react';
import { IonCard, IonContent, IonPage } from '@ionic/react';
import Header from '../../Header';
import Footer from '../../Footer';
import InfoCard from '../../InfoCard';
import BarChartMembers from '../../BarChartMembers';
import LineChartEvents from '../../LineChartEvents';
import '../../../assets/css/index.css';
import './DashboardView.css';

const DashboardView: React.FC = () => {

  return (
    <IonPage>
      <Header title='Dashboard' />
      <IonContent>
        <div className='container-content ion-padding'>
          <IonCard className='ion-padding'>
            <InfoCard />
            <section className='graphic'>
              <BarChartMembers />
              <LineChartEvents />
            </section>
          </IonCard>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default DashboardView;
