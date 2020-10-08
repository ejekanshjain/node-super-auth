import { Request, Response, Next } from 'restify'
import { InternalServerError, BadRequestError, InvalidCredentialsError, ForbiddenError } from 'restify-errors'
import jwt from 'jsonwebtoken'

import { JWT_SECRET, JWT_REFRESH_SECRET } from '../../config'
import User from '../../models/User'
import RefreshToken from '../../models/RefreshToken'

export default async (req: Request, res: Response, next: Next) => {
    const { refreshToken } = req.body
    if (!refreshToken) return next(new BadRequestError('"refreshToken" is required'))
    try {
        const foundRefreshToken = await RefreshToken.findOne({ refreshToken })
        if (!foundRefreshToken) return next(new InvalidCredentialsError('Invalid Authorization token!'))
        if (foundRefreshToken.userAgent !== req.headers['user-agent']) return next(new ForbiddenError('Invalid User Agent!'))
        let decodedUser: any
        try {
            decodedUser = jwt.verify(foundRefreshToken.refreshToken.toString(), JWT_REFRESH_SECRET)
        } catch (err) {
            return next(new InvalidCredentialsError('Invalid Authorization token!'))
        }
        const user = await User.findById(decodedUser._id, { role: 1, active: 1 })
        if (!user) return next(new BadRequestError('User not found!'))
        if (!user.active) return next(new ForbiddenError('Your account has been suspended!'))
        const newRefreshToken = jwt.sign({
            _id: user._id,
            role: user.role
        }, JWT_REFRESH_SECRET)
        foundRefreshToken.refreshToken = newRefreshToken
        const iat = Math.floor(Date.now() / 1000)
        const exp = Math.floor(Date.now() / 1000) + (60 * 30) // 30 minutes
        const token = jwt.sign({
            iat,
            _id: user._id,
            role: user.role,
            exp
        }, JWT_SECRET)
        await foundRefreshToken.save()
        res.send({ userId: user._id, role: user.role, token, refreshToken: newRefreshToken, issuedAt: iat, expiresAt: exp })
        next()
    } catch (err) {
        console.log(err)
        next(new InternalServerError(err.message || 'Something Went Wrong!'))
    }
}
