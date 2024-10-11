import express from 'express'

import {
  signup,
  signin,
} from '../../internal/adapters/controllers/auth.controller'

const router = express.Router()

router.route('/signup').post(signup)
router.route('/signin').post(signin)

export default router
