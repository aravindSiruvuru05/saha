import express from 'express'

import { createRideAndRideRequest } from '../../internal/adapters/controllers/ride_requests.controller'

const router = express.Router()

// Passenger create ride-request
router.route('/').post(createRideAndRideRequest)

// // Host search for ride requests from passengers
// router.route('/search').get(searchRideRequests)

// // Passenger cancels their ride request before joining ride.
// router.route('/:requestID/cancel').post(cancelRequest)

// // Host accepts a passenger's ride need.
// router.route('/:requestID/accept').post(acceptRequest)

// // // Host declines a passenger's ride need.
// // router.route('/:requestID/decline').post(declineRequest)

// // requests pending that i received that i need to accept or decline
// router.route('/requests/pending/received').get(getPendingRequestsForMyRides)
// // requests pending that i sent
// router.route('/requests/pending/sent').get(getPendingRequestsForMyRides)
// router.route('/:id').get(getRideByID)

export default router
