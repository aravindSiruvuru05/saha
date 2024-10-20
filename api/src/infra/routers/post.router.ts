import express from 'express'

import {
  createPost,
  findRides,
  getUserRides,
} from '../../internal/adapters/controllers/post.controller'

const router = express.Router()

router.route('/rides').post(createPost).get(getUserRides)
router.route('/find-rides').get(findRides)

export default router
