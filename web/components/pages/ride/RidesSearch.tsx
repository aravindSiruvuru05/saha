// RidesSearch.tsx
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useIonRouter } from '@ionic/react';
import { DatePicker } from '@/components/ui/date-picker';
import { SwapButton } from '@/components/ui/commonComponents/SwapButton';
import { GoogleSearchCommandInput } from '@/components/ui/commonComponents/GoogleSearchCommandInput';
import { APP_LABELS } from '@/utils/labels';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  ridesStateSlice,
  setFromLocation,
  setRideDate,
  setToLocation,
} from '@/store/ridesSlice';
import { ToggleBar } from '@/components/ui/commonComponents/ToggleBar';

export const RidesSearch = () => {
  const dispatch = useDispatch();
  const router = useIonRouter();

  const fromLocation = useSelector(
    (state: RootState) => state[ridesStateSlice.reducerPath].fromLocation,
  );
  const toLocation = useSelector(
    (state: RootState) => state[ridesStateSlice.reducerPath].toLocation,
  );
  const rideDate = useSelector(
    (state: RootState) => state[ridesStateSlice.reducerPath].rideDate,
  );

  const handleSwapLocations = () => {
    dispatch(setFromLocation(toLocation));
    dispatch(setToLocation(fromLocation));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fromLocation && toLocation && rideDate) {
      try {
        router.push(
          `/search-listings?from=${encodeURIComponent(fromLocation.googlePlaceID)}&to=${encodeURIComponent(toLocation.googlePlaceID)}&date=${encodeURIComponent(rideDate.toISOString())}`,
        );
      } catch (e) {
        console.error('Failed to navigate to search listings', e);
      }
    }
  };

  useEffect(() => {
    // If you need to fetch initial data or perform actions based on route changes, do it here.
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto bg-accent">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ToggleBar
            options={[
              {
                label: 'Find Rides',
                description:
                  'Explore drivers offering rides to your destination.',
                component: (
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      <GoogleSearchCommandInput
                        value={fromLocation?.description}
                        placeholder={APP_LABELS.startLocaitonPlaceholder}
                        onSelect={p => dispatch(setFromLocation(p))}
                      />
                      <SwapButton onSwapLocations={handleSwapLocations} />
                    </div>
                    <GoogleSearchCommandInput
                      value={toLocation?.description}
                      placeholder={APP_LABELS.destinationPlaceholder}
                      onSelect={p => dispatch(setToLocation(p))}
                    />
                    <DatePicker
                      value={rideDate}
                      onChange={val => dispatch(setRideDate(val))}
                    />
                    <Button type="submit" className="w-full">
                      Search
                    </Button>
                  </div>
                ),
              },
              {
                label: 'Find Requests',
                description:
                  'Discover passengers seeking a lift on your route.',
                component: <>No implementation</>,
              },
            ]}
          />
        </form>
      </CardContent>
    </Card>
  );
};
