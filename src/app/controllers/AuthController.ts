import { Request, Response } from 'express';
import { getRepository } from 'typeorm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../models/User'
import TokenHelper from '../utils/TokenHelper';
import Mail from '../modules/mailer'

interface AuthUserData {
    id: string;

    password?: string;
}

class AuthController {
    async authenticate(req: Request, res: Response) {
        try {
            const repository = getRepository(User)

            const { email, password } = req.body

            const user = await repository.findOne({ where: { email }})

            if (!user) {
                return res.sendStatus(400)
            }

            const isValidPassword = await bcrypt.compare(password, user.password)

            if (!isValidPassword) {
                return res.sendStatus(401)
            }

            delete user.password

            return res.json({
                user,
                token : TokenHelper.generate({id: user.id})
            })
        } catch (err) {
            res.status(400).send({ error: 'Cannot authenticate user, try again' })
        }
    }

    async forgotPassword(req: Request, res: Response) {

        try {
            const { email } = req.body

            const repository = getRepository(User)

            const user = await repository.findOne({ where: { email }})

            if (!user) {
                return res.sendStatus(400)
            }

            const now = new Date()
            now.setHours(now.getHours() + 1)

            const token = TokenHelper.generateReset()

            await repository.update(user.id, {
                passwordResetToken: token,
                passwordResetExpires: now
            })

            await Mail.send({
                to: user.email,
                from: 'admin@contasimples.com.br',
                html: 'auth/forgot_password',
                subject: 'Conta Simples - Recuperação de senha',
                context: { token }
            })
            return res.send('Email sent')
        } catch (err) {
            console.log(err)
            console.log(err.body)
            res.status(400).send({ error: 'Cannot send reset email, try again' })
        }
    }

    async resetPassword(req: Request, res: Response) {

        try {
            const { email, token, password } = req.body

            const repository = getRepository(User)
    
            const user = await repository.findOne({ where: { email }})
    
            if (!user) {
                return res.status(400).send({ error: 'Invalid email' })
            }
    
            if (token !== user.passwordResetToken) {
                return res.status(400).send({ error: 'Invalid token' })
            }
    
            if (new Date() > user.passwordResetExpires) {
                return res.status(400).send({ error: 'Expired token' })
            }
    
            user.password = password
            user.hashPassword()
            user.passwordResetToken = ''
    
            await repository.save(user)
    
            return res.send('password reset with success')
        } catch (err) {
            res.status(400).send({ error: 'Cannot reset password, try again' })
        }
    }
}

export default new AuthController()