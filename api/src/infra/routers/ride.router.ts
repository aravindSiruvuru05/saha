import express from 'express'

import {
  createPost,
  searchRides,
  getUserRides,
  getRideByID,
} from '../../internal/adapters/controllers/ride.controller'
import {
  acceptRequest,
  cancelRequest,
  declineRequest,
  getPendingRequestsForMyRides,
  joinRide,
} from '../../internal/adapters/controllers/ride_requests.controller'

const router = express.Router()

router.route('/').post(createPost)

// operations on multiple leads
router.route('/my-rides').get(getUserRides)
router.route('/search').get(searchRides)

// operations on single lead
router.route('/requests/join').post(joinRide)
router.route('/requests/cancel').post(cancelRequest)
router.route('/requests/accept').post(acceptRequest)
router.route('/requests/decline').post(declineRequest)
// requests pending that i received that i need to accept or decline
router.route('/requests/pending/received').get(getPendingRequestsForMyRides)
// requests pending that i sent
router.route('/requests/pending/sent').get(getPendingRequestsForMyRides)
router.route('/:id').get(getRideByID)

export default router
