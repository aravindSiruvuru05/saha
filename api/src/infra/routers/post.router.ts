import express from 'express'

import { createPost } from '../../internal/adapters/controllers/post.controller'

const router = express.Router()

router.route('/ride').post(createPost)

export default router
