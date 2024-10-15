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

// New function to get current location details using reverse geocoding
export const getCurrentLocationDetails = async (
  latitude: number,
  longitude: number,
): Promise<IPlaceDetails> => {
  return new Promise((resolve, reject) => {
    loadGooglePlacesAPI().then(() => {
      const geocoder = new google.maps.Geocoder();
      const latLng = new google.maps.LatLng(latitude, longitude);

      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const placeDetails = extractBiggerAreaFromGeocodeResult(results[0]);
          resolve(placeDetails);
        } else {
          reject(status);
        }
      });
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

// Extract details from a geocode result
export const extractBiggerAreaFromGeocodeResult = (
  result: google.maps.places.PlaceResult,
): IPlaceDetails => {
  const addressComponents = result.address_components;
  if (!addressComponents) return {} as IPlaceDetails;
  const placeID = result.place_id || '';
  const description = result.formatted_address || '';

  let neighborhood = '';
  let locality = '';
  let city = '';
  let state = '';
  let country = '';

  for (const component of addressComponents) {
    const types = component.types;
    if (types.includes('neighborhood')) {
      neighborhood = component.long_name;
    } else if (types.includes('locality')) {
      locality = component.long_name;
    } else if (types.includes('administrative_area_level_2')) {
      city = component.long_name;
    } else if (types.includes('administrative_area_level_1')) {
      state = component.long_name;
    } else if (types.includes('country')) {
      country = component.long_name;
    }
  }

  return {
    placeID,
    neighborhood,
    locality,
    city,
    state,
    country,
    description,
  };
};

export const getPlaceDetailsByPlaceID = (
  placeID: string,
): Promise<IPlaceDetails> => {
  return new Promise((resolve, reject) => {
    loadGooglePlacesAPI().then(() => {
      const service = new google.maps.places.PlacesService(
        document.createElement('div'),
      );

      service.getDetails({ placeId: placeID }, (result, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          result &&
          result.address_components != undefined
        ) {
          // Check if result is not null before calling extractBiggerAreaFromGeocodeResult
          const placeDetails = extractBiggerAreaFromGeocodeResult(result);
          resolve({
            ...placeDetails,
            placeID,
            description: placeDetails.description,
          });
        } else {
          reject(
            new Error(
              `Failed to get place details. Status: ${status}, Result is null: ${result === null}`,
            ),
          );
        }
      });
    });
  });
};
