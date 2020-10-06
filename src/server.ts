import restify from 'restify'
import corsMiddleware from 'restify-cors-middleware2'

import { NODE_ENV, PORT } from './config'
import routes from './routes/routes'
import './db/MongoDB'

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

server.use(restify.plugins.jsonBodyParser())
server.use(restify.plugins.queryParser())

server.use(restify.plugins.multipartBodyParser({
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024,
    multiples: false,
    uploadDir: 'uploads'
}))

routes(server)

server.listen(
    PORT,
    console.log(
        `${NODE_ENV === 'production' ? 'Production' : 'Development'} server started on port ${PORT}...`
    )
)
