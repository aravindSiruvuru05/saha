import { Button } from '@/components/ui/button';
import { NoRidesFound } from '@/components/ui/commonComponents/NoRidesFound';
import RideCardsList from '@/components/ui/commonComponents/RideCardsList';
import { useGetMyRidesQuery } from '@/store/apiSlice';
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
      <div className="sticky top-0 z-10 bg-white shadow-md font-bold mb-10  pb-4 py-4 flex items-center space-x-4 px-4">
        My Rides
      </div>
      {!!ridePosts ? (
        <RideCardsList rideListings={ridePosts} />
      ) : (
        <NoRidesFound simdple />
      )}
    </div>
  );
};
