require('dotenv/config')
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

interface TokenData {
    id: string;
}

interface TokenPayload {
    id: string;
    iat: number;
    exp:number;
}

class TokenHelper {

    generate(params: TokenData) {
        return jwt.sign(params, process.env.JWT_TOKEN_SECRET, { expiresIn: '1d'})
    }

    verify(token: string) {
        return jwt.verify(token, process.env.JWT_TOKEN_SECRET) as TokenPayload
    }

    generateReset() {
        return crypto.randomBytes(20).toString('hex')
    }
}

export default new TokenHelper()