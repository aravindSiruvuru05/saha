'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  User,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIonRouter } from '@ionic/react';
import { useGetRideByIDQuery, useJoinRideMutation } from '@/store/apiSlice';
import {
  getFullName,
  getInitialsOfName,
  getLocationLable,
} from '@/utils/common';
import { Label } from '@/components/ui/label';
import { Loading } from '@/components/ui/commonComponents/Loading';
import { format } from 'date-fns';
import { RideRequestStatus } from '@/store/types';

function ExpandableCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between">
          {title}
          <ChevronRight
            className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          />
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent
          className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}
        >
          {children}
        </CardContent>
      )}
    </Card>
  );
}

export const RideDetails = () => {
  const router = useIonRouter();
  const query = new URLSearchParams(location.search);
  const [
    joinRide,
    { isLoading: isCreating, error: joinRideError, data, isSuccess },
  ] = useJoinRideMutation();
  const rideID = query.get('id');
  const {
    data: rideDetails,
    error,
    isLoading: isFetchingRide,
    refetch,
  } = useGetRideByIDQuery({ id: rideID! });

  useEffect(() => {
    if (rideID || isSuccess) {
      refetch();
    }
  }, [rideID, isSuccess, refetch]);

  if (isFetchingRide) {
    return <Loading />;
  }

  if (error || !rideDetails || !rideID) {
    return <Label> Something went wrong</Label>;
  }

  const handleJoinRide = async () => {
    const res = await joinRide({ rideID });
    console.log(res);
  };

  return (
    <div>
      <div className="sticky top-0 z-10 bg-white shadow-md pb-4 py-4 flex items-center space-x-4 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={e => {
            e.preventDefault();
            router.goBack();
          }}
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Go back</span>
        </Button>
      </div>
      <div className="max-h-screen container mx-auto bg-background flex flex-col">
        <ScrollArea className="flex-grow overflow-auto">
          <div className="container p-4 pb-40 space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={rideDetails.user.pic}
                  alt={getInitialsOfName(rideDetails.user)}
                />
                <AvatarFallback>
                  {getInitialsOfName(rideDetails.user)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">
                  {getFullName(rideDetails.user)}
                </h2>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>4</span>
                </div>
              </div>
            </div>

            <Card className="overflow-hidden relative">
              <CardHeader className="cursor-pointer">
                <CardTitle className="flex items-center justify-between">
                  Ride Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-muted-foreground">{rideDetails.about}</p>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="overflow-hidden relative">
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-primary" />
                      <span>
                        From:{' '}
                        {getLocationLable(rideDetails.details.fromLocation)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-primary" />
                      <span>
                        To: {getLocationLable(rideDetails.details.toLocation)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-primary" />
                      <span>
                        Date:{' '}
                        {format(
                          new Date(rideDetails.details.startTime),
                          'MMMM dd, hh:mm a',
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden relative">
                <CardHeader className="cursor-pointer">
                  <CardTitle className="flex items-center justify-between">
                    Stopovers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {['Newyork', 'Dallas', 'Dummy', 'Values'].map(
                      (stopover, index) => (
                        <li key={index} className="flex items-center">
                          <MapPin className="w-5 h-5 mr-2 text-primary" />
                          <span>{stopover}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 w-[100vw] bg-background shadow-md container mx-auto">
        <Button className="w-full" onClick={handleJoinRide}>
          {rideDetails?.currUserReqStatus === RideRequestStatus.PENDING
            ? 'Request Sent 🥳. Click here to cancel.'
            : 'Join Ride'}
        </Button>
      </div>
    </div>
  );
};
