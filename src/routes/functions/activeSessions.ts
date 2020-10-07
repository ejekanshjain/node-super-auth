import { Request, Response, Next } from 'restify'

export default async (req: Request, res: Response, next: Next) => {
    next()
}
