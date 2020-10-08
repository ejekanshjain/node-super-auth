import { Request, Response, Next } from 'restify'

export default (req: Request, res: Response, next: Next) => {
    res.send('Server up and running...')
    next()
}
