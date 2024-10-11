'use client';

import React, { useState } from 'react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Input } from '../input';
import { useDebouncedCallback } from 'use-debounce';
import { ChevronRight, Locate, MapPin, Search } from 'lucide-react';
import {
  IPlaceDetails,
  extractBiggerArea,
  getPlacePredictions,
} from '@/utils/google_places';

interface IGoogleSearchCommandInput {
  onSelect: (place: IPlaceDetails) => void;
}
export const GoogleSearchCommandInput = ({
  onSelect,
}: IGoogleSearchCommandInput) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);

  const handleInputChange = useDebouncedCallback(async (e: any) => {
    const val = e.target.value;
    if (val) {
      const results = await getPlacePredictions(val);
      setSuggestions(results);
    }
  }, 500);

  const handleLocationSelect = (
    suggestion: google.maps.places.AutocompletePrediction | string,
  ) => {
    if (typeof suggestion !== 'string') {
      const placeDetails = extractBiggerArea(suggestion);
      onSelect({ ...placeDetails, placeID: suggestion.place_id });
      setInputValue(suggestion.description);
      setOpen(open => !open);
    } else if (suggestion === 'current_user') {
    }
  };

  return (
    <div className="w-[100%]">
      <div className="flex items-center border rounded-md shadow-sm bg-white gap-2  w-full max-w-[400px]">
        <MapPin className="ml-2 text-gray-500 h-4 w-4" />
        <Input
          onFocus={() => setOpen(open => !open)}
          placeholder="Start location..."
          className="border-hidden shadow-none"
          value={inputValue}
        />
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search Location..."
          onSelect={handleInputChange}
        />
        <CommandList>
          <CommandItem
            onSelect={() => handleLocationSelect('current_locaiton')}
          >
            <Locate className="mr-2 h-4 w-4" />
            <span>Pick current location.</span>
          </CommandItem>
          <CommandSeparator />
          <CommandGroup heading="search results">
            {suggestions.map(s => {
              return (
                <CommandItem
                  key={s.place_id}
                  id={s.place_id}
                  onSelect={() => handleLocationSelect(s)}
                >
                  <span>{s.description}</span>
                  <ChevronRight className="ml-auto mr-2 h-4 w-4" />
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};
