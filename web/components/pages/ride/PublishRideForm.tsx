'use client';

import { useState } from 'react';
import { MapPin, Calendar, Clock, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from 'react-responsive';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { SingleSelect } from '@/components/ui/commonComponents/SingleSelect';
import { GoogleSearchCommandInput } from '@/components/ui/commonComponents/GoogleSearchCommandInput';
import { APP_LABELS } from '@/utils/labels';
import { IPlaceDetails } from '@/utils/google_places';
import { useCreatePostMutation } from '@/store/apiSlice';
import { start } from 'repl';

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

const steps = [
  {
    id: 1,
    title: 'Personal Info',
  },
  { id: 2, title: 'Contact' },
];

export const PublishRideForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [fromLocation, setFromLocation] = useState<IPlaceDetails | null>(null);
  const [toLocation, setToLocation] = useState<IPlaceDetails | null>(null);
  const [rideDate, setRideDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState<string>('');
  const [availableSeats, setAvailableSeats] = useState<string>('');
  const [createPost, { isLoading: isCreating, error }] =
    useCreatePostMutation();
  const [disableSubmit, setDisableSubmit] = useState(false);
  // const isSmallScreen = useMediaQuery({ query: '(min-width: 640px)' });
  // const isMediumScreen = useMediaQuery({ query: '(min-width: 768px)' });
  // const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' });

  const [stopovers, setStopovers] = useState<string[]>([]);

  const handleAddStopover = (location: string) => {
    if (!stopovers.includes(location)) {
      setStopovers(prev => [...prev, location]);
    }
  };

  const handleRemoveStopover = (stopover: string) => {
    setStopovers(prev => prev.filter(s => s !== stopover));
  };

  const combineDateAndTime = (
    rideDate?: Date,
    startTime?: string,
  ): string | null => {
    if (!rideDate || !startTime) return null;
    // Create a new Date object from the rideDate
    const date = new Date(rideDate);

    // Extract hours and minutes from the startTime (assumes format "HH:mm")
    const [hours, minutes] = startTime.split(':').map(Number);

    // Set the hours and minutes on the date object
    date.setHours(hours, minutes, 0, 0); // Set seconds and milliseconds to zero

    // Convert to ISO string
    const isoString = date.toISOString();

    return isoString;
  };

  const handleNext = async () => {
    console.log(
      combineDateAndTime(rideDate, startTime),
      // new Date(`${rideDate}T${startTime}:00Z`).toISOString(),
    );
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === steps.length) {
      if (!fromLocation || !toLocation) {
        console.error('error in from and to lation');
        return;
      }
      try {
        // setDisableSubmit(true);
        const res = await createPost({
          start_location: fromLocation.description,
          end_location: toLocation.description,
          about: '',
          actual_seats: parseInt(availableSeats, 10),
          start_time: combineDateAndTime(rideDate, startTime) || '',
        }).unwrap();
      } catch (e) {}
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const items = Array.from({ length: 24 }, (_, index) => {
    const hour = index.toString().padStart(2, '0'); // Format hours to two digits
    const period = index < 12 ? 'AM' : 'PM'; // Determine AM/PM
    const displayHour = index % 12 === 0 ? 12 : index % 12; // Convert to 12-hour format

    return {
      id: `${index + 1}`,
      value: `${hour}:00`,
      label: `${displayHour.toString().padStart(2, '0')}:00 ${period}`,
    };
  });

  return (
    <div className="min-h-[100%] bg-transparent p-4 max-w-[1300px] w-[100%]">
      <Card className="bg-accent">
        <CardHeader>
          <CardTitle>Publish a Ride</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 items-center">
          {currentStep === 1 && (
            <>
              <div className="flex flex-col md:flex-row gap-3">
                <GoogleSearchCommandInput
                  label="From"
                  placeholder={APP_LABELS.startLocaitonPlaceholder}
                  onSelect={place => setFromLocation(place)}
                  value={fromLocation?.description}
                />
                <GoogleSearchCommandInput
                  label="To"
                  placeholder={APP_LABELS.destinationPlaceholder}
                  onSelect={place => setToLocation(place)}
                  value={toLocation?.description}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <DatePicker
                  value={rideDate}
                  onChange={val => setRideDate(val)}
                />
                <SingleSelect
                  label="Start Time"
                  value={startTime}
                  placeholder="Select time"
                  items={items}
                  onSelect={setStartTime}
                />
              </div>
            </>
          )}
          {currentStep === 2 && (
            <>
              <SingleSelect
                placeholder="Select Seats Available"
                value={availableSeats}
                label="Available Seats"
                items={Array.from({ length: 6 }, (_, index) => ({
                  id: `${index + 1}`,
                  value: `${(index + 1).toString().padStart(2, '0')}`,
                  label: `${(index + 1).toString().padStart(2, '0')}`,
                }))}
                onSelect={setAvailableSeats}
              />
              <div className="space-y-2">
                <Label>Stopovers</Label>
                <Combobox />
                <p className="text-sm text-muted-foreground">
                  Add more stopovers to get more passengers
                </p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button onClick={handleNext} disabled={disableSubmit}>
            {currentStep === steps.length ? 'Submit' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
