import { ArrowLeft, User, MapPin, Calendar, Users, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  useAcceptRequestMutation,
  useDeclineRequestMutation,
  usePendingRequestsQuery,
} from '@/store/apiSlice';
import {
  getFullName,
  getInitialsOfName,
  getLocationLable,
} from '@/utils/common';
import { format } from 'date-fns';
import { useIonRouter } from '@ionic/react';
import { useEffect } from 'react';

// Mock data for pendingRequests (replace with actual data fetching in a real application)
const notifications = [
  {
    id: 1,
    requesterName: 'Alice Johnson',
    requesterAvatar: '/placeholder.svg?height=40&width=40',
    seatsRequested: 2,
    from: 'New York',
    to: 'Boston',
    date: '2023-05-20',
    seatsLeft: 3,
  },
  {
    id: 2,
    requesterName: 'Bob Smith',
    requesterAvatar: '/placeholder.svg?height=40&width=40',
    seatsRequested: 1,
    from: 'Los Angeles',
    to: 'San Francisco',
    date: '2023-05-22',
    seatsLeft: 2,
  },
  // Add more notifications as needed
];

export const Notifications = () => {
  const {
    data: pendingRequests,
    error: ridesFetchingError,
    isLoading: isRidesFetching,
    refetch,
  } = usePendingRequestsQuery({}, { refetchOnFocus: true });

  const [
    acceptRequest,
    {
      isLoading: isAccepting,
      error: errorCancelRide,
      isSuccess: isAcceptSuccess,
    },
  ] = useAcceptRequestMutation();

  const [
    declineRequest,
    { isLoading: isDeclining, isSuccess: isDeclineSuccess },
  ] = useDeclineRequestMutation();

  const router = useIonRouter();

  useEffect(() => {
    if (isAcceptSuccess || isDeclineSuccess) {
      refetch();
    }
  }, [isAcceptSuccess, isDeclineSuccess, refetch]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar with back button */}
      <header className="bg-background border-b h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => router.goBack()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <span>Notificaitons</span>
        </div>
      </header>

      {pendingRequests && pendingRequests.length > 0 ? (
        <div className="p-4 space-y-4">
          {pendingRequests.map(pendingRequest => (
            <Card key={pendingRequest.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={pendingRequest.requester.pic}
                        alt={getFullName(pendingRequest.requester)}
                      />
                      <AvatarFallback>
                        {getInitialsOfName(pendingRequest.requester)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold">
                        {getFullName(pendingRequest.requester)}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Requesting 1 seat
                        {/* {pendingRequests.seatsRequested > 1 ? 's' : ''} */}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    <Users className="mr-1 h-3 w-3" />
                    {pendingRequest?.ridePost?.details?.actualSeats &&
                    pendingRequest.ridePost?.details?.seatsFilled
                      ? pendingRequest?.ridePost?.details?.actualSeats -
                        pendingRequest.ridePost?.details?.seatsFilled
                      : 0}{' '}
                    left
                  </Badge>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      From:{' '}
                      {getLocationLable(
                        pendingRequest.ridePost.details?.fromLocation,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      To:{' '}
                      {getLocationLable(
                        pendingRequest.ridePost.details?.toLocation,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      Date:{' '}
                      {pendingRequest.ridePost.details?.startTime &&
                        format(
                          new Date(pendingRequest.ridePost.details?.startTime),
                          'MMMM dd, hh:mm a',
                        )}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      declineRequest({ requestID: pendingRequest.id })
                    }
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={() =>
                      acceptRequest({ requestID: pendingRequest.id })
                    }
                  >
                    Accept {pendingRequest.ridePost.id}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div>No pending requests on your rides.</div>
      )}
    </div>
  );
};
