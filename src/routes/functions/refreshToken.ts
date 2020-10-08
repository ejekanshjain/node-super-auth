import { Request, Response, Next } from 'restify'
import { InternalServerError, BadRequestError } from 'restify-errors'

import RefreshToken from '../../models/RefreshToken'

export default async (req: Request, res: Response, next: Next) => {
    const { refreshToken } = req.body
    if (!refreshToken) return next(new BadRequestError('"refreshToken" is required'))
    try {
        await RefreshToken.findOne({ refreshToken })
        res.send(200)
        next()
    } catch (err) {
        console.log(err)
        next(new InternalServerError(err.message || 'Something Went Wrong!'))
    }
}
