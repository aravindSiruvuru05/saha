export const findRideRequestByRequestIDQuery = `
SELECT rr.id AS request_id,
       r.id AS ride_id,
       r.type AS ride_type,
       r.start_time AS ride_start_time,
       r.price AS ride_price,
       r.about AS about,
       r.host_id AS ride_host_id,
       r.distance AS ride_distance,
       r.actual_seats AS ride_actual_seats,
       r.seats_filled AS ride_seats_filled,
       rr.status AS request_status,
       rr.seats AS requested_steats,
       passenger.id AS passenger_id,
       passenger.first_name AS passenger_first_name,
       passenger.last_name AS passenger_last_name,
       passenger.pic AS passenger_pic,
       startLoc.google_place_id AS start_place_id,
       startLoc.neighborhood AS start_neighborhood,
       startLoc.locality AS start_locality,
       startLoc.city AS start_city,
       endLoc.google_place_id AS end_place_id,
       endLoc.neighborhood AS end_neighborhood,
       endLoc.locality AS end_locality,
       endLoc.city AS end_city
FROM ride_requests rr
JOIN rides r ON rr.ride_id = r.id
JOIN users passenger ON rr.passenger_id = passenger.id
JOIN locations startLoc ON r.from_location_id = startLoc.google_place_id
JOIN locations endLoc ON r.to_location_id = endLoc.google_place_id
WHERE rr.id = $1
`

export const updateRideRequestStatusQuery = `
  UPDATE ride_requests
  SET status = $1
  WHERE id = $2
  RETURNING *
`

export const updateRideSeatsCountQuery = `
UPDATE rides
SET seats_filled = seats_filled + 1
WHERE id = $1
`
