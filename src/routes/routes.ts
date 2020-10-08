import { Server } from 'restify'

import welcome from './functions/welcome'
import signUp from './functions/signUp'
import signIn from './functions/signIn'
import signOut from './functions/signOut'
import getUserProfile from './functions/getUserProfile'
import updateUserProfile from './functions/updateUserProfile'
import refreshToken from './functions/refreshToken'
import getActiveSessions from './functions/getActiveSessions'
import removeActiveSession from './functions/removeActiveSession'
import changePassword from './functions/changePassword'

export default (server:Server) => {
    server.get('/', welcome)
    server.post('/signUp', signUp)
    server.post('/signIn', signIn)
    server.post('/signOut', signOut)
    server.get('/profile', getUserProfile)
    server.patch('/profile', updateUserProfile)
    server.post('/refreshToken', refreshToken)
    server.get('/activeSessions', getActiveSessions)
    server.del('/activeSessions/:id', removeActiveSession)
    server.post('/changePassword', changePassword)
}
