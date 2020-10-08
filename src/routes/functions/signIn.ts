import { Request, Response, Next } from 'restify'
import { InternalServerError, BadRequestError } from 'restify-errors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { JWT_SECRET, JWT_REFRESH_SECRET } from '../../config'
import { signInSchema } from '../../validators'
import User from '../../models/User'
import RefreshToken from '../../models/RefreshToken'

export default async (req: Request, res: Response, next: Next) => {
    try {
        let validatedObj
        try {
            validatedObj = await signInSchema.validateAsync(req.body, {
                abortEarly: true,
                allowUnknown: true,
                stripUnknown: true
            })
        } catch (err) {
            return next(new BadRequestError(err.message))
        }
        const user = await User.findOne({ email: validatedObj.email })
        if (!user) return next(new BadRequestError('Invalid email or password!'))
        if (!user.active) return next(new BadRequestError('Your account has been suspended!'))
        if (!(await bcrypt.compare(validatedObj.password, user.password.toString()))) return next(new BadRequestError('Invalid email or password!'))
        const userAgent = req.userAgent()
        const refreshToken = jwt.sign({
            _id: user._id,
            role: user.role
        }, JWT_REFRESH_SECRET)
        await RefreshToken.create({
            userId: user._id,
            refreshToken,
            userAgent
        })
        const iat = Math.floor(Date.now() / 1000)
        const exp = Math.floor(Date.now() / 1000) + (60 * 30) // 30 minutes
        const token = jwt.sign({
            iat,
            _id: user._id,
            role: user.role,
            exp
        }, JWT_SECRET)

        res.send({ userId: user._id, role: user.role, token, refreshToken, issuedAt: iat, expiresAt: exp })
        next()
    } catch (err) {
        console.log(err)
        next(new InternalServerError(err.message || 'Something Went Wrong!'))
    }
}
