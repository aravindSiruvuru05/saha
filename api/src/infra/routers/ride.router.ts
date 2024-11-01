import express from 'express'

import {
  createRide,
  searchRides,
  getUserRides,
  cancelRequestByPassenger,
  getRideByID,
  getPendingRequestsForMyRides,
  joinRideByPassenger,
  acceptRequestByHost,
  declineRequest,
} from '../../internal/adapters/controllers/ride.controller'

const router = express.Router()

// Create ride by host
router.route('/').post(createRide)
// Operations on multiple leads
router.route('/my-rides').get(getUserRides)
// Passengers searches for rides posted by hosts
router.route('/search').get(searchRides)

//  Passenger requests to join a host's ride.
router.route('/:rideID/requests/join').post(joinRideByPassenger)

// Passenger cancels their ride request on host's ride.
router.route('/requests/:requestID/cancel').post(cancelRequestByPassenger)

// Host accepts a passenger’s ride request on host's ride.
router.route('/requests/:requestID/accept').post(acceptRequestByHost)

// Host decline a passenger's ride request on host's ride.
router.route('/requests/:requestID/decline').post(declineRequest)

// requests pending that i received that i need to accept or decline
router.route('/requests/pending/received').get(getPendingRequestsForMyRides)
// requests pending that i sent
router.route('/requests/pending/sent').get(getPendingRequestsForMyRides)
router.route('/:id').get(getRideByID)

export default router
