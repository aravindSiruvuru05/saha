'use client';

import { createContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Route, Search, Grip, BellIcon } from 'lucide-react';
import { PublishRide } from './PublishRide';
import { RidesSearch } from './RidesSearch';
import { MyRides } from './MyRides';
import { useIonRouter } from '@ionic/react';
import { useActiveTab } from '../ActiveTabContext';
import { ToggleBar } from '@/components/ui/commonComponents/ToggleBar';
import { ServiceDashboardLayout } from '../ServiceDashboardLayout';

const ActiveTabContext = createContext({
  activeTab: 'ride-search', // Default value
  setActiveTab: (tab: string) => {},
});

export const RideHomeLayout = () => {
  return (
    <ServiceDashboardLayout
      menuItems={[
        {
          id: 'ride-search',
          label: 'Search',
          component: (
            <ToggleBar
              options={[
                {
                  label: 'Find Rides',
                  component: <RidesSearch />,
                },
                {
                  label: 'Find Requests',
                  component: <>No implementation</>,
                },
              ]}
            />
          ),
          icon: <Search className="h-5 w-5" />,
        },
        {
          id: 'publish',
          label: 'Publish',
          component: (
            <ToggleBar
              options={[
                {
                  label: 'Publish Ride',
                  component: <PublishRide />,
                },
                {
                  label: 'Publish Requests',
                  component: <>No implementation</>,
                },
              ]}
            />
          ),
          icon: <Plus />,
        },
        {
          id: 'my-ride',
          label: 'My Rides',
          component: <MyRides />,
          icon: <Route />,
        },
      ]}
    />
  );
};
