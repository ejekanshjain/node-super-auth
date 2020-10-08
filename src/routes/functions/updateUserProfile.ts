import { Request, Response, Next } from 'restify'
import { BadRequestError, InternalServerError } from 'restify-errors'

import User from '../../models/User'
import { updateProfileSchema } from '../../validators'

export default async (req: Request, res: Response, next: Next) => {
    try {
        let validatedObj
        try {
            validatedObj = await updateProfileSchema.validateAsync(req.body, {
                abortEarly: true,
                allowUnknown: true,
                stripUnknown: true
            })
        } catch (err) {
            return next(new BadRequestError(err.message))
        }
        const user = await User.findById(req.user?._id)
        if (!user) return next(new BadRequestError('User not found!'))
        user.email = validatedObj.email
        user.firstName = validatedObj.firstName
        user.lastName = validatedObj.lastName
        try {
            await user.save()
        } catch (err) {
            if (err.code && err.code === 11000) return next(new BadRequestError('Email already associated to another account!'))
            throw err
        }
        res.send(200)
        next()
    } catch (err) {
        console.log(err)
        next(new InternalServerError(err.message || 'Something Went Wrong!'))
    }
}
