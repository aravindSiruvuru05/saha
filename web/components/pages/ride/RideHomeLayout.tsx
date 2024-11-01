'use client';

import { createContext, useState } from 'react';
import { Plus, Route, Search, Grip, BellIcon } from 'lucide-react';
import { PublishRide } from './PublishRide';
import { RidesSearch } from './RidesSearch';
import { MyRides } from './MyRides';
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
          component: <RidesSearch />,
          icon: <Search className="h-5 w-5" />,
        },
        {
          id: 'publish',
          label: 'Publish',
          component: <PublishRide />,
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
