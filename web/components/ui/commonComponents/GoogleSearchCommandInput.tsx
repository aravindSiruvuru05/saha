'use client';

import React, { useEffect, useState } from 'react';

import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Input } from '../input';
import { useDebouncedCallback } from 'use-debounce';
import { ChevronRight, Locate, MapPin, Loader2Icon } from 'lucide-react';
import {
  IPlaceDetails,
  getPlacePredictions,
  getCurrentLocationDetails,
  getPlaceDetailsByPlaceID,
} from '@/utils/google_places';
import { Spinner } from './Spinner';
import { Label } from '../label';

interface IGoogleSearchCommandInput {
  label?: string;
  value?: string;
  onSelect: (place: IPlaceDetails) => void;
  placeholder: string;
}

export const GoogleSearchCommandInput = ({
  value,
  label,
  onSelect,
  placeholder,
}: IGoogleSearchCommandInput) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = useDebouncedCallback(async (e: any) => {
    const val = e.target.value;
    if (val) {
      const results = await getPlacePredictions(val);
      setSuggestions(results);
    }
  }, 500);

  const handleLocationSelect = async (
    suggestion: google.maps.places.AutocompletePrediction | string,
  ) => {
    if (typeof suggestion !== 'string') {
      // If a suggestion is selected, fetch additional details using reverse geocoding
      try {
        const placeDetails = await getPlaceDetailsByPlaceID(
          suggestion.place_id,
        );
        onSelect(placeDetails);
        setOpen(false);
        setInputValue(suggestion.description);
      } catch (error) {
        console.error('Error getting place details:', error);
        alert('Unable to retrieve place details. Please try again.');
      }
    } else if (suggestion === 'current_location') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            setIsFetchingLocation(true);
            const { latitude, longitude } = position.coords;
            try {
              const placeDetails = await getCurrentLocationDetails(
                latitude,
                longitude,
              );
              onSelect(placeDetails);
              setOpen(false);

              setInputValue(placeDetails.description);
            } catch (error) {
              console.error('Error getting location details:', error);
              alert('Unable to retrieve location details. Please try again.');
            } finally {
              setIsFetchingLocation(false);
            }
          },
          error => {
            console.error('Error getting current location:', error);
            alert('Unable to retrieve current location. Please try again.');
            setIsFetchingLocation(false);
          },
        );
      } else {
        alert('Geolocation is not supported by this browser.');
        setIsFetchingLocation(true);
      }
    }
  };

  return (
    <div className="w-[100%]">
      <Label htmlFor="date">{label}</Label>
      <div className="flex items-center border rounded-md shadow-sm bg-white gap-2 w-full max-w-[400px]">
        <MapPin className="ml-2 text-gray-500 h-4 w-4" />
        <Input
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="border-hidden shadow-none"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search Location..."
          onSelect={handleInputChange}
        />
        <CommandList>
          <CommandItem
            onSelect={() => handleLocationSelect('current_location')}
          >
            <div className="w-full flex justify-between">
              <div className="flex">
                <Locate className="mr-2 h-4 w-4" />
                <span>Pick current location.</span>
              </div>
              {isFetchingLocation && <Spinner />}
            </div>
          </CommandItem>
          <CommandSeparator />
          <CommandGroup heading="search results">
            {suggestions.map(s => (
              <CommandItem
                key={s.place_id}
                id={s.place_id}
                onSelect={() => {
                  try {
                    handleLocationSelect(s);
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setIsFetchingLocation(false);
                  }
                }}
              >
                <span>{s.description}</span>
                <ChevronRight className="ml-auto mr-2 h-4 w-4" />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};
