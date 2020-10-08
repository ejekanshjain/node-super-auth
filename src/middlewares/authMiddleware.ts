import { Request, Response, Next } from 'restify'
import unless from 'express-unless'
import { InvalidCredentialsError, UnauthorizedError } from 'restify-errors'
import jwt from 'jsonwebtoken'

declare module 'restify' {
    export interface Request {
        user?: {
            _id?: String,
            role?: String
        }
    }
}

interface Options {
    secret: string
}

const authMiddleware: any = (options: Options) => {
    const middleware = (req: Request, res: Response, next: Next) => {
        const token = req.headers.authorization
        if (!token) {
            return next(new InvalidCredentialsError('Authorization token is required!'))
        }
        try {
            const decodedUser: any = jwt.verify(token, options.secret)
            req.user = {
                _id: decodedUser._id,
                role: decodedUser.role
            }
        } catch (err) {
            return next(new UnauthorizedError('Invalid Authorization token!'))
        }
        next()
    }
    middleware.unless = unless
    return middleware
}

export default authMiddleware
