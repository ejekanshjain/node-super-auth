import { Request, Response, Next } from 'restify'
import { BadRequestError, InternalServerError } from 'restify-errors'
import bcrypt from 'bcryptjs'

import User from '../../models/User'
import { changePasswordSchema } from '../../validators'

export default async (req: Request, res: Response, next: Next) => {
    try {
        let validatedObj
        try {
            validatedObj = await changePasswordSchema.validateAsync(req.body, {
                abortEarly: true,
                allowUnknown: true,
                stripUnknown: true
            })
        } catch (err) {
            return next(new BadRequestError(err.message))
        }
        const { currentPassword, newPassword, confirmPassword } = validatedObj
        if (currentPassword === newPassword) return next(new BadRequestError('New password cannot be same as current password!'))
        if (newPassword !== confirmPassword) return next(new BadRequestError('Passwords do not match!'))
        const user = await User.findById(req.user?._id)
        if (!user) return next(new BadRequestError('User not found!'))
        if (!(await bcrypt.compare(currentPassword, user.password.toString()))) return next(new BadRequestError('Your password is invalid!'))
        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()
        res.send(200)
        next()
    } catch (err) {
        console.log(err)
        next(new InternalServerError(err.message || 'Something Went Wrong!'))
    }
}
