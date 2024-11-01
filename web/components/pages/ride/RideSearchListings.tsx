import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIonRouter } from '@ionic/react';
import RideCardsList from '@/components/ui/commonComponents/RideCardsList';
import { Loading } from '@/components/ui/commonComponents/Loading';
import { useEffect } from 'react';
import { getLocationLable, getStartAndEndOfDay } from '@/utils/common';
import { useSearchRidesQuery } from '@/store/ridesSlice';

export const RideSearchListings = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const fromID = query.get('from');
  const toID = query.get('to');
  const rideDate = decodeURIComponent(query.get('date') || '');

  const router = useIonRouter();

  const { startOfLocalDayISO, endOfLocalDayISO } =
    getStartAndEndOfDay(rideDate);

  const {
    data: ridesData,
    error: ridesFetchingError,
    isLoading: isRidesFetching,
    refetch,
  } = useSearchRidesQuery(
    {
      fromPlaceID: fromID!,
      toPlaceID: toID!,
      startDate: startOfLocalDayISO!,
      endDate: endOfLocalDayISO!,
    },
    { skip: !startOfLocalDayISO || !endOfLocalDayISO },
  );

  useEffect(() => {
    if (fromID && toID && startOfLocalDayISO && endOfLocalDayISO) {
      refetch();
    }
  }, [fromID, toID, startOfLocalDayISO, endOfLocalDayISO, refetch]);

  return (
    <>
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
      <div className="flex flex-col container p-4 mx-auto ">
        {isRidesFetching ? (
          <Loading />
        ) : (
          <RideCardsList rideListings={ridesData?.rides} isBooking />
        )}
      </div>
    </>
  );
};
