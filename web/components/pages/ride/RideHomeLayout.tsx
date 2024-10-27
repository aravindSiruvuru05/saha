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

const ActiveTabContext = createContext({
  activeTab: 'ride-search', // Default value
  setActiveTab: (tab: string) => {},
});

export const RideHomeLayout = () => {
  const query = new URLSearchParams(location.search);

  // const [activeTab, setActiveTab] = useState('ride-search');
  const { activeTab, setActiveTab } = useActiveTab();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useIonRouter(); // Use IonRouter for navigation

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main
        className="flex-grow min-h-screen flex items-start justify-center p-4 mb-20 overflow-auto bg-right md:bg-center bg-cover w-lg"
        // style={{
        //   backgroundImage: `url(${images.src})`,
        // }}
      >
        {activeTab === 'publish' && (
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
        )}
        {activeTab === 'ride-search' && (
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
        )}
        {activeTab === 'my-rides' && <MyRides />}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg lg:pb-0">
        <nav className="flex justify-around items-center h-16">
          <button
            onClick={() => router.push('/', 'root', 'replace')}
            className={`flex flex-col items-center justify-center h-full bg-accent w-full ${
              activeTab === 'ride-search'
                ? 'text-primary font-bold'
                : 'text-gray-500'
            }`}
          >
            <Grip className="h-6 w-6" />
          </button>
          <button
            onClick={() => setActiveTab('ride-search')}
            className={`flex flex-col items-center justify-center w-full h-full  ${
              activeTab === 'ride-search'
                ? 'text-primary font-bold scale-110'
                : 'text-gray-500'
            }`}
          >
            <Search className="h-6 w-6" />
            <span className="text-sm mt-1">Search</span>
          </button>
          <button
            onClick={() => setActiveTab('publish')}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === 'publish'
                ? 'text-primary font-bold scale-110'
                : 'text-gray-500'
            }`}
          >
            <Plus className="h-6 w-6" />
            <span className="text-sm mt-1">Publish</span>
          </button>
          <button
            onClick={() => setActiveTab('my-rides')}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === 'my-rides'
                ? 'text-primary font-bold scale-110'
                : 'text-gray-500'
            }`}
          >
            <Route className="h-6 w-6" />
            <span className="text-sm mt-1">My Rides</span>
          </button>
        </nav>
      </footer>
    </div>
  );
};
