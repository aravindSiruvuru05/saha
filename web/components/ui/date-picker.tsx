'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker';
import { Label } from './label';

interface IDatePickerProps {
  onChange: (date: Date | undefined) => void;
  value?: Date;
}

export const DatePicker = ({ value, onChange }: IDatePickerProps) => {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [open, setOpen] = React.useState(false); // State to control Popover open

  const handleDateSelect: SelectSingleEventHandler = val => {
    setDate(val);
    onChange(val);
    setOpen(false); // Close the Popover after selecting the date
  };

  return (
    <div className="flex flex-col w-[100%] gap-3">
      <Label htmlFor="date">Date</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[100%] justify-start text-left font-normal shadow-sm text-md border bg-white hover:bg-white max-w-[400px]',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick your travel date...</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
