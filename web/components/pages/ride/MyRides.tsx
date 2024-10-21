// components/HomePage/Profile.tsx

import RideCardsList from '@/components/ui/commonComponents/RideCardsList';
import { useGetMyRidesQuery } from '@/store/apiSlice';
import React from 'react';

export const MyRides = () => {
  const {
    data: ridePosts,
    error,
    isLoading: isFetchingRides,
  } = useGetMyRidesQuery({});

  if (isFetchingRides) {
    return <div>Fetching your rides...</div>;
  }
  if (error || !ridePosts) {
    return <div>Error fetching rides...</div>;
  }

  return (
    <div className="w-full max-w-lg h-screen">
      <h2 className="text-xl font-semibold mb-4 pl-4">My Rides</h2>
      <RideCardsList rideListings={ridePosts} />
    </div>
  );
};
