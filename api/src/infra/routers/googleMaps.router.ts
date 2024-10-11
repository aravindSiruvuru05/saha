import express from 'express'
import {
  distanceMatrix,
  placeDetails,
} from '../../internal/adapters/controllers/google_maps.controller'

const router = express.Router()

router.route('/distance-matrix').get(distanceMatrix)
router.route('/places').get(placeDetails)

export default router
