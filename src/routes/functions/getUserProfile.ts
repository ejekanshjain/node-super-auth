import { Request, Response, Next } from 'restify'
import { BadRequestError, InternalServerError } from 'restify-errors'

import User from '../../models/User'

export default async (req: Request, res: Response, next: Next) => {
    try {
        const user = await User.findById(req.user?._id, { email: 1, firstName: 1, lastName: 1, active: 1, role: 1 })
        if (!user) return next(new BadRequestError('User not found!'))
        res.send(user)
        next()
    } catch (err) {
        console.log(err)
        next(new InternalServerError(err.message || 'Something Went Wrong!'))
    }
}
