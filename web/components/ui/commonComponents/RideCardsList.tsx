import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/commonComponents/StarRating';
import { UserCircle2 } from 'lucide-react';
import { getInitials } from '@/utils/common';
import { IFindRidesRes } from '@/store/types';
import { format } from 'date-fns';
import { isBefore } from 'date-fns';
import { NoRidesFound } from './NoRidesFound';

interface Ride {
  id: string;
  user: {
    name: string;
    pic?: string;
  };
  rating?: number;
  from: string;
  to: string;
  startTime: string;
  price: number;
  actualSeats: number;
  availableSeats: number;
}

interface RideCardsListProps {
  rideListings: IFindRidesRes['rides'];
  isBooking?: boolean;
}

const SeatAvailability = ({
  actualSeats,
  availableSeats,
}: {
  actualSeats: number;
  availableSeats: number;
}) => {
  return (
    <div className="flex items-center space-x-1">
      <div className="font-medium">Seats Left </div>
      {Array.from({ length: actualSeats }).map((_, index) => (
        <UserCircle2
          key={index}
          className={`w-5 h-5 ${
            index < availableSeats
              ? 'text-primary fill-primary'
              : 'text-gray-300 fill-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const RideCardsList: React.FC<RideCardsListProps> = ({
  rideListings,
  isBooking,
}) => {
  if (!rideListings || rideListings.length === 0) {
    return <NoRidesFound />;
  }

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4">
      {rideListings.map(ride => {
        const isPastRide = isBefore(
          new Date(ride.details.startTime),
          new Date(),
        );

        return (
          <Card key={ride.id} className="overflow-hidden relative">
            <div
              className={`absolute top-2 right-2 ${isPastRide ? 'bg-red-500 ' : 'bg-green-500 '}text-white text-xs px-2 py-1 rounded-full`}
            >
              {isPastRide ? 'Completed' : 'Upcomming'}
            </div>
            <CardContent className="p-4">
              {isBooking && (
                <div className="flex items-center space-x-4">
                  {ride.user.pic ? (
                    <Image
                      src={ride.user.pic}
                      alt={ride.user.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-white font-bold">
                      {getInitials(ride.user.name)}
                    </div>
                  )}
                  <div className="flex-grow">
                    <div className="font-medium">{ride.user.name}</div>
                    <StarRating rating={4} />
                  </div>
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-medium">From</div>
                  <div>{ride.details.fromLocation.neighborhood}</div>
                </div>
                <div>
                  <div className="font-medium">To</div>
                  <div>{ride.details.toLocation.neighborhood}</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-medium">Time</div>
                  <div>
                    {format(
                      new Date(ride.details.startTime),
                      'MMMM dd, hh:mm a',
                    )}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Price</div>
                  <div>$20</div>
                </div>
              </div>
              {isBooking && (
                <div className="mt-4 flex justify-between items-center">
                  <SeatAvailability
                    actualSeats={ride.details.actualSeats}
                    availableSeats={
                      ride.details.actualSeats - ride.details.seatsFilled
                    }
                  />
                  <Button>Book Now</Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RideCardsList;
