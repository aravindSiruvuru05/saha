import express from 'express'

import {
  createPost,
  searchRides,
  getUserRides,
  getRideByID,
} from '../../internal/adapters/controllers/ride.controller'
import { joinRide } from '../../internal/adapters/controllers/ride_requests.controller'

const router = express.Router()

router.route('/rides').post(createPost)
router.route('/rides/my-rides').get(getUserRides)
router.route('/rides/join-ride').post(joinRide)
router.route('/rides/search-rides').get(searchRides)
router.route('/rides/:id').get(getRideByID)

export default router
