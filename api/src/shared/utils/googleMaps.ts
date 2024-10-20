// utils/googleMapsService.ts
import {
  AddressType,
  Client,
  Place,
  TravelMode,
} from '@googlemaps/google-maps-services-js'

export interface IDistanceMatrixParams {
  origins: string
  destinations: string
  mode?: TravelMode
}

export interface IPlaceDetails {
  googlePlaceID: string
  neighborhood: string
  locality: string
  city: string
  state: string
  country: string
  description: string
}

class GoogleMapsService {
  private static instance: GoogleMapsService
  private client: Client

  // Private constructor to prevent direct instantiation
  private constructor() {
    this.client = new Client({})
  }

  // Static method to get the singleton instance
  public static getInstance(): GoogleMapsService {
    if (!GoogleMapsService.instance) {
      GoogleMapsService.instance = new GoogleMapsService()
    }
    return GoogleMapsService.instance
  }

  // Method to get distance matrix data
  public async getDistanceMatrix({
    origins,
    destinations,
  }: IDistanceMatrixParams) {
    try {
      const response = await this.client.distancematrix({
        params: {
          origins: [`place_id:${origins}`] as any,
          destinations: [`place_id:${destinations}`] as any,
          mode: TravelMode.driving,
          key: process.env.GOOGLE_MAPS_API_KEY!,
        },
        timeout: 1000, // Optional timeout in milliseconds
      })
      const element = response.data.rows[0].elements[0]

      if (element.status === 'OK') {
        return {
          distance: element.distance.text,
          duration: element.duration.text,
        }
      } else {
        throw new Error(`Error: ${element.status}`)
      }
    } catch (error: any) {
      throw new Error(`Google Maps API error: ${error.message}`)
    }
  }

  // private extractBiggerArea = (
  //   googleAddress: string,
  // ): Omit<IPlaceDetails, 'placeID'> => {
  //   const terms = googleAddress.split(',').map((t) => t.trim())
  //   const termsLen = terms.length
  //   // Depending on the length of the terms, map them to neighborhood, city, state, country
  //   const country = termsLen > 0 ? terms[termsLen - 1] : ''
  //   const state = termsLen > 1 ? terms[termsLen - 2] : ''
  //   const city = termsLen > 2 ? terms[termsLen - 3] : ''
  //   const locality = termsLen > 3 ? terms[termsLen - 4] : ''
  //   const neighborhood = termsLen > 4 ? terms[termsLen - 5] : ''

  //   // Return the larger area like city and beyond
  //   return {
  //     neighborhood: neighborhood, // Example: "Raja Rajeshwara Nagar"
  //     locality,
  //     city, // Example: "Kondapur"
  //     state, // Example: "Telangana"
  //     country, // Example: "India"
  //     description: googleAddress,
  //   }
  // }

  public async getPlaceDetails(googlePlaceId: string): Promise<IPlaceDetails> {
    try {
      const response = await this.client.placeDetails({
        params: {
          place_id: googlePlaceId,
          key: process.env.GOOGLE_MAPS_API_KEY!,
          fields: ['name', 'formatted_address', 'address_components'],
        },
      })
      console.log(response.data, 'google res ======')
      if (
        response.data.status === 'OK' &&
        response.data.result.formatted_address
      ) {
        const place = this.extractBiggerAreaFromGeocodeResult(
          response.data.result,
        )
        return place
      } else {
        throw new Error(`Error fetching place details: ${response.data.status}`)
      }
    } catch (error) {
      throw new Error(`Google Places API error: ${(error as any).message}`)
    }
  }

  public extractBiggerAreaFromGeocodeResult = (
    result: Place,
  ): IPlaceDetails => {
    const addressComponents = result.address_components
    if (!addressComponents) return {} as IPlaceDetails
    const placeID = result.place_id || ''
    const description = result.formatted_address || ''

    let neighborhood = ''
    let locality = ''
    let city = ''
    let state = ''
    let country = ''

    for (const component of addressComponents) {
      const types = component.types
      if (types.includes(AddressType.sublocality)) {
        // some times if we search madhapur directly insted of exact place it comes in 1st as sublocality which is our base location
        neighborhood = component.long_name
      } else if (types.includes(AddressType.neighborhood)) {
        neighborhood = component.long_name
      } else if (types.includes(AddressType.locality)) {
        locality = component.long_name
      } else if (types.includes(AddressType.administrative_area_level_3)) {
        // we take only one of these 2 or 3
        city = component.long_name
      } else if (types.includes(AddressType.administrative_area_level_2)) {
        city = component.long_name
      } else if (types.includes(AddressType.administrative_area_level_1)) {
        state = component.long_name
      } else if (types.includes(AddressType.country)) {
        country = component.long_name
      }
    }

    if (!placeID) {
      console.log('place id missing for:', neighborhood, locality)
    }

    return {
      googlePlaceID: placeID,
      neighborhood,
      locality,
      city,
      state,
      country,
      description,
    }
  }
}

export default GoogleMapsService
