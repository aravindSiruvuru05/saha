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
  { id: 3, title: 'Security' },
];

export const PublishRideForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const isSmallScreen = useMediaQuery({ query: '(min-width: 640px)' });
  const isMediumScreen = useMediaQuery({ query: '(min-width: 768px)' });
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' });
  console.log(isLargeScreen, isMediumScreen, isSmallScreen);
  const [date, setDate] = useState<Date>();
  const [stopovers, setStopovers] = useState<string[]>([]);

  const handleAddStopover = (location: string) => {
    if (!stopovers.includes(location)) {
      setStopovers(prev => [...prev, location]);
    }
  };

  const handleRemoveStopover = (stopover: string) => {
    setStopovers(prev => prev.filter(s => s !== stopover));
  };
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
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
                  onSelect={place => console.log(place)}
                />
                <GoogleSearchCommandInput
                  onSelect={place => console.log(place)}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <DatePicker value={date} onChange={val => setDate(val)} />
                <SingleSelect label="Time" />
              </div>
            </>
          )}
          {currentStep === 2 && (
            <>
              <SingleSelect label="Available Seats" />
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
          <Button onClick={handleNext} disabled={currentStep === steps.length}>
            {currentStep === steps.length ? 'Submit' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
