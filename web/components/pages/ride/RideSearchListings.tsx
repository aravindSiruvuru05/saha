import { ArrowLeft, Star, UserCircle2 } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIonRouter } from '@ionic/react';
import { useEffect } from 'react';
import {
  useLazyDistanceDetailsQuery,
  useLazyPlaceDetailsQuery,
  usePlaceDetailsQuery,
  useDistanceDetailsQuery,
} from '@/store/apiSlice';
import { Label } from '@/components/ui/label';

const getInitials = (name: string) => {
  const initials = name
    .split(' ')
    .map(word => word[0].toUpperCase())
    .join('');
  return initials;
};

// Sample data for ride listings
const rideListings = [
  {
    id: 1,
    from: 'New York',
    to: 'Boston',
    time: '10:00 AM',
    user: { name: 'John Doe', pic: '' },
    rating: 4.5,
    price: 50,
    totalSeats: 4,
    availableSeats: 2,
  },
  {
    id: 2,
    from: 'Los Angeles',
    to: 'San Francisco',
    time: '2:00 PM',
    user: { name: 'Jane Smith', pic: '' },
    rating: 4.8,
    price: 65,
    totalSeats: 3,
    availableSeats: 1,
  },
  {
    id: 3,
    from: 'Becon',
    to: 'San Francisco',
    time: '2:00 PM',
    user: { name: 'Arif Akram', pic: '' },
    rating: 4.8,
    price: 65,
    totalSeats: 3,
    availableSeats: 1,
  },
  {
    id: 4,
    from: 'Prof Angeles',
    to: 'San Francisco',
    time: '3:00 PM',
    user: { name: 'Kinh Smith', pic: '' },
    rating: 4.8,
    price: 65,
    totalSeats: 3,
    availableSeats: 1,
  },
  {
    id: 5,
    from: 'Angeles',
    to: 'San Francisco',
    time: '2:00 PM',
    user: { name: 'Jane Smith', pic: '' },
    rating: 4.8,
    price: 65,
    totalSeats: 3,
    availableSeats: 1,
  },
  // Add more ride listings as needed
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= Math.round(rating)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};

const SeatAvailability = ({
  totalSeats,
  availableSeats,
}: {
  totalSeats: number;
  availableSeats: number;
}) => {
  return (
    <div className="flex items-center space-x-1">
      <div className="font-medium">Seats : </div>
      {Array.from({ length: totalSeats }).map((_, index) => (
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

export const RideSearchListings = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const from = query.get('from');
  const to = query.get('to');
  const router = useIonRouter();
  const {
    data: distaceData,
    error: distanceFetchingError,
    isLoading: isDistanceFetching,
  } = useDistanceDetailsQuery({
    originPlaceID: from,
    destinationPlaceID: to,
  });
  const {
    data: fromPlace,
    error: fromFetchingError,
    isLoading: isFromFetching,
  } = usePlaceDetailsQuery({ id: from });
  const {
    data: toPlace,
    error: toFetchingError,
    isLoading: isToFetching,
  } = usePlaceDetailsQuery({ id: to });

  return (
    <div className="max-h-screen flex flex-col bg-gray-100 h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white shadow-md  pb-4 py-4 flex items-center space-x-4 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => router.goBack()}
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Go back</span>
        </Button>
        <div className="flex-grow">
          {!(isFromFetching || isToFetching) && fromPlace && toPlace && (
            <>
              <div className="text-sm font-medium">
                {fromPlace.locality || fromPlace.city}
              </div>
              <div className="text-xs text-gray-500">
                {toPlace.locality || toPlace.city}
              </div>
            </>
          )}
        </div>
      </div>
      {!!distanceFetchingError ? (
        <Label className="mt-[30%] self-center text-center">
          Route doesn&apos;t exist for given locaitons.
        </Label>
      ) : isDistanceFetching || isFromFetching || isToFetching ? (
        <div className="self-center "> Loading...</div>
      ) : (
        <div className="flex-grow overflow-y-auto p-4 space-y-4 ">
          {rideListings.map(ride => (
            <Card key={ride.id} className="overflow-hidden ">
              <CardContent className="p-4">
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
                    <StarRating rating={ride.rating} />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  {/* <div className="flex flex-col items-center">
                  <MapPin className="text-primary w-5 h-5" />
                  <div className="border-l border-gray-300 h-full"></div>
                  <MapPin className="text-primary w-5 h-5" />
                </div> */}
                  <div>
                    <div className="font-medium">From</div>
                    <div>{ride.from}</div>
                  </div>
                  <div>
                    <div className="font-medium">Time</div>
                    <div>{ride.time}</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="font-medium">To</div>
                    <div>{ride.to}</div>
                  </div>

                  <div>
                    <div className="font-medium">Price</div>
                    <div>${ride.price}</div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <SeatAvailability
                    totalSeats={ride.totalSeats}
                    availableSeats={ride.availableSeats}
                  />
                  <Button>Book Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
