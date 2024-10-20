import { ArrowLeft, Star, UserCircle2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIonRouter } from '@ionic/react';
import { useFindRidesQuery, useDistanceDetailsQuery } from '@/store/apiSlice';
import RideCardsList from '@/components/ui/commonComponents/RideCardsList';
import { Loading } from '@/components/ui/commonComponents/Loading';

export const RideSearchListings = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const fromID = query.get('from');
  const toID = query.get('to');
  const rideDate = query.get('date');

  const router = useIonRouter();
  const {
    data: distaceData,
    error: distanceFetchingError,
    isLoading: isDistanceFetching,
  } = useDistanceDetailsQuery({
    originPlaceID: fromID,
    destinationPlaceID: toID,
  });

  const {
    data: ridesData,
    error: ridesFetchingError,
    isLoading: isRidesFetching,
  } = useFindRidesQuery({
    fromPlaceID: fromID!,
    toPlaceID: toID!,
    startDate: rideDate!,
  });

  if (!fromID || !toID || !rideDate) {
    router.push('/rides-home', 'root');
    return <div />;
  }

  //TODO: get the distance and time between the from and to locaitons from BE with distance matrix

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
          {!isRidesFetching && ridesData && (
            <>
              <div className="text-sm font-medium">
                {ridesData.fromLocation}
              </div>
              <div className="text-xs text-gray-500">
                {ridesData.toLocation}
              </div>
            </>
          )}
        </div>
      </div>
      {isDistanceFetching || isRidesFetching ? (
        <Loading />
      ) : (
        <RideCardsList rideListings={ridesData?.rides!} isBooking />
      )}
    </div>
  );
};
