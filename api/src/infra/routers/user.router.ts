import express from 'express'

import { protect } from '../../internal/adapters/controllers/auth.controller'
import { getUserById } from '../../internal/adapters/controllers/user.controller'

const router = express.Router()

// router.route('/').get(protect, getAllUsers).post(createUser)
router.route('/:id').get(getUserById)

export { router }
