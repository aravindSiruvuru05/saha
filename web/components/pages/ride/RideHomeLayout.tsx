'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  Car,
  Building2,
  Plus,
  Route,
  Search,
  LogOutIcon,
} from 'lucide-react';
import { PublishRide } from './PublishRide';
import { RidesSearch } from './RidesSearch';
import { MyRides } from './MyRides';
import images from '../../../assets/images/free-cars-white.webp';
import { useIonRouter } from '@ionic/react';

export const RideHomeLayout = () => {
  const query = new URLSearchParams(location.search);

  const backhome = query.get('backhome');
  const [activeTab, setActiveTab] = useState('ride-search');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useIonRouter(); // Use IonRouter for navigation

  useEffect(() => {
    if (backhome) {
      setActiveTab('ride-search');
      console.log(backhome, '====');
      query.set('backhome', 'false');
    }
  }, [backhome]);
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-primary text-primary-foreground pb-4 px-4 py-4 fixed top-0 left-0 right-0 z-10 flex items-center justify-between shadow-lg">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px] pt-28">
            <nav className="flex flex-col gap-4 justify-between">
              <div>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Car className="mr-2 h-5 w-5" />
                  Car Pooling
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Building2 className="mr-2 h-5 w-5" />
                  Accommodations
                </Button>
              </div>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  localStorage.removeItem('AccessToken');
                  router.push('/signin');
                }}
              >
                <LogOutIcon className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-bold text-center flex-grow">CarPool</h1>
        <div className="w-10"></div> {/* Spacer to center the title */}
      </header>

      <main
        className="flex-grow min-h-screen flex items-start justify-center p-4 mt-16 lg:mt-16 mb-20 overflow-auto bg-right md:bg-center bg-cover"
        style={{
          height: 'calc(100vh - 4rem - 4rem)',
          backgroundImage: `url(${images.src})`,
        }}
      >
        {activeTab === 'publish' && <PublishRide />}
        {activeTab === 'ride-search' && <RidesSearch />}
        {activeTab === 'my-rides' && <MyRides />}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg lg:pb-0">
        <nav className="flex justify-around items-center h-16">
          <button
            onClick={() => setActiveTab('ride-search')}
            className={`flex flex-col items-center justify-center w-full h-full  ${
              activeTab === 'ride-search'
                ? 'text-primary font-bold'
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
                ? 'text-primary font-bold'
                : 'text-gray-500'
            }`}
          >
            <div className="bg-primary text-primary-foreground rounded-full p-3 -mt-6">
              <Plus className="h-6 w-6" />
            </div>
            <span className="text-sm mt-1">Publish</span>
          </button>
          <button
            onClick={() => setActiveTab('my-rides')}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === 'my-rides'
                ? 'text-primary font-bold'
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
