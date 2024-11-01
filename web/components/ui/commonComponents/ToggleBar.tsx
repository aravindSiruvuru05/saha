'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Label } from '../label';

interface IToggleBarProps {
  title?: string;
  options: { label: string; component: JSX.Element; description?: string }[];
}

export const ToggleBar: React.FunctionComponent<IToggleBarProps> = ({
  title,
  options,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-lg font-semibold text-center mb-4">{title}</h2>
      )}
      {/* Title added */}
      <div className="relative w-full h-12 bg-white shadow rounded-full p-1 max-w-md m-auto">
        <motion.div
          className="absolute top-1 left-1 bottom-1 rounded-full bg-primary"
          initial={false}
          animate={{
            x: activeTab === 0 ? 0 : '95%',
            width: '50%',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        <div className="relative z-10 flex justify-around ">
          <ToggleButton
            active={activeTab === 0}
            onClick={() => setActiveTab(0)}
          >
            {options[0].label}
          </ToggleButton>
          <ToggleButton
            active={activeTab === 1}
            onClick={() => setActiveTab(1)}
          >
            {options[1].label}
          </ToggleButton>
        </div>
      </div>
      <Label className="mt-4 block text-sm text-muted-foreground">
        {options[activeTab].description}
      </Label>
      <div className="mt-4 w-full">{options[activeTab].component}</div>
    </div>
  );
};

function ToggleButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        'px-4 py-2 text-sm font-medium transition-colors rounded-full',
        active ? 'text-primary-foreground' : 'text-foreground',
      )}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
