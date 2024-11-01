'use client';

import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';

import { Bell, Menu, Grip, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useActiveTab } from './ActiveTabContext';
import { useIonRouter } from '@ionic/react';
import { MainLayout } from '../ui/commonComponents/MainLayout';
import { Label } from '../ui/label';

interface IMenuItems {
  icon: JSX.Element;
  label: string;
  id: string;
  component: JSX.Element;
}

interface IServiceDashboardLayoutPros {
  menuItems: IMenuItems[];
}

export const ServiceDashboardLayout: React.FC<IServiceDashboardLayoutPros> = ({
  menuItems,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { activeTab, setActiveTab } = useActiveTab();
  const router = useIonRouter(); // Use IonRouter for navigation
  const platform = Capacitor.getPlatform();

  return (
    <MainLayout>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? '16rem' : '4rem' }}
          className={cn(
            'bg-muted text-muted-foreground h-[100vh]',
            'flex flex-col overflow-hidden hidden md:flex',
          )}
        >
          <div className="p-4 flex justify-between items-center ">
            {sidebarOpen && <h2 className="text-lg font-semibold">Menu</h2>}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1">
            <ul className="py-2 flex flex-col gap-1">
              {menuItems.map((item, index) => (
                <motion.li
                  key={index}
                  initial={false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    'flex w-full justify-start px-4 text-sm py-2',
                    sidebarOpen ? '' : 'justify-center',
                  )}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start relative overflow-hidden group gap-1 p-3',
                      sidebarOpen ? 'px-0' : 'px-0 py-2 justify-center',
                      activeTab === item.id &&
                        'px-0 bg-black text-accent hover:bg-foreground/80 hover:text-white',
                      sidebarOpen && activeTab === item.id && 'px-2',
                    )}
                    onClick={() => setActiveTab(item.id)}
                  >
                    {item.icon}
                    {sidebarOpen && (
                      <span className="truncate">{item.label}</span>
                    )}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: activeTab === item.id ? '100%' : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-primary/10 pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Button>
                </motion.li>
              ))}
            </ul>
          </nav>
          <div className=" border-t">
            <ul className="py-2">
              {[
                { icon: <Grip />, label: 'All Services', id: 'home' },
                { icon: <User />, label: 'My Profile' },
              ].map((item, index) => (
                <li
                  key={index}
                  className={cn(
                    'flex w-full justify-start px-4 text-sm py-2',
                    sidebarOpen ? '' : 'justify-center',
                  )}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start relative overflow-hidden group gap-1 p-3',
                      sidebarOpen ? 'px-0' : 'px-0 py-2 justify-center',
                      activeTab === item.id &&
                        'px-0 bg-black text-accent hover:bg-foreground/80 hover:text-white',
                      sidebarOpen && activeTab === item.id && 'px-2',
                    )}
                    onClick={() =>
                      item.id === 'home' && router.push('/', 'root', 'replace')
                    }
                  >
                    {item.icon}
                    {sidebarOpen && (
                      <span className="truncate">{item.label}</span>
                    )}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: activeTab === item.id ? '100%' : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-primary/10 pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </motion.aside>

        <div className="flex-1 flex flex-col">
          {/* Top navbar */}
          <header className="bg-background border-b h-14 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Label className="font-bold">loop</Label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="relative bg-accent"
              onClick={() => {
                router.push('/notifications');
              }}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </header>

          <main className="flex-1 p-4">
            {menuItems.find(mI => mI.id === activeTab)?.component}
          </main>
        </div>
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg lg:pb-0 md:hidden">
          <nav
            className={`flex justify-around items-center  ${platform === 'ios' || platform === 'android' ? 'h-20' : 'h-16'}`}
          >
            <button
              className={`flex flex-col items-center justify-center w-full h-full bg-accent`}
              onClick={() => router.push('/', 'root', 'replace')}
            >
              <Grip className="h-6 w-6" />
            </button>
            {menuItems.map((item, index) => {
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center justify-center w-full h-full  ${(platform === 'ios' || platform === 'android') && 'pb-4'} ${
                    activeTab === item.id
                      ? 'text-primary font-bold'
                      : 'text-gray-500 scale-95'
                  }`}
                >
                  {item.icon}
                  <span className="text-sm mt-1">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </footer>
      </div>
    </MainLayout>
  );
};
