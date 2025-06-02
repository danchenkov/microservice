// userservice/index.js

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import { MongoClient } from 'mongodb'

import grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

import { resolveProtoPath } from './utils.js'
import API from './api.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load .proto dynamically
const PROTO_PATH = resolveProtoPath('protos/user/user.proto')
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
const userPackage = protoDescriptor.userpackage

// Mongo Connection
const dbClient = new MongoClient(process.env.DB_URI)
let api = null

async function connectDB() {
    try {
        await dbClient.connect()
        const db = dbClient.db(process.env.DB_NAME)
        await db.command({ ping: 1 })
        console.log('Connected successfully to mongo server')

        // Create index
        await db.collection('users').createIndex({ email: 1 })

        api = new API(db, grpc)
        if (!api) {
            console.error('API not initialized. Exiting...')
            process.exit(1)
        }
    } catch (e) {
        console.error(e)
    }
}

async function main() {
    await connectDB().catch(console.dir)

    const server = new grpc.Server()

    // Add service dynamically
    server.addService(userPackage.UserService.service, {
        Register: api.Register.bind(api),
        Login: api.Login.bind(api),
        Verify: api.Verify.bind(api),
        GetUser: api.GetUser.bind(api),
    })

    const address = `${process.env.HOST}:${process.env.PORT}`

    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error('Server binding failed:', err)
            return
        }
        console.log(`Server bound on port: ${port}`)
        console.log(`Server running at ${address}`)
    })
}

main()
