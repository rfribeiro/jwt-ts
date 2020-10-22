import { Router } from 'express'

import AuthMiddleware from './app/middleware/AuthMiddleware'
import UserController from './app/controllers/UserController'
import AuthController from './app/controllers/AuthController'

const router = Router()

router.post('/login', AuthController.authenticate)
router.post('/forgot_password', AuthController.forgotPassword)
router.post('/reset_password', AuthController.resetPassword)

router.post('/users', UserController.register)
router.get('/users', AuthMiddleware, UserController.index)

export default router