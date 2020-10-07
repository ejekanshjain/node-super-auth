import { Server } from 'restify'

import signUp from './functions/signUp'
import signIn from './functions/signIn'
import signOut from './functions/signOut'
import refreshToken from './functions/refreshToken'
import activeSessions from './functions/activeSessions'
import changePassword from './functions/changePassword'
import getUserProfile from './functions/getUserProfile'
import updateUserProfile from './functions/updateUserProfile'

export default (server:Server) => {
    server.post('/signUp', signUp)
    server.post('/signIn', signIn)
    server.post('/signOut', signOut)
    server.get('/profile', getUserProfile)
    server.patch('/profile', updateUserProfile)
    server.post('/refreshToken', refreshToken)
    server.post('/activeSessions', activeSessions)
    server.post('/changePassword', changePassword)
}
