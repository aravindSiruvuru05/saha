'use client';

import { useState } from 'react';
import { Check, User, Mail, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const steps = [
  {
    id: 1,
    title: 'Personal Info',
    icon: User,
    component: (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" placeholder="Enter your first name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" placeholder="Enter your last name" />
        </div>
      </div>
    ),
  },
  { id: 2, title: 'Contact', icon: Mail },
  { id: 3, title: 'Security', icon: Lock },
];

export const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(1);

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
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center relative">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2',
                  currentStep >= step.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-gray-300',
                )}
              >
                {currentStep > step.id ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <step.icon className="w-6 h-6" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-1 w-full absolute top-5 left-1/2 transform -translate-x-1/2',
                    currentStep > step.id ? 'bg-primary' : 'bg-gray-300',
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map(step => (
            <div key={step.id} className="text-center">
              <p className="text-sm font-medium">{step.title}</p>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && steps[0].component}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
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
