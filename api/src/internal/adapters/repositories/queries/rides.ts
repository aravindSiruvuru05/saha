export const findRidesByUserIDQuery = `
SELECT r.*, 
      u.id AS host_id, 
      u.first_name AS first_name, 
      u.last_name AS last_name,
      u.pic AS user_pic,
      startLoc.google_place_id AS start_place_id, 
      startLoc.neighborhood AS start_neighborhood, 
      startLoc.locality AS start_locality, 
      startLoc.city AS start_city, 
      endLoc.google_place_id AS end_place_id, 
      endLoc.neighborhood AS end_neighborhood, 
      endLoc.locality AS end_locality, 
      endLoc.city AS end_city,
      rr.status AS request_status
FROM rides r
LEFT JOIN ride_requests rr ON rr.ride_id = r.id AND rr.requester_id = $1
JOIN locations startLoc ON r.from_location_id = startLoc.google_place_id
JOIN locations endLoc ON r.to_location_id = endLoc.google_place_id
JOIN users u ON r.host_id = u.id
WHERE r.host_id = $1 OR rr.requester_id = $1
ORDER BY r.start_time DESC
`
export const findRidesQuery = `
SELECT r.*, 
      u.id AS host_id, 
      u.first_name AS first_name, 
      u.last_name AS last_name,
      u.pic AS user_pic,
      startLoc.google_place_id AS start_place_id, 
      startLoc.neighborhood AS start_neighborhood, 
      startLoc.locality AS start_locality, 
      startLoc.city AS start_city, 
      endLoc.google_place_id AS end_place_id, 
      endLoc.neighborhood AS end_neighborhood, 
      endLoc.locality AS end_locality, 
      endLoc.city AS end_city,
      rr.status AS request_status
FROM rides r
JOIN locations startLoc ON r.from_location_id = startLoc.google_place_id
JOIN locations endLoc ON r.to_location_id = endLoc.google_place_id
JOIN users u ON r.host_id = u.id
LEFT JOIN ride_requests rr ON rr.ride_id = r.id AND rr.requester_id = $1
WHERE 1 = 1
`
export const findRideByID = `
SELECT r.*, 
       u.id AS host_id, 
       u.first_name AS first_name, 
       u.last_name AS last_name,
       u.pic AS user_pic,
       startLoc.google_place_id AS start_place_id, 
       startLoc.neighborhood AS start_neighborhood, 
       startLoc.locality AS start_locality, 
       startLoc.city AS start_city, 
       endLoc.google_place_id AS end_place_id,
       endLoc.neighborhood AS end_neighborhood, 
       endLoc.locality AS end_locality, 
       endLoc.city AS end_city,
       rr.status AS request_status
FROM rides r
JOIN locations startLoc ON r.from_location_id = startLoc.google_place_id
JOIN locations endLoc ON r.to_location_id = endLoc.google_place_id
JOIN users u ON r.host_id = u.id
LEFT JOIN ride_requests rr ON rr.ride_id = r.id AND rr.requester_id = $2
WHERE r.id = $1
`

export const reduceSeatsFilledQuery = `
UPDATE rides
SET seats_filled = seats_filled - 1
WHERE id = $1 AND seats_filled > 0
`

export const insertRideQuery = `
INSERT INTO rides (about, from_location_id, to_location_id, start_time)
VALUES ($1, $2, $3, $4, $5)
RETURNING id
`
