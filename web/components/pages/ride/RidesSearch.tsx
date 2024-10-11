import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useIonRouter } from '@ionic/react';
import { DatePicker } from '@/components/ui/date-picker';
import { SwapButton } from '@/components/ui/commonComponents/SwapButton';
import { GoogleSearchCommandInput } from '@/components/ui/commonComponents/GoogleSearchCommandInput';
import { IPlaceDetails } from '@/utils/google_places';

export const RidesSearch = () => {
  const [fromLocation, setFromLocation] = useState<IPlaceDetails | null>(null);
  const [toLocation, setToLocation] = useState<IPlaceDetails | null>(null);
  const [rideDate, setRideDate] = useState<Date | undefined>();
  const router = useIonRouter(); // Use IonRouter for navigation

  // Call the API hook
  const handleSwapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fromLocation && toLocation) {
      try {
        router.push(
          `/search-listings?from=${encodeURIComponent(fromLocation.placeID)}&to=${encodeURIComponent(toLocation.placeID)}`,
        );
      } catch (e) {
        console.error('Failed to fetch distance matrix', e);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-5 bg-accent">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex gap-3">
              <GoogleSearchCommandInput onSelect={p => setFromLocation(p)} />
              <SwapButton onSwapLocations={handleSwapLocations} />
            </div>
            <GoogleSearchCommandInput onSelect={p => setToLocation(p)} />
            <DatePicker value={rideDate} onChange={val => setRideDate(val)} />
          </div>
          <Button type="submit" className="w-full">
            Search
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
