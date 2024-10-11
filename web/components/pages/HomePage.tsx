'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  ArrowLeftRight,
  Home,
  Plus,
  User,
  Menu,
  Car,
  Building2,
} from 'lucide-react';

const locations = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'San Jose',
];

export const HomePage = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [activeTab, setActiveTab] = useState('publish');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSwapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', { fromLocation, toLocation });
    // Here you would typically send the data to your backend
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-primary text-primary-foreground py-4 fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4">
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
          <SheetContent side="left" className="w-[250px] sm:w-[300px]">
            <nav className="flex flex-col gap-4">
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
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="text-2xl font-bold text-center flex-grow">CarPool</h1>
        <div className="w-10"></div> {/* Spacer to center the title */}
      </header>

      <main className="flex-grow flex items-center justify-center p-4 mt-16 mb-20">
        {activeTab === 'publish' && (
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Select value={fromLocation} onValueChange={setFromLocation}>
                    <SelectTrigger className="flex-grow">
                      <SelectValue placeholder="From" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleSwapLocations}
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </Button>
                  <Select value={toLocation} onValueChange={setToLocation}>
                    <SelectTrigger className="flex-grow">
                      <SelectValue placeholder="To" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Publish Post
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        {activeTab === 'posts' && (
          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Available Rides</h2>
            {/* Add your posts list here */}
            <p>List of available rides will be displayed here.</p>
          </div>
        )}
        {activeTab === 'profile' && (
          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>
            {/* Add your profile content here */}
            <p>User profile information and settings will be displayed here.</p>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <nav className="flex justify-around items-center h-16">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === 'posts' ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Posts</span>
          </button>
          <button
            onClick={() => setActiveTab('publish')}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === 'publish' ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <div className="bg-primary text-primary-foreground rounded-full p-3 -mt-6">
              <Plus className="h-6 w-6" />
            </div>
            <span className="text-xs mt-1">Publish</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center w-full h-full ${
              activeTab === 'profile' ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </nav>
      </footer>
    </div>
  );
};
