const main = async () => {
    // Role.create({
    //     name: 'Super Admin'
    // })

    // Role.create({
    //     name: 'User'
    // })
}

main()
    .then(() => console.log('Finished'))
    .catch(err => {
        console.log(err)
        process.exit(1)
    })
