import { Request, Response, Next } from 'restify'
import { InternalServerError } from 'restify-errors'

import RefreshToken from '../../models/RefreshToken'

export default async (req: Request, res: Response, next: Next) => {
    try {
        await RefreshToken.deleteOne({ _id: req.params.id })
        res.send(204)
        next()
    } catch (err) {
        console.log(err)
        next(new InternalServerError(err.message || 'Something Went Wrong!'))
    }
}
