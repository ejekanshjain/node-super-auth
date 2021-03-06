import { Request, Response, Next } from 'restify'
import { InternalServerError, BadRequestError } from 'restify-errors'
import bcrypt from 'bcryptjs'

import User from '../../models/User'
import Role from '../../models/Role'
import { signUpSchema } from '../../validators'

export default async (req: Request, res: Response, next: Next) => {
    try {
        let validatedObj
        try {
            validatedObj = await signUpSchema.validateAsync(req.body, {
                abortEarly: true,
                allowUnknown: true,
                stripUnknown: true
            })
        } catch (err) {
            return next(new BadRequestError(err.message))
        }
        validatedObj.password = await bcrypt.hash(validatedObj.password, 10)
        const role = await Role.findOne({ name: 'User' }, { name: 1 })
        if (!role) throw new Error('Role Not Found!')
        validatedObj.role = role.name
        try {
            await User.create(validatedObj)
        } catch (err) {
            if (err.code && err.code === 11000) return next(new BadRequestError('Email already associated to another account!'))
            throw err
        }
        res.send(201)
        next()
    } catch (err) {
        console.log(err)
        next(new InternalServerError(err.message || 'Something Went Wrong!'))
    }
}
