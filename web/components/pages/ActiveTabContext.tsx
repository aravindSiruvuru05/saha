import React, { createContext, useContext, useState } from 'react';

// Create the context
const ActiveTabContext = createContext({
  activeTab: 'ride-search', // Default value
  setActiveTab: (tab: string) => {},
});

// Create a provider component
export const ActiveTabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('ride-search');

  return (
    <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ActiveTabContext.Provider>
  );
};

// Custom hook to use the ActiveTabContext
export const useActiveTab = () => useContext(ActiveTabContext);
