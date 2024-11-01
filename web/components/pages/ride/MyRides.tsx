import { NoRidesFound } from '@/components/ui/commonComponents/NoRidesFound';
import RideCardsList from '@/components/ui/commonComponents/RideCardsList';
import { useGetMyRidesQuery } from '@/store/ridesSlice';
import React from 'react';

export const MyRides = () => {
  const {
    data: ridePosts,
    error,
    isLoading: isFetchingRides,
  } = useGetMyRidesQuery({}, { refetchOnFocus: true });

  if (isFetchingRides) {
    return <div>Fetching your rides...</div>;
  }
  if (error) {
    return <div>Error fetching rides...</div>;
  }

  return (
    <div className="w-full h-screen container mx-auto">
      {!!ridePosts ? (
        <RideCardsList rideListings={ridePosts} />
      ) : (
        <NoRidesFound />
      )}
    </div>
  );
};
