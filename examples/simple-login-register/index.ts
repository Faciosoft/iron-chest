import Storage, { Cluster } from 'iron-chest'
import express from 'express'

const storage: Storage = new Storage()
storage.init(__dirname + '/auth/data')

// Getting or creating the user cluster
const userCluster = storage.getCluster('users') || storage.createCluster('users')

// Initializing express app
const app = express()

app.get('/login/:username/:password', (req, res) => {
    const user = userCluster?.getCluster(req.params.username)

    if(!user) return res.send('Failed: invalid credentials 404 (user doesn\'t exists)')

    // Decrypting data and checking if status file content is equal to success which should be after decrypting
    user.useEncryptionKey(req.params.password)

    if(user.fileRead('status') === 'success') {
        const money =  user.fileRead('money')
        const thumbnail = user.fileRead('thumbnail')

        return res.send(`User: <strong>${req.params.username}</strong> with thumbnail <strong>${thumbnail}</strong> has <strong>$${money}</strong>`)
    }

    // If not authenticated then returns 404
    res.send('Failed: invalid credentials 404 (invalid password)')
})

app.get('/register/:username/:password', (req, res) => {
    let user = userCluster?.getCluster(req.params.username)

    if(user) return res.send('Failed: user exists')

    // Creating user
    user = userCluster?.createCluster(req.params.username)
    if(!user) return

    user.useEncryptionKey(req.params.password)

    // Creating user data
    user.fileWrite('status', 'success')
    user.fileWrite('money', '10000')
    user.fileWrite('thumbnail', 'iron-chest.png')

    res.send('Success!')
})

// Listen
app.listen(7000, () => console.log('Server works at port 7000'))