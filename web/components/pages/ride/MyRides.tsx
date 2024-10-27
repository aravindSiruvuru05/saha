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
    <div className="w-full h-screen container mx-auto mt-16">
      {!!ridePosts ? (
        <RideCardsList rideListings={ridePosts} />
      ) : (
        <NoRidesFound simdple />
      )}
      <div className="fixed top-16 left-0 right-0 p-4 bg-white container mx-auto max-w-xl">
        <h2 className=" text-xl font-semibold mb-4 pl-4 m-auto">My Rides</h2>
      </div>
    </div>
  );
};
