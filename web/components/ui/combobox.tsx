'use client';

import * as React from 'react';
import { CaretSortIcon, CheckIcon, Cross1Icon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from './badge';

const locations = [
  { value: 'newyork' },
  { value: 'losangeles' },
  { value: 'chicago' },
  { value: 'houston' },
  { value: 'phoenix' },
  { value: 'philadelphia' },
  { value: 'sanantonio' },
  { value: 'sandiego' },
  { value: 'dallas' },
  { value: 'sanjose' },
];

export const Combobox = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <div className="flex flex-col">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            Select Stops
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {locations.map(location => (
                  <CommandItem
                    key={location.value}
                    value={location.value}
                    onBlur={() => setOpen(false)}
                    onSelect={currentValue => {
                      setValue(prev => {
                        return prev.includes(currentValue)
                          ? prev.filter(item => item !== currentValue)
                          : [...prev, currentValue];
                      });
                    }}
                  >
                    {location.value}
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        value.includes(location.value)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-3 mt-3">
        {' '}
        {/* Flex container for badges */}
        {value.map(v => (
          <Badge
            key={v}
            className="w-min bg-gray-100 text-black text-sm border-1 hover:bg-gray-100 font-normal"
          >
            {v}
            <Cross1Icon
              className={cn(
                'ml-2 h-3 w-3 transition-transform duration-200 hover:scale-110 hover:font-bold',
              )}
              onClick={() =>
                setValue(prev => {
                  return prev.filter(item => item !== v);
                })
              }
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};
