import { Request, Response, Next } from 'restify'
import { InternalServerError } from 'restify-errors'

import RefreshToken from '../../models/RefreshToken'

export default async (req: Request, res: Response, next: Next) => {
    try {
        const activeSessions = await RefreshToken.find({ userId: req.user?._id }, { _id: 0, userAgent: 1, createdAt: 1 })
        res.send(activeSessions)
        next()
    } catch (err) {
        console.log(err)
        next(new InternalServerError(err.message || 'Something Went Wrong!'))
    }
}
