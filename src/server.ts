import restify from 'restify'
import corsMiddleware from 'restify-cors-middleware2'

import { NODE_ENV, PORT, JWT_SECRET } from './config'
import routes from './routes/routes'
import './db/MongoDB'
import authMiddleware from './middlewares/authMiddleware'

const server = restify.createServer({
    name: 'Super Auth',
    version: '0.0.1'
})

const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['Authorization'],
    exposeHeaders: ['Authorization']
})

server.pre(cors.preflight)
server.use(cors.actual)

server.pre(restify.plugins.cpuUsageThrottle({
    limit: 0.8,
    max: 0.9,
    interval: 500,
    halfLife: 500
}))

server.use(restify.plugins.throttle({
    burst: 5,
    rate: 0.5,
    ip: true,
    setHeaders: true
}))

server.use(restify.plugins.jsonBodyParser())
server.use(restify.plugins.queryParser())

server.use(restify.plugins.multipartBodyParser({
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024,
    multiples: false,
    uploadDir: 'uploads'
}))

server.use(authMiddleware({ secret: JWT_SECRET }).unless({ path: ['/', '/signUp', '/signIn', '/refreshToken'] }))

routes(server)

server.listen(
    PORT,
    console.log(
        `${NODE_ENV === 'production' ? 'Production' : 'Development'} server started on port ${PORT}...`
    )
)
