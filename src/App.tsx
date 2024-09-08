import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import RequireAuth from './context/requireAuth';
import RequireLogout from './context/requireLogout';
import Menu from './components/Menu';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Pages */
import Login from './pages/Login';
import Profil from './pages/Profil';
import Dashboard from './pages/Dashboard';
import News from './pages/News';
import NewsContent from './pages/NewsContent';
import OrganizationList from './pages/OrganizationList';
import OrganizationDetails from './pages/OrganizationDetails';
import Achievement from './pages/Achievement';
import Gallery from './pages/Gallery';
import NotFound from './pages/NotFound';
import OrganizationEvents from './pages/OrganizationEvents';
import OrganizationMembers from './pages/OrganizationMembers';
import OrganizationGallery from './pages/OrganizationGallery';
import OrganizationAchievements from './pages/OrganizationAchievements';

/* Admin */
import UserList from './pages/UserList';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact>
              <Redirect to="/login" />
            </Route>
            <Route exact path="/login">
              <RequireLogout>
                <Login />
              </RequireLogout>
            </Route>
            <Route exact path="/profile">
              <RequireAuth><Profil /></RequireAuth>
            </Route>
            <Route exact path="/dashboard">
              <RequireAuth><Dashboard /></RequireAuth>
            </Route>
            <Route exact path="/news">
              <RequireAuth><News /></RequireAuth>
            </Route>
            <Route exact path="/news/:id">
              <RequireAuth><NewsContent /></RequireAuth>
            </Route>
            <Route exact path="/organizations">
              <RequireAuth><OrganizationList /></RequireAuth>
            </Route>
            <Route exact path="/organizations/:id">
              <RequireAuth><OrganizationDetails /></RequireAuth>
            </Route>
            <Route exact path="/organizations/:id/achievement">
              <RequireAuth><Achievement /></RequireAuth>
            </Route>
            <Route exact path="/organizations/:id/gallery">
              <RequireAuth><Gallery /></RequireAuth>
            </Route>
            <Route exact path="/my-organization/:id">
              <Redirect to="/my-organization/:id/events" />
            </Route>
            <Route exact path="/my-organization/:id/events">
              <RequireAuth><OrganizationEvents /></RequireAuth>
            </Route>
            <Route exact path="/my-organization/:id/members">
              <RequireAuth><OrganizationMembers /></RequireAuth>
            </Route>
            <Route exact path="/my-organization/:id/gallery">
              <RequireAuth><OrganizationGallery /></RequireAuth>
            </Route>
            <Route exact path="/my-organization/:id/achievements">
              <RequireAuth><OrganizationAchievements /></RequireAuth>
            </Route>

            {/* ADMIN */}
            <Route exact path="/users">
              <RequireAuth><UserList /></RequireAuth>
            </Route>

            {/* NOT FOUND */}
            <Route>
              <RequireAuth><NotFound /></RequireAuth>
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
