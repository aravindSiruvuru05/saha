export interface IPlaceDetails {
  googlePlaceID: string;
  neighborhood: string;
  locality: string;
  city: string;
  state?: string;
  country?: string;
  description?: string;
}

export interface IDistanceRes {
  distance: string;
  duration: string;
}
