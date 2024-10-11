// utils/googlePlaces.ts
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: 'AIzaSyB8WhOZ11Lnt4V6WzpdlkE_WcpdkEjMdj4', // Replace with your API key
  libraries: ['places'],
});

export const loadGooglePlacesAPI = async () => {
  return loader.load();
};

export const getPlacePredictions = (
  input: string,
): Promise<google.maps.places.AutocompletePrediction[]> => {
  return new Promise((resolve, reject) => {
    loadGooglePlacesAPI().then(() => {
      const autocompleteService = new google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions(
        { input },
        (predictions, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            reject(status);
            return;
          }
          resolve(predictions || []);
        },
      );
    });
  });
};

export interface IPlaceDetails {
  placeID: string;
  neighborhood: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  description: string;
}
export const extractBiggerArea = (
  place: google.maps.places.AutocompletePrediction,
): IPlaceDetails => {
  const { terms, place_id, description } = place;
  const len = terms.length;

  // Depending on the length of the terms, map them to neighborhood, city, state, country
  const country = len > 0 ? terms[len - 1].value : '';
  const state = len > 1 ? terms[len - 2].value : '';
  const city = len > 2 ? terms[len - 3].value : '';
  const locality = len > 3 ? terms[len - 4].value : '';
  const neighborhood = len > 4 ? terms[len - 5].value : '';

  // Return the larger area like city and beyond
  return {
    placeID: place_id,
    neighborhood: neighborhood, // Example: "Raja Rajeshwara Nagar"
    locality,
    city, // Example: "Kondapur"
    state, // Example: "Telangana"
    country, // Example: "India"
    description,
  };
};
