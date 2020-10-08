import './config'
import './db/MongoDB'
// import User from './models/User'
import Role from './models/Role'
// import RefreshToken from './models/RefreshToken'

const main = async () => {
    await Role.insertMany(
        [
            {
                name: 'Super Admin'
            },
            {
                name: 'User'
            }
        ]
    )
}

main()
    .then(() => console.log('Finished'))
    .catch(err => {
        console.log(err)
        process.exit(1)
    })
