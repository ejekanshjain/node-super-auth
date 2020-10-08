import { Request, Response, Next } from 'restify'
import { InternalServerError, BadRequestError } from 'restify-errors'

import RefreshToken from '../../models/RefreshToken'

export default async (req: Request, res: Response, next: Next) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) return next(new BadRequestError('"refreshToken" is required'))
        await RefreshToken.deleteOne({ refreshToken })
        res.send(204)
        next()
    } catch (err) {
        console.log(err)
        next(new InternalServerError(err.message || 'Something Went Wrong!'))
    }
}
