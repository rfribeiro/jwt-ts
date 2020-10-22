import { Request, Response } from 'express';
import { getRepository } from 'typeorm'

import User from '../models/User'
import TokenHelper from '../utils/TokenHelper'

class UserController {
    index(req: Request, res: Response) {
        return res.send({ userId: req.userId })
    }

    async register(req: Request, res: Response) {
        const repository = getRepository(User)

        const { email, password } = req.body

        const userExists = await repository.findOne({ where: { email }})

        if (userExists) {
            return res.sendStatus(409)
        }

        const user = repository.create({ email, password })
        await repository.save(user)

        delete user.password
        delete user.passwordResetToken
        delete user.passwordResetExpires

        return res.status(201).json({
            user,
            token : TokenHelper.generate({id: user.id})
        })
    }
}

export default new UserController()

