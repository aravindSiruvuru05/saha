import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/commonComponents/StarRating';
import { UserCircle2 } from 'lucide-react';
import { ISearchRidesRes } from '@/store/types';
import { format } from 'date-fns';
import { isBefore } from 'date-fns';
import { NoRidesFound } from './NoRidesFound';
import {
  getFullName,
  getInitialsOfName,
  getLocationLable,
} from '@/utils/common';
import { useIonRouter } from '@ionic/react';
import { ScrollArea } from '../scroll-area';

interface RideCardsListProps {
  rideListings?: ISearchRidesRes['rides'];
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
  const router = useIonRouter();

  const handleBookNowClick = async (rideID: string) => {
    if (rideID) {
      try {
        router.push(`/ride-details?id=${encodeURIComponent(rideID)}`);
      } catch (e) {
        console.error('Failed to navigate to search details', e);
      }
    }
  };

  if (!rideListings || rideListings.length === 0) {
    return <NoRidesFound />;
  }

  return (
    <ScrollArea className="flex-grow overflow-auto pb-28">
      <div className="space-y-4">
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
                    {ride.host.pic ? (
                      <Image
                        src={ride.host.pic}
                        alt={ride.host.firstName}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-white font-bold">
                        {getInitialsOfName(ride.host)}
                      </div>
                    )}
                    <div className="flex-grow">
                      <div className="font-medium">
                        {getFullName(ride.host)}
                      </div>
                      <StarRating rating={4} />
                    </div>
                  </div>
                )}
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="font-medium">From</div>
                    <div>{getLocationLable(ride.details.fromLocation)}</div>
                  </div>
                  <div>
                    <div className="font-medium">To</div>
                    <div>{getLocationLable(ride.details.toLocation)}</div>
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
                    <Button
                      onClick={e => {
                        e.preventDefault();
                        handleBookNowClick(ride.id);
                      }}
                    >
                      Book Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default RideCardsList;
