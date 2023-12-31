# Iron Chest
Iron chest is powerful cluster-storage file management liblary for nodejs with typescript support

## Installation
```
npm i iron-chest
```

## Authors
Made by [Faciosoft](https://github.com/Faciosoft) with main author [Maciej Dębowski](https://maciejdebowski.pl)

## Example of usage:

```ts
import Storage, { Cluster } from '../src/index'

const storage: Storage = new Storage()
storage.init(__dirname + '/storage')

const my_files = storage.getCluster('my_files') || storage.createCluster('my_files')

my_files.useEncryptionKey('this is my very secret key')
my_files.fileWrite('message', 'this is my very secret message')
```

```ts
import Storage, { Cluster } from '../src/index'

// ...

const storage: Storage = new Storage()
storage.init(__dirname + '/storage')

const users = storage.getCluster('users') || storage.createCluster('users')

app.on('login', ({ username, password }) => {
    try {
        const user = users.getCluster(username)
        if(!user) return false

        // Using user password as decrypt password
        user.useEncryptionKey(password)

        // If file will be decrypted successfully (password matches) file should contains 'success' text as content
        return user.fileRead('is_success') === 'success'
    } catch(err) {
        console.error(err)
    }

    return false
})

app.on('register', ({ username, password }) => {
    try {
        // User exists
        let user = users.getCluster(username)
        if(user) return false

        user = users.createCluster(username)

        // Using user password as decrypt password
        user.useEncryptionKey(password)

        // Writing our success text
        user.fileWrite('is_success', 'success')

        return true
    } catch(err) {
        console.error(err)
    }

    return false
})
```

## Avaliable cluster methods:
```ts
cluster.useEncryptionKey(encryption_key: string): void
cluster.getCluster(cluster_name: string): Cluster|void
cluster.createCluster(cluster_name: string): Cluster|void
cluster.fileExists(name: string): boolean
cluster.fileNotExists(name: string): boolean
cluster.fileWrite(name: string, content: string): void
cluster.fileRead(name: string): string
cluster.fileRemove(name: string): string
cluster.fileRename(name: string): void
```

## Storage Config
Inside storage folder create **iron-chest.config.json** file with content:
```json
{
    "storage": {
        "name": "STORAGE_NAME"
    }
}
```
