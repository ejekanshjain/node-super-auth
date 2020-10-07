import { Request, Response, Next } from 'restify'
import unless from 'express-unless'

interface Options {
    secret: String
}

const authMiddleware: any = (options: Options) => {
    const middleware = (req: Request, res: Response, next: Next) => {
        next()
    }
    middleware.unless = unless
    return middleware
}

export default authMiddleware
