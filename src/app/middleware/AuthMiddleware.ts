import { Request, Response, NextFunction } from "express";
import TokenHelper from '../utils/TokenHelper'

export default function AuthMiddleware(
    req: Request, res: Response, next: NextFunction,
) {
    const { authorization } = req.headers

    if (!authorization) {
        return res.sendStatus(401)
    }

    const token = authorization.replace('Bearer', '').trim()

    try {
        const data = TokenHelper.verify(token)

        const { id } = data

        req.userId = id

        next() 
    } catch {
        return res.sendStatus(401)
    }
}