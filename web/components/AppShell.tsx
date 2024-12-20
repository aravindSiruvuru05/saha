'use client';
import { Provider } from 'react-redux';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import store from '@/store/store';
import ProtectedRoute from '@/components/pages/ProtectedRoute';
import { Signin } from './pages/Signin';
import { Signup } from './pages/Signup';
import { RideHomeLayout } from './pages/ride/RideHomeLayout';
import { RideSearchListings } from './pages/ride/RideSearchListings';
import { ActiveTabProvider } from './pages/ActiveTabContext';
import { RideDetails } from './pages/ride/RideDetails';
import { Notifications } from './pages/Notifications';
import { HomePage } from './pages/HomePage';

setupIonicReact({});

// Toggle dark/light status bar based on user preference
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', async status => {
    try {
      await StatusBar.setStyle({
        style: status.matches ? Style.Dark : Style.Light,
      });
    } catch {}
  });

const AppShell = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <Provider store={store}>
          <IonRouterOutlet id="main">
            {/* Unprotected routes */}
            <Route path="/signin" render={() => <Signin />} exact />
            <Route path="/signup" render={() => <Signup />} exact />
            <Route path="/" exact>
              <Redirect to="/home" />
            </Route>

            {/* Protected routes (Tabs as a protected route) */}
            <ProtectedRoute path="/home" exact>
              <HomePage />
            </ProtectedRoute>
            <ProtectedRoute path="/rides-home" exact>
              <ActiveTabProvider>
                <RideHomeLayout />
              </ActiveTabProvider>
            </ProtectedRoute>
            <ProtectedRoute path="/search-listings" exact>
              <RideSearchListings />
            </ProtectedRoute>
            <ProtectedRoute path="/ride-details" exact>
              <RideDetails />
            </ProtectedRoute>
            <ProtectedRoute path="/notifications" exact>
              <Notifications />
            </ProtectedRoute>

            {/* Add other protected routes here */}
          </IonRouterOutlet>
        </Provider>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
