import googleMapsService, {
  IDistanceMatrixParams,
  IPlaceDetails,
} from '../../shared/utils/googleMaps'

export const getPlaceDetails = async (
  googlePlaceID: string,
): Promise<IPlaceDetails> => {
  const placeDetails = await googleMapsService
    .getInstance()
    .getPlaceDetails(googlePlaceID)
  return placeDetails
}

export const getdistanceData = async ({
  origins,
  destinations,
}: IDistanceMatrixParams) => {
  const distanceData = await googleMapsService.getInstance().getDistanceMatrix({
    origins,
    destinations,
  })
  return distanceData
}
