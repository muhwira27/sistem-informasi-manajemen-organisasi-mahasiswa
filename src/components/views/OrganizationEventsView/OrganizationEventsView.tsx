import { IonCard, IonContent, IonPage } from '@ionic/react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import EventsSegment from '../../EventsSegment';
import MyOrganizationSegments from '../../MyOrganizationSegments';
import '../../../assets/css/index.css';

const OrganizationEventsView: React.FC = () => {

  return (
    <IonPage>
      <Header title='My Organization' />
      <IonContent>
        <div className='container-content ion-padding'>
          <div className='organization-segment-container'>
            <MyOrganizationSegments />
            <div>
              <EventsSegment />
            </div>
          </div>
        </div>
        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default OrganizationEventsView;